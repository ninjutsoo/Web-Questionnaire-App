require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

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
You are a kind and supportive AI assistant helping an elderly person with their health and daily questions.

FORMAT RULES — FOLLOW THESE:
• Always answer in a warm, friendly, and respectful tone.
• Use **simple, everyday language** that's easy for older adults to understand.
• **Avoid medical jargon** and complicated terms.
• Use **emojis when helpful**, but not in every sentence.
• Your answer should feel **natural, not robotic**:
  – Use **Less than 5 short bullet points** if the answer has multiple steps or tips.
  – If a quick reply works better, **use just 1–2 sentences**.
• Keep each bullet or sentence **short and clear**—don't use sub-bullets or long paragraphs.
• **Bold key actions or facts** at the start of each bullet when using bullets.
• ❗️**Do NOT start the answer with any general or motivational sentence. Jump right into the advice.** (e.g., avoid phrases like "It's important to stay active…" or "Let's talk about...")

Your goal is to be clear, caring, and easy to follow — just like a helpful friend or family member would be.
`;

    
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
        model: 'deepseek/deepseek-chat-v3-0324:free',
        messages: [
          { 
            role: 'system', 
            content: systemPrompt
          },
          ...messages
        ],
        max_tokens: 300,
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': '4Ms Health Questionnaire App'
        }
      }
    );

    console.log('✅ OpenRouter API Response:', response.data);
    
    const assistantMessage = response.data.choices[0]?.message?.content || 
                            'I apologize, but I couldn\'t generate a response at the moment.';

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
    
    let prompt = `You are a helpful AI assistant. Based on the following user's health questionnaire answers, generate exactly 5 short, helpful questions that someone with this context would benefit from asking an AI health assistant.

IMPORTANT: Return ONLY a JSON array of 5 strings (the questions). Do not include any other text, explanations, or formatting.

Example format:
["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?"]

User's health assessment data:`;
    
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
    
    prompt += '\n\nGenerate 5 relevant questions based on this context:';
    
    console.log('📝 Sending prompt to AI:', prompt);
    
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'deepseek/deepseek-chat-v3-0324:free',
        messages: [
          { role: 'system', content: prompt }
        ],
        max_tokens: 300,
        temperature: 0.5
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
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
          return line.replace(/^["\-\d\.\s]+/, '').replace(/["\s]+$/, '');
        })
        .filter(line => line.length > 10 && line.length < 100);
      
      if (questions.length === 0) {
        console.log('⚠️ No questions extracted, using fallback');
        questions = [
          "What are some good exercises for seniors?",
          "How can I improve my sleep quality?",
          "What foods are good for heart health?",
          "How can I manage stress better?",
          "How can I stay mentally active?"
        ];
      }
    }
    
    console.log('📤 Sending questions to frontend:', questions);
    res.json({ questions });
  } catch (error) {
    console.error('❌ OpenRouter Quick Questions Error:', error.response?.data || error.message);
    res.json({ questions: [
      "What are some good exercises for seniors?",
      "How can I improve my sleep quality?",
      "What foods are good for heart health?",
      "How can I manage stress better?",
      "How can I stay mentally active?"
    ] });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 AI Chat Backend server running on port ${PORT}`);
  console.log(`📡 Using OpenRouter API with DeepSeek Chat model`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
}); 