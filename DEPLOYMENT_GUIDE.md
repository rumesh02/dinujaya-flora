# 🚀 Dinujaya Flora - Deployment Guide

Complete step-by-step guide to deploy your MERN stack application to Render (Backend) and Vercel (Frontend).

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:
- ✅ GitHub account
- ✅ Render account (render.com)
- ✅ Vercel account (vercel.com)
- ✅ MongoDB Atlas account (for production database)
- ✅ Cloudinary account (for image hosting)
- ✅ All code pushed to GitHub repository

---

## 🗄️ Step 1: Setup MongoDB Atlas (Production Database)

### 1.1 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Start Free" or "Sign In"
3. Create account or log in

### 1.2 Create a New Cluster
1. Click "Build a Database"
2. Choose **FREE (M0)** tier
3. Select cloud provider: **AWS**
4. Choose region: **Closest to your users**
5. Cluster name: `dinujaya-flora-cluster`
6. Click "Create"

### 1.3 Setup Database User
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Authentication Method: **Password**
4. Username: `dinujaya_admin`
5. Password: **Generate a secure password** (save it!)
6. Database User Privileges: **Read and write to any database**
7. Click "Add User"

### 1.4 Setup Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for production)
4. IP Address: `0.0.0.0/0`
5. Click "Confirm"

### 1.5 Get Connection String
1. Go to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: **Node.js**, Version: **4.1 or later**
5. Copy the connection string:
   ```
   mongodb+srv://dinujaya_admin:<password>@dinujaya-flora-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password
7. Add database name before `?`:
   ```
   mongodb+srv://dinujaya_admin:YOUR_PASSWORD@dinujaya-flora-cluster.xxxxx.mongodb.net/dinujaya-flora?retryWrites=true&w=majority
   ```
8. **Save this connection string!**

---

## ☁️ Step 2: Setup Cloudinary (Image Storage)

### 2.1 Create Cloudinary Account
1. Go to https://cloudinary.com
2. Sign up for free account
3. Verify your email

### 2.2 Get API Credentials
1. Go to Dashboard: https://console.cloudinary.com/
2. You'll see:
   - **Cloud Name**: `your_cloud_name`
   - **API Key**: `123456789012345`
   - **API Secret**: `your_secret_key`
3. **Save these credentials!**

---

## 🎨 Step 3: Deploy Backend to Render

### 3.1 Prepare Backend Code

#### Create `render.yaml` (optional but recommended)
Create this file in your backend folder:

```yaml
# backend/render.yaml
services:
  - type: web
    name: dinujaya-flora-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
```

#### Update `backend/package.json`
Ensure your package.json has:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 3.2 Push Code to GitHub

```bash
# Navigate to your project
cd E:\dinujaya-flora

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for deployment"

# Add remote repository (replace with your repo URL)
git remote add origin https://github.com/rumesh02/dinujaya-flora.git

# Push to GitHub
git push -u origin main
```

### 3.3 Create Render Account & Deploy

1. **Sign Up on Render**
   - Go to https://render.com
   - Click "Get Started"
   - Sign up with GitHub

2. **Connect GitHub Repository**
   - Click "New +" button
   - Select "Web Service"
   - Connect your GitHub account
   - Select repository: `dinujaya-flora`
   - Click "Connect"

3. **Configure Web Service**
   - **Name**: `dinujaya-flora-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your branch)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

4. **Add Environment Variables**
   Click "Advanced" and add these environment variables:

   ```
   PORT = 5000
   
   MONGODB_URI = mongodb+srv://dinujaya_admin:YOUR_PASSWORD@dinujaya-flora-cluster.xxxxx.mongodb.net/dinujaya-flora?retryWrites=true&w=majority
   
   JWT_SECRET = your_super_secret_jwt_key_here_min_32_characters
   
   CLOUDINARY_CLOUD_NAME = your_cloud_name
   CLOUDINARY_API_KEY = 123456789012345
   CLOUDINARY_API_SECRET = your_secret_key
   
   NODE_ENV = production
   
   FRONTEND_URL = https://dinujaya-flora.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Once deployed, you'll get a URL: `https://dinujaya-flora-backend.onrender.com`
   - **Save this URL!**

### 3.4 Test Backend API

Open your backend URL in browser:
```
https://dinujaya-flora-backend.onrender.com/api/products
```

You should see a JSON response (might be empty initially).

---

## 🌐 Step 4: Deploy Frontend to Vercel

### 4.1 Prepare Frontend Code

#### Update API Base URL

Create/update `frontend/src/config.js`:

```javascript
// frontend/src/config.js
const config = {
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
};

export default config;
```

#### Update all API calls in services

Update `frontend/src/services/api.js`:

```javascript
import axios from 'axios';
import config from '../config';

const API = axios.create({
  baseURL: `${config.API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
```

#### Create `vercel.json` in frontend folder

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "https://dinujaya-flora-backend.onrender.com"
  }
}
```

#### Update `package.json` scripts

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

### 4.2 Commit Changes

```bash
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

### 4.3 Deploy to Vercel

1. **Sign Up on Vercel**
   - Go to https://vercel.com
   - Click "Sign Up"
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository: `dinujaya-flora`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   
   ```
   REACT_APP_API_URL = https://dinujaya-flora-backend.onrender.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment (3-5 minutes)
   - Once deployed, you'll get a URL: `https://dinujaya-flora.vercel.app`
   - **This is your live website!**

---

## 🔧 Step 5: Configure CORS in Backend

After deployment, update your backend CORS settings.

In `backend/server.js`:

```javascript
const cors = require('cors');

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://dinujaya-flora.vercel.app',
    'https://dinujaya-flora-*.vercel.app' // For preview deployments
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

Commit and push:
```bash
git add .
git commit -m "Update CORS for production"
git push origin main
```

Render will auto-deploy the changes.

---

## ✅ Step 6: Final Testing

### 6.1 Test Production Site

1. Visit your Vercel URL: `https://dinujaya-flora.vercel.app`
2. Test all features:
   - ✅ Homepage loads
   - ✅ Navigation works
   - ✅ User registration
   - ✅ User login
   - ✅ Product browsing
   - ✅ Add to cart
   - ✅ Checkout process
   - ✅ Admin login
   - ✅ Admin dashboard
   - ✅ Image uploads

### 6.2 Check Backend Health

Visit: `https://dinujaya-flora-backend.onrender.com/api/products`

Should return products JSON.

---

## 🎯 Step 7: Custom Domain (Optional)

### For Vercel (Frontend)

1. Go to your project settings on Vercel
2. Navigate to "Domains"
3. Click "Add Domain"
4. Enter your domain: `dinujayaflora.com`
5. Follow DNS configuration instructions
6. Add these DNS records at your domain registrar:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### For Render (Backend)

1. Go to your service on Render
2. Navigate to "Settings"
3. Scroll to "Custom Domain"
4. Click "Add Custom Domain"
5. Enter: `api.dinujayaflora.com`
6. Add CNAME record at your domain registrar:
   ```
   Type: CNAME
   Name: api
   Value: dinujaya-flora-backend.onrender.com
   ```

---

## 📊 Step 8: Monitor Your Application

### Render Monitoring

1. Go to Render Dashboard
2. Click on your service
3. View:
   - **Logs**: Real-time server logs
   - **Metrics**: CPU, Memory usage
   - **Events**: Deployment history

### Vercel Monitoring

1. Go to Vercel Dashboard
2. Click on your project
3. View:
   - **Analytics**: Page views, performance
   - **Logs**: Build and runtime logs
   - **Deployments**: History of all deployments

---

## 🔄 Step 9: Continuous Deployment

Now your apps are set up for automatic deployment:

### How it works:
1. You make changes to code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
3. **Vercel** automatically detects push and deploys frontend
4. **Render** automatically detects push and deploys backend
5. Your live site updates in 3-5 minutes!

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: API not responding
- Check Render logs: Dashboard → Service → Logs
- Verify environment variables are set
- Ensure MongoDB connection string is correct

**Problem**: CORS errors
- Update CORS origins in `server.js`
- Include your Vercel URL
- Redeploy backend

**Problem**: Images not uploading
- Verify Cloudinary credentials
- Check environment variables on Render
- Test Cloudinary connection in logs

### Frontend Issues

**Problem**: API calls failing
- Check `REACT_APP_API_URL` environment variable
- Verify backend is running (visit backend URL)
- Check browser console for errors

**Problem**: Blank page after deployment
- Check Vercel deployment logs
- Verify build succeeded
- Check for errors in browser console
- Ensure `vercel.json` has correct rewrites

**Problem**: Routing not working
- Ensure `vercel.json` has SPA rewrites
- Test direct URL access to routes

---

## 💰 Pricing Information

### Free Tier Limits

**Render Free:**
- 750 hours/month of runtime
- Services spin down after 15 min inactivity
- Cold start: 30-60 seconds
- 512 MB RAM

**Vercel Free (Hobby):**
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- Unlimited team members

**MongoDB Atlas Free (M0):**
- 512 MB storage
- Shared RAM
- Enough for small-medium apps

**Cloudinary Free:**
- 25 GB storage
- 25 GB bandwidth/month
- Good for hundreds of images

### Upgrade Options (if needed)

- **Render**: $7/month for always-on instance
- **Vercel Pro**: $20/month for advanced features
- **MongoDB**: $9/month for 2GB (M2)
- **Cloudinary**: $99/month for 1TB

---

## 📝 Important URLs to Save

After deployment, save these:

```
Frontend (Vercel): https://dinujaya-flora.vercel.app
Backend (Render): https://dinujaya-flora-backend.onrender.com
MongoDB Atlas: https://cloud.mongodb.com/
Cloudinary: https://console.cloudinary.com/

Admin Login:
- Email: admin@dinujayaflora.com
- Password: [your admin password]

Database Connection:
mongodb+srv://dinujaya_admin:PASSWORD@cluster.mongodb.net/dinujaya-flora
```

---

## 🎉 Success Checklist

After deployment, verify:

- [ ] Frontend loads at Vercel URL
- [ ] Backend responds at Render URL
- [ ] User can register and login
- [ ] Products display correctly
- [ ] Images load from Cloudinary
- [ ] Cart functionality works
- [ ] Checkout process completes
- [ ] Admin can login
- [ ] Admin can add/edit products
- [ ] Admin can view orders
- [ ] Mobile responsiveness works
- [ ] All navigation links work
- [ ] Contact form works
- [ ] Custom flower box works

---

## 🚀 You're Live!

Congratulations! Your Dinujaya Flora application is now live on the internet! 🌸

Share your website:
- Send link to friends and family
- Add to your portfolio
- Share on social media
- Add to your resume

---

## 📞 Support Resources

**Render Documentation**: https://render.com/docs
**Vercel Documentation**: https://vercel.com/docs
**MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
**Cloudinary Docs**: https://cloudinary.com/documentation

**Need Help?**
- Check Render community forum
- Check Vercel discussions
- MongoDB support chat
- Stack Overflow

---

**Last Updated**: November 2025
**Version**: 1.0.0

Good luck with your deployment! 🚀🌸
