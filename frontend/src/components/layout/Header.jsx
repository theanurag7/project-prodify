import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function Header(){
  const { user, logout } = useContext(AuthContext);
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b">
      <div className="text-lg font-medium">Welcome{user ? `, ${user.name || ''}` : ''}</div>
      <div>
        {user ? (
          <button onClick={logout} className="px-3 py-1 rounded bg-slate-800 text-white">Logout</button>
        ) : null}
      </div>
    </header>
  );
}
