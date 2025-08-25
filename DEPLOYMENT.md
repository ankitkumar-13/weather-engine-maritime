# 🚀 Weather Engine Maritime - Free Deployment Guide

## Complete Free Deployment Steps

### **Step 1: Prepare Your Repository**

1. **Push to GitHub** (if not already done):
```bash
cd /Users/gewu/Desktop/weather-engine-maritime
git init
git add .
git commit -m "Initial commit - Weather Engine Maritime MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/weather-engine-maritime.git
git push -u origin main
```

### **Step 2: Deploy Backend on Railway (FREE)**

1. **Sign up for Railway**: https://railway.app
   - Use GitHub account for easy integration
   - Free tier: 500 hours/month

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `weather-engine-maritime` repository

3. **Configure Railway Deployment**:
   - Railway will auto-detect Python
   - Set these environment variables in Railway dashboard:
     ```
     PORT=8000
     PYTHONPATH=/app/backend
     ```

4. **Deploy Settings**:
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `python backend/main.py`
   - Root Directory: `/` (keep default)

5. **Get Your Backend URL**:
   - After deployment, Railway provides a URL like: `https://your-app-name.railway.app`
   - Test it: `https://your-app-name.railway.app/` should show API status

### **Step 3: Deploy Frontend on Vercel (FREE)**

1. **Sign up for Vercel**: https://vercel.com
   - Use GitHub account
   - Unlimited static deployments

2. **Import Project**:
   - Click "New Project"
   - Import from GitHub: `weather-engine-maritime`
   - Framework Preset: "Other"
   - Root Directory: `frontend`

3. **Configure Build Settings**:
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
   - Install Command: (leave empty)

### **Step 4: Update Frontend API Endpoints**

1. **Update demo.html** to use your Railway backend URL:
   - Replace `http://localhost:8000` with your Railway URL
   - Example: `https://your-app-name.railway.app`

### **Step 5: Alternative Free Options**

#### **Backend Alternatives:**
- **Render**: https://render.com (750 hours/month free)
- **Heroku**: https://heroku.com (550 hours/month free with credit card)
- **PythonAnywhere**: https://pythonanywhere.com (limited free tier)

#### **Frontend Alternatives:**
- **Netlify**: https://netlify.com (100GB bandwidth/month)
- **GitHub Pages**: Free static hosting
- **Surge.sh**: Simple static deployment

### **Step 6: Quick Deploy Commands**

#### **For Railway (using CLI)**:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

#### **For Vercel (using CLI)**:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from frontend directory
cd frontend
vercel --prod
```

### **Step 7: Environment Variables**

Add these to your Railway backend:
```
PORT=8000
OWM_KEY=your_openweather_api_key_optional
PYTHONPATH=/app/backend
```

### **Step 8: Test Deployment**

1. **Backend Test**:
   ```bash
   curl https://your-railway-app.railway.app/
   curl https://your-railway-app.railway.app/route_forecast
   ```

2. **Frontend Test**:
   - Visit your Vercel URL
   - Test all buttons in the demo
   - Verify API calls work

### **Expected URLs After Deployment**:
- **Backend API**: `https://your-app-name.railway.app`
- **Frontend Demo**: `https://your-project.vercel.app`

### **Cost Breakdown (FREE)**:
- Railway: $0 (500 hours/month)
- Vercel: $0 (unlimited static)
- Domain: $0 (using provided subdomains)
- **Total Monthly Cost: $0**

### **Pro Tips**:
1. **Railway sleeps after 30min inactivity** - first request may be slow
2. **Use Railway's built-in monitoring** for uptime tracking  
3. **Vercel provides instant deployments** on every git push
4. **Set up custom domain later** if needed (optional)

### **Troubleshooting**:
- **Railway build fails**: Check `requirements.txt` path
- **CORS errors**: Verify frontend URL in backend CORS settings
- **API not found**: Ensure Railway app is awake (visit URL)
- **Frontend 404**: Check Vercel build logs and file paths

Your Weather Engine Maritime will be live and accessible worldwide! 🌊⚓
