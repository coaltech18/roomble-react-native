# 🚀 Render Deployment Guide for Roomble

## 📋 Prerequisites

1. **GitHub Account** - Your code must be on GitHub
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **MongoDB Atlas** - Your database (already set up)

## 🔧 Step 1: Prepare Your Code

### 1.1 Push to GitHub
```bash
# Make sure your code is on GitHub
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 1.2 Environment Variables Needed
You'll need these in Render dashboard:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/roomble?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_jwt_secret_here
NODE_ENV=production
```

## 🚀 Step 2: Deploy to Render

### 2.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Verify your email

### 2.2 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select your repository: `roomble-react-native`

### 2.3 Configure Service Settings
```
Name: roomble-api
Environment: Node
Region: Choose closest to you
Branch: main
Root Directory: server
Build Command: npm install && npm run build
Start Command: npm start
```

**⚠️ CRITICAL: Make sure "Root Directory" is set to "server"**
This tells Render to use the server/package.json file which contains the build script.

**Alternative Build Commands (if the above fails):**
```
# Option 1: Simple install only
Build Command: npm install

# Option 2: With explicit TypeScript build
Build Command: npm install && npx tsc

# Option 3: Using the build script
Build Command: chmod +x build.sh && ./build.sh

# Option 4: If Root Directory is not working
Build Command: cd server && npm install && npm run build
```

### 2.4 Set Environment Variables
In Render dashboard, add these:
```
MONGODB_URI = your_mongodb_atlas_connection_string
JWT_SECRET = your_jwt_secret_key
NODE_ENV = production
```

### 2.5 Deploy
1. Click **"Create Web Service"**
2. Wait for build to complete (5-10 minutes)
3. Your API will be available at: `https://your-service-name.onrender.com`

## 🔗 Step 3: Update Mobile App

### 3.1 Update API Base URL
```bash
# In your .env file, update:
EXPO_PUBLIC_API_BASE_URL=https://your-service-name.onrender.com
```

### 3.2 Test the Connection
```bash
# Test your deployed API
curl https://your-service-name.onrender.com/api/health
```

## 📱 Step 4: Deploy Mobile App (Expo EAS Build)

### 4.1 Install EAS CLI
```bash
npm install -g @expo/eas-cli
```

### 4.2 Login to Expo
```bash
eas login
```

### 4.3 Configure EAS Build
```bash
eas build:configure
```

### 4.4 Build for Android
```bash
eas build --platform android
```

### 4.5 Build for iOS
```bash
eas build --platform ios
```

## 🎯 Step 5: Distribute Your App

### 5.1 Internal Distribution
- Download APK/IPA from EAS Build
- Share with users via Google Drive/Dropbox
- Users install directly on their devices

### 5.2 App Store Distribution (Optional)
- Google Play Console ($25 one-time fee)
- Apple App Store ($99/year)

## 🔍 Troubleshooting

### Build Failures:
1. **"Missing script: build"** - Make sure "Root Directory" is set to "server"
2. **"npm run" error** - Try alternative build commands above
3. **TypeScript compilation fails** - Check for syntax errors in src/
4. **Missing dependencies** - Verify package.json is complete
5. **Permission errors** - Use `npm install` only as build command

### Common Issues:
1. **Build fails** - Check environment variables
2. **CORS errors** - Verify CORS configuration
3. **Database connection** - Check MongoDB Atlas settings
4. **JWT errors** - Verify JWT_SECRET is set

### Build Debugging Steps:
1. **Check Render logs** for specific error messages
2. **Test build locally**: `cd server && npm install && npm run build`
3. **Verify TypeScript**: `npx tsc --noEmit`
4. **Check file structure**: Ensure all imports are correct

### Useful Commands:
```bash
# Check Render logs
# Go to Render dashboard → Your service → Logs

# Test API locally
curl http://localhost:4000/api/health

# Check MongoDB connection
# Verify your Atlas connection string
```

## 💰 Cost Breakdown
- **Render**: Free (750 hours/month)
- **MongoDB Atlas**: Free (512MB)
- **Expo EAS Build**: Free tier available
- **Total**: $0/month

## 🎉 Success!
Your app is now:
- ✅ Backend hosted on Render
- ✅ Database on MongoDB Atlas
- ✅ Mobile app built with EAS
- ✅ Ready for distribution
