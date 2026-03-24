/* eslint-env node */
// /**
//  * Import function triggers from their respective submodules:
//  *
//  * const {onCall} = require("firebase-functions/v2/https");
//  * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
//  *
//  * See a full list of supported triggers at https://firebase.google.com/docs/functions
//  */

// const {setGlobalOptions} = require("firebase-functions");
// const {onRequest} = require("firebase-functions/https");
// const logger = require("firebase-functions/logger");

// // For cost control, you can set the maximum number of containers that can be
// // running at the same time. This helps mitigate the impact of unexpected
// // traffic spikes by instead downgrading performance. This limit is a
// // per-function limit. You can override the limit for each function using the
// // `maxInstances` option in the function's options, e.g.
// // `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// // NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// // functions should each use functions.runWith({ maxInstances: 10 }) instead.
// // In the v1 API, each function can only serve one request per container, so
// // this will be the maximum concurrent request count.
// setGlobalOptions({ maxInstances: 10 });

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started

// // exports.helloWorld = onRequest((request, response) => {
// //   logger.info("Hello logs!", {structuredData: true});
// //   response.send("Hello from Firebase!");
// // });

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");
const { defineString } = require("firebase-functions/params");

admin.initializeApp();

// v7 params: set via .env in functions/ or prompt on deploy (e.g. .env.web-app-new-efb66)
const geminiApiKeyParam = defineString("GEMINI_API_KEY", { default: "" });

// Example tips for each transport method
const transportTips = {
  Bedrest: [
    "Regular turning helps prevent pressure ulcers (bed sores) and improves circulation. Set reminders to change position every 2 hours.",
    "Keep skin clean and dry to prevent sores.",
    "Ask for help to change positions safely."
  ],
  Walker: [
    "Always have someone nearby when getting up.",
    "Sit at the edge first, check for dizziness, then stand slowly with support.",
    "Use your walker for balance and support at all times."
  ],
  Wheelchair: [
    "Regular movement helps maintain strength and flexibility. Try arm raises, side twists, and knee/toe raises while seated.",
    "Check your wheelchair's brakes before transferring.",
    "Keep pathways clear to avoid accidents."
  ],
  Independent: [
    "Even when moving independently, it's safer to have someone nearby.",
    "Always check for dizziness before standing.",
    "Take your time and avoid rushing."
  ]
};

const EMAIL_FROM = "mohammad.a.roshani@gmail.com";

const normalizeEmail = (email) => (typeof email === "string" ? email.trim().toLowerCase() : "");

const getRecipientEmails = async (uid, userData) => {
  const recipients = new Set();
  const caregiver = normalizeEmail(userData?.caregiverEmail);
  const profileEmail = normalizeEmail(userData?.email);

  if (caregiver) recipients.add(caregiver);
  if (profileEmail) recipients.add(profileEmail);

  try {
    const authUser = await admin.auth().getUser(uid);
    const authEmail = normalizeEmail(authUser?.email);
    if (authEmail) recipients.add(authEmail);
  } catch (error) {
    console.warn(`Could not load auth email for user ${uid}:`, error.message);
  }

  return [...recipients];
};

const formatMedicationSummary = (medicationResponses = {}) => {
  const sections = [];
  Object.entries(medicationResponses).forEach(([questionKey, answer]) => {
    if (!answer) return;
    if (typeof answer === "object") {
      const tags = Array.isArray(answer.tags) ? answer.tags.join(", ") : "";
      const notes = typeof answer.text === "string" ? answer.text.trim() : "";
      const combined = [tags && `Selected: ${tags}`, notes && `Notes: ${notes}`].filter(Boolean).join(" | ");
      if (combined) sections.push(`${questionKey.toUpperCase()}: ${combined}`);
      return;
    }
    if (typeof answer === "string" && answer.trim()) {
      sections.push(`${questionKey.toUpperCase()}: ${answer.trim()}`);
    }
  });
  return sections.length ? sections.join("\n") : "No medication updates were saved yet.";
};

const pickMobilityTip = (mobilityType) => {
  if (!mobilityType || !transportTips[mobilityType]) {
    return "Try to move safely today, go slowly when standing, and ask for help if needed.";
  }
  const tips = transportTips[mobilityType];
  return tips[Math.floor(Math.random() * tips.length)];
};

const sendDailyMedicationAndMobilityReminders = async () => {
  const sendgridKey = process.env.SENDGRID_API_KEY;
  if (!sendgridKey) {
    console.error("SENDGRID_API_KEY missing; daily reminders skipped.");
    return { processed: 0, sent: 0, skipped: 0 };
  }
  sgMail.setApiKey(sendgridKey);

  const usersSnapshot = await admin.firestore().collection("Users").get();
  let processed = 0;
  let sent = 0;
  let skipped = 0;

  for (const userDoc of usersSnapshot.docs) {
    processed += 1;
    const uid = userDoc.id;
    const userData = userDoc.data() || {};
    const recipients = await getRecipientEmails(uid, userData);
    if (!recipients.length) {
      skipped += 1;
      continue;
    }

    const answerDocRef = admin.firestore().collection("Answers").doc(`${uid}_4ms_health`);
    const answerSnap = await answerDocRef.get();
    const responses = answerSnap.exists ? (answerSnap.data()?.responses || {}) : {};
    const medicationSummary = formatMedicationSummary(responses.medication || {});
    const mobilityType = responses?.mobility?.mobilityType;
    const mobilityTip = pickMobilityTip(mobilityType);

    const medicationMsg = {
      to: recipients,
      from: EMAIL_FROM,
      subject: "Daily Medication Reminder",
      text: `This is your daily medication reminder.\n\nMedication summary:\n${medicationSummary}`
    };
    const mobilityMsg = {
      to: recipients,
      from: EMAIL_FROM,
      subject: "Daily Mobility Tip",
      text: `Mobility type: ${mobilityType || "Not set"}\n\nToday's tip:\n${mobilityTip}`
    };

    try {
      await sgMail.send(medicationMsg);
      await sgMail.send(mobilityMsg);
      sent += recipients.length;
      console.log(`Daily reminders sent for user ${uid} to: ${recipients.join(", ")}`);
    } catch (error) {
      skipped += 1;
      console.error(`Failed sending reminders for user ${uid}:`, error.response?.body || error.message);
    }
  }

  console.log(`Daily reminders complete. processed=${processed}, sent=${sent}, skipped=${skipped}`);
  return { processed, sent, skipped };
};

// Scheduled function to send daily tips
// exports.sendDailyTransportTips = functions.pubsub.schedule('every day 08:00').timeZone('America/New_York').onRun(async (context) => {
//   const usersSnapshot = await admin.firestore().collection('User').where('caregiverNotify', '==', true).get();
//
//   const sendPromises = [];
//
//   usersSnapshot.forEach(doc => {
//     const user = doc.data();
//     const caregiverEmail = user.caregiverEmail;
//     const method = user.transportMethod || user.mobilityType; // fallback to either field
//     if (!caregiverEmail || !method || !transportTips[method]) return;
//
//     // Pick a random tip for variety
//     const tips = transportTips[method];
//     const tip = tips[Math.floor(Math.random() * tips.length)];
//
//     const msg = {
//       to: caregiverEmail,
//       from: "your_verified_email@example.com", // TODO: Replace with your verified sender
//       subject: "Daily Mobility Tip for Your Care Recipient",
//       text: `Here is a daily tip for their mobility type (${method}):\n\n${tip}`,
//     };
//     sendPromises.push(sgMail.send(msg));
//   });
//
//   await Promise.all(sendPromises);
//   return null;
// });

const app = express();

// Dynamic CORS configuration - accepts requests from any origin in development
app.use(cors({
  origin: true, // Reflect the request origin, allowing all origins
  credentials: true
}));

app.use(express.json());

// Endpoint to send a tip email to the caregiver immediately
app.post("/send-caregiver-tip", async (req, res) => {
  const sendgridKey = process.env.SENDGRID_API_KEY;
  if (!sendgridKey) {
    return res.status(501).json({ error: "SendGrid is not configured." });
  }
  sgMail.setApiKey(sendgridKey);
  const { caregiverEmail, mobilityType } = req.body;
  console.log("Received caregiverEmail:", caregiverEmail);
  console.log("Received mobilityType:", mobilityType);
  if (!caregiverEmail || !mobilityType || !transportTips[mobilityType]) {
    console.log('Invalid input:', req.body);
    return res.status(400).json({ error: 'Missing or invalid caregiverEmail or mobilityType' });
  }
  const tips = transportTips[mobilityType];
  const tip = tips[Math.floor(Math.random() * tips.length)];
  const msg = {
    to: caregiverEmail,
    from: EMAIL_FROM,
    subject: "Mobility Tip for Your Care Recipient",
    text: `Here is a tip for their mobility type (${mobilityType}):\n\n${tip}`,
  };
  try {
    const sgRes = await sgMail.send(msg);
    console.log('SendGrid response:', sgRes);
    res.json({ success: true, message: `Tip email sent to ${caregiverEmail}` });
  } catch (err) {
    console.error('SendGrid error:', err.response?.body || err.message || err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/send-daily-reminders-now", async (req, res) => {
  try {
    const result = await sendDailyMedicationAndMobilityReminders();
    res.json({ success: true, ...result });
  } catch (error) {
    console.error("Error running daily reminders:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI Chat Backend is running with Google Gemini API' });
});

// Debug: check if Gemini key is set (does not reveal the key)
app.get("/api/chat-status", (req, res) => {
  const keySet = !!geminiApiKeyParam.value();
  res.json({
    geminiKeySet: keySet,
    hint: keySet ? "Key is configured" : "Set GEMINI_API_KEY in functions/.env or when prompted on deploy",
  });
});

// Google Gemini (Google AI Studio) - try in order; 2.5 may not be in all regions yet
const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

// Convert chat messages to Gemini contents (user/model + parts)
function messagesToGeminiContents(messages) {
  return messages
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: typeof m.content === 'string' ? m.content : (m.content || '').toString() }]
    }));
}

app.post("/api/chat", async (req, res) => {
  const { messages, userContext } = req.body;
  const apiKey = geminiApiKeyParam.value();

  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not set. Set via: firebase functions:config:set gemini.api_key="..."');
    return res.json({
      choices: [{
        message: {
          role: "assistant",
          content: "I'm having trouble connecting to the AI service. Please set GEMINI_API_KEY in functions/.env or when prompted on deploy.",
        },
      }],
    });
  }

  try {
    console.log("Attempting Gemini API call with", GEMINI_MODELS[0], "(and fallbacks)");
    console.log('User messages:', messages?.length);
    console.log('User context available:', !!userContext);

    let systemPrompt = `
You are a kind, supportive AI assistant for an elderly person with health and daily questions.

RESPONSE RULES — FOLLOW THESE:
• Be concise: keep your answer under 200 tokens.
• Use simple, everyday language. Avoid medical jargon.
• Use 1–2 short sentences if possible, or up to 5 short bullet points if needed.
• Each bullet: start with a bolded key action/fact, keep it under 15 words.
• Use emojis only if helpful, not in every sentence.
• Do NOT start with general/motivational phrases. Jump right into advice.
• No sub-bullets, no long paragraphs.
• Be warm, friendly, and clear — like a helpful friend.
`;

    if (userContext && userContext.location) {
      systemPrompt += `\n\nThe person is currently located at: ${userContext.location}`;
    }

    if (userContext && userContext.completedSections && userContext.completedSections.length > 0) {
      systemPrompt += '\n\nIMPORTANT: You are a medical advisor for an elderly person who has completed a health assessment. Use the following information about this person to provide personalized, relevant advice:';
      Object.entries(userContext.responses || {}).forEach(([section, questions]) => {
        systemPrompt += `\n\n**${section.charAt(0).toUpperCase() + section.slice(1)} Assessment:**`;
        Object.entries(questions || {}).forEach(([question, answer]) => {
          systemPrompt += `\n- ${question}: ${answer}`;
        });
      });
      systemPrompt += '\n\nWhen providing advice, consider this person\'s specific health situation, concerns, and needs. Tailor your recommendations to their mobility level, medication concerns, mental health status, and what matters most to them. Be empathetic and supportive while providing practical, actionable advice.';
    }

    const contents = messagesToGeminiContents(messages || []);
    if (contents.length === 0) {
      return res.status(400).json({ error: 'No messages provided' });
    }

    const body = {
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: { temperature: 0.3, maxOutputTokens: 1024 }
    };
    let response;
    let usedModel;
    let lastErr;

    for (const model of GEMINI_MODELS) {
      try {
        console.log(`🔄 Trying Gemini model: ${model}`);
        response = await axios.post(
          `${GEMINI_BASE}/${model}:generateContent?key=${apiKey}`,
          body,
          { headers: { 'Content-Type': 'application/json' }, timeout: 60000 }
        );
        usedModel = model;
        console.log(`✅ Gemini API success with ${model}`);
        break;
      } catch (err) {
        lastErr = err;
        const status = err.response?.status;
        const msg = err.response?.data?.error?.message || err.message;
        console.error(`❌ Gemini ${model} failed:`, status, msg);
        if (status === 404 || status === 400) continue;
        break;
      }
    }

    if (!response) {
      console.error('❌ All Gemini models failed. Last error:', lastErr?.response?.data || lastErr?.message);
      return res.json({
        choices: [{
          message: {
            role: 'assistant',
            content: "The AI service is temporarily unavailable. Please try again in a moment. If this keeps happening, set GEMINI_API_KEY in functions/.env and redeploy.",
          }
        }],
        _fallback: true
      });
    }

    const candidate = response.data?.candidates?.[0];
    const textPart = candidate?.content?.parts?.[0]?.text;
    const assistantMessage = textPart?.trim() || "I couldn't generate a response at the moment. Please try again.";

    res.json({
      choices: [{
        message: {
          role: 'assistant',
          content: assistantMessage
        }
      }],
      debug: { model: usedModel }
    });
  } catch (error) {
    console.error('❌ Gemini API Error (unexpected):', error.response?.data || error.message);
    res.json({
      choices: [{
        message: {
          role: 'assistant',
          content: "The AI service is temporarily unavailable. Please try again in a moment."
        }
      }],
      _fallback: true
    });
  }
});

// Parse and normalize AI quick-questions response: 4-6 items, each ≤100 chars
const MAX_QUESTION_LENGTH = 100;
const MIN_QUESTIONS = 4;
const MAX_QUESTIONS = 6;

function normalizeQuestion(s) {
  if (typeof s !== 'string') return '';
  let q = s.trim();
  // Match leading/trailing whitespace, brackets, comma, double-quote (] escaped in class)
  q = q.replace(/^[\s\],["]+/, '').replace(/[\s\],["]+$/, '');
  if (q.length > MAX_QUESTION_LENGTH) {
    const cut = q.slice(0, MAX_QUESTION_LENGTH);
    const lastSpace = cut.lastIndexOf(' ');
    q = (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim();
    if (!q.endsWith('?')) q += '?';
  }
  return q;
}

function parseQuickQuestionsResponse(text) {
  const raw = (text || '').trim();
  let questions = [];
  let clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/g, '').trim();
  const startIdx = clean.indexOf('[');
  if (startIdx !== -1) {
    let depth = 0;
    let endIdx = -1;
    for (let i = startIdx; i < clean.length; i++) {
      if (clean[i] === '[') depth++;
      else if (clean[i] === ']') { depth--; if (depth === 0) { endIdx = i; break; } }
    }
    const jsonStr = endIdx !== -1 ? clean.slice(startIdx, endIdx + 1) : clean.slice(startIdx);
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed)) questions = parsed.map(s => String(s || '').trim()).filter(Boolean);
    } catch {
      const quoted = clean.match(/"([^"]*?)"/g);
      if (quoted) questions = quoted.map(m => m.slice(1, -1).replace(/\\"/g, '"').trim()).filter(Boolean);
    }
  }
  if (questions.length === 0) {
    const lines = raw.split(/\n/).map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      const stripped = line.replace(/^[\s\-.\d\]"]+/, '').replace(/[\s",\]]+$/, '');
      if (stripped.includes('?') && stripped.length >= 10 && stripped.length <= MAX_QUESTION_LENGTH) questions.push(stripped);
    }
  }
  questions = questions
    .map(normalizeQuestion)
    .filter(q => q.length >= 10 && q.length <= MAX_QUESTION_LENGTH && q.includes('?'));
  return questions.slice(0, MAX_QUESTIONS);
}

// Quick Questions endpoint - only generate, don't save
app.get('/api/quick-questions', async (req, res) => {
  res.json({ questions: [] });
});

const QUICK_QUESTIONS_FALLBACK = [
  "What are some good exercises for seniors?",
  "How can I improve my sleep quality?",
  "What foods are good for heart health?",
  "How can I manage stress better?",
  "How can I stay mentally active?"
];

app.post("/api/quick-questions", async (req, res) => {
  const { userContext } = req.body;
  const apiKey = geminiApiKeyParam.value();

  if (!apiKey) {
    return res.json({ questions: QUICK_QUESTIONS_FALLBACK });
  }

  try {
    console.log('🔄 Quick Questions request received (Gemini)');

    let prompt = `You are a helpful AI assistant. Based on the following user's health questionnaire answers, generate 4 to 6 short, helpful questions that this person would benefit from asking an AI health assistant.

RULES:
- Return ONLY a JSON array of 4 to 6 strings. No other text, no markdown, no code fences.
- Each question MUST be under 100 characters (count carefully).
- Each question must be a complete sentence ending with "?".
- Do not truncate any question mid-sentence.

Example: ["What exercises help balance?", "How can I sleep better?"]

User's health assessment data:`;

    if (userContext && userContext.location) {
      prompt += `\n\nThe person is currently located at: ${userContext.location}`;
    }
    if (userContext && userContext.responses) {
      Object.entries(userContext.responses).forEach(([section, questions]) => {
        prompt += `\n\n${section.charAt(0).toUpperCase() + section.slice(1)} Section:`;
        Object.entries(questions).forEach(([question, answer]) => {
          prompt += `\n- ${question}: ${typeof answer === 'object' ? JSON.stringify(answer) : answer}`;
        });
      });
    } else {
      prompt += '\n(No answers yet)';
    }
    prompt += '\n\nGenerate 4 to 6 relevant questions (each under 100 characters), JSON array only:';

    const body = { contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.3, maxOutputTokens: 512 } };
    let response;
    for (const model of GEMINI_MODELS) {
      try {
        response = await axios.post(
          `${GEMINI_BASE}/${model}:generateContent?key=${apiKey}`,
          body,
          { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
        );
        break;
      } catch (err) {
        console.error(`Quick questions: ${model} failed`, err.response?.status, err.response?.data?.error?.message);
        if (err.response?.status === 404 || err.response?.status === 400) continue;
        throw err;
      }
    }

    if (!response) {
      return res.json({ questions: QUICK_QUESTIONS_FALLBACK });
    }
    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    let questions = parseQuickQuestionsResponse(text);
    if (questions.length < MIN_QUESTIONS) questions = [...QUICK_QUESTIONS_FALLBACK];
    res.json({ questions: questions.slice(0, MAX_QUESTIONS) });
  } catch (error) {
    console.error('❌ Gemini Quick Questions Error:', error.response?.data || error.message);
    res.json({ questions: QUICK_QUESTIONS_FALLBACK });
  }
});

// Test endpoint for sending a notification email locally
app.get("/test-send-email", async (req, res) => {
  const sendgridKey = process.env.SENDGRID_API_KEY;
  if (!sendgridKey) {
    return res.status(501).json({ error: "SendGrid is not configured." });
  }
  sgMail.setApiKey(sendgridKey);
  const email = req.query.email;
  const method = req.query.method || "Bedrest";
  if (!email || !transportTips[method]) {
    return res.status(400).json({ error: 'Missing or invalid email/method' });
  }
  const tips = transportTips[method];
  const tip = tips[Math.floor(Math.random() * tips.length)];
  const msg = {
    to: email,
    from: EMAIL_FROM,
    subject: "Your Daily Transportation Tip (Test)",
    text: `Here is your daily tip for getting around by ${method}:\n\n${tip}`,
  };
  try {
    const sgRes = await sgMail.send(msg);
    console.log('SendGrid response:', sgRes);
    res.json({ success: true, message: `Test email sent to ${email}` });
  } catch (err) {
    console.error('SendGrid error:', err.response?.body || err.message || err);
    res.status(500).json({ error: err.message });
  }
});

exports.sendDailyMedicationAndMobilityTips = functions.pubsub
  .schedule("every day 08:00")
  .timeZone("America/New_York")
  .onRun(async () => {
    await sendDailyMedicationAndMobilityReminders();
    return null;
  });

exports.api = functions.https.onRequest(app);