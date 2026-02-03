require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const https = require('https');
const fs = require('fs');
const path = require('path');
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
app.post('/send-caregiver-tip', async (req, res) => {
  const { caregiverEmail, mobilityType } = req.body;
  console.log('Received caregiverEmail:', caregiverEmail);
  console.log('Received mobilityType:', mobilityType);
  if (!caregiverEmail || !mobilityType || !transportTips[mobilityType]) {
    console.log('Invalid input:', req.body);
    return res.status(400).json({ error: 'Missing or invalid caregiverEmail or mobilityType' });
  }
  const tips = transportTips[mobilityType];
  const tip = tips[Math.floor(Math.random() * tips.length)];
  const msg = {
    to: caregiverEmail,
    from: "mohammad.a.roshani@gmail.com",
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI Chat Backend is running with OpenRouter API' });
});

// AI Chat endpoint using OpenRouter API with DeepSeek Chat
app.post('/api/chat', async (req, res) => {
  const { messages, userContext } = req.body;

  try {
    console.log('Attempting OpenRouter API call with DeepSeek Chat');
    console.log('User messages:', messages);
    console.log('User context available:', !!userContext);
    
    // Build personalized system prompt based on user context
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

    // Add location to system prompt if present
    if (userContext && userContext.location) {
      systemPrompt += `\n\nThe person is currently located at: ${userContext.location}`;
    }

    if (userContext && userContext.completedSections && userContext.completedSections.length > 0) {
      systemPrompt += '\n\nIMPORTANT: You are a medical advisor for an elderly person who has completed a health assessment. Use the following information about this person to provide personalized, relevant advice:';
      
      // Add user's health assessment data
      Object.entries(userContext.responses).forEach(([section, questions]) => {
        systemPrompt += `\n\n**${section.charAt(0).toUpperCase() + section.slice(1)} Assessment:**`;
        Object.entries(questions).forEach(([question, answer]) => {
          systemPrompt += `\n- ${question}: ${answer}`;
        });
      });
      
      systemPrompt += '\n\nWhen providing advice, consider this person\'s specific health situation, concerns, and needs. Tailor your recommendations to their mobility level, medication concerns, mental health status, and what matters most to them. Be empathetic and supportive while providing practical, actionable advice.';
    }
    
    // Log the system prompt for debugging (do not log userContext separately)
    console.log('==== SYSTEM PROMPT SENT TO AI ====');
    console.log(systemPrompt);
    
    // List of free models to try in order of preference
    const freeModels = [
      'z-ai/glm-4.5-air:free',           // Primary model
      'deepseek/deepseek-chat-v3-0324:free',
      'qwen/qwen3-coder:free',
      'tngtech/deepseek-r1t2-chimera:free',
      'meta-llama/llama-3.1-8b-instruct:free'
    ];

    let response;
    let lastError;
    let usedModel;

    // Try each model until one works
    for (const model of freeModels) {
      try {
        console.log(`🔄 Attempting OpenRouter API call with model: ${model}`);
        
        response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: model,
            messages: [
              { 
                role: 'system', 
                content: systemPrompt
              },
              ...messages
            ],
            // max_tokens: 400,
            temperature: 0.3
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': req.headers.origin ?? process.env.FRONTEND_URL ?? 'http://localhost:5173',
              'X-Title': '4Ms Health Questionnaire App'
            }
          }
        );

        usedModel = model;
        console.log(`✅ Successfully used model: ${model}`);
        break; // Success, exit the loop

      } catch (error) {
        lastError = error;
        console.log(`❌ Model ${model} failed:`, error.response?.data?.error?.message || error.message);
        
        // Check if it's a rate limit or model unavailable error
        const errorMessage = error.response?.data?.error?.message || '';
        const isRateLimit = errorMessage.includes('rate limit') || 
                           errorMessage.includes('quota') || 
                           errorMessage.includes('No endpoints found') ||
                           error.status === 429;
        
        if (isRateLimit) {
          console.log(`⏳ Rate limit hit for ${model}, trying next model...`);
          continue; // Try next model
        } else {
          console.log(`🚫 Non-rate-limit error for ${model}, trying next model...`);
          continue; // Try next model for other errors too
        }
      }
    }

    // If all models failed, throw the last error
    if (!response) {
      console.log('❌ All models failed, using fallback response');
      throw lastError || new Error('All free models are currently unavailable');
    }

    console.log(`✅ OpenRouter API Response (using ${usedModel}):`, response.data);
    
    const assistantMessage = response.data.choices[0]?.message?.content || 
                            'I apologize, but I couldn\'t generate a response at the moment.';

    // Log the model's output (assistant's message)
    console.log(`==== MODEL OUTPUT FROM AI (${usedModel}) ====`);
    console.log(assistantMessage);
    
    res.json({
      choices: [{
        message: {
          role: 'assistant',
          content: assistantMessage
        }
      }],
      debug: {
        model: usedModel,
        maxTokens: 400,
        temperature: 0.3,
        systemPrompt: systemPrompt.substring(0, 500) + '...'
      }
    });

  } catch (error) {
    console.error('❌ OpenRouter API Error:', error.response?.data || error.message);
    console.error('Error status:', error.response?.status);
    
    // Provide a fallback response instead of error
    const fallbackResponses = [
      "I'm here to help with your health questions! What would you like to know about exercise, nutrition, or general wellness?",
      "I'd be happy to assist you with health-related topics. Feel free to ask about physical activity, sleep, stress management, or other wellness concerns.",
      "Hello! I'm your AI health assistant. I can help you with questions about staying healthy, exercise tips, nutrition advice, and general wellness. What's on your mind?",
      "Welcome! I'm here to support your health journey. Whether you have questions about fitness, diet, mental health, or general wellness, I'm ready to help.",
      "Hi there! I'm your friendly AI health companion. I can provide information about healthy living, exercise recommendations, nutrition tips, and wellness advice. What would you like to discuss?"
    ];
    
    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    
    res.json({
      choices: [{
        message: {
          role: 'assistant',
          content: randomResponse
        }
      }]
    });
  }
});

// Parse and normalize AI quick-questions response: 4-6 items, each ≤100 chars, no truncation
const MAX_QUESTION_LENGTH = 100;
const MIN_QUESTIONS = 4;
const MAX_QUESTIONS = 6;

function normalizeQuestion(s) {
  if (typeof s !== 'string') return '';
  let q = s.trim();
  // Strip leading/trailing JSON/markdown artifacts (e.g. [" or ", or ])
  q = q.replace(/^[\s\[\],"]+/, '').replace(/[\s\[\],"]+$/, '');
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

  // 1) Strip code fences and trim
  let clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/g, '').trim();

  // 2) Try to extract a JSON array: find first '[' and matching ']'
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
    } catch (_) {
      // 3) Fallback: extract quoted strings (handles truncated or malformed JSON)
      const quoted = clean.match(/"([^"]*?)"/g);
      if (quoted) {
        questions = quoted.map(m => m.slice(1, -1).replace(/\\"/g, '"').trim()).filter(Boolean);
      }
    }
  }

  // 4) If still empty, try line-by-line extraction
  if (questions.length === 0) {
    const lines = raw.split(/\n/).map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      const stripped = line.replace(/^[\s\-.\d\]"]+/, '').replace(/[\s",\]]+$/, '');
      if (stripped.includes('?') && stripped.length >= 10 && stripped.length <= MAX_QUESTION_LENGTH) {
        questions.push(stripped);
      }
    }
  }

  // 5) Normalize: ≤100 chars, must look like a question
  questions = questions
    .map(normalizeQuestion)
    .filter(q => q.length >= 10 && q.length <= MAX_QUESTION_LENGTH && q.includes('?'));

  return questions.slice(0, MAX_QUESTIONS);
}

// Quick Questions endpoint - only generate, don't save
app.get('/api/quick-questions', async (req, res) => {
  // Return empty array - frontend will handle loading from Firebase
  res.json({ questions: [] });
});

const QUICK_QUESTIONS_FALLBACK = [
  "What are some good exercises for seniors?",
  "How can I improve my sleep quality?",
  "What foods are good for heart health?",
  "How can I manage stress better?",
  "How can I stay mentally active?"
];

app.post('/api/quick-questions', async (req, res) => {
  const { userContext } = req.body;
  try {
    console.log('🔄 Quick Questions request received');
    console.log('📊 User context:', userContext);
    
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
    
    console.log('📝 Sending prompt to AI:', prompt);
    
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'z-ai/glm-4.5-air:free',
        messages: [
          { role: 'system', content: prompt }
        ],
        max_tokens: 512,
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': req.headers.origin ?? process.env.FRONTEND_URL ?? 'http://localhost:3000',
          'X-Title': '4Ms Health Questionnaire App'
        }
      }
    );
    
    const rawContent = response.data.choices[0]?.message?.content || '';
    console.log('✅ AI Response received:', rawContent);
    
    let questions = parseQuickQuestionsResponse(rawContent);
    if (questions.length < MIN_QUESTIONS) {
      console.log('⚠️ Too few questions after parse, using fallback');
      questions = [...QUICK_QUESTIONS_FALLBACK];
    }
    questions = questions.slice(0, MAX_QUESTIONS);
    
    console.log('📤 Sending questions to frontend:', questions);
    res.json({ questions });
  } catch (error) {
    console.error('❌ OpenRouter Quick Questions Error:', error.response?.data || error.message);
    res.json({ questions: QUICK_QUESTIONS_FALLBACK });
  }
});

// Test endpoint for sending a notification email locally
app.get('/test-send-email', async (req, res) => {
  const email = req.query.email;
  const method = req.query.method || 'Bedrest';
  if (!email || !transportTips[method]) {
    return res.status(400).json({ error: 'Missing or invalid email/method' });
  }
  const tips = transportTips[method];
  const tip = tips[Math.floor(Math.random() * tips.length)];
  const msg = {
    to: email,
    from: "mohammad.a.roshani@gmail.com",
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

const PORT = process.env.PORT || 5001;
const USE_HTTPS = process.env.USE_HTTPS === 'true';

let server;

if (USE_HTTPS) {
  // HTTPS mode - for production or when explicitly enabled
  const certPath = process.env.CERT_PATH || path.join(__dirname, '..', 'localhost+3.pem');
  const keyPath = process.env.KEY_PATH || path.join(__dirname, '..', 'localhost+3-key.pem');
  
  if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
    const httpsOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath)
    };
    server = https.createServer(httpsOptions, app);
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🔒 AI Chat Backend server running on HTTPS port ${PORT}`);
      console.log(`📡 Using OpenRouter API with DeepSeek Chat model`);
      console.log(`🔗 Health check: https://localhost:${PORT}/api/health`);
      console.log(`🌐 Accepting requests from any origin (dynamic CORS)`);
    });
  } else {
    console.error(`❌ HTTPS enabled but certificates not found!`);
    console.error(`   Expected: ${certPath} and ${keyPath}`);
    console.error(`   Run with USE_HTTPS=false or provide valid certificates`);
    process.exit(1);
  }
} else {
  // HTTP mode - default for local development and LAN access
  server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 AI Chat Backend server running on HTTP port ${PORT}`);
    console.log(`📡 Using OpenRouter API with DeepSeek Chat model`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌐 Network: http://YOUR_IP:${PORT} (accessible from LAN)`);
    console.log(`🌐 Accepting requests from any origin (dynamic CORS)`);
    console.log(`💡 To enable HTTPS: set USE_HTTPS=true in .env`);
  });
} 