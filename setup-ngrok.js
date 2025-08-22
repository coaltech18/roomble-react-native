const fs = require('fs');
const path = require('path');

// Function to create .env file
function createEnvFile(ngrokUrl) {
  const envContent = `# API Configuration
# For local development with ngrok
EXPO_PUBLIC_API_BASE_URL=${ngrokUrl}

# For local development without ngrok (emulator only)
# EXPO_PUBLIC_API_BASE_URL=http://localhost:4000

# For physical device testing with local network
# EXPO_PUBLIC_API_BASE_URL=http://172.20.10.2:4000
`;

  const envPath = path.join(__dirname, '.env');
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log(`📡 API Base URL set to: ${ngrokUrl}`);
}

// Function to update .env file with new ngrok URL
function updateEnvFile(ngrokUrl) {
  const envPath = path.join(__dirname, '.env');
  
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Update the ngrok URL
    envContent = envContent.replace(
      /EXPO_PUBLIC_API_BASE_URL=https:\/\/.*\.ngrok\.io/g,
      `EXPO_PUBLIC_API_BASE_URL=${ngrokUrl}`
    );
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file updated successfully!');
    console.log(`📡 API Base URL updated to: ${ngrokUrl}`);
  } else {
    createEnvFile(ngrokUrl);
  }
}

// Check if ngrok URL is provided as argument
const ngrokUrl = process.argv[2];

if (ngrokUrl) {
  if (ngrokUrl.includes('ngrok.io')) {
    updateEnvFile(ngrokUrl);
  } else {
    console.log('❌ Please provide a valid ngrok URL (should contain ngrok.io)');
    console.log('Usage: node setup-ngrok.js https://your-url.ngrok.io');
  }
} else {
  console.log('🚀 Ngrok Setup Instructions:');
  console.log('');
  console.log('1. Start your server:');
  console.log('   cd server && npm start');
  console.log('');
  console.log('2. In a new terminal, start ngrok:');
  console.log('   ngrok http 4000');
  console.log('');
  console.log('3. Copy the HTTPS URL from ngrok output (e.g., https://abc123.ngrok.io)');
  console.log('');
  console.log('4. Update your .env file with:');
  console.log('   node setup-ngrok.js https://your-url.ngrok.io');
  console.log('');
  console.log('5. Restart your Expo development server:');
  console.log('   npx expo start --clear');
  console.log('');
  console.log('📱 Now you can test on physical devices!');
}
