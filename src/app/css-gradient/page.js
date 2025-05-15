"use client";

import { useState, useEffect } from 'react';
import BackgroundPattern from '../../components/BackgroundPattern';

// Predefined gradient templates
const gradientTemplates = [
  { name: 'Sunset', colors: ['#FF512F', '#F09819'], type: 'linear', angle: 90 },
  { name: 'Blue Lagoon', colors: ['#43C6AC', '#191654'], type: 'linear', angle: 45 },
  { name: 'Purple Love', colors: ['#CC2B5E', '#753A88'], type: 'linear', angle: 135 },
  { name: 'Green to Blue', colors: ['#11998e', '#38ef7d'], type: 'linear', angle: 90 },
  { name: 'Rainbow', colors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF'], type: 'linear', angle: 90 },
  { name: 'Ocean', colors: ['#1A2980', '#26D0CE'], type: 'radial', shape: 'circle' },
  { name: 'Peach', colors: ['#ED4264', '#FFEDBC'], type: 'linear', angle: 315 },
];

export default function CssGradient() {
  const [gradientType, setGradientType] = useState('linear');
  const [angle, setAngle] = useState(90);
  const [shape, setShape] = useState('circle');
  const [colors, setColors] = useState([
    { color: '#FF512F', position: 0 },
    { color: '#F09819', position: 100 },
  ]);
  const [cssCode, setCssCode] = useState('');
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    generateCssCode();
  }, [gradientType, angle, shape, colors]);
  
  const generateCssCode = () => {
    let gradientString;
    
    if (gradientType === 'linear') {
      const colorStops = colors
        .sort((a, b) => a.position - b.position)
        .map((c) => `${c.color} ${c.position}%`)
        .join(', ');
      
      gradientString = `linear-gradient(${angle}deg, ${colorStops})`;
    } else {
      const colorStops = colors
        .sort((a, b) => a.position - b.position)
        .map((c) => `${c.color} ${c.position}%`)
        .join(', ');
      
      gradientString = `radial-gradient(${shape}, ${colorStops})`;
    }
    
    const code = `background: ${gradientString};\nbackground: -webkit-${gradientString};\nbackground: -moz-${gradientString};`;
    
    setCssCode(code);
  };
  
  const addColor = () => {
    if (colors.length >= 10) return;
    
    // Find average position between last two colors
    const sortedColors = [...colors].sort((a, b) => a.position - b.position);
    let newPosition = 50;
    
    if (sortedColors.length >= 2) {
      const lastPosition = sortedColors[sortedColors.length - 1].position;
      const secondLastPosition = sortedColors[sortedColors.length - 2].position;
      newPosition = Math.min(100, lastPosition + (lastPosition - secondLastPosition) / 2);
    }
    
    // Generate a color between the last two colors or a new random color
    let newColor;
    if (colors.length >= 2) {
      const lastColor = sortedColors[sortedColors.length - 1].color;
      const secondLastColor = sortedColors[sortedColors.length - 2].color;
      newColor = blendColors(lastColor, secondLastColor);
    } else {
      newColor = getRandomColor();
    }
    
    setColors([...colors, { color: newColor, position: newPosition }]);
  };
  
  const removeColor = (index) => {
    if (colors.length <= 2) return;
    
    const newColors = [...colors];
    newColors.splice(index, 1);
    setColors(newColors);
  };
  
  const updateColor = (index, newColor) => {
    const newColors = [...colors];
    newColors[index].color = newColor;
    setColors(newColors);
  };
  
  const updatePosition = (index, newPosition) => {
    const newColors = [...colors];
    newColors[index].position = Math.max(0, Math.min(100, newPosition));
    setColors(newColors);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  const loadTemplate = (template) => {
    setGradientType(template.type);
    
    if (template.type === 'linear') {
      setAngle(template.angle);
    } else {
      setShape(template.shape || 'circle');
    }
    
    // Convert template colors to our format with positions
    const templateColors = template.colors.map((color, index) => ({
      color,
      position: index * (100 / (template.colors.length - 1)),
    }));
    
    setColors(templateColors);
  };
  
  // Helper to blend two colors
  const blendColors = (color1, color2) => {
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ] : [0, 0, 0];
    };
    
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    const blend = rgb1.map((component, i) => {
      const mid = Math.floor((component + rgb2[i]) / 2);
      return mid;
    });
    
    return `#${blend.map(c => c.toString(16).padStart(2, '0')).join('')}`;
  };
  
  // Generate random color
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  
  return (
    <div className="relative py-12">
      <BackgroundPattern />
      
      <div className="max-w-5xl mx-auto relative">
        <div className="text-center mb-8">
          <div className="inline-flex mb-6 p-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full">
            <div className="bg-white rounded-full p-3">
              <div className="text-3xl">🎨</div>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            CSS Gradient Generator
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create beautiful CSS gradients with a visual editor
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-8">
            {/* Preview */}
            <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900">Preview</h2>
              </div>
              
              <div className="p-6">
                <div 
                  className="w-full h-64 rounded-lg shadow-inner"
                  style={{ background: `${gradientType === 'linear' ? `linear-gradient(${angle}deg, ${colors.sort((a, b) => a.position - b.position).map(c => `${c.color} ${c.position}%`).join(', ')})` : `radial-gradient(${shape}, ${colors.sort((a, b) => a.position - b.position).map(c => `${c.color} ${c.position}%`).join(', ')})`}` }}
                />
              </div>
            </div>
            
            {/* Code output */}
            <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between">
                <h2 className="text-lg font-medium text-gray-900">CSS Code</h2>
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
              </div>
              
              <div className="p-6">
                <pre className="bg-gray-50 p-4 rounded-md font-mono text-sm whitespace-pre overflow-x-auto">
                  {cssCode}
                </pre>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-8">
            {/* Controls */}
            <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900">Controls</h2>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Gradient Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gradient Type
                  </label>
                  <div className="flex space-x-4">
                    <div className="flex items-center">
                      <input
                        id="linear"
                        type="radio"
                        checked={gradientType === 'linear'}
                        onChange={() => setGradientType('linear')}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label htmlFor="linear" className="ml-2 block text-sm text-gray-700">
                        Linear
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="radial"
                        type="radio"
                        checked={gradientType === 'radial'}
                        onChange={() => setGradientType('radial')}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label htmlFor="radial" className="ml-2 block text-sm text-gray-700">
                        Radial
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Angle or Shape */}
                {gradientType === 'linear' ? (
                  <div>
                    <label htmlFor="angle" className="block text-sm font-medium text-gray-700 mb-2">
                      Angle: {angle}°
                    </label>
                    <input
                      id="angle"
                      type="range"
                      min="0"
                      max="360"
                      value={angle}
                      onChange={(e) => setAngle(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0°</span>
                      <span>90°</span>
                      <span>180°</span>
                      <span>270°</span>
                      <span>360°</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shape
                    </label>
                    <select
                      value={shape}
                      onChange={(e) => setShape(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="circle">Circle</option>
                      <option value="ellipse">Ellipse</option>
                    </select>
                  </div>
                )}
                
                {/* Color Stops */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Color Stops
                    </label>
                    <button
                      onClick={addColor}
                      disabled={colors.length >= 10}
                      className="px-2 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      + Add Color
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {colors.map((colorStop, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={colorStop.color}
                          onChange={(e) => updateColor(index, e.target.value)}
                          className="h-8 w-8 cursor-pointer rounded-md border-0"
                        />
                        <div className="flex-1">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={colorStop.position}
                            onChange={(e) => updatePosition(index, parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>0%</span>
                            <span>{colorStop.position}%</span>
                            <span>100%</span>
                          </div>
                        </div>
                        {colors.length > 2 && (
                          <button
                            onClick={() => removeColor(index)}
                            className="text-gray-500 hover:text-gray-700"
                            title="Remove color"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Templates */}
            <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900">Templates</h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-3">
                  {gradientTemplates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => loadTemplate(template)}
                      className="h-12 rounded-md shadow border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                      style={{
                        background: template.type === 'linear'
                          ? `linear-gradient(${template.angle}deg, ${template.colors.join(', ')})`
                          : `radial-gradient(${template.shape || 'circle'}, ${template.colors.join(', ')})`
                      }}
                      title={template.name}
                    />
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-gray-600">
                  {gradientTemplates.map((template, index) => (
                    <div key={index} className="text-center truncate">{template.name}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Usage Tips</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-2">How to Use</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Choose gradient type (linear or radial)</li>
                  <li>Adjust angle or shape</li>
                  <li>Add, remove, or modify color stops</li>
                  <li>Copy the generated CSS code</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-2">Browser Support</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>The generator includes vendor prefixes</li>
                  <li>Supported in all modern browsers</li>
                  <li>For older browsers, use fallback colors</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-2">Best Practices</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Use complementary colors for contrast</li>
                  <li>Avoid harsh transitions between colors</li>
                  <li>Consider accessibility for text overlays</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 