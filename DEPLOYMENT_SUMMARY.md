# 🚀 Complete Deployment Guide for Roomble

## 📋 Overview

This guide will help you deploy your Roomble cross-platform mobile app to production using:
- **Backend**: Render (Free hosting)
- **Database**: MongoDB Atlas (Already hosted)
- **Mobile App**: Expo EAS Build (Free tier)

## 🎯 Quick Start Commands

```bash
# Check deployment readiness
npm run deploy:check

# Deploy backend to Render
# Follow RENDER_DEPLOYMENT.md

# Build mobile app
npm run deploy:mobile
npm run build:all
```

## 📱 Complete Deployment Process

### Phase 1: Backend Deployment (Render)

#### Step 1: Prepare Your Code
```bash
# 1. Push to GitHub
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

#### Step 2: Deploy to Render
1. **Sign up** at [render.com](https://render.com)
2. **Create new Web Service**
3. **Connect GitHub repository**
4. **Configure settings:**
   - Name: `roomble-api`
   - Environment: `Node`
   - Root Directory: `server`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

#### Step 3: Set Environment Variables
In Render dashboard, add:
```
MONGODB_URI = your_mongodb_atlas_connection_string
JWT_SECRET = your_jwt_secret_key
NODE_ENV = production
```

#### Step 4: Get Your API URL
After deployment, your API will be available at:
```
https://your-service-name.onrender.com
```

### Phase 2: Update Mobile App Configuration

#### Step 1: Update API Base URL
```bash
# In your .env file, update:
EXPO_PUBLIC_API_BASE_URL=https://your-service-name.onrender.com
```

#### Step 2: Test the Connection
```bash
# Test your deployed API
curl https://your-service-name.onrender.com/api/health
```

### Phase 3: Build Mobile App (EAS Build)

#### Step 1: Install EAS CLI
```bash
npm install -g @expo/eas-cli
```

#### Step 2: Login to Expo
```bash
eas login
```

#### Step 3: Check Mobile Deployment
```bash
npm run deploy:mobile
```

#### Step 4: Build Your App
```bash
# Build for all platforms
npm run build:all

# Or build separately:
npm run build:android  # Android APK
npm run build:ios      # iOS Archive
```

### Phase 4: Distribute Your App

#### Option A: Internal Distribution (Free)
1. **Download APK/IPA** from EAS Build
2. **Share via Google Drive/Dropbox**
3. **Users install directly** on their devices

#### Option B: App Store Distribution (Paid)
- **Google Play Console**: $25 one-time fee
- **Apple App Store**: $99/year

## 🔧 Environment Variables

### Backend (Render)
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/roomble?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_jwt_secret_here
NODE_ENV=production
```

### Frontend (.env)
```bash
EXPO_PUBLIC_API_BASE_URL=https://your-service-name.onrender.com
```

## 📊 Cost Breakdown

| Service | Cost | Details |
|---------|------|---------|
| **Render** | Free | 750 hours/month |
| **MongoDB Atlas** | Free | 512MB database |
| **Expo EAS Build** | Free | Basic tier |
| **Total** | **$0/month** | Completely free! |

## 🎉 Success Checklist

- ✅ Backend deployed to Render
- ✅ API endpoints working
- ✅ Mobile app built with EAS
- ✅ App distributed to users
- ✅ Authentication working
- ✅ Database connected

## 🔍 Troubleshooting

### Common Issues:

1. **Build fails on Render**
   - Check environment variables
   - Verify MongoDB connection
   - Check build logs

2. **CORS errors**
   - Verify CORS configuration in server
   - Check allowed origins

3. **Mobile app can't connect**
   - Verify API base URL
   - Test API endpoints
   - Check network connectivity

4. **Authentication issues**
   - Verify JWT_SECRET is set
   - Check token generation/validation

### Useful Commands:
```bash
# Check deployment status
npm run deploy:check

# Test API locally
curl http://localhost:4000/api/health

# Check Render logs
# Go to Render dashboard → Your service → Logs

# Check EAS build status
eas build:list
```

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review Render and Expo documentation
3. Check build logs for specific errors
4. Verify all environment variables are set correctly

## 🚀 Next Steps

After successful deployment:
1. **Monitor your app** performance
2. **Set up analytics** (optional)
3. **Plan for scaling** if needed
4. **Consider app store** distribution
5. **Set up monitoring** and alerts

---

**🎉 Congratulations! Your Roomble app is now live and ready for users!**
