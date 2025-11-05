// Simple script to generate placeholder icon files
// Run with: node generate-icons.js

const fs = require('fs');

// Create simple SVG icons and save as files
const sizes = [16, 48, 128];

sizes.forEach(size => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad)"/>
  <text x="50%" y="50%" font-family="Arial" font-size="${size * 0.6}" fill="white" text-anchor="middle" dy=".3em" font-weight="bold">M</text>
</svg>`;
  
  fs.writeFileSync(`icon${size}.svg`, svg);
  console.log(`Created icon${size}.svg`);
});

console.log('\nNote: Chrome extensions prefer PNG files.');
console.log('You can convert these SVG files to PNG using:');
console.log('- Online converter: https://convertio.co/svg-png/');
console.log('- Or use the create-icons.html file in your browser');
