# 🚀 Ngrok Integration Setup Guide

This guide will help you set up ngrok to expose your local server to the internet, allowing you to test your React Native app on physical devices.

## 📋 Prerequisites

1. **Ngrok Account**: Sign up at [ngrok.com](https://ngrok.com) (free tier available)
2. **Ngrok Installed**: `npm install -g ngrok`
3. **Server Running**: Your backend server should be running on port 4000

## 🔧 Setup Steps

### Step 1: Start Your Backend Server

```bash
# Navigate to server directory
cd server

# Install dependencies (if not already done)
npm install

# Start the server
npm start
```

Your server should now be running on `http://localhost:4000`

### Step 2: Start Ngrok

In a new terminal window:

```bash
# Start ngrok to expose port 4000
ngrok http 4000
```

You'll see output like this:
```
Session Status                online
Account                       your-email@example.com
Version                       3.x.x
Region                        United States (us)
Latency                       51ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok.io -> http://localhost:4000
```

**Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

### Step 3: Update Environment Configuration

```bash
# Update your .env file with the ngrok URL
node setup-ngrok.js https://your-ngrok-url.ngrok.io
```

### Step 4: Restart Expo Development Server

```bash
# Clear cache and restart
npx expo start --clear
```

## 📱 Testing on Physical Devices

1. **Install Expo Go** on your physical device
2. **Scan the QR code** from the Expo development server
3. **Test the app** - it will now connect to your local server via ngrok

## 🔄 Quick Commands

```bash
# Setup ngrok with URL
npm run ngrok:setup

# Start ngrok tunnel
npm run ngrok:start

# Start server
npm run server:start

# Start both server and ngrok (requires concurrently)
npm run dev:full
```

## ⚠️ Important Notes

### Security
- **Ngrok URLs are public** - anyone with the URL can access your server
- **Use for development only** - don't use ngrok in production
- **Free tier limitations** - URLs change on restart, limited connections

### URL Changes
- **Ngrok URLs change** every time you restart ngrok (free tier)
- **Update .env file** whenever the URL changes
- **Restart Expo** after updating the URL

### Troubleshooting

#### Connection Issues
```bash
# Check if server is running
curl http://localhost:4000

# Check ngrok status
curl http://127.0.0.1:4040/api/tunnels
```

#### CORS Issues
If you encounter CORS errors, make sure your server allows requests from ngrok domains.

#### SSL Issues
Ngrok provides HTTPS by default, so your app should work without SSL configuration.

## 🎯 Alternative Setup Methods

### Method 1: Manual .env Creation
Create a `.env` file in the project root:
```env
EXPO_PUBLIC_API_BASE_URL=https://your-ngrok-url.ngrok.io
```

### Method 2: Direct URL in Code (Not Recommended)
Temporarily hardcode the URL in `src/services/httpClient.ts`:
```typescript
export const http = axios.create({ 
  baseURL: 'https://your-ngrok-url.ngrok.io' 
});
```

## 📞 Support

If you encounter issues:
1. Check that your server is running on port 4000
2. Verify ngrok is forwarding correctly
3. Ensure the .env file is in the correct location
4. Restart Expo development server after URL changes

## 🔗 Useful Links

- [Ngrok Documentation](https://ngrok.com/docs)
- [Expo Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [React Native Network Security](https://reactnative.dev/docs/network-security)
