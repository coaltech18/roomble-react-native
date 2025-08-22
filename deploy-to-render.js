const fs = require('fs');
const path = require('path');

console.log('🚀 Roomble Render Deployment Helper');
console.log('=====================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('Please create a .env file with your configuration.\n');
  
  console.log('📝 Required environment variables:');
  console.log('EXPO_PUBLIC_API_BASE_URL=https://your-service-name.onrender.com');
  console.log('MONGODB_URI=your_mongodb_atlas_connection_string');
  console.log('JWT_SECRET=your_jwt_secret_key\n');
  
  console.log('🔧 Steps to deploy:');
  console.log('1. Push your code to GitHub');
  console.log('2. Sign up at render.com');
  console.log('3. Create new Web Service');
  console.log('4. Set environment variables in Render dashboard');
  console.log('5. Deploy and get your URL');
  console.log('6. Update EXPO_PUBLIC_API_BASE_URL with your Render URL');
  console.log('7. Build your mobile app with EAS\n');
  
  console.log('📖 See RENDER_DEPLOYMENT.md for detailed instructions');
} else {
  console.log('✅ .env file found');
  
  // Read and display current API URL
  const envContent = fs.readFileSync(envPath, 'utf8');
  const apiUrlMatch = envContent.match(/EXPO_PUBLIC_API_BASE_URL=(.+)/);
  
  if (apiUrlMatch) {
    const currentUrl = apiUrlMatch[1];
    console.log(`📡 Current API URL: ${currentUrl}`);
    
    if (currentUrl.includes('onrender.com')) {
      console.log('✅ API URL is already set to Render!');
    } else if (currentUrl.includes('ngrok')) {
      console.log('⚠️  API URL is set to ngrok (development)');
      console.log('Update to your Render URL after deployment');
    } else {
      console.log('ℹ️  API URL is set to:', currentUrl);
    }
  } else {
    console.log('❌ EXPO_PUBLIC_API_BASE_URL not found in .env');
  }
}

console.log('\n🎯 Next Steps:');
console.log('1. Follow the deployment guide in RENDER_DEPLOYMENT.md');
console.log('2. Deploy your backend to Render');
console.log('3. Update your .env file with the Render URL');
console.log('4. Build your mobile app with EAS Build');
console.log('5. Distribute your app to users');

console.log('\n💡 Tips:');
console.log('- Make sure your MongoDB Atlas is accessible');
console.log('- Generate a strong JWT_SECRET for production');
console.log('- Test your API endpoints after deployment');
console.log('- Use EAS Build for cross-platform mobile app builds');
