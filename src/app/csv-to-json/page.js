"use client";

import { useState, useRef } from 'react';
import BackgroundPattern from '../../components/BackgroundPattern';
import ModalLoader from '../../components/ModalLoader';

const sampleCsv = `name,email,age,city
John Doe,john@example.com,32,New York
Jane Smith,jane@example.com,28,San Francisco
Mike Johnson,mike@example.com,45,Chicago
Sarah Williams,sarah@example.com,36,Boston`;

const sampleJson = [
  {
    "name": "John Doe",
    "email": "john@example.com",
    "age": "32",
    "city": "New York"
  },
  {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "age": "28",
    "city": "San Francisco"
  }
];

export default function CsvToJson() {
  const [inputFormat, setInputFormat] = useState('csv');
  const [input, setInput] = useState(sampleCsv);
  const [output, setOutput] = useState('');
  const [hasHeader, setHasHeader] = useState(true);
  const [delimiter, setDelimiter] = useState(',');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const fileInputRef = useRef(null);
  
  const parseCSV = (csv, hasHeader, delimiter) => {
    // Split by line breaks
    const lines = csv.split(/\r\n|\n|\r/).filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
      throw new Error('CSV is empty');
    }
    
    // Get headers
    const headers = hasHeader 
      ? lines[0].split(delimiter).map(header => header.trim())
      : lines[0].split(delimiter).map((_, index) => `column${index + 1}`);
    
    // Parse data rows
    const result = [];
    const startIndex = hasHeader ? 1 : 0;
    
    for (let i = startIndex; i < lines.length; i++) {
      const row = {};
      const values = parseCSVLine(lines[i], delimiter);
      
      if (values.length !== headers.length) {
        // Skip malformed rows
        continue;
      }
      
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      
      result.push(row);
    }
    
    return result;
  };
  
  // Helper function to parse CSV line (handles quoted values with commas inside)
  const parseCSVLine = (line, delimiter) => {
    const result = [];
    let value = '';
    let insideQuote = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          // Escaped quote
          value += '"';
          i++;
        } else {
          // Toggle inside/outside quotes
          insideQuote = !insideQuote;
        }
      } else if (char === delimiter && !insideQuote) {
        // End of value
        result.push(value.trim());
        value = '';
      } else {
        // Add character to value
        value += char;
      }
    }
    
    // Add the last value
    result.push(value.trim());
    
    return result;
  };
  
  const parseJSON = (json) => {
    const data = JSON.parse(json);
    
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('JSON must be an array of objects');
    }
    
    // Get all possible headers from all objects
    const headers = new Set();
    data.forEach(obj => {
      Object.keys(obj).forEach(key => headers.add(key));
    });
    
    const headerArray = Array.from(headers);
    
    // Create CSV
    const rows = [headerArray.join(delimiter)];
    
    data.forEach(obj => {
      const row = headerArray.map(header => {
        const value = obj[header] !== undefined ? obj[header] : '';
        
        // Wrap in quotes if value contains delimiters or quotes
        if (typeof value === 'string' && (value.includes(delimiter) || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        
        return value;
      });
      
      rows.push(row.join(delimiter));
    });
    
    return rows.join('\n');
  };
  
  const convert = () => {
    setError('');
    setLoading(true);
    
    try {
      if (inputFormat === 'csv') {
        // CSV to JSON
        const json = parseCSV(input, hasHeader, delimiter);
        setOutput(JSON.stringify(json, null, 2));
      } else {
        // JSON to CSV
        const csv = parseJSON(input);
        setOutput(csv);
      }
    } catch (e) {
      setError(`Error: ${e.message}`);
      setOutput('');
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = () => {
    setShowLoader(true);
  };
  
  const loadSample = () => {
    if (inputFormat === 'csv') {
      setInput(sampleCsv);
    } else {
      setInput(JSON.stringify(sampleJson, null, 2));
    }
  };
  
  const clearInput = () => {
    setInput('');
    setOutput('');
    setError('');
  };
  
  const copyToClipboard = () => {
    if (!output) return;
    
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      setError('Failed to copy to clipboard');
    });
  };
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setError('');
    setLoading(true);
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      setInput(event.target.result);
      setLoading(false);
    };
    
    reader.onerror = () => {
      setError('Error reading file');
      setLoading(false);
    };
    
    reader.readAsText(file);
  };
  
  return (
    <div className="relative py-12">
      <BackgroundPattern />
      
      {showLoader && (
        <ModalLoader
          onComplete={() => {
            convert();
            setShowLoader(false);
          }}
        />
      )}
      
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-8">
          <div className="inline-flex mb-6 p-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full">
            <div className="bg-white rounded-full p-3">
              <div className="text-3xl">📊</div>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {inputFormat === 'csv' ? 'CSV to JSON Converter' : 'JSON to CSV Converter'}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Convert between CSV and JSON formats effortlessly
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Input</h2>
              <div className="flex space-x-2">
                <button
                  onClick={loadSample}
                  className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                >
                  Load Sample
                </button>
                <button
                  onClick={clearInput}
                  className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                >
                  Clear
                </button>
                <label
                  htmlFor="file-upload"
                  className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md cursor-pointer"
                >
                  Upload File
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept={inputFormat === 'csv' ? '.csv' : '.json'}
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  className="hidden"
                />
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between mb-4">
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      id="csv-option"
                      type="radio"
                      checked={inputFormat === 'csv'}
                      onChange={() => setInputFormat('csv')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="csv-option" className="ml-2 block text-sm text-gray-700">
                      CSV
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="json-option"
                      type="radio"
                      checked={inputFormat === 'json'}
                      onChange={() => setInputFormat('json')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="json-option" className="ml-2 block text-sm text-gray-700">
                      JSON
                    </label>
                  </div>
                </div>
                
                {inputFormat === 'csv' && (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        id="has-header"
                        type="checkbox"
                        checked={hasHeader}
                        onChange={() => setHasHeader(!hasHeader)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="has-header" className="ml-2 block text-sm text-gray-700">
                        Has Header
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <label htmlFor="delimiter" className="block text-sm text-gray-700">
                        Delimiter:
                      </label>
                      <select
                        id="delimiter"
                        value={delimiter}
                        onChange={(e) => setDelimiter(e.target.value)}
                        className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value=",">Comma (,)</option>
                        <option value=";">Semicolon (;)</option>
                        <option value="\t">Tab</option>
                        <option value="|">Pipe (|)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
              
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={15}
                className="w-full font-mono text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={inputFormat === 'csv' ? 'Paste your CSV data here...' : 'Paste your JSON data here...'}
              />
            </div>
          </div>
          
          {/* Output Panel */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Output</h2>
              {output && (
                <button
                  onClick={copyToClipboard}
                  className={`px-3 py-1 text-xs font-medium rounded-md flex items-center ${
                    copied 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : 'Copy'}
                </button>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <button
                  onClick={handleConvert}
                  disabled={loading || !input}
                  className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Converting...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                      {inputFormat === 'csv' ? 'Convert to JSON' : 'Convert to CSV'}
                    </>
                  )}
                </button>
              </div>
              
              {error && (
                <div className="mb-4 p-3 text-sm bg-red-50 text-red-600 rounded-md border border-red-100">
                  {error}
                </div>
              )}
              
              <textarea
                value={output}
                readOnly
                rows={15}
                className="w-full font-mono text-sm bg-gray-50 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={inputFormat === 'csv' ? 'JSON output will appear here...' : 'CSV output will appear here...'}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Tips</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-2">CSV Format Tips</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Use commas to separate values (or your chosen delimiter)</li>
                  <li>Include a header row for field names</li>
                  <li>Use quotes for values containing the delimiter</li>
                  <li>Each line represents a data record</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-2">JSON Format Tips</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Use a valid array of objects</li>
                  <li>Each object represents a data record</li>
                  <li>Property names should be strings</li>
                  <li>Valid values include strings, numbers, booleans, null, arrays, and objects</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 