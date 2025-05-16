// This file is used to check the build output structure
// Run with: node build-check.js

console.log('Build script starting...');
const fs = require('fs');
const path = require('path');

const clientDistPath = path.join(__dirname, '../client/dist/client');
const targetPath = path.join(clientDistPath, 'index.html');

console.log(`Checking if path exists: ${clientDistPath}`);
console.log(`Path exists: ${fs.existsSync(clientDistPath)}`);

if (fs.existsSync(clientDistPath)) {
  const files = fs.readdirSync(clientDistPath);
  console.log('Files in client dist directory:', files);
}

console.log(`Target index.html exists: ${fs.existsSync(targetPath)}`);
