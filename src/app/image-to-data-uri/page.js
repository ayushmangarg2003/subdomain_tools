"use client";

import { useState, useRef } from 'react';
import BackgroundPattern from '../../components/BackgroundPattern';

export default function ImageToDataUri() {
  const [dataUri, setDataUri] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [fileType, setFileType] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setError('');
    setLoading(true);
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      setLoading(false);
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit.');
      setLoading(false);
      return;
    }
    
    // Store file info
    setFileName(file.name);
    setFileSize(formatBytes(file.size));
    setFileType(file.type);
    
    // Read file as data URL
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const result = event.target.result;
      setDataUri(result);
      setImagePreview(result);
      setLoading(false);
    };
    
    reader.onerror = () => {
      setError('Error reading file. Please try again.');
      setLoading(false);
    };
    
    reader.readAsDataURL(file);
  };
  
  const copyToClipboard = () => {
    if (!dataUri) return;
    
    navigator.clipboard.writeText(dataUri).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      setError('Failed to copy to clipboard. Please try again.');
    });
  };
  
  const resetForm = () => {
    setDataUri('');
    setFileName('');
    setFileSize('');
    setFileType('');
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  return (
    <div className="relative py-12">
      <BackgroundPattern />
      
      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-8">
          <div className="inline-flex mb-6 p-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full">
            <div className="bg-white rounded-full p-3">
              <div className="text-3xl">🖼️</div>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Image to Data URI Converter
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Convert images to data URIs for embedding directly in HTML/CSS
          </p>
        </div>
        
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden mb-8">
          <div className="p-6">
            <div className="mb-6">
              <div className="flex justify-center">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                  </svg>
                  Select Image
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
              </div>
              
              {error && (
                <div className="mt-4 p-3 text-sm bg-red-50 text-red-600 rounded-md border border-red-100">
                  {error}
                </div>
              )}
              
              <div className="mt-4 text-center text-sm text-gray-500">
                Supported formats: JPG, PNG, GIF, SVG, WebP (Max: 5MB)
              </div>
            </div>
            
            {loading && (
              <div className="flex justify-center my-8">
                <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
            
            {dataUri && !loading && (
              <>
                <div className="mb-6 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Image Preview</h3>
                  
                  <div className="bg-gray-50 rounded-md p-4 flex items-center justify-center">
                    <img src={imagePreview} alt="Preview" className="max-h-64 max-w-full rounded shadow" />
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <span className="block text-gray-500">File name:</span>
                      <span className="font-medium truncate block">{fileName}</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <span className="block text-gray-500">File size:</span>
                      <span className="font-medium">{fileSize}</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <span className="block text-gray-500">File type:</span>
                      <span className="font-medium">{fileType}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Data URI</h3>
                  
                  <div className="relative">
                    <textarea
                      readOnly
                      value={dataUri}
                      className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono bg-gray-50"
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={copyToClipboard}
                        className={`p-1.5 rounded-md focus:outline-none ${
                          copied ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        } transition-colors duration-200`}
                        title="Copy to clipboard"
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
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Convert Another Image
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Usage Examples</h2>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-800 mb-2">In HTML:</h3>
              <div className="bg-gray-50 p-3 rounded-md font-mono text-sm">
                &lt;img src="<span className="text-green-600">data:image/png;base64,...</span>" alt="Image" /&gt;
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-800 mb-2">In CSS:</h3>
              <div className="bg-gray-50 p-3 rounded-md font-mono text-sm">
                .element {'{'}
                <br />
                &nbsp;&nbsp;background-image: url("<span className="text-green-600">data:image/png;base64,...</span>");
                <br />
                {'}'}
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-2">Benefits:</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Reduces HTTP requests</li>
                <li>Works offline</li>
                <li>No external dependencies</li>
                <li>Useful for small images like icons</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 