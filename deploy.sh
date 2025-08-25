#!/bin/bash
# Complete deployment script for Weather Engine Maritime
echo "🚢 Weather Engine Maritime - Complete Deployment Script"
echo "======================================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}📁 Initializing Git repository...${NC}"
    git init
    git add .
    git commit -m "Initial commit - Weather Engine Maritime MVP"
    git branch -M main
    echo -e "${GREEN}✅ Git repository initialized${NC}"
else
    echo -e "${GREEN}✅ Git repository already exists${NC}"
fi

echo ""
echo -e "${BLUE}🚀 DEPLOYMENT OPTIONS:${NC}"
echo "1. Railway (Backend) + Vercel (Frontend) - RECOMMENDED"
echo "2. Render (Backend) + Netlify (Frontend)"
echo "3. Manual deployment instructions"
echo ""

read -p "Choose option (1-3): " choice

case $choice in
    1)
        echo -e "${YELLOW}📋 RAILWAY + VERCEL DEPLOYMENT${NC}"
        echo ""
        echo -e "${BLUE}STEP 1: Push to GitHub${NC}"
        echo "1. Create a new repository on GitHub: https://github.com/new"
        echo "2. Run these commands:"
        echo "   git remote add origin https://github.com/YOUR_USERNAME/weather-engine-maritime.git"
        echo "   git push -u origin main"
        echo ""
        echo -e "${BLUE}STEP 2: Deploy Backend on Railway${NC}"
        echo "1. Go to: https://railway.app"
        echo "2. Sign up with GitHub"
        echo "3. Click 'New Project' → 'Deploy from GitHub repo'"
        echo "4. Select your weather-engine-maritime repository"
        echo "5. Railway will auto-deploy your backend"
        echo "6. Copy your Railway app URL (e.g., https://your-app.railway.app)"
        echo ""
        echo -e "${BLUE}STEP 3: Update Frontend API URLs${NC}"
        echo "After getting your Railway URL, run:"
        echo "   python3 update_api_endpoints.py https://your-railway-app.railway.app"
        echo ""
        echo -e "${BLUE}STEP 4: Deploy Frontend on Vercel${NC}"
        echo "1. Go to: https://vercel.com"
        echo "2. Sign up with GitHub"
        echo "3. Click 'New Project' → Import from GitHub"
        echo "4. Select weather-engine-maritime"
        echo "5. Set Root Directory to: frontend"
        echo "6. Deploy!"
        ;;
    2)
        echo -e "${YELLOW}📋 RENDER + NETLIFY DEPLOYMENT${NC}"
        echo ""
        echo -e "${BLUE}STEP 1: Deploy Backend on Render${NC}"
        echo "1. Go to: https://render.com"
        echo "2. Sign up with GitHub"
        echo "3. Click 'New' → 'Web Service'"
        echo "4. Connect your GitHub repository"
        echo "5. Settings:"
        echo "   - Build Command: pip install -r backend/requirements.txt"
        echo "   - Start Command: python backend/main.py"
        echo ""
        echo -e "${BLUE}STEP 2: Deploy Frontend on Netlify${NC}"
        echo "1. Go to: https://netlify.com"
        echo "2. Drag and drop your frontend folder"
        echo "3. Or connect GitHub repository"
        ;;
    3)
        echo -e "${YELLOW}📋 MANUAL DEPLOYMENT${NC}"
        echo "See DEPLOYMENT.md for detailed instructions"
        ;;
    *)
        echo -e "${RED}❌ Invalid option${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Deployment files created!${NC}"
echo -e "${BLUE}📁 Files added:${NC}"
echo "   - railway.json (Railway configuration)"
echo "   - Dockerfile (Container deployment)"
echo "   - vercel.json (Vercel configuration)"
echo "   - DEPLOYMENT.md (Complete guide)"
echo "   - update_api_endpoints.py (URL updater)"
echo ""
echo -e "${YELLOW}💡 Next Steps:${NC}"
echo "1. Push your code to GitHub"
echo "2. Follow the deployment steps above"
echo "3. Update API endpoints after backend deployment"
echo "4. Test your live application!"
echo ""
echo -e "${GREEN}🌊 Your Weather Engine Maritime will be live soon! ⚓${NC}"
