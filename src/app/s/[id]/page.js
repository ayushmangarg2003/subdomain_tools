"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ShortUrlRedirect({ params }) {
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    // In a real application, you would fetch the original URL from your database
    // using the 'id' parameter
    
    // For demo purposes, we'll just redirect to the home page after showing a message
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [id, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p className="text-gray-600 mb-2">
          In a real application, this page would redirect to the original URL associated with code: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{id}</span>
        </p>
        <p className="text-sm text-gray-500">You will be redirected to homepage in 3 seconds.</p>
      </div>
    </div>
  );
} 