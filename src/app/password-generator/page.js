"use client";

import { useState } from 'react';
import BackgroundPattern from '../../components/BackgroundPattern';
import ModalLoader from '../../components/ModalLoader';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let chars = '';
    if (includeUppercase) chars += uppercase;
    if (includeLowercase) chars += lowercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;
    
    if (chars === '') {
      setPassword('');
      return;
    }
    
    let generatedPassword = '';
    const missingTypes = [];
    
    // Ensure at least one character from each selected type
    if (includeUppercase) {
      const char = uppercase[Math.floor(Math.random() * uppercase.length)];
      generatedPassword += char;
      missingTypes.push(uppercase);
    }
    if (includeLowercase) {
      const char = lowercase[Math.floor(Math.random() * lowercase.length)];
      generatedPassword += char;
      missingTypes.push(lowercase);
    }
    if (includeNumbers) {
      const char = numbers[Math.floor(Math.random() * numbers.length)];
      generatedPassword += char;
      missingTypes.push(numbers);
    }
    if (includeSymbols) {
      const char = symbols[Math.floor(Math.random() * symbols.length)];
      generatedPassword += char;
      missingTypes.push(symbols);
    }
    
    // Fill the rest of the password
    while (generatedPassword.length < length) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      generatedPassword += chars[randomIndex];
    }
    
    // Shuffle the password
    generatedPassword = generatedPassword.split('').sort(() => Math.random() - 0.5).join('');
    
    // Check if all required character types are present
    const hasAllTypes = missingTypes.every(type => 
      type.split('').some(char => generatedPassword.includes(char))
    );
    
    if (!hasAllTypes) {
      return generatePassword();
    }
    
    setPassword(generatedPassword);
  };
  
  const copyToClipboard = () => {
    if (!password) return;
    
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleGeneratePassword = () => {
    setShowLoader(true);
  };
  
  const getPasswordStrength = () => {
    if (!password) return { text: '', className: '' };
    
    if (length < 8) {
      return { text: 'Very Weak', className: 'bg-red-100 text-red-800' };
    }
    
    let score = 0;
    if (includeUppercase) score++;
    if (includeLowercase) score++;
    if (includeNumbers) score++;
    if (includeSymbols) score++;
    if (length >= 12) score++;
    if (length >= 16) score++;
    
    if (score <= 2) return { text: 'Weak', className: 'bg-red-100 text-red-800' };
    if (score <= 4) return { text: 'Medium', className: 'bg-yellow-100 text-yellow-800' };
    if (score <= 5) return { text: 'Strong', className: 'bg-green-100 text-green-800' };
    return { text: 'Very Strong', className: 'bg-green-100 text-green-800' };
  };
  
  return (
    <div className="relative py-12">
      <BackgroundPattern />
      
      {showLoader && (
        <ModalLoader
          onComplete={() => {
            generatePassword();
            setShowLoader(false);
          }}
        />
      )}
      
      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-8">
          <div className="inline-flex mb-6 p-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full">
            <div className="bg-white rounded-full p-3">
              <div className="text-3xl">🔒</div>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Password Generator
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create strong, secure passwords with custom requirements
          </p>
        </div>
        
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden mb-8">
          <div className="p-6">
            <div className="mb-6">
              <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">
                Password Length: {length}
              </label>
              <input
                type="range"
                id="length"
                min="4"
                max="32"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <input
                  id="uppercase"
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="uppercase" className="ml-2 block text-sm text-gray-700">
                  Include Uppercase Letters (A-Z)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="lowercase"
                  type="checkbox"
                  checked={includeLowercase}
                  onChange={(e) => setIncludeLowercase(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="lowercase" className="ml-2 block text-sm text-gray-700">
                  Include Lowercase Letters (a-z)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="numbers"
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="numbers" className="ml-2 block text-sm text-gray-700">
                  Include Numbers (0-9)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="symbols"
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="symbols" className="ml-2 block text-sm text-gray-700">
                  Include Symbols (!@#$%^&*)
                </label>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={handleGeneratePassword}
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
              >
                Generate Password
              </button>
            </div>
          </div>
        </div>
        
        {password && (
          <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700 mb-1">Generated Password</div>
                  <div className="font-mono text-lg break-all">{password}</div>
                </div>
                <button
                  onClick={copyToClipboard}
                  className={`ml-4 p-2 rounded-md focus:outline-none ${
                    copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {copied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  )}
                </button>
              </div>
              
              <div className="flex items-center">
                <div className="text-sm font-medium text-gray-700 mr-2">Strength:</div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPasswordStrength().className}`}>
                  {getPasswordStrength().text}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 