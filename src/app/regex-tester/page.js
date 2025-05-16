"use client";

import { useState, useEffect } from 'react';
import BackgroundPattern from '../../components/BackgroundPattern';
import ModalLoader from '../../components/ModalLoader';

// Example regex patterns with descriptions
const examplePatterns = [
  { pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", description: "Email address" },
  { pattern: "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$", description: "Password with minimum 8 characters, at least one letter and one number" },
  { pattern: "^(0[1-9]|1[0-2])\\/(0[1-9]|[12][0-9]|3[01])\\/\\d{4}$", description: "Date in MM/DD/YYYY format" },
  { pattern: "^(\\+\\d{1,3}( )?)?((\\(\\d{3}\\))|\\d{3})[- .]?\\d{3}[- .]?\\d{4}$", description: "Phone number with optional country code" },
  { pattern: "^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$", description: "Hex color code" },
];

export default function RegexTester() {
  const [regex, setRegex] = useState("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("user@example.com\nsupport@domain.co.uk\nnot-an-email\njohn.doe@company.org");
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");
  const [selectedExample, setSelectedExample] = useState(0);
  const [showLoader, setShowLoader] = useState(false);
  
  // Process regex whenever inputs change
  useEffect(() => {
    testRegex();
  }, [regex, flags, testString]);
  
  const testRegex = () => {
    setError("");
    setMatches([]);
    
    if (!regex) return;
    
    try {
      const regexObj = new RegExp(regex, flags);
      
      // Find all matches with their positions
      const lines = testString.split('\n');
      const newMatches = [];
      
      lines.forEach((line, lineIndex) => {
        let match;
        const lineMatches = [];
        const regexWithIndices = new RegExp(regex, flags.includes('g') ? flags : flags + 'g');
        
        while ((match = regexWithIndices.exec(line)) !== null) {
          lineMatches.push({
            value: match[0],
            startPos: match.index,
            endPos: match.index + match[0].length,
          });
          
          // Prevent infinite loops for zero-length matches
          if (match.index === regexWithIndices.lastIndex) {
            regexWithIndices.lastIndex++;
          }
        }
        
        newMatches.push({
          line,
          lineIndex,
          matches: lineMatches,
          isMatch: lineMatches.length > 0,
        });
      });
      
      setMatches(newMatches);
    } catch (e) {
      setError(e.message);
    }
  };
  
  const handleTestRegex = () => {
    setShowLoader(true);
  };
  
  const loadExample = (index) => {
    setSelectedExample(index);
    setRegex(examplePatterns[index].pattern);
  };
  
  const highlightMatches = (line, lineMatches) => {
    if (lineMatches.length === 0) return line;
    
    let result = [];
    let lastEnd = 0;
    
    lineMatches.forEach((match, index) => {
      // Add text before match
      if (match.startPos > lastEnd) {
        result.push(
          <span key={`before-${index}`}>
            {line.substring(lastEnd, match.startPos)}
          </span>
        );
      }
      
      // Add highlighted match
      result.push(
        <span 
          key={`match-${index}`}
          className="bg-green-200 text-green-800 rounded px-0.5"
        >
          {line.substring(match.startPos, match.endPos)}
        </span>
      );
      
      lastEnd = match.endPos;
    });
    
    // Add remaining text after last match
    if (lastEnd < line.length) {
      result.push(
        <span key="after-last">
          {line.substring(lastEnd)}
        </span>
      );
    }
    
    return result;
  };
  
  return (
    <div className="relative py-12">
      <BackgroundPattern />
      
      {showLoader && (
        <ModalLoader
          onComplete={() => {
            testRegex();
            setShowLoader(false);
          }}
        />
      )}
      
      <div className="max-w-5xl mx-auto relative">
        <div className="text-center mb-8">
          <div className="inline-flex mb-6 p-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full">
            <div className="bg-white rounded-full p-3">
              <div className="text-3xl">🔍</div>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Regex Tester</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Test and debug regular expressions with live highlighting</p>
        </div>
        
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden mb-8">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="regex" className="block text-sm font-medium text-gray-700 mb-1">
                  Regular Expression
                </label>
                <div className="flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    /
                  </span>
                  <input
                    type="text"
                    id="regex"
                    value={regex}
                    onChange={(e) => setRegex(e.target.value)}
                    className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
                    placeholder="Enter regex pattern"
                  />
                  <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    /
                    <input
                      type="text"
                      value={flags}
                      onChange={(e) => setFlags(e.target.value)}
                      className="w-12 px-1 border-0 bg-transparent focus:outline-none focus:ring-0 text-sm font-mono"
                      placeholder="flags"
                    />
                  </span>
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Flags: g (global), i (case-insensitive), m (multi-line), s (dot matches newlines), u (unicode), y (sticky)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Example Patterns
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={selectedExample}
                  onChange={(e) => loadExample(parseInt(e.target.value))}
                >
                  {examplePatterns.map((example, index) => (
                    <option key={index} value={index}>
                      {example.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="test-string" className="block text-sm font-medium text-gray-700 mb-1">
                Test String
              </label>
              <textarea
                id="test-string"
                rows={5}
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
                placeholder="Enter text to test against the regex pattern"
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleTestRegex}
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
              >
                Test Regex
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Results</h2>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <div className="font-medium text-sm text-gray-700 mb-2">Match Visualization</div>
              <div className="bg-gray-50 p-4 rounded-md font-mono text-sm whitespace-pre-wrap">
                {matches.map((lineData, lineIndex) => (
                  <div
                    key={lineIndex}
                    className={`py-1 ${lineData.isMatch ? 'border-l-4 border-green-500 pl-2 -ml-2' : ''}`}
                  >
                    {highlightMatches(lineData.line, lineData.matches)}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="font-medium text-sm text-gray-700 mb-2">Matches</div>
              <div className="bg-gray-50 p-4 rounded-md">
                {matches.some(line => line.matches.length > 0) ? (
                  <div className="space-y-4">
                    {matches.filter(line => line.matches.length > 0).map((lineData, lineIndex) => (
                      <div key={lineIndex}>
                        <div className="text-xs text-gray-500 mb-1">Line {lineData.lineIndex + 1}</div>
                        <div className="flex flex-wrap gap-2">
                          {lineData.matches.map((match, matchIndex) => (
                            <span
                              key={matchIndex}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800 font-mono"
                            >
                              {match.value}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No matches found</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 