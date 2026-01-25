# Printify Store Setup Guide

## ✅ Configuration Complete!

Your Printify dropshipping store has been configured with:
- **API Token**: Configured in `app.js`
- **Shop ID**: `PablosMerchantStand`
- **API Base URL**: `https://api.printify.com/v1`

## 🚀 Hosting the Store

### Option 1: Python HTTP Server (Recommended for Testing)

The store is currently running on:
```bash
cd /home/runner/work/666/666
python3 -m http.server 8000
```

Access at: **http://localhost:8000**

### Option 2: Node.js HTTP Server

```bash
npx http-server -p 8000
```

### Option 3: PHP Built-in Server

```bash
php -S localhost:8000
```

### Option 4: Production Hosting

For production deployment, you can host on:

1. **GitHub Pages**
   - Push your repository to GitHub
   - Go to Settings → Pages
   - Select branch and folder
   - Your site will be live at `https://<username>.github.io/<repo>`

2. **Netlify** (Recommended)
   - Sign up at https://netlify.com
   - Drag and drop your folder or connect GitHub repo
   - Instant deployment with HTTPS
   - Free SSL certificate

3. **Vercel**
   - Sign up at https://vercel.com
   - Connect your GitHub repository
   - Automatic deployments on push

4. **Any Web Server**
   - Upload `index.html`, `app.js`, and `styles.css` to your web server
   - No special configuration needed - just static files!

## 📝 Important Notes

### API Limitations

⚠️ **Security Warning**: The current setup has API credentials in client-side code (`app.js`). This is acceptable for:
- Development and testing
- Personal use
- Internal tools

For production e-commerce stores, you should:

1. **Create a Backend API** (Node.js, Python, PHP, etc.)
2. **Move credentials to server-side** environment variables
3. **Proxy all Printify API calls** through your backend
4. **Never expose API tokens** to the browser

### CORS and Browser Restrictions

If you see errors like "Failed to fetch" or "ERR_BLOCKED_BY_CLIENT":
- This is due to browser security (CORS) or ad blockers
- The app will automatically use demo products as fallback
- For real API integration, you need a backend proxy (see above)

### Demo Mode

When API credentials are not properly configured or API calls fail, the store runs in demo mode with mock products. This allows you to:
- Test the UI and functionality
- See the design and layout
- Understand the workflow before connecting to real API

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
