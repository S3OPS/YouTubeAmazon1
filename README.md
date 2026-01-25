# Printify Dropshipping Store

An automated dropshipping page powered by Printify API. This application provides a complete e-commerce frontend that integrates with Printify for print-on-demand products.

## Features

- 🛍️ **Product Catalog**: Display products from your Printify shop
- 🔍 **Search & Filter**: Search products by name and filter by category
- 🛒 **Shopping Cart**: Add products to cart and manage quantities
- 💳 **Checkout System**: Complete order form with customer details
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🚀 **Automated Integration**: Syncs with Printify API for product data and order processing
- 🎨 **Modern UI**: Clean, professional design with smooth animations

## Getting Started

### Prerequisites

- A Printify account ([sign up here](https://printify.com))
- Printify API token
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Setup Instructions

**Quick Setup (Recommended):**

Run the automated setup wizard:
```bash
npm run setup
```

The setup wizard will:
- Create your `.env` configuration file
- Validate your environment settings
- Provide step-by-step instructions
- Guide you through getting API credentials

**Manual Setup:**

1. **Get your Printify API credentials**:
   - Log in to your Printify account
   - Go to Settings → API
   - Generate an API token
   - Note your Shop ID

2. **Configure the application**:
   - Copy `.env.example` to `.env`
   - Edit `.env` and add your credentials:
     ```
     PRINTIFY_API_TOKEN=your_api_token_here
     PRINTIFY_SHOP_ID=your_shop_id_here
     PRINTIFY_API_BASE_URL=https://api.printify.com/v1
     PORT=3000
     ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the backend server**:
   ```bash
   npm start
   ```

5. **Open the application**:
   - Visit `http://localhost:3000` in your web browser
   - The backend API will proxy all requests to Printify securely

## Usage

### For Customers

1. **Browse Products**: View all available print-on-demand products
2. **Filter & Search**: Use category filters and search to find specific items
3. **Add to Cart**: Click "Add to Cart" on any product
4. **Checkout**: Click the cart icon, review items, and proceed to checkout
5. **Place Order**: Fill in shipping details and submit your order

### For Store Owners

The application automatically:
- Fetches products from your Printify shop
- Displays product information (title, description, price, images)
- Creates orders in Printify when customers checkout
- Syncs with your Printify inventory

## File Structure

```
.
├── index.html          # Main HTML page
├── styles.css          # Styling and responsive design
├── app.js             # Frontend application logic
├── server.js          # Backend API server (proxies Printify API)
├── package.json       # Node.js dependencies
├── .env               # Environment variables (not in git)
├── .env.example       # Environment configuration template
├── README.md          # This file
└── SECURITY.md        # Security guidelines
```

## API Integration

The application uses a secure backend API architecture:

### Backend API Endpoints

- **GET /api/products**: Fetch all products (proxies to Printify)
- **GET /api/products/:productId**: Fetch single product
- **POST /api/orders**: Create new order (proxies to Printify)
- **GET /api/health**: Health check endpoint

### Security Benefits

✅ **API credentials stored server-side** in environment variables  
✅ **No credentials exposed to browser** or client-side code  
✅ **Backend proxies all Printify API calls** securely  
✅ **CORS handled properly** by the backend server  

### API Response Handling

Products are automatically formatted from the Printify API response:
- Product images
- Titles and descriptions
- Pricing from variants
- Categories from tags

## Demo Mode

If API credentials are not configured, the app runs in demo mode with mock products. This allows you to:
- Test the UI and functionality
- See the layout and design
- Understand how the integration works

## Customization

### Styling

Edit `styles.css` to customize:
- Colors and gradients
- Fonts and typography
- Layout and spacing
- Responsive breakpoints

### Products

The product display can be customized in `app.js`:
- Change the grid layout
- Modify product card design
- Add custom filtering logic
- Implement product variations

### Checkout

Customize the checkout process:
- Add payment gateway integration
- Modify required fields
- Add order validation
- Implement shipping calculations

## Production Deployment

### Security Considerations

✅ **Backend API Implemented**: This application now uses a secure backend architecture

The application includes:
1. ✅ **Server-side API**: Node.js/Express backend (`server.js`)
2. ✅ **Secure credential storage**: Environment variables in `.env` file
3. ✅ **API proxy**: All Printify requests go through the backend
4. ✅ **No exposed tokens**: Client-side code never sees API credentials

### Deployment Options

#### Option 1: Heroku

1. Install Heroku CLI
2. Create a Heroku app:
   ```bash
   heroku create your-app-name
   ```
3. Set environment variables:
   ```bash
   heroku config:set PRINTIFY_API_TOKEN=your_token
   heroku config:set PRINTIFY_SHOP_ID=your_shop_id
   ```
4. Deploy:
   ```bash
   git push heroku main
   ```

#### Option 2: DigitalOcean / AWS / Azure

1. Set up a VPS or App Service
2. Clone your repository
3. Create `.env` file with your credentials
4. Install dependencies: `npm install`
5. Start the server: `npm start`
6. Configure a process manager (PM2 recommended):
   ```bash
   npm install -g pm2
   pm2 start server.js
   ```

#### Option 3: Vercel / Netlify (with Serverless Functions)

For these platforms, you'll need to adapt the backend to serverless functions, but the security principles remain the same.

### Production Checklist

- [ ] Use HTTPS (SSL certificate)
- [ ] Set environment variables on your hosting platform
- [ ] Never commit `.env` file to git
- [ ] Enable rate limiting
- [ ] Add request logging
- [ ] Implement error monitoring
- [ ] Set up backups

## Printify API Documentation

For more information about the Printify API:
- [Official API Documentation](https://developers.printify.com/)
- [API Reference](https://developers.printify.com/#introduction)
- [Authentication Guide](https://developers.printify.com/#authentication)

## Troubleshooting

### Products Not Loading

- Check your API token is correct
- Verify your Shop ID
- Check browser console for errors
- Ensure CORS is properly configured

### Order Creation Fails

- Verify product IDs are valid
- Check shipping address format
- Review API response errors in console
- Ensure products are published in Printify

### CORS Errors

- Use a local development server
- Implement a backend proxy
- Configure proper CORS headers

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is open source and available for use in your dropshipping business.

## Support

For issues with:
- **This application**: Check the troubleshooting section
- **Printify API**: Contact [Printify support](https://help.printify.com/)
- **Your store**: Review Printify's merchant documentation

## Future Enhancements

Potential features to add:
- [ ] Product variations (size, color)
- [ ] User accounts and order history
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Email notifications
- [ ] Advanced product filtering
- [ ] Wishlist functionality
- [ ] Reviews and ratings
- [ ] Multi-language support
- [ ] Analytics dashboard

## Contributing

Feel free to fork this project and customize it for your needs!

---

**Built with ❤️ for automated dropshipping with Printify**