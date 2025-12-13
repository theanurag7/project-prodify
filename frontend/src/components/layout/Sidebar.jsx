import React from 'react';
import { NavLink } from 'react-router-dom';

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `block px-4 py-2 rounded ${isActive ? 'bg-white shadow' : 'hover:bg-slate-100'}`}
  >
    {children}
  </NavLink>
);

export default function Sidebar(){
  return (
    <aside className="w-56 bg-slate-100 p-4">
      <h3 className="font-semibold mb-4">Prodify</h3>
      <nav className="space-y-1">
        <NavItem to="/">Dashboard</NavItem>
        <NavItem to="/tasks">Tasks</NavItem>
        <NavItem to="/pomodoro">Pomodoro</NavItem>
        <NavItem to="/analytics">Analytics</NavItem>
        <NavItem to="/ai-chat">🤖 AI Coach</NavItem> {/* ⭐ ADD THIS */}
      </nav>
    </aside>
  );
}