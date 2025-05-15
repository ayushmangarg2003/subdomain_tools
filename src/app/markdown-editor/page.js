"use client";

import { useState, useEffect } from 'react';
import BackgroundPattern from '../../components/BackgroundPattern';

// Simple markdown parser
const parseMarkdown = (markdown) => {
  // Basic markdown parsing (This is a simplified version for demonstration)
  let html = markdown;
  
  // Handle code blocks
  html = html.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');
  
  // Handle inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Handle headers
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  
  // Handle bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Handle italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Handle links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Handle unordered lists
  html = html.replace(/^\s*\* (.*$)/gm, '<li>$1</li>');
  html = html.replace(/<li>(.*)<\/li>/g, '<ul><li>$1</li></ul>');
  html = html.replace(/<\/ul>\s*<ul>/g, '');
  
  // Handle ordered lists
  html = html.replace(/^\s*\d+\. (.*$)/gm, '<li>$1</li>');
  html = html.replace(/<li>(.*)<\/li>/g, '<ol><li>$1</li></ol>');
  html = html.replace(/<\/ol>\s*<ol>/g, '');
  
  // Handle blockquotes
  html = html.replace(/^\> (.*$)/gm, '<blockquote>$1</blockquote>');
  
  // Handle paragraphs (must be last)
  html = html.replace(/^(?!<[a-z])(.*$)/gm, '<p>$1</p>');
  html = html.replace(/<p><\/p>/g, '');
  
  return html;
};

// Example markdown content
const exampleMarkdown = `# Welcome to Markdown Editor

## What is Markdown?

Markdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents.

### Basic Syntax

* **Bold text** with double asterisks
* *Italic text* with single asterisks
* [Links](https://example.com) with brackets and parentheses

### Code Example

\`\`\`
function helloWorld() {
  console.log("Hello, world!");
}
\`\`\`

> This is a blockquote.

1. First ordered list item
2. Second ordered list item

Enjoy using the markdown editor!
`;

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState('');
  const [html, setHtml] = useState('');
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('split'); // 'edit', 'preview', or 'split'
  
  useEffect(() => {
    // Set example markdown on first load
    if (!markdown) {
      setMarkdown(exampleMarkdown);
    }
    
    // Parse markdown whenever it changes
    setHtml(parseMarkdown(markdown));
  }, [markdown]);
  
  const handleMarkdownChange = (e) => {
    setMarkdown(e.target.value);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  const clearEditor = () => {
    if (confirm('Are you sure you want to clear the editor?')) {
      setMarkdown('');
    }
  };
  
  const loadExample = () => {
    if (markdown && !confirm('Discard current content and load example?')) {
      return;
    }
    setMarkdown(exampleMarkdown);
  };
  
  return (
    <div className="relative py-12">
      <BackgroundPattern />
      
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-8">
          <div className="inline-flex mb-6 p-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full">
            <div className="bg-white rounded-full p-3">
              <div className="text-3xl">📝</div>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Markdown Editor</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Write and preview markdown with a clean interface</p>
        </div>
        
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('edit')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  viewMode === 'edit' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Edit
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  viewMode === 'preview' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  viewMode === 'split' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Split
              </button>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={loadExample}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              >
                Load Example
              </button>
              <button
                onClick={clearEditor}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              >
                Clear
              </button>
              <button
                onClick={copyToClipboard}
                className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center ${
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
            </div>
          </div>
          
          <div className={`flex ${viewMode === 'split' ? 'flex-row' : 'flex-col'} h-[60vh]`}>
            {/* Editor */}
            {(viewMode === 'edit' || viewMode === 'split') && (
              <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} h-full border-r border-gray-200`}>
                <textarea
                  value={markdown}
                  onChange={handleMarkdownChange}
                  className="w-full h-full p-4 focus:outline-none resize-none font-mono text-gray-800"
                  placeholder="Type your markdown here..."
                />
              </div>
            )}
            
            {/* Preview */}
            {(viewMode === 'preview' || viewMode === 'split') && (
              <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} h-full overflow-auto bg-gray-50`}>
                <div 
                  className="p-6 prose prose-indigo max-w-none"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-500">
            <p>Tip: Use markdown syntax to format your text. View the <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">Markdown Cheat Sheet</a> for help.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 