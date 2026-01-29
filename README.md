# YouTube Amazon Affiliate Automation System

**100% Fully Automated System with Automatic Video Generation**

This application provides a complete automation solution that **automatically generates videos** from product configurations, adds Amazon affiliate links, and posts them to YouTube. Built with enterprise-grade security, monitoring, and automation features using **free, open-source tools**.

## 🎬 Primary Features - YouTube Automation

### Video Generation 🎥 (NEW!)
- ✅ **Automatic Video Creation**: Generate videos from JSON configurations
- ✅ **Text-to-Speech Narration**: Optional voice narration using free tools
- ✅ **Slide-based Videos**: Create product showcase videos automatically
- ✅ **Customizable Templates**: Configure video dimensions, duration, and styling
- ✅ **Batch Generation**: Create multiple videos from configurations
- ✅ **Free Tools**: Uses FFmpeg, ImageMagick, and espeak (all free)

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

## 🚀 Quick Start

### One-Command Setup (Automated)

```bash
npm run build-configure-test
```

This automated workflow will install, configure, and test your system in ~3-5 minutes.

### Manual Setup

```bash
# 1. Install dependencies
npm install

# 2. Setup video generation (installs FFmpeg and other tools)
npm run setup:video-generation

# 3. Run setup wizard
npm run setup:youtube

# 4. Start the server
npm start
```

### 📖 Complete Installation Guide

For detailed step-by-step instructions including API credential setup, configuration options, deployment, and troubleshooting, see:

**➡️ [INSTALLATION.md](INSTALLATION.md) - Complete Installation & Setup Guide**

This comprehensive guide covers:
- Prerequisites and system requirements
- Getting YouTube API credentials
- Getting Amazon Associates credentials
- Configuration options
- Deployment to various platforms
- Troubleshooting common issues
- Testing and verification

## 📖 Usage

### Automated Workflow with Video Generation (NEW!)

1. **Create product configs** in `./videos/` directory:
   ```json
   {
     "title": "Top 5 Gaming Accessories 2024",
     "description": "Best gaming gear for serious gamers!",
     "products": [
       { "name": "Gaming Mouse RGB", "url": "B08XXXXX" },
       { "name": "Mechanical Keyboard", "url": "B08YYYYY" }
     ],
     "tags": ["gaming", "review", "tech"]
   }
   ```

2. **Generate videos automatically**:
   ```bash
   # Generate videos from all JSON configs
   curl -X POST http://localhost:3000/api/videos/generate-from-configs
   ```

3. **Let it run** - Videos are automatically processed and uploaded per schedule!

### Alternative: Use Pre-existing Videos

1. **Place videos** in `./videos/` directory
2. **Create config** files (optional): `video-name.json`
3. **Let automation run** - Videos are automatically processed and uploaded!

### Manual Operations

```bash
# Generate a single video
curl -X POST http://localhost:3000/api/videos/generate \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Product Review",
    "products": [{"name": "Product", "url": "B08XXXXX"}],
    "tags": ["review", "tech"]
  }'

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

### Video Generation (NEW!)
- `POST /api/videos/generate` - Generate video from configuration
- `POST /api/videos/generate-from-configs` - Generate videos from all JSON files
- `POST /api/videos/generate-with-narration` - Generate video with voice narration

### YouTube Automation
- `GET /api/automation/status` - Get automation status
- `POST /api/automation/trigger` - Manually trigger processing
- `POST /api/youtube/upload` - Upload video with affiliate links
- `GET /api/youtube/auth-url` - Get OAuth authorization URL
- `GET /api/videos/scan` - Scan for new videos

### Amazon Affiliate
- `POST /api/affiliate/generate` - Generate affiliate link

### Data Cleanup
- `GET /api/cleanup/scan` - Scan for irrelevant data (orphaned configs, stale files, temp files)
- `GET /api/cleanup/status` - Get cleanup status and summary
- `POST /api/cleanup/archive` - Archive irrelevant data to archive directory
- `POST /api/cleanup/erase` - Permanently delete irrelevant data

### System
- `GET /api/health` - Health check endpoint

## 📁 Project Structure

```
.
├── youtube-api.js              # YouTube API integration
├── amazon-affiliate.js         # Amazon affiliate management
├── video-processor.js          # Video processing engine
├── automation-scheduler.js     # Cron-based scheduler
├── data-cleanup.js             # Data cleanup utility
├── server.js                   # Express API server
├── video-generator.js          # Video generation engine (NEW!)
├── setup-youtube.js            # Setup wizard
├── setup-video-generation.sh   # Video generation setup (NEW!)
├── videos/                     # Video directory
│   ├── *.mp4                   # AI-generated videos
│   ├── *.json                  # Video configs
│   └── processed/              # Metadata storage
├── temp/                       # Temporary files for video generation (NEW!)
├── archive/                    # Archived irrelevant data
├── VIDEO_GENERATION.md         # Video generation guide (NEW!)
└── YOUTUBE_AUTOMATION.md       # Detailed documentation
```

## ⚙️ Configuration

### Video Generation Settings

```env
# Video dimensions
VIDEO_WIDTH=1920          # Width in pixels (default: 1920)
VIDEO_HEIGHT=1080         # Height in pixels (default: 1080)

# Video settings
VIDEO_FPS=30              # Frames per second (default: 30)
SLIDE_DURATION=3          # Seconds per slide (default: 3)

# Directories
TEMP_DIRECTORY=./temp     # Temporary files directory
```

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

- **[VIDEO_GENERATION.md](VIDEO_GENERATION.md)** - Complete video generation guide (NEW!)
- **[INSTALLATION.md](INSTALLATION.md)** - Complete installation and setup guide
- **[YOUTUBE_AUTOMATION.md](YOUTUBE_AUTOMATION.md)** - Complete YouTube automation guide
- **[AUTOMATION.md](AUTOMATION.md)** - CI/CD and DevOps automation
- **[SECURITY.md](SECURITY.md)** - Security guidelines and best practices
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Extended troubleshooting guide

## 🎯 Example Workflows

### Complete Automated Workflow (with Video Generation)
```bash
# 1. Create product configuration
cat > videos/gaming-products.json << 'EOF'
{
  "title": "Top 5 Gaming Accessories 2024",
  "description": "Best gaming gear!",
  "products": [
    {"name": "Gaming Mouse", "url": "B08XXXXX"},
    {"name": "Mechanical Keyboard", "url": "B08YYYYY"}
  ],
  "tags": ["gaming", "tech", "review"]
}
EOF

# 2. Generate video
curl -X POST http://localhost:3000/api/videos/generate-from-configs

# 3. Videos are automatically uploaded per schedule (or trigger now)
curl -X POST http://localhost:3000/api/automation/trigger
```

### Daily Automated Uploads
```bash
# 1. Configure schedule
echo "AUTO_UPLOAD=true" >> .env
echo "UPLOAD_SCHEDULE=0 10 * * *" >> .env

# 2. Create video configs OR add videos to directory
# Option A: Generate videos from configs
curl -X POST http://localhost:3000/api/videos/generate-from-configs

# Option B: Add pre-made videos
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

- **[INSTALLATION.md](INSTALLATION.md)** - Complete installation and setup guide
- **[AUTOMATION.md](AUTOMATION.md)** - Complete guide to using automation features
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

# Data Cleanup
npm run cleanup:scan   # Scan for irrelevant data
npm run cleanup:archive # Archive irrelevant data
npm run cleanup:erase  # Permanently delete irrelevant data
```

## Contributing

Feel free to fork this project and customize it for your needs!

---

**Built with ❤️ for 100% Automated YouTube & Amazon Affiliate Video Marketing** 🎬💰
