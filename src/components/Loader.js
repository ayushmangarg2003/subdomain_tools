"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BackgroundPattern from './BackgroundPattern';

export default function Loader({ redirectUrl, onComplete }) {
  const [countdown, setCountdown] = useState(10);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onComplete) {
            onComplete();
          }
          router.push(redirectUrl);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [redirectUrl, router, onComplete]);

  return (
    <div className="relative py-12">
      <BackgroundPattern />
      
      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-8">
          <div className="inline-flex mb-6 p-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full">
            <div className="bg-white rounded-full p-3">
              <div className="text-3xl">⏳</div>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Processing Your Request
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Please wait while we process your request
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="text-6xl font-bold text-indigo-600 mb-4">{countdown}</div>
              <div className="text-gray-600">seconds remaining</div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 h-2.5 rounded-full transition-all duration-1000"
                style={{ width: `${(countdown / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 