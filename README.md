# YouTube Amazon Affiliate Automation System

**100% Fully Automated System for AI-Generated Video Content**

This application provides a complete automation solution for adding Amazon affiliate links to AI-generated short videos and automatically posting them to YouTube. Built with enterprise-grade security, monitoring, and automation features.

## 🎬 Primary Features - YouTube Automation

### Core Automation 🤖
- 🎥 **Automatic Video Processing**: Scans directory for AI-generated videos
- 💰 **Affiliate Link Injection**: Automatically adds Amazon affiliate links to descriptions
- 📅 **Scheduled Uploads**: Configurable cron-based YouTube uploads
- 🔄 **Batch Processing**: Process multiple videos simultaneously
- 🧹 **Auto-Cleanup**: Removes old processed files automatically
- 📊 **Metadata Management**: Tracks all processed videos and upload status
- ⚡ **Zero-Touch Operation**: 100% hands-free after initial setup

### YouTube Integration 📺
- ✅ **OAuth2 Authentication**: Secure YouTube API v3 integration
- ✅ **Video Uploads**: Automated uploads with custom metadata
- ✅ **Metadata Control**: Custom titles, descriptions, tags
- ✅ **Privacy Controls**: Public, unlisted, or private options
- ✅ **Video Management**: Update, retrieve, and delete videos programmatically

### Amazon Affiliate 💵
- ✅ **Link Generation**: Automatic affiliate link creation from ASINs/URLs
- ✅ **Batch Operations**: Generate multiple affiliate links at once
- ✅ **Smart Descriptions**: Professional product descriptions with embedded links
- ✅ **FTC Compliance**: Automatic disclaimer integration
- ✅ **Link Validation**: Verify affiliate links are properly formatted

### Video Processing 📹
- ✅ **Auto-Discovery**: Scans video directory for new content
- ✅ **Metadata Extraction**: Reads and processes video file information
- ✅ **JSON Configuration**: Per-video configuration support
- ✅ **Product Linking**: Automatic product-to-description mapping
- ✅ **SEO Optimization**: Smart tag enhancement for discoverability

## 🚀 Quick Start - YouTube Automation

### Prerequisites

1. **Node.js** (v14 or higher)
2. **YouTube Account** with API access enabled
3. **Amazon Associates Account** with active affiliate tag
4. **Google Cloud Project** with YouTube Data API v3 enabled

### Setup (3 Easy Steps)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Setup Wizard**
   ```bash
   npm run setup:youtube
   ```
   
   The wizard will guide you through:
   - YouTube API credentials
   - Amazon affiliate configuration
   - Automation schedule
   - Directory setup

3. **Start the Server**
   ```bash
   npm start
   ```

### Quick Configuration

```env
# YouTube API
YOUTUBE_CLIENT_ID=your_client_id
YOUTUBE_CLIENT_SECRET=your_client_secret
YOUTUBE_REFRESH_TOKEN=your_refresh_token

# Amazon Affiliate
AMAZON_AFFILIATE_TAG=your_tag_here

# Automation
AUTO_UPLOAD=true
UPLOAD_SCHEDULE=0 10 * * *  # Daily at 10 AM
```

## 📖 Usage

### Automated Workflow (Recommended)

1. **Place videos** in `./videos/` directory
2. **Create config** files (optional): `video-name.json`
   ```json
   {
     "title": "Amazing Product Review",
     "description": "Check out these products!",
     "products": [
       { "name": "Product 1", "url": "B08XXXXX" }
     ],
     "tags": ["review", "tech", "amazon"]
   }
   ```
3. **Let it run** - Videos are automatically processed and uploaded per schedule!

### Manual Upload

```bash
# Trigger processing now
curl -X POST http://localhost:3000/api/automation/trigger

# Upload specific video
curl -X POST http://localhost:3000/api/youtube/upload \
  -H "Content-Type: application/json" \
  -d '{
    "filePath": "./videos/my-video.mp4",
    "title": "My Video",
    "products": [{"name": "Product", "url": "B08XXXXX"}]
  }'
```

## 📊 API Endpoints

### YouTube Automation
- `GET /api/automation/status` - Get automation status
- `POST /api/automation/trigger` - Manually trigger processing
- `POST /api/youtube/upload` - Upload video with affiliate links
- `GET /api/youtube/auth-url` - Get OAuth authorization URL
- `GET /api/videos/scan` - Scan for new videos

### Amazon Affiliate
- `POST /api/affiliate/generate` - Generate affiliate link

### System
- `GET /api/health` - Health check endpoint

## 📁 Project Structure

```
.
├── youtube-api.js              # YouTube API integration
├── amazon-affiliate.js         # Amazon affiliate management
├── video-processor.js          # Video processing engine
├── automation-scheduler.js     # Cron-based scheduler
├── server.js                   # Express API server
├── setup-youtube.js            # Setup wizard
├── videos/                     # Video directory
│   ├── *.mp4                   # AI-generated videos
│   ├── *.json                  # Video configs
│   └── processed/              # Metadata storage
└── YOUTUBE_AUTOMATION.md       # Detailed documentation
```

## ⚙️ Configuration

### Upload Schedule (Cron Format)

```env
# Examples:
UPLOAD_SCHEDULE=0 10 * * *      # Daily at 10 AM
UPLOAD_SCHEDULE=0 14 * * 1-5    # Weekdays at 2 PM
UPLOAD_SCHEDULE=0 */6 * * *     # Every 6 hours
```

### Privacy Settings

```env
DEFAULT_PRIVACY_STATUS=public   # public, unlisted, or private
```

## 🔐 Security

- ✅ **OAuth2**: Secure YouTube authentication
- ✅ **Environment Variables**: All secrets in .env
- ✅ **Rate Limiting**: API endpoint protection
- ✅ **Helmet.js**: Security headers
- ✅ **Input Validation**: All user inputs validated
- ✅ **CORS**: Configurable whitelist

## 📚 Documentation

- **[YOUTUBE_AUTOMATION.md](YOUTUBE_AUTOMATION.md)** - Complete YouTube automation guide
- **[AUTOMATION.md](AUTOMATION.md)** - CI/CD and DevOps automation
- **[SETUP.md](SETUP.md)** - Detailed setup instructions
- **[SECURITY.md](SECURITY.md)** - Security guidelines

## 🎯 Example Workflows

### Daily Automated Uploads
```bash
# 1. Configure schedule
echo "AUTO_UPLOAD=true" >> .env
echo "UPLOAD_SCHEDULE=0 10 * * *" >> .env

# 2. Add videos to directory
cp my-videos/*.mp4 videos/

# 3. Done! Videos upload automatically at 10 AM
```

### Batch Processing
```javascript
// Trigger batch upload
const response = await fetch('http://localhost:3000/api/automation/trigger', {
  method: 'POST'
});
const { results } = await response.json();
console.log(`Uploaded ${results.uploaded} videos`);
```

## 🛠️ Available Commands

```bash
# Setup
npm run setup:youtube          # YouTube automation setup wizard
npm install                     # Install dependencies

# Running
npm start                       # Start server
npm run dev                     # Development mode

# Automation
# (Runs automatically based on UPLOAD_SCHEDULE)

# Development
npm test                        # Run tests
npm run lint                    # Check code quality
npm run format                  # Format code

# Docker
npm run docker:build            # Build Docker image
npm run docker:run              # Run with Docker Compose
```

## 🐛 Troubleshooting

### Videos Not Uploading
1. Check YouTube API credentials
2. Verify video file format (mp4, mov, avi, mkv, webm)
3. Review server logs for errors

### Affiliate Links Not Working
1. Verify `AMAZON_AFFILIATE_TAG` in .env
2. Test link generation: `POST /api/affiliate/generate`

### Scheduler Not Running
1. Ensure `AUTO_UPLOAD=true`
2. Verify cron schedule format
3. Restart server

## 🚀 Deployment

### Docker
```bash
docker build -t youtube-automation .
docker run -d -p 3000:3000 \
  -v $(pwd)/videos:/app/videos \
  -v $(pwd)/.env:/app/.env \
  youtube-automation
```

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS with SSL
- [ ] Configure firewall
- [ ] Set up monitoring
- [ ] Enable log rotation
- [ ] Configure backups

## 📈 Performance

- Batch processing for efficiency
- Cron-based scheduling
- Automatic cleanup of old files
- Request caching and optimization

## 🤝 Contributing

Feel free to fork and customize for your needs!

---

## 🛍️ Legacy Feature - Printify Dropshipping

This repository originally supported Printify dropshipping and those features are still available. See the legacy documentation for details.

### Printify Features (Legacy)
- 🛍️ Product catalog from Printify API
- 🔍 Search & filter products
- 🛒 Shopping cart system
- 💳 Checkout and order processing

To use Printify features, configure:
```env
PRINTIFY_API_TOKEN=your_token
PRINTIFY_SHOP_ID=your_shop_id
```

---

**Built for 100% Automated YouTube & Amazon Affiliate Video Marketing** 🎬💰

## 🌟 Features

### Core Functionality
- 🛍️ **Product Catalog**: Display products from your Printify shop with pagination
- 🔍 **Search & Filter**: Search products by name and filter by category
- 🛒 **Shopping Cart**: Add products to cart and manage quantities
- 💳 **Checkout System**: Complete order form with validation
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🚀 **Automated Integration**: Syncs with Printify API for product data and order processing
- 🎨 **Modern UI**: Clean, professional design with smooth animations

### Security Features 🔒
- ✅ **XSS Protection**: Safe DOM manipulation, no innerHTML vulnerabilities
- ✅ **Input Validation**: Client and server-side validation with express-validator
- ✅ **Rate Limiting**: API endpoint protection (100 req/15min per IP)
- ✅ **Security Headers**: Helmet.js with CSP, X-Frame-Options, etc.
- ✅ **CORS Whitelist**: Configurable allowed origins for production
- ✅ **Environment-based Security**: Strict mode in production
- ✅ **Financial Precision**: Cents-based calculations for accurate money handling
- ✅ **Secure Credentials**: Server-side API tokens, never exposed to client
- ✅ **CodeQL Scanning**: Automated security analysis in CI/CD

### DevOps & Automation 🤖
- ✅ **100% Automated CI/CD**: Multi-job pipeline (lint, security, tests, build)
- ✅ **Docker Support**: Multi-stage Dockerfile with non-root user
- ✅ **Docker Compose**: One-command deployment for dev and production
- ✅ **Automated Deployment**: GitHub Actions workflow for staging/production
- ✅ **Automated Releases**: Version management with changelog generation
- ✅ **CodeQL Security Scanning**: Weekly automated security analysis
- ✅ **Performance Testing**: Automated benchmarking on PRs and weekly
- ✅ **Health Monitoring**: Continuous monitoring with automatic alerts
- ✅ **Automated Dependency Updates**: Dependabot configuration
- ✅ **Pre-commit Hooks**: Husky + lint-staged for code quality
- ✅ **Code Quality**: ESLint + Prettier enforcement
- ✅ **Build-Configure-Test Script**: One-command setup and validation

### Monitoring & Logging 📊
- ✅ **Structured Logging**: Winston logger with JSON formatting
- ✅ **Request Tracking**: UUID-based request IDs
- ✅ **Performance Monitoring**: Request duration logging
- ✅ **Error Tracking**: Detailed error logs with context
- ✅ **Environment-aware**: Different log levels for dev/prod
- ✅ **Health Checks**: Built-in health endpoint and Docker health checks
- ✅ **Automated Monitoring**: Continuous health checking with alerts

### Performance ⚡
- ✅ **HTTP Caching**: Cache-Control headers on static files and API
- ✅ **ETags**: Efficient cache validation
- ✅ **Pagination**: Limit API responses for better performance
- ✅ **Static Asset Caching**: 1-day cache in production
- ✅ **Multi-platform Docker**: Optimized builds for amd64 and arm64


## 🚀 Quick Start

### Build-Configure-Test Workflow (Recommended)

For a comprehensive build, configure, and test cycle with automatic retry:

```bash
npm run build-configure-test
```

This workflow:
- 🔨 **Builds**: Installs dependencies with critical priority ("life and death matter")
- ⚙️ **Configures**: Sets up environment files and validates configuration
- 🧪 **Tests**: Runs security and integration tests with automatic server management
- ✅ **Quality**: Runs lint and formatting checks
- 🔄 **Retries**: Automatically repeats the entire workflow if any step fails (up to 3 attempts)

Perfect for:
- Initial setup and validation
- Pre-deployment checks
- CI/CD pipelines
- Verifying changes after updates

### Manual Setup

See [SETUP.md](SETUP.md) for detailed manual setup instructions.

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

## 📚 Documentation

- **[AUTOMATION.md](AUTOMATION.md)** - Complete guide to using automation features
- **[SETUP.md](SETUP.md)** - Detailed setup and deployment instructions
- **[SECURITY.md](SECURITY.md)** - Security guidelines and best practices
- **[CHANGELOG.md](CHANGELOG.md)** - Version history and changes

## 🛠️ Available Commands

```bash
# Development
npm start              # Start the server
npm run dev            # Start in development mode
npm run setup          # Run setup wizard
npm run build-configure-test # Automated setup, testing, and quality checks

# Build & Deploy
npm run build-configure-test  # Build, configure, and test workflow with retry

# Testing
npm test               # Run all tests
npm run test:security  # Run security tests
npm run test:integration # Run integration tests

# Code Quality
npm run lint           # Check code quality
npm run lint:fix       # Auto-fix linting issues
npm run format         # Format code with Prettier
npm run format:check   # Check code formatting
npm run ci             # Run all CI checks locally

# Docker
npm run docker:build   # Build Docker image
npm run docker:run     # Run with Docker Compose
npm run docker:stop    # Stop Docker containers
npm run docker:logs    # View Docker logs
npm run docker:prod    # Run in production mode

# Monitoring
npm run monitor        # Start health monitoring

# Automation
npm run automation:dashboard  # View automation status
npm run automation:validate   # Validate automation setup
```

## Contributing

Feel free to fork this project and customize it for your needs!

---

**Built with ❤️ for automated dropshipping with Printify**
