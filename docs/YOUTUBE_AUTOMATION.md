# YouTube Amazon Affiliate Automation System

## 🎬 Overview

This is a **100% fully automated system** for adding Amazon affiliate links to AI-generated short videos and automatically posting them to YouTube. The system handles video processing, affiliate link injection, scheduled uploads, and complete automation.

## 🌟 Key Features

### Automation Features 🤖
- ✅ **Automatic Video Processing**: Scans directory for new AI-generated videos
- ✅ **Affiliate Link Injection**: Automatically adds Amazon affiliate links to video descriptions
- ✅ **Scheduled YouTube Uploads**: Configurable cron-based scheduling
- ✅ **Batch Processing**: Process multiple videos at once
- ✅ **Auto-Cleanup**: Removes old processed files automatically
- ✅ **Metadata Management**: Tracks processed videos and upload status
- ✅ **Error Handling**: Robust error handling with detailed logging

### YouTube Integration 🎥
- ✅ **OAuth2 Authentication**: Secure YouTube API authentication
- ✅ **Video Uploads**: Automated video uploads with metadata
- ✅ **Custom Metadata**: Title, description, tags customization
- ✅ **Privacy Controls**: Public, unlisted, or private video options
- ✅ **Video Management**: Update, retrieve, and delete videos

### Amazon Affiliate 💰
- ✅ **Link Generation**: Automatic affiliate link generation from ASINs or URLs
- ✅ **Batch Link Creation**: Generate multiple affiliate links at once
- ✅ **Description Formatting**: Professional product descriptions with links
- ✅ **Disclaimer Integration**: Automatic FTC-compliant disclaimers
- ✅ **Link Validation**: Verify affiliate links are properly formatted

### Video Processing 📹
- ✅ **Auto-Discovery**: Scans video directory for new content
- ✅ **Metadata Extraction**: Reads video file information
- ✅ **JSON Configuration**: Per-video configuration support
- ✅ **Product Integration**: Links products to video descriptions
- ✅ **Tag Enhancement**: Automatic tag optimization for SEO

### Monitoring & Logging 📊
- ✅ **Structured Logging**: Winston-based logging with JSON format
- ✅ **Request Tracking**: UUID-based request tracking
- ✅ **Performance Monitoring**: Upload duration and success tracking
- ✅ **Error Tracking**: Detailed error logs with context
- ✅ **Status Dashboard**: Real-time automation status

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v14 or higher)
2. **YouTube Account** with API access
3. **Amazon Associates Account** with affiliate tag
4. **Google Cloud Project** with YouTube Data API v3 enabled

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd 666
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Set up YouTube API**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable YouTube Data API v3
   - Create OAuth 2.0 credentials
   - Add credentials to `.env`

5. **Get YouTube Refresh Token**
   ```bash
   npm start
   # Visit http://localhost:3000/api/youtube/auth-url
   # Follow authorization flow
   # Copy refresh token to .env
   ```

6. **Configure Amazon Affiliate**
   - Sign up at [Amazon Associates](https://affiliate-program.amazon.com/)
   - Get your affiliate tag
   - Add to `.env` file

7. **Create video directories**
   ```bash
   mkdir -p videos/processed
   ```

8. **Start the server**
   ```bash
   npm start
   ```

## 📖 Usage Guide

### Automated Workflow

#### 1. Prepare Videos

Place your AI-generated videos in the `videos/` directory:
```
videos/
  ├── product-review-1.mp4
  ├── product-review-2.mp4
  └── product-review-3.mp4
```

#### 2. Create Video Configuration (Optional)

Create a JSON file for each video with the same name:
```json
// videos/product-review-1.json
{
  "title": "Amazing Product Review - Must See!",
  "description": "Check out this incredible product!",
  "products": [
    {
      "name": "Product Name",
      "url": "B08XXXXX"
    }
  ],
  "tags": ["product review", "tech", "gadgets"]
}
```

#### 3. Enable Automation

Update `.env`:
```env
AUTO_UPLOAD=true
UPLOAD_SCHEDULE=0 10 * * *  # Daily at 10 AM
```

Restart server - videos will be processed and uploaded automatically!

### Manual Processing

#### Upload a Single Video

```bash
curl -X POST http://localhost:3000/api/youtube/upload \
  -H "Content-Type: application/json" \
  -d '{
    "filePath": "./videos/my-video.mp4",
    "title": "My Video Title",
    "description": "Video description",
    "products": [
      {
        "name": "Product 1",
        "url": "B08XXXXX"
      }
    ],
    "tags": ["review", "tech"],
    "privacyStatus": "public"
  }'
```

#### Trigger Processing Now

```bash
curl -X POST http://localhost:3000/api/automation/trigger
```

#### Generate Affiliate Link

```bash
curl -X POST http://localhost:3000/api/affiliate/generate \
  -H "Content-Type: application/json" \
  -d '{
    "productUrl": "B08XXXXX",
    "campaign": "youtube-videos"
  }'
```

#### Check Automation Status

```bash
curl http://localhost:3000/api/automation/status
```

## 🔧 Configuration

### Environment Variables

See `.env.example` for all available configuration options.

#### YouTube Configuration
```env
YOUTUBE_CLIENT_ID=your_client_id
YOUTUBE_CLIENT_SECRET=your_client_secret
YOUTUBE_REFRESH_TOKEN=your_refresh_token
```

#### Amazon Configuration
```env
AMAZON_AFFILIATE_TAG=your_tag_here
```

#### Automation Settings
```env
AUTO_UPLOAD=true
UPLOAD_SCHEDULE=0 10 * * *
DEFAULT_PRIVACY_STATUS=public
VIDEO_DIRECTORY=./videos
```

### Upload Schedule (Cron Format)

- `0 10 * * *` - Daily at 10 AM
- `0 14 * * 1-5` - Weekdays at 2 PM
- `0 */6 * * *` - Every 6 hours
- `0 9,17 * * *` - Twice daily at 9 AM and 5 PM

## 📁 Project Structure

```
.
├── youtube-api.js              # YouTube API integration
├── amazon-affiliate.js         # Amazon affiliate link management
├── video-processor.js          # Video processing and metadata
├── automation-scheduler.js     # Cron-based automation
├── server.js                   # Express API server
├── logger.js                   # Winston logging configuration
├── package.json                # Dependencies and scripts
├── .env.example                # Environment template
├── videos/                     # AI-generated videos
│   ├── *.mp4                   # Video files
│   ├── *.json                  # Video configurations
│   └── processed/              # Processed metadata
├── YOUTUBE_AUTOMATION.md       # This file
└── README.md                   # General documentation
```

## 🔌 API Endpoints

### Automation Endpoints

#### `GET /api/automation/status`
Get automation scheduler status

#### `POST /api/automation/trigger`
Manually trigger video processing and upload

### YouTube Endpoints

#### `POST /api/youtube/upload`
Upload a video to YouTube with affiliate links

**Body:**
```json
{
  "filePath": "./videos/video.mp4",
  "title": "Video Title",
  "description": "Description",
  "products": [...],
  "tags": [...],
  "privacyStatus": "public"
}
```

#### `GET /api/youtube/auth-url`
Get YouTube OAuth authorization URL

#### `GET /oauth2callback`
OAuth2 callback handler (used during setup)

### Affiliate Endpoints

#### `POST /api/affiliate/generate`
Generate Amazon affiliate link

**Body:**
```json
{
  "productUrl": "B08XXXXX",
  "campaign": "youtube",
  "content": "video-1"
}
```

### Video Endpoints

#### `GET /api/videos/scan`
Scan video directory for new videos

## 🎯 Workflow Examples

### Example 1: Daily Automated Uploads

1. **Setup**: Configure `.env` with `AUTO_UPLOAD=true` and `UPLOAD_SCHEDULE=0 10 * * *`
2. **Add Videos**: Drop AI-generated videos into `videos/` folder
3. **Add Config**: Create companion JSON files with product information
4. **Auto-Process**: System automatically processes and uploads at 10 AM daily
5. **Monitor**: Check logs for upload status

### Example 2: Manual Batch Processing

```javascript
// Process all videos in directory
const response = await fetch('http://localhost:3000/api/automation/trigger', {
  method: 'POST'
});
const results = await response.json();
console.log(`Uploaded ${results.results.uploaded} videos`);
```

### Example 3: Custom Video Upload

```javascript
// Upload with custom settings
const response = await fetch('http://localhost:3000/api/youtube/upload', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    filePath: './videos/special-video.mp4',
    title: 'Special Product Review',
    description: 'Custom description',
    products: [
      { name: 'Product A', url: 'B08AAAAA' },
      { name: 'Product B', url: 'B08BBBBB' }
    ],
    tags: ['review', 'tech', 'amazon'],
    privacyStatus: 'unlisted'
  })
});
```

## 🔐 Security Best Practices

### API Credentials
- ✅ **Never commit** `.env` file
- ✅ **Use environment variables** for all secrets
- ✅ **Rotate tokens** regularly
- ✅ **Limit OAuth scopes** to minimum required

### File Security
- ✅ **Validate file paths** to prevent directory traversal
- ✅ **Check file extensions** before processing
- ✅ **Set proper permissions** on video directories
- ✅ **Clean up** processed files regularly

### Server Security
- ✅ **Use HTTPS** in production
- ✅ **Enable rate limiting** on API endpoints
- ✅ **Implement CORS** whitelist
- ✅ **Regular security updates**

## 📊 Monitoring

### Logs

Check application logs:
```bash
# View real-time logs
npm start

# Logs include:
# - Video processing status
# - Upload success/failures
# - Affiliate link generation
# - Automation scheduler events
```

### Status Dashboard

```bash
# Check automation status
curl http://localhost:3000/api/automation/status

# Response:
{
  "running": true,
  "autoUpload": true,
  "uploadSchedule": "0 10 * * *",
  "activeJobs": 2
}
```

## 🐛 Troubleshooting

### Videos Not Uploading

1. **Check YouTube API credentials**
   ```bash
   curl http://localhost:3000/api/youtube/auth-url
   # Re-authorize if needed
   ```

2. **Verify video file format**
   - Supported: .mp4, .mov, .avi, .mkv, .webm
   - Check file permissions

3. **Check logs**
   - Look for error messages
   - Verify file paths are correct

### Affiliate Links Not Working

1. **Verify affiliate tag**
   ```bash
   # Check .env file
   grep AMAZON_AFFILIATE_TAG .env
   ```

2. **Test link generation**
   ```bash
   curl -X POST http://localhost:3000/api/affiliate/generate \
     -H "Content-Type: application/json" \
     -d '{"productUrl": "B08XXXXX"}'
   ```

### Scheduler Not Running

1. **Check AUTO_UPLOAD setting**
   ```env
   AUTO_UPLOAD=true
   ```

2. **Verify cron schedule**
   ```env
   UPLOAD_SCHEDULE=0 10 * * *
   ```

3. **Restart server**
   ```bash
   npm start
   ```

## 🚀 Deployment

### Docker Deployment

```bash
# Build image
docker build -t youtube-automation .

# Run container
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/videos:/app/videos \
  -v $(pwd)/.env:/app/.env \
  --name youtube-automation \
  youtube-automation
```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS with SSL certificate
- [ ] Configure firewall rules
- [ ] Set up monitoring and alerts
- [ ] Enable automated backups
- [ ] Configure log rotation
- [ ] Set resource limits
- [ ] Test automation schedule

## 📈 Performance Optimization

### Video Processing
- Process videos in batches
- Use efficient video formats (MP4)
- Limit concurrent uploads
- Clean up old files regularly

### API Optimization
- Implement request caching
- Use connection pooling
- Enable compression
- Monitor rate limits

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

See LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Review logs for error messages
3. Open an issue on GitHub

## 🎓 Resources

### YouTube API
- [YouTube Data API v3](https://developers.google.com/youtube/v3)
- [OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Video Upload Guide](https://developers.google.com/youtube/v3/guides/uploading_a_video)

### Amazon Associates
- [Amazon Associates Program](https://affiliate-program.amazon.com/)
- [Product Advertising API](https://webservices.amazon.com/paapi5/documentation/)
- [Operating Agreement](https://affiliate-program.amazon.com/help/operating/agreement)

### Automation
- [Node-cron Documentation](https://github.com/node-cron/node-cron)
- [Cron Expression Generator](https://crontab.guru/)

---

**Built for 100% Automated YouTube & Amazon Affiliate Video Marketing** 🎬💰
