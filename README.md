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
- A web browser

### Setup Instructions

1. **Get your Printify API credentials**:
   - Log in to your Printify account
   - Go to Settings → API
   - Generate an API token
   - Note your Shop ID

2. **Configure the application**:
   - Open `app.js`
   - Replace the configuration values:
     ```javascript
     const config = {
         apiToken: 'YOUR_PRINTIFY_API_TOKEN',  // Your API token
         shopId: 'YOUR_SHOP_ID',                // Your Shop ID
         apiBaseUrl: 'https://api.printify.com/v1'
     };
     ```

3. **Open the application**:
   - Simply open `index.html` in your web browser
   - Or host the files on any web server

### Using a Local Server (Recommended)

For better development experience and to avoid CORS issues:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

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
├── app.js             # Application logic and Printify integration
├── README.md          # This file
├── SECURITY.md        # Security guidelines
└── .env.example       # Environment configuration template
```

## API Integration

The application uses the Printify API v1 for:

- **GET /shops/{shop_id}/products.json**: Fetch all products
- **POST /shops/{shop_id}/orders.json**: Create new orders

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

⚠️ **Important**: Never expose your API token in client-side code in production!

For production deployment:

1. **Use a Backend**: Create a server-side API that:
   - Stores API credentials securely
   - Proxies requests to Printify
   - Handles authentication
   - Processes payments

2. **Environment Variables**: Use environment variables for sensitive data

3. **HTTPS**: Always use HTTPS in production

### Backend Implementation Example

```javascript
// Example Node.js/Express backend endpoint
app.post('/api/products', async (req, res) => {
    const response = await fetch('https://api.printify.com/v1/shops/{shop_id}/products.json', {
        headers: {
            'Authorization': `Bearer ${process.env.PRINTIFY_API_TOKEN}`
        }
    });
    const data = await response.json();
    res.json(data);
});
```

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