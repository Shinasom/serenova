"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const res = await fetch('http://127.0.0.1:8000/api/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      alert("Account created! Please log in.");
      router.push('/login');
    } else {
      alert("Registration failed. Username might be taken.");
    }
  };

  return (
    <div className="min-h-screen bg-serenova-bg flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        <h1 className="text-3xl font-bold text-serenova-dark mb-2 text-center">Join Serenova</h1>
        <p className="text-gray-500 text-center mb-8">Start your wellness journey today.</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-serenova-primary outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-serenova-primary outline-none" required />
          </div>
          <button type="submit" className="w-full bg-serenova-primary text-white p-3 rounded-xl font-bold hover:bg-opacity-90 transition">Create Account</button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account? <Link href="/login" className="text-serenova-dark font-bold">Log In</Link>
        </p>
      </div>
    </div>
  );
}