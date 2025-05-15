"use client";

import { useState } from 'react';
import BackgroundPattern from '../../components/BackgroundPattern';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  
  const generatePassword = () => {
    // Reset error state
    setError('');
    
    // Validate options
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
      setError('Please select at least one character type');
      return;
    }
    
    if (length < 4 || length > 100) {
      setError('Password length must be between 4 and 100 characters');
      return;
    }
    
    // Define character sets
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_-+={}[]|:;<>,.?/~';
    
    // Build character pool based on selections
    let charPool = '';
    if (includeUppercase) charPool += uppercaseChars;
    if (includeLowercase) charPool += lowercaseChars;
    if (includeNumbers) charPool += numberChars;
    if (includeSymbols) charPool += symbolChars;
    
    // Generate password
    let generatedPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charPool.length);
      generatedPassword += charPool[randomIndex];
    }
    
    // Ensure all selected character types are included
    let missingTypes = [];
    if (includeUppercase && !/[A-Z]/.test(generatedPassword)) missingTypes.push('uppercase');
    if (includeLowercase && !/[a-z]/.test(generatedPassword)) missingTypes.push('lowercase');
    if (includeNumbers && !/[0-9]/.test(generatedPassword)) missingTypes.push('number');
    if (includeSymbols && !/[!@#$%^&*()_\-+={}[\]|:;<>,.?/~]/.test(generatedPassword)) missingTypes.push('symbol');
    
    // If any types are missing, try again
    if (missingTypes.length > 0) {
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
  
  const getPasswordStrength = () => {
    if (!password) return { text: '', className: '' };
    
    if (length < 8) {
      return { text: 'Very Weak', className: 'bg-red-500' };
    } else if (length < 12) {
      return { text: 'Weak', className: 'bg-orange-500' };
    } else if (length < 16) {
      return { text: 'Medium', className: 'bg-yellow-500' };
    } else if (length < 20) {
      return { text: 'Strong', className: 'bg-green-500' };
    } else {
      return { text: 'Very Strong', className: 'bg-indigo-500' };
    }
  };
  
  const strength = getPasswordStrength();
  
  return (
    <div className="relative py-12">
      <BackgroundPattern />
      
      <div className="max-w-3xl mx-auto relative">
        <div className="text-center mb-10">
          <div className="inline-flex mb-6 p-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full">
            <div className="bg-white rounded-full p-3">
              <div className="text-3xl">🔒</div>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Password Generator</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Create strong, secure passwords with custom requirements</p>
        </div>
        
        <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
          {/* Password Output */}
          <div className="mb-8">
            <div className="flex items-center mb-2 justify-between">
              <label className="block text-sm font-medium text-gray-700">Your Password</label>
              {password && (
                <div className="flex items-center text-sm">
                  <span className="mr-2">Strength:</span>
                  <span className={`px-2 py-1 rounded text-white text-xs ${strength.className}`}>
                    {strength.text}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex">
              <input
                type="text"
                readOnly
                value={password}
                placeholder="Generated password will appear here"
                className="flex-1 p-3 border border-gray-300 rounded-l-md font-mono text-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={copyToClipboard}
                disabled={!password}
                className={`px-4 py-3 rounded-r-md focus:outline-none transition-colors duration-200 flex items-center justify-center min-w-[100px] ${
                  !password 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : copied 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {copied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied
                  </>
                ) : (
                  'Copy'
                )}
              </button>
            </div>
          </div>
          
          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password Length: {length}</label>
              <input
                type="range"
                min="4"
                max="100"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>4</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="uppercase"
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={() => setIncludeUppercase(!includeUppercase)}
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
                  onChange={() => setIncludeLowercase(!includeLowercase)}
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
                  onChange={() => setIncludeNumbers(!includeNumbers)}
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
                  onChange={() => setIncludeSymbols(!includeSymbols)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="symbols" className="ml-2 block text-sm text-gray-700">
                  Include Symbols (!@#$%^&*)
                </label>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="mb-6 p-3 text-sm bg-red-50 text-red-600 rounded-md border border-red-100">
              {error}
            </div>
          )}
          
          <button
            onClick={generatePassword}
            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Generate Password
          </button>
          
          {password && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Password Tips:</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Use different passwords for different accounts</li>
                <li>Don't share your passwords with others</li>
                <li>Consider using a password manager to store your passwords securely</li>
                <li>Change important passwords periodically</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 