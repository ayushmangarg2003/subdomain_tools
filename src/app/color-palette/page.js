"use client";

import { useState, useEffect } from 'react';
import BackgroundPattern from '../../components/BackgroundPattern';

// Predefined color harmonies
const colorHarmonies = [
  { name: 'Analogous', description: 'Colors that are adjacent to each other on the color wheel' },
  { name: 'Monochromatic', description: 'Various shades and tints of a single color' },
  { name: 'Complementary', description: 'Colors that are opposite each other on the color wheel' },
  { name: 'Triadic', description: 'Three colors that are evenly spaced around the color wheel' },
  { name: 'Split Complementary', description: 'A color and two colors adjacent to its complement' },
  { name: 'Tetradic', description: 'Four colors arranged into two complementary pairs' },
];

export default function ColorPalette() {
  const [baseColor, setBaseColor] = useState('#6366f1'); // Default indigo color
  const [harmony, setHarmony] = useState('Analogous');
  const [palette, setPalette] = useState([]);
  const [copied, setCopied] = useState(null);
  
  // Generate palette whenever base color or harmony changes
  useEffect(() => {
    generatePalette();
  }, [baseColor, harmony]);
  
  // Convert hex to HSL
  const hexToHSL = (hex) => {
    // Remove the # if present
    hex = hex.replace(/^#/, '');
    
    // Parse the hex values
    let r = parseInt(hex.substr(0, 2), 16) / 255;
    let g = parseInt(hex.substr(2, 2), 16) / 255;
    let b = parseInt(hex.substr(4, 2), 16) / 255;
    
    // Find greatest and smallest channel values
    let cmin = Math.min(r, g, b);
    let cmax = Math.max(r, g, b);
    let delta = cmax - cmin;
    let h = 0, s = 0, l = 0;
    
    // Calculate hue
    if (delta === 0) {
      h = 0;
    } else if (cmax === r) {
      h = ((g - b) / delta) % 6;
    } else if (cmax === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    
    // Calculate lightness
    l = (cmax + cmin) / 2;
    
    // Calculate saturation
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    
    // Convert to percentages
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    
    return { h, s, l };
  };
  
  // Convert HSL to hex
  const hslToHex = (h, s, l) => {
    s /= 100;
    l /= 100;
    
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c / 2;
    let r = 0, g = 0, b = 0;
    
    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }
    
    r = Math.round((r + m) * 255).toString(16).padStart(2, '0');
    g = Math.round((g + m) * 255).toString(16).padStart(2, '0');
    b = Math.round((b + m) * 255).toString(16).padStart(2, '0');
    
    return `#${r}${g}${b}`;
  };
  
  const generatePalette = () => {
    const { h, s, l } = hexToHSL(baseColor);
    let colors = [];
    
    switch (harmony) {
      case 'Analogous':
        colors = [
          hslToHex((h - 30 + 360) % 360, s, l),
          baseColor,
          hslToHex((h + 30) % 360, s, l),
          hslToHex((h + 60) % 360, s, l),
          hslToHex((h + 90) % 360, s, l),
        ];
        break;
        
      case 'Monochromatic':
        colors = [
          hslToHex(h, s, Math.max(0, l - 30)),
          hslToHex(h, s, Math.max(0, l - 15)),
          baseColor,
          hslToHex(h, s, Math.min(100, l + 15)),
          hslToHex(h, s, Math.min(100, l + 30)),
        ];
        break;
        
      case 'Complementary':
        colors = [
          hslToHex(h, s, Math.max(0, l - 10)),
          baseColor,
          hslToHex(h, Math.max(0, s - 20), l),
          hslToHex((h + 180) % 360, Math.max(0, s - 20), l),
          hslToHex((h + 180) % 360, s, l),
        ];
        break;
        
      case 'Triadic':
        colors = [
          baseColor,
          hslToHex((h + 120) % 360, s, l),
          hslToHex((h + 240) % 360, s, l),
          hslToHex((h + 60) % 360, s, l),
          hslToHex((h + 300) % 360, s, l),
        ];
        break;
        
      case 'Split Complementary':
        colors = [
          baseColor,
          hslToHex((h + 150) % 360, s, l),
          hslToHex((h + 210) % 360, s, l),
          hslToHex((h + 30) % 360, s, l),
          hslToHex((h + 330) % 360, s, l),
        ];
        break;
        
      case 'Tetradic':
        colors = [
          baseColor,
          hslToHex((h + 90) % 360, s, l),
          hslToHex((h + 180) % 360, s, l),
          hslToHex((h + 270) % 360, s, l),
          hslToHex((h + 45) % 360, s, l),
        ];
        break;
        
      default:
        colors = [baseColor];
    }
    
    setPalette(colors);
  };
  
  const copyToClipboard = (color, index) => {
    navigator.clipboard.writeText(color).then(() => {
      setCopied(index);
      setTimeout(() => setCopied(null), 2000);
    });
  };
  
  const copyPalette = () => {
    navigator.clipboard.writeText(palette.join(', ')).then(() => {
      setCopied('all');
      setTimeout(() => setCopied(null), 2000);
    });
  };
  
  return (
    <div className="relative py-12">
      <BackgroundPattern />
      
      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-10">
          <div className="inline-flex mb-6 p-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full">
            <div className="bg-white rounded-full p-3">
              <div className="text-3xl">🎨</div>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Color Palette Generator</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Create beautiful color schemes for your projects</p>
        </div>
        
        <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Base Color</label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="h-10 w-10 border-0 cursor-pointer rounded-l-md"
                />
                <input
                  type="text"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="flex-1 p-2 border border-l-0 border-gray-300 rounded-r-md font-mono text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Pick a color or enter a hex value</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color Harmony</label>
              <select
                value={harmony}
                onChange={(e) => setHarmony(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {colorHarmonies.map((h) => (
                  <option key={h.name} value={h.name}>{h.name}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {colorHarmonies.find(h => h.name === harmony)?.description}
              </p>
            </div>
          </div>
          
          {/* Color Palette Display */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row h-36 md:h-44 rounded-xl overflow-hidden shadow-md">
              {palette.map((color, index) => (
                <div
                  key={index}
                  className="flex-1 flex items-end justify-center transition-all hover:flex-[1.2] cursor-pointer relative group"
                  style={{ backgroundColor: color }}
                  onClick={() => copyToClipboard(color, index)}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/10 transition-opacity flex items-center justify-center">
                    <span className="text-white bg-black/30 px-2 py-1 rounded text-sm backdrop-blur-sm">
                      {copied === index ? 'Copied!' : 'Click to copy'}
                    </span>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm w-full p-2 text-center font-mono text-sm">
                    {color.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={copyPalette}
              className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
            >
              {copied === 'all' ? 'Copied All!' : 'Copy All Colors'}
            </button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Tips for Using Color Palettes:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Use your primary color for main elements
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Add accent colors for buttons and highlights
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Consider light and dark modes
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Ensure text has enough contrast
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 