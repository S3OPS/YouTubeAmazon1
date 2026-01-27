# Quick Start Guide - YouTube Amazon Affiliate Automation

## 🚀 Get Started in 5 Minutes

This guide will get you up and running with automated YouTube video uploads with Amazon affiliate links.

## Prerequisites

- Node.js v14+ installed
- YouTube account
- Amazon Associates account
- Google Cloud project with YouTube Data API v3 enabled

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Setup Wizard

```bash
npm run setup:youtube
```

The wizard will prompt you for:
- YouTube API credentials
- Amazon affiliate tag
- Automation preferences
- Directory paths

### 3. Get YouTube Credentials

#### A. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Create Project"
3. Name it (e.g., "YouTube Automation")
4. Click "Create"

#### B. Enable YouTube Data API v3

1. In your project, go to "APIs & Services" → "Library"
2. Search for "YouTube Data API v3"
3. Click "Enable"

#### C. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Configure consent screen if prompted
4. Application type: "Web application"
5. Add authorized redirect URI: `http://localhost:3000/oauth2callback`
6. Click "Create"
7. Copy **Client ID** and **Client Secret**

### 4. Get Amazon Affiliate Tag

1. Sign up at [Amazon Associates](https://affiliate-program.amazon.com/)
2. Complete the application
3. Once approved, get your affiliate tag from the dashboard
4. Format: `yourname-20` or similar

### 5. Configure Environment

Edit `.env` file (created by setup wizard):

```env
# YouTube API
YOUTUBE_CLIENT_ID=your_client_id_here
YOUTUBE_CLIENT_SECRET=your_client_secret_here
YOUTUBE_REFRESH_TOKEN=will_get_this_next

# Amazon Affiliate
AMAZON_AFFILIATE_TAG=yourname-20

# Automation
AUTO_UPLOAD=false  # Set to true when ready
UPLOAD_SCHEDULE=0 10 * * *
```

### 6. Get YouTube Refresh Token

```bash
# Start the server
npm start

# In a browser, visit:
http://localhost:3000/api/youtube/auth-url
```

This will give you an authorization URL. 

1. Copy the URL and open it in your browser
2. Sign in with your YouTube account
3. Grant permissions
4. You'll be redirected to `/oauth2callback`
5. **Copy the refresh token** shown on the page
6. Add it to your `.env` file:

```env
YOUTUBE_REFRESH_TOKEN=your_refresh_token_here
```

7. Restart the server

### 7. Test with a Sample Video

Create a test video or use a placeholder:

```bash
# Option 1: Create a test video config without actual video
cat > videos/test-video.json << 'EOF'
{
  "title": "Test Product Review",
  "description": "This is a test upload",
  "products": [
    {
      "name": "Test Product",
      "url": "B08C4KWM9T"
    }
  ],
  "tags": ["test", "review"]
}
EOF
```

### 8. Upload Manually (First Time)

```bash
# If you have an actual video file:
curl -X POST http://localhost:3000/api/youtube/upload \
  -H "Content-Type: application/json" \
  -d '{
    "filePath": "./videos/your-video.mp4",
    "title": "My First Automated Upload",
    "description": "Testing the automation",
    "products": [
      {"name": "Product 1", "url": "B08C4KWM9T"}
    ],
    "privacyStatus": "private"
  }'
```

**Note**: Use `"privacyStatus": "private"` for testing!

### 9. Enable Automation (Optional)

Once testing works, enable automatic uploads:

```env
# .env
AUTO_UPLOAD=true
UPLOAD_SCHEDULE=0 10 * * *  # Daily at 10 AM
```

Restart the server - videos will now upload automatically!

## Usage Patterns

### Pattern 1: Daily Automated Uploads

**Use Case**: Post one video every day at 10 AM

1. Set `AUTO_UPLOAD=true`
2. Set `UPLOAD_SCHEDULE=0 10 * * *`
3. Drop videos in `videos/` folder
4. System handles the rest!

### Pattern 2: Manual Batch Processing

**Use Case**: Process all videos when ready

1. Set `AUTO_UPLOAD=false`
2. Add multiple videos to `videos/` folder
3. Trigger manually:
   ```bash
   curl -X POST http://localhost:3000/api/automation/trigger
   ```

### Pattern 3: Scheduled Batches

**Use Case**: Upload 3 videos per week

1. Set `UPLOAD_SCHEDULE=0 10 * * 1,3,5` (Mon, Wed, Fri)
2. System uploads one video each scheduled time

## Video Configuration

### Simple Config

```json
{
  "title": "Product Review",
  "products": [
    {"name": "Product", "url": "B08XXXXX"}
  ]
}
```

### Complete Config

```json
{
  "title": "Complete Product Review - Top 5 Picks!",
  "description": "Detailed review of my favorite products",
  "products": [
    {"name": "Product 1", "url": "B08XXXXX"},
    {"name": "Product 2", "url": "B08YYYYY"},
    {"name": "Product 3", "url": "B08ZZZZZ"}
  ],
  "tags": [
    "product review",
    "amazon finds",
    "tech",
    "gadgets",
    "recommendations"
  ]
}
```

## Common Commands

```bash
# Start server
npm start

# Check automation status
curl http://localhost:3000/api/automation/status

# Scan for videos
curl http://localhost:3000/api/videos/scan

# Generate affiliate link
curl -X POST http://localhost:3000/api/affiliate/generate \
  -H "Content-Type: application/json" \
  -d '{"productUrl": "B08C4KWM9T"}'

# Trigger upload now
curl -X POST http://localhost:3000/api/automation/trigger

# Check health
curl http://localhost:3000/api/health
```

## Troubleshooting

### "YouTube API not configured"

- Check `YOUTUBE_CLIENT_ID` and `YOUTUBE_CLIENT_SECRET` in `.env`
- Verify YouTube Data API v3 is enabled in Google Cloud Console

### "Missing refresh token"

- Visit `http://localhost:3000/api/youtube/auth-url`
- Complete authorization flow
- Add refresh token to `.env`

### "Amazon affiliate tag missing"

- Check `AMAZON_AFFILIATE_TAG` in `.env`
- Verify you're enrolled in Amazon Associates program

### Videos not uploading

1. Check server logs for errors
2. Verify video file exists and is supported format
3. Ensure `AUTO_UPLOAD=true` if using automation
4. Check cron schedule format

### "File not found" errors

- Use absolute paths or paths relative to project root
- Verify video files are in `videos/` directory
- Check file permissions

## Next Steps

1. ✅ Complete setup
2. ✅ Test with private video
3. ✅ Create video configs
4. ✅ Test automation
5. 🚀 Go live with `privacyStatus: "public"`

## Resources

- [YOUTUBE_AUTOMATION.md](YOUTUBE_AUTOMATION.md) - Complete documentation
- [videos/README.md](videos/README.md) - Video configuration guide
- [.env.example](.env.example) - All configuration options

## Support

- Check logs: Server output shows detailed information
- Review API responses: Use `-v` flag with curl for details
- Test incrementally: Start with manual uploads, then automation

---

**Ready to automate? Let's go! 🚀**
