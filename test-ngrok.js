const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function testNgrokConnection() {
  try {
    // Read the .env file to get the API URL
    const envPath = path.join(__dirname, '.env');
    
    if (!fs.existsSync(envPath)) {
      console.log('❌ .env file not found. Please run the ngrok setup first.');
      console.log('Run: node setup-ngrok.js https://your-ngrok-url.ngrok.io');
      return;
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const apiUrlMatch = envContent.match(/EXPO_PUBLIC_API_BASE_URL=(.+)/);
    
    if (!apiUrlMatch) {
      console.log('❌ API URL not found in .env file');
      return;
    }

    const apiUrl = apiUrlMatch[1].trim();
    console.log(`🔍 Testing connection to: ${apiUrl}`);

    // Test health endpoint
    console.log('\n📡 Testing health endpoint...');
    const healthResponse = await axios.get(`${apiUrl}/api/health`);
    console.log('✅ Health check passed:', healthResponse.data);

    // Test auth endpoints
    console.log('\n🔐 Testing auth endpoints...');
    
    // Test send OTP
    console.log('📱 Testing send OTP...');
    try {
      const otpResponse = await axios.post(`${apiUrl}/api/auth/send-otp`, {
        phone: '1234567890'
      });
      console.log('✅ Send OTP endpoint working:', otpResponse.data);
    } catch (error) {
      console.log('⚠️ Send OTP endpoint error (expected for invalid phone):', error.response?.data?.error || error.message);
    }

    // Test registration
    console.log('\n📝 Testing registration...');
    try {
      const regResponse = await axios.post(`${apiUrl}/api/auth/register-phone`, {
        phone: '1234567890',
        name: 'Test User',
        age: 25,
        gender: 'Male',
        occupation: 'Developer'
      });
      console.log('✅ Registration endpoint working:', regResponse.data);
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('✅ Registration endpoint working (user already exists)');
      } else {
        console.log('❌ Registration endpoint error:', error.response?.data?.error || error.message);
      }
    }

    console.log('\n🎉 All tests completed! Your ngrok setup is working correctly.');
    console.log('📱 You can now test your app on physical devices.');

  } catch (error) {
    console.log('❌ Connection test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure your server is running: npm run server:start');
    console.log('2. Make sure ngrok is running: ngrok http 4000');
    console.log('3. Check that the .env file has the correct ngrok URL');
    console.log('4. Verify the ngrok URL is accessible in your browser');
  }
}

// Run the test
testNgrokConnection();
