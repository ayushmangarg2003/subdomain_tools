"use client";

import { useState } from 'react';
import { nanoid } from 'nanoid';
import BackgroundPattern from '../../components/BackgroundPattern';

export default function UrlShortener() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generateShortUrl = () => {
    // Reset states
    setError('');
    setCopied(false);
    
    // Validate URL
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    try {
      // Check if valid URL format
      new URL(url);
      
      setIsLoading(true);
      
      // Generate a short code using nanoid (in a real app, you'd save this to a database)
      const shortCode = nanoid(6);
      
      // Simulate API delay
      setTimeout(() => {
        const baseUrl = window.location.origin;
        setShortUrl(`${baseUrl}/s/${shortCode}`);
        setIsLoading(false);
      }, 800);
      
    } catch (err) {
      setError('Please enter a valid URL including http:// or https://');
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative py-8">
      <BackgroundPattern />
      
      <div className="max-w-2xl mx-auto relative">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">URL Shortener</h1>
          <p className="text-gray-600">Shorten your long URLs with just one click</p>
        </div>
        
        <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
          <div className="mb-6">
            <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your long URL
            </label>
            <input 
              id="url-input"
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/very/long/url"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
          
          <button 
            onClick={generateShortUrl}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              'Shorten URL'
            )}
          </button>
          
          {shortUrl && (
            <div className="mt-8 p-5 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">Your shortened URL:</p>
              <div className="flex items-center">
                <input
                  type="text"
                  readOnly
                  value={shortUrl}
                  className="flex-1 p-3 border border-gray-300 rounded-l-md bg-white focus:outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className={`px-4 py-3 rounded-r-md focus:outline-none ${
                    copied 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors duration-200`}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                This is a demonstration. In a production app, URLs would persist in a database.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 