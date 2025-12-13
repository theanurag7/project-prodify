import React, { useState, useRef, useEffect } from 'react';
import AppShell from '../components/layout/AppShell';
import { sendChatMessage } from '../api/ai';

export default function AIChatPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your AI productivity coach powered by Groq AI. How can I help you boost your productivity today? 🚀"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // Prepare conversation history (exclude the welcome message)
      const history = messages
        .slice(1) // Skip welcome message
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      const { data } = await sendChatMessage(userMessage, history);
      
      if (data.success) {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: data.message }
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = error.response?.data?.message || 'Sorry, I encountered an error. Please try again.';
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `❌ ${errorMsg}`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold">AI Productivity Coach 🤖</h1>
          <p className="text-sm text-slate-600 mt-1">Powered by Groq AI - Lightning Fast ⚡</p>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow p-4 mb-4">
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-800 rounded-lg px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Prompts */}
        <div className="mb-3 flex flex-wrap gap-2">
          <button
            onClick={() => handleQuickPrompt("How can I be more productive?")}
            className="text-xs px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
          >
            💡 Productivity tips
          </button>
          <button
            onClick={() => handleQuickPrompt("What's the Pomodoro technique?")}
            className="text-xs px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
          >
            🍅 About Pomodoro
          </button>
          <button
            onClick={() => handleQuickPrompt("How should I prioritize tasks?")}
            className="text-xs px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
          >
            📋 Task prioritization
          </button>
          <button
            onClick={() => handleQuickPrompt("Give me motivation to start working")}
            className="text-xs px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
          >
            ⚡ Motivate me
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about productivity..."
            disabled={loading}
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </AppShell>
  );
}