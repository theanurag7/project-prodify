// src/controllers/aiController.js
const Groq = require('groq-sdk');

let groq = null;
function getGroqClient() {
  if (!groq) {
    if (!process.env.GROQ_API_KEY) {
      const err = new Error('GROQ_API_KEY is not configured');
      err.status = 500;
      throw err;
    }
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
}

const SYSTEM_PROMPT = `You are a friendly and supportive AI productivity coach for Prodify, a task management and productivity app.

Your role:
- Help users manage their tasks effectively
- Provide productivity tips and strategies
- Offer motivation and encouragement
- Suggest time management techniques
- Help users understand their progress and analytics
- Be concise but helpful (keep responses under 200 words unless more detail is needed)

User context:
- The app has tasks with priorities (low, normal, high)
- Users can track pomodoro sessions
- Users earn points for completing tasks and pomodoro sessions
- Analytics show weekly points earned

Personality:
- Friendly and encouraging
- Professional but approachable
- Use emojis occasionally (but not excessively)
- Focus on actionable advice

When users ask about their data:
- Remind them you can see conversation context but not their actual tasks/data
- Suggest they share specific details if they want personalized advice
- Guide them to check their Analytics page for detailed insights`;

const chat = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Message is required' 
      });
    }

    console.log('📤 Sending to Groq API...');

    // Build messages array with system prompt and history
    const messages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT
      },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    // Call Groq API with Llama model (super fast!)
    const completion = await getGroqClient().chat.completions.create({
      messages: messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
    });

    const assistantMessage = completion.choices[0]?.message?.content || 'No response generated.';

    console.log('✅ Groq API response received');

    // Build updated conversation history
    const updatedHistory = [
      ...conversationHistory,
      {
        role: 'user',
        content: message
      },
      {
        role: 'assistant',
        content: assistantMessage
      }
    ];

    res.json({
      success: true,
      message: assistantMessage,
      conversationHistory: updatedHistory
    });

  } catch (error) {
    console.error('❌ AI Chat error:', error);
    console.error('Error details:', error.message);
    
    // Handle specific API errors
    if (error.message?.includes('API_KEY') || error.message?.includes('API key')) {
      return res.status(500).json({
        success: false,
        message: 'API key configuration error. Please contact support.'
      });
    }

    if (error.message?.includes('quota') || error.message?.includes('limit')) {
      return res.status(429).json({
        success: false,
        message: 'Rate limit exceeded. Please try again in a moment.'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get AI response. Please try again.'
    });
  }
};

module.exports = { chat };
