#!/usr/bin/env python3
"""
Script to update frontend API endpoints for deployment
"""
import re
import sys

def update_demo_html(backend_url):
    """Update demo.html to use deployed backend URL"""
    demo_path = "frontend/demo.html"
    
    try:
        with open(demo_path, 'r') as f:
            content = f.read()
        
        # Replace localhost:8000 with deployed backend URL
        updated_content = re.sub(
            r'http://localhost:8000',
            backend_url.rstrip('/'),
            content
        )
        
        with open(demo_path, 'w') as f:
            f.write(updated_content)
        
        print(f"✅ Updated {demo_path} with backend URL: {backend_url}")
        return True
        
    except Exception as e:
        print(f"❌ Error updating {demo_path}: {e}")
        return False

def main():
    if len(sys.argv) != 2:
        print("Usage: python update_api_endpoints.py <backend_url>")
        print("Example: python update_api_endpoints.py https://your-app.railway.app")
        sys.exit(1)
    
    backend_url = sys.argv[1]
    
    print(f"🔄 Updating API endpoints to: {backend_url}")
    
    if update_demo_html(backend_url):
        print("🎉 Frontend updated successfully!")
        print("📝 Next steps:")
        print("1. Commit and push changes to GitHub")
        print("2. Vercel will auto-deploy the updated frontend")
        print("3. Test your live application!")
    else:
        print("❌ Failed to update frontend")
        sys.exit(1)

if __name__ == "__main__":
    main()
