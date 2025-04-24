'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.push('/courses'); // Redirect if already logged in
    }
  }, [token]);

  const goToLogin = () => {
    router.push('/login');
  };

  const goToRegister = () => {
    router.push('/register');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to Student Course Tracker</h1>
      <p className="text-lg mb-6">Track your courses, enroll, and rate them!</p>
      <div className="flex gap-4">
        <button
          onClick={goToLogin}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>
        <button
          onClick={goToRegister}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Register
        </button>
      </div>
    </main>
  );
}
