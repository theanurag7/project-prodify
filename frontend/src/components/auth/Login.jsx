import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await login({ email, password });
      navigate('/');
    } catch (error) {
      console.error(error);
      setErr(error?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl mb-4">Login</h2>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        <label className="block mb-2">
          <span className="text-sm">Email</span>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} className="mt-1 block w-full p-2 border rounded" />
        </label>
        <label className="block mb-4">
          <span className="text-sm">Password</span>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="mt-1 block w-full p-2 border rounded" />
        </label>
        <button type="submit" className="w-full py-2 rounded bg-slate-800 text-white">Login</button>
        <p className="mt-4 text-sm">No account? <Link to="/register" className="text-blue-600">Register</Link></p>
      </form>
    </div>
  );
}
