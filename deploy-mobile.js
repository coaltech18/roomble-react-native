const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📱 Roomble Mobile App Deployment Helper');
console.log('========================================\n');

// Check if EAS CLI is installed
try {
  execSync('eas --version', { stdio: 'pipe' });
  console.log('✅ EAS CLI is installed');
} catch (error) {
  console.log('❌ EAS CLI not found');
  console.log('Installing EAS CLI...');
  try {
    execSync('npm install -g eas-cli', { stdio: 'inherit' });
    console.log('✅ EAS CLI installed successfully');
  } catch (installError) {
    console.log('❌ Failed to install EAS CLI');
    console.log('Please install manually: npm install -g eas-cli');
    process.exit(1);
  }
}

// Check if user is logged in
try {
  execSync('eas whoami', { stdio: 'pipe' });
  console.log('✅ Logged in to Expo');
} catch (error) {
  console.log('❌ Not logged in to Expo');
  console.log('Please run: eas login');
  console.log('Then run this script again');
  process.exit(1);
}

// Check if eas.json exists
const easConfigPath = path.join(__dirname, 'eas.json');
if (!fs.existsSync(easConfigPath)) {
  console.log('❌ eas.json not found');
  console.log('Creating eas.json...');
  
  const easConfig = {
    "cli": {
      "version": ">= 5.9.1"
    },
    "build": {
      "development": {
        "developmentClient": true,
        "distribution": "internal"
      },
      "preview": {
        "distribution": "internal",
        "android": {
          "buildType": "apk"
        },
        "ios": {
          "buildType": "archive"
        }
      },
      "production": {
        "android": {
          "buildType": "app-bundle"
        },
        "ios": {
          "buildType": "archive"
        }
      }
    },
    "submit": {
      "production": {}
    }
  };
  
  fs.writeFileSync(easConfigPath, JSON.stringify(easConfig, null, 2));
  console.log('✅ eas.json created');
}

console.log('\n🎯 Available Build Commands:');
console.log('1. Development Build (for testing):');
console.log('   eas build --profile development --platform all');
console.log('');
console.log('2. Preview Build (APK for Android, Archive for iOS):');
console.log('   eas build --profile preview --platform all');
console.log('');
console.log('3. Production Build (App Bundle for Android, Archive for iOS):');
console.log('   eas build --profile production --platform all');
console.log('');
console.log('4. Android Only (APK):');
console.log('   eas build --profile preview --platform android');
console.log('');
console.log('5. iOS Only:');
console.log('   eas build --profile preview --platform ios');

console.log('\n📋 Before Building:');
console.log('1. Make sure your backend is deployed to Render');
console.log('2. Update EXPO_PUBLIC_API_BASE_URL in .env');
console.log('3. Test your app locally first');
console.log('4. Commit and push your changes to GitHub');

console.log('\n💡 Tips:');
console.log('- Preview builds are best for internal distribution');
console.log('- Production builds are for app store submission');
console.log('- APK files can be installed directly on Android devices');
console.log('- iOS builds require TestFlight or App Store for distribution');
console.log('- Builds take 10-30 minutes to complete');

console.log('\n🚀 Ready to build? Choose a command above and run it!');
