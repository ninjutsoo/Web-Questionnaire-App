require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
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
app.use(cors());
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
    
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'x-ai/grok-4-fast:free',
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
          'HTTP-Referer': req.headers.origin ?? process.env.FRONTEND_URL ?? 'http://localhost:3000',
          'X-Title': '4Ms Health Questionnaire App'
        }
      }
    );

    console.log('✅ OpenRouter API Response:', response.data);
    
    const assistantMessage = response.data.choices[0]?.message?.content || 
                            'I apologize, but I couldn\'t generate a response at the moment.';

    // Log the model's output (assistant's message)
    console.log('==== MODEL OUTPUT FROM AI ====');
    console.log(assistantMessage);
    
    res.json({
      choices: [{
        message: {
          role: 'assistant',
          content: assistantMessage
        }
      }]
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

// Quick Questions endpoint - only generate, don't save
app.get('/api/quick-questions', async (req, res) => {
  // Return empty array - frontend will handle loading from Firebase
  res.json({ questions: [] });
});

app.post('/api/quick-questions', async (req, res) => {
  const { userContext } = req.body;
  try {
    console.log('🔄 Quick Questions request received');
    console.log('📊 User context:', userContext);
    
    let prompt = `You are a helpful AI assistant. Based on the following user's health questionnaire answers, generate exactly 10 short, helpful questions that someone with this context would benefit from asking an AI health assistant.

IMPORTANT: Return ONLY a JSON array of 10 strings (the questions). Do not include any other text, explanations, or formatting.

Example format:
["Question 1?", "Question 2?", ..., "Question 10?"]

User's health assessment data:`;
    
    // Add location to quick questions prompt if present
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
    
    prompt += '\n\nGenerate 10 relevant questions based on this context:';
    
    console.log('📝 Sending prompt to AI:', prompt);
    
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'x-ai/grok-4-fast:free',
        messages: [
          { role: 'system', content: prompt }
        ],
        // max_tokens: 400,
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
    
    console.log('✅ AI Response received:', response.data.choices[0]?.message?.content);
    
    // Try to parse the response as a JSON array
    let questions = [];
    try {
      const text = response.data.choices[0]?.message?.content || '';
      console.log('🔍 Attempting to parse:', text);
      
      // Clean the text - remove any markdown formatting
      const cleanText = text.replace(/```json\s*|\s*```/g, '').trim();
      questions = JSON.parse(cleanText);
      
      if (!Array.isArray(questions)) {
        throw new Error('Response is not an array');
      }
      
      console.log('✅ Successfully parsed questions:', questions);
    } catch (err) {
      console.log('⚠️ JSON parsing failed, trying to extract questions from text');
      // fallback: try to extract lines that look like questions
      const text = response.data.choices[0]?.message?.content || '';
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      
      questions = lines
        .filter(line => line.includes('?') || line.startsWith('"') || line.startsWith('-'))
        .map(line => {
          // Remove quotes, dashes, numbers, etc.
          return line.replace(/^\["\-\d\.\s]+/, '').replace(/["\s]+$/, '');
        })
        .filter(line => line.length > 10 && line.length < 100);
      
      if (questions.length === 0) {
        console.log('⚠️ No questions extracted, using fallback');
        questions = [
          "What are some good exercises for seniors?",
          "How can I improve my sleep quality?",
          "What foods are good for heart health?",
          "How can I manage stress better?",
          "How can I stay mentally active?",
          "What are some ways to stay socially connected?",
          "How can I safely increase my physical activity?",
          "What are some tips for managing medications?",
          "How can I improve my memory?",
          "What are some healthy snacks for seniors?"
        ];
      }
    }
    
    // Only return up to 10 questions
    questions = questions.slice(0, 10);
    
    console.log('📤 Sending questions to frontend:', questions);
    res.json({ questions });
  } catch (error) {
    console.error('❌ OpenRouter Quick Questions Error:', error.response?.data || error.message);
    res.json({ questions: [
      "What are some good exercises for seniors?",
      "How can I improve my sleep quality?",
      "What foods are good for heart health?",
      "How can I manage stress better?",
      "How can I stay mentally active?",
      "What are some ways to stay socially connected?",
      "How can I safely increase my physical activity?",
      "What are some tips for managing medications?",
      "How can I improve my memory?",
      "What are some healthy snacks for seniors?"
    ] });
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
app.listen(PORT, () => {
  console.log(`🚀 AI Chat Backend server running on port ${PORT}`);
  console.log(`📡 Using OpenRouter API with DeepSeek Chat model`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
}); 