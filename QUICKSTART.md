# Quick Start Guide

## 🎉 Secure Backend Architecture Implemented!

### Current Status
✅ **Backend API**: Node.js/Express server  
✅ **Secure Credentials**: Environment variables in `.env`  
✅ **API Proxy**: All Printify calls go through backend  
✅ **No Exposed Tokens**: Client-side code is secure  

### Quick Setup (3 Steps)

1. **Configure credentials** (copy `.env.example` to `.env` and add your Printify API token)
2. **Install dependencies** (`npm install`)
3. **Start server** (`npm start`)

### Access Your Store

**Local Development:**
```
http://localhost:3000
```

### Server Commands

**Start Server:**
```bash
npm start
```

**Stop Server:**
```bash
# Press Ctrl+C in the terminal
# Or find and kill the process:
ps aux | grep "node server.js"
kill <PID>
```

### Quick Test Checklist

1. ✅ Start backend server (`npm start`)
2. ✅ Open http://localhost:3000
3. ✅ Browse products
4. ✅ Add items to cart
5. ✅ View cart (click 🛒)
6. ✅ Try checkout form

### Files Overview

- `index.html` - Main store page
- `app.js` - Frontend application logic (no credentials!)
- `server.js` - Backend API server (handles Printify API securely)
- `styles.css` - Styling
- `package.json` - Node.js dependencies
- `.env` - Environment variables (not committed to git)
- `.env.example` - Template for environment variables
- `SETUP.md` - Detailed setup and hosting guide
- `README.md` - Project documentation

### For Production Hosting

See `SETUP.md` for detailed instructions on:
- GitHub Pages
- Netlify (recommended)
- Vercel
- Custom web hosting

### Important Security Notes

✅ **SECURE Architecture Implemented**

**Current Setup**: Backend API with environment variables
- ✅ Perfect for: Production, development, and testing
- ✅ API credentials are server-side only
- ✅ No tokens exposed in browser
- ✅ Proper security best practices

🔒 **Security Features**:
- Environment variables in `.env` file
- Backend proxies all Printify API calls
- CORS properly configured
- `.env` excluded from version control

### Need Help?

1. Check `SETUP.md` for detailed instructions
2. See `README.md` for features and customization
3. Visit [Printify API Docs](https://developers.printify.com/)

---

**That's it! Your store is live and ready to use! 🚀**
