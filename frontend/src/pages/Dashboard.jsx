// src/pages/Dashboard.jsx
import React, { useState, useContext, useEffect } from 'react';
import AppShell from '../components/layout/AppShell';
import { AuthContext } from '../context/AuthContext';

// Motivational quotes from productivity books
const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Either you run the day, or the day runs you.", author: "Jim Rohn" },
  { text: "Until we can manage time, we can manage nothing else.", author: "Peter Drucker" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "What you do today can improve all your tomorrows.", author: "Ralph Marston" },
  { text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.", author: "Stephen Covey" },
  { text: "Productivity is never an accident. It is always the result of commitment to excellence.", author: "Paul J. Meyer" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.", author: "Stephen King" },
  { text: "It's not about having time. It's about making time.", author: "Unknown" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" }
];

// Productivity articles
const ARTICLES = [
  {
    title: "The Two-Minute Rule",
    content: "If a task takes less than two minutes, do it immediately. This simple rule from David Allen's 'Getting Things Done' prevents small tasks from piling up and overwhelming you.",
    source: "Getting Things Done by David Allen"
  },
  {
    title: "Deep Work: The Superpower of the 21st Century",
    content: "The ability to focus without distraction on a cognitively demanding task is becoming increasingly rare and valuable. Schedule blocks of uninterrupted time for your most important work.",
    source: "Deep Work by Cal Newport"
  },
  {
    title: "Eat That Frog",
    content: "Start your day by tackling your biggest, most challenging task first. When you complete your hardest task early, everything else feels easier and you gain momentum.",
    source: "Eat That Frog! by Brian Tracy"
  },
  {
    title: "The Pomodoro Technique",
    content: "Work in focused 25-minute intervals followed by 5-minute breaks. This technique helps maintain high concentration while preventing burnout throughout the day.",
    source: "The Pomodoro Technique by Francesco Cirillo"
  },
  {
    title: "The Power of Tiny Habits",
    content: "Big changes come from small actions repeated consistently. Start with a habit so small it seems trivial, then build from there. Success breeds success.",
    source: "Atomic Habits by James Clear"
  },
  {
    title: "Single-Tasking Over Multi-Tasking",
    content: "Your brain can only truly focus on one task at a time. Switching between tasks reduces productivity by up to 40%. Choose one task and give it your full attention.",
    source: "The One Thing by Gary Keller"
  },
  {
    title: "The 80/20 Rule (Pareto Principle)",
    content: "80% of your results come from 20% of your efforts. Identify the high-impact activities that drive most of your success and prioritize them ruthlessly.",
    source: "The 4-Hour Workweek by Tim Ferriss"
  },
  {
    title: "Energy Management Over Time Management",
    content: "Instead of managing your time, manage your energy. Schedule your most important work during your peak energy hours and protect those golden hours fiercely.",
    source: "The Power of Full Engagement by Jim Loehr"
  },
  {
    title: "Decision Fatigue is Real",
    content: "Every decision depletes your mental energy. Reduce decision fatigue by creating routines, planning ahead, and automating trivial choices to preserve mental capacity for important decisions.",
    source: "Willpower by Roy Baumeister"
  },
  {
    title: "The Five-Minute Journal Method",
    content: "Start each day by writing three things you're grateful for and three things that would make today great. This simple practice shifts your mindset toward positivity and clarity.",
    source: "The Five Minute Journal by Intelligent Change"
  }
];

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [quote, setQuote] = useState(QUOTES[0]);
  const [article, setArticle] = useState(ARTICLES[0]);

  useEffect(() => {
    // Pick random quote and article on component mount
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    const randomArticle = ARTICLES[Math.floor(Math.random() * ARTICLES.length)];
    setQuote(randomQuote);
    setArticle(randomArticle);
  }, []);

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        {/* Welcome Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-3">
            Welcome back, {user?.name || user?.email?.split('@')[0] || 'Achiever'}!
          </h1>
          <div className="max-w-2xl mx-auto">
            <blockquote className="text-xl text-slate-600 italic mb-2">
              "{quote.text}"
            </blockquote>
            <p className="text-sm text-slate-500">— {quote.author}</p>
          </div>
        </div>

        {/* Productivity Article */}
        <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-blue-500">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-800">{article.title}</h2>
            <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              Daily Insight
            </span>
          </div>
          
          <p className="text-slate-700 leading-relaxed mb-4 text-lg">
            {article.content}
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <p className="text-sm text-slate-500 italic">
              📚 From: {article.source}
            </p>
            <button 
              onClick={() => {
                const newArticle = ARTICLES[Math.floor(Math.random() * ARTICLES.length)];
                setArticle(newArticle);
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Read Another →
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a 
            href="/tasks" 
            className="bg-gradient-to-br from-slate-700 to-slate-900 text-white p-6 rounded-lg shadow hover:shadow-xl transition-shadow text-center"
          >
            <div className="text-3xl mb-2">📝</div>
            <div className="font-semibold">Manage Tasks</div>
          </a>

          <a 
            href="/pomodoro" 
            className="bg-gradient-to-br from-red-500 to-red-700 text-white p-6 rounded-lg shadow hover:shadow-xl transition-shadow text-center"
          >
            <div className="text-3xl mb-2">🍅</div>
            <div className="font-semibold">Start Pomodoro</div>
          </a>

          <a 
            href="/analytics" 
            className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-lg shadow hover:shadow-xl transition-shadow text-center"
          >
            <div className="text-3xl mb-2">📊</div>
            <div className="font-semibold">View Progress</div>
          </a>
        </div>
      </div>
    </AppShell>
  );
}