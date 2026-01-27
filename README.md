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

**Built for 100% Automated YouTube & Amazon Affiliate Video Marketing** 🎬💰

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
