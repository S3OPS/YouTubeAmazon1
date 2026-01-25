# Quick Start Guide

## 🎉 Your Store is Ready!

### Current Status
✅ **API Token**: Configured  
✅ **Shop ID**: PablosMerchantStand  
✅ **Server**: Running on port 8000  
✅ **Files**: All configured and tested  

### Access Your Store

**Local Development:**
```
http://localhost:8000
```

### Server Commands

**Start Server:**
```bash
cd /home/runner/work/666/666
python3 -m http.server 8000
```

**Stop Server:**
```bash
# Find the process
ps aux | grep "http.server"
# Kill it (replace PID with actual process ID)
kill <PID>
```

### Quick Test Checklist

1. ✅ Open http://localhost:8000
2. ✅ Browse products
3. ✅ Add items to cart
4. ✅ View cart (click 🛒)
5. ✅ Try checkout form

### Files Overview

- `index.html` - Main store page
- `app.js` - Application logic (contains your API credentials)
- `styles.css` - Styling
- `.env` - Environment variables (not committed to git)
- `SETUP.md` - Detailed setup and hosting guide
- `README.md` - Project documentation

### For Production Hosting

See `SETUP.md` for detailed instructions on:
- GitHub Pages
- Netlify (recommended)
- Vercel
- Custom web hosting

### Important Security Notes

⚠️ **Current Setup**: API credentials are in `app.js` (client-side)
- ✅ Good for: Testing, development, personal use
- ❌ Not ideal for: Public e-commerce stores

🔒 **For Production**: Implement a backend API
- Move credentials to server-side
- Use environment variables
- Proxy Printify API calls through your backend

### Need Help?

1. Check `SETUP.md` for detailed instructions
2. See `README.md` for features and customization
3. Visit [Printify API Docs](https://developers.printify.com/)

---

**That's it! Your store is live and ready to use! 🚀**
