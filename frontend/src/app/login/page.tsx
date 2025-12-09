"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error('Invalid credentials');

      const data = await res.json();
      
      // Save Token to LocalStorage
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      
      // Redirect to Dashboard
      router.push('/');
      
    } catch (err) {
      setError('Login failed. Please checks your details.');
    }
  };

  return (
    <div className="min-h-screen bg-serenova-bg flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        <h1 className="text-3xl font-bold text-serenova-dark mb-2 text-center">Welcome Back</h1>
        <p className="text-gray-500 text-center mb-8">Please log in to continue.</p>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-serenova-primary outline-none"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-serenova-primary outline-none"
              required 
            />
          </div>
          <button type="submit" className="w-full bg-serenova-dark text-white p-3 rounded-xl font-bold hover:bg-opacity-90 transition">
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account? <Link href="/register" className="text-serenova-primary font-bold">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}