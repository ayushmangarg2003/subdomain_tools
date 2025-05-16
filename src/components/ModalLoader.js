"use client";

import { useState, useEffect } from 'react';

export default function ModalLoader({ onComplete }) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onComplete) {
            onComplete();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        <div className="p-8 text-center">
          <div className="mb-6">
            <div className="inline-flex mb-6 p-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full">
              <div className="bg-white rounded-full p-3">
                <div className="text-3xl">⏳</div>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Processing Your Request
            </h2>
            <p className="text-gray-600">
              Please wait while we process your request
            </p>
          </div>
          
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
  );
} 