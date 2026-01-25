# Printify Store Setup Guide

## ✅ Backend API Configuration

Your Printify dropshipping store now uses a secure backend architecture:
- **Backend Server**: Node.js/Express (`server.js`)
- **API Credentials**: Stored in `.env` file (server-side)
- **Security**: API tokens never exposed to the browser

## 🚀 Quick Start

### Automated Setup (Recommended)

Run the setup wizard to configure your environment:

```bash
npm run setup
```

The setup wizard will:
✅ Create your `.env` file from the template  
✅ Validate your configuration  
✅ Provide step-by-step guidance  
✅ Show you where to get API credentials  

### Manual Setup

If you prefer manual setup, follow these steps:

### Step 1: Configure Environment Variables

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Printify credentials:
   ```
   PRINTIFY_API_TOKEN=your_api_token_here
   PRINTIFY_SHOP_ID=your_shop_id_here
   PRINTIFY_API_BASE_URL=https://api.printify.com/v1
   PORT=3000
   ```

**Where to get your credentials:**
- **API Token**: https://printify.com/app/account/api
- **Shop ID**: Found in your Printify shop settings

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start the Server

```bash
npm start
```

The server will start on http://localhost:3000

### Step 4: Access Your Store

Open your browser and go to:
```
http://localhost:3000
```

## 🔒 Security Features

✅ **API credentials stored server-side** in environment variables  
✅ **No credentials in client-side code** (app.js is clean)  
✅ **Backend proxies all Printify API calls**  
✅ **CORS properly configured**  
✅ **`.env` file excluded from git**

## 🌐 Production Hosting

For production deployment, you can host on:

1. **Heroku** (Recommended for Node.js apps)
   - Sign up at https://heroku.com
   - Install Heroku CLI
   - Create app: `heroku create your-app-name`
   - Set environment variables in Heroku dashboard or CLI
   - Deploy: `git push heroku main`

2. **DigitalOcean App Platform**
   - Sign up at https://digitalocean.com
   - Create a new app from your GitHub repository
   - Configure environment variables in the dashboard
   - Automatic deployments on push

3. **AWS Elastic Beanstalk**
   - Deploy Node.js application
   - Configure environment variables
   - Set up auto-scaling as needed

4. **Any VPS (DigitalOcean, Linode, Vultr)**
   - Set up a Linux server
   - Install Node.js
   - Clone repository and configure `.env`
   - Use PM2 to keep server running
   - Set up nginx as reverse proxy

## 📝 Architecture Overview

### Before (Insecure)
```
Browser → Printify API (with exposed token)
```

### After (Secure) ✅
```
Browser → Backend API → Printify API
           (with credentials in .env)
```

The backend server (`server.js`) now:
- Stores credentials securely in environment variables
- Provides API endpoints that the frontend calls
- Proxies requests to Printify API
- Never exposes sensitive data to the browser

## 📝 Demo Mode

When API credentials are not properly configured or API calls fail, the store runs in demo mode with mock products. This allows you to:
- Test the UI and functionality
- See the design and layout
- Understand the workflow before connecting to real API

The backend will automatically fall back to demo mode if:
- `.env` file is missing
- Printify API credentials are not set
- Printify API is unavailable

## 🎨 Customization

### Update Store Branding

Edit `index.html`:
```html
<h1>🛍️ Your Store Name</h1>
```

### Modify Colors and Styles

Edit `styles.css`:
- Change the color scheme
- Update fonts and typography
- Adjust layout and spacing

### Add Custom Products

When properly connected to Printify API, products will automatically sync from your Printify shop.

## 🧪 Testing the Store

1. **Browse Products**: View the product grid
2. **Search**: Use the search box to filter products
3. **Filter by Category**: Select categories from dropdown
4. **Add to Cart**: Click "Add to Cart" on any product
5. **View Cart**: Click the cart icon (🛒) in the header
6. **Checkout**: Click "Proceed to Checkout" and fill in the form
7. **Place Order**: Submit the order form

## 🔧 Troubleshooting

### Products Not Loading
- Check browser console (F12) for errors
- Verify API token is correct
- Ensure shop ID matches your Printify shop
- Check if ad blocker is blocking requests

### CORS Errors
- Use a local development server (not file://)
- Consider implementing a backend proxy
- Or use the demo mode for testing

### Order Creation Issues
- Ensure products exist in your Printify shop
- Verify products are published
- Check API permissions in Printify dashboard

## 📚 Resources

- [Printify API Documentation](https://developers.printify.com/)
- [Printify Dashboard](https://printify.com/app/)
- [API Token Management](https://printify.com/app/account/api)

## 🎉 You're All Set!

Your store is ready to use. The configuration has been completed with your API credentials. Start the local server using any of the hosting options above and visit the URL in your browser.

For questions or issues, refer to the main README.md or Printify's support documentation.
