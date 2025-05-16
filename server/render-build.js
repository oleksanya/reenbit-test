// This script will run during the Render build process

// Import required modules
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Log the start of the build process
console.log('Starting build process...');

try {
  // Step 1: Check if we're in the correct directory
  console.log('Current directory:', process.cwd());
  
  // Step 2: Install server dependencies
  console.log('Installing server dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Step 3: Build the client
  console.log('Building client...');
  
  // Navigate to client directory
  process.chdir('../client');
  console.log('Changed directory to:', process.cwd());
  
  // Install client dependencies
  console.log('Installing client dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Build the client application
  console.log('Running client build...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Step 4: Verify the build output structure
  const distPath = path.join(process.cwd(), 'dist/client');
  console.log('Checking build output at:', distPath);
  
  if (fs.existsSync(distPath)) {
    console.log('Build directory exists!');
    const files = fs.readdirSync(distPath);
    console.log('Files in build directory:', files);
    
    // Check for index.html
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      console.log('index.html exists!');
    } else {
      console.log('ERROR: index.html not found!');
      
      // Look for browser subdirectory
      const browserPath = path.join(distPath, 'browser');
      if (fs.existsSync(browserPath)) {
        console.log('Found browser subdirectory:', fs.readdirSync(browserPath));
        
        // Create an index.html at the expected location
        if (fs.existsSync(path.join(browserPath, 'index.html'))) {
          console.log('Copying index.html from browser directory to client directory...');
          fs.copyFileSync(
            path.join(browserPath, 'index.html'), 
            path.join(distPath, 'index.html')
          );
          console.log('Successfully copied index.html!');
        }
      }
    }
  } else {
    console.log('ERROR: Build directory not found!');
  }
  
  // Return to the server directory
  process.chdir('../server');
  console.log('Returned to server directory:', process.cwd());
  
  console.log('Build process completed successfully!');
} catch (error) {
  console.error('Build process failed:', error);
  process.exit(1);
}
