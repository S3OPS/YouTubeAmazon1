# YouTube Amazon Affiliate Automation Setup Guide

## ✅ System Overview

Your YouTube Amazon Affiliate Automation System uses a secure backend architecture:
- **Backend Server**: Node.js/Express (`server.js`)
- **API Credentials**: Stored in `.env` file (server-side)
- **Security**: API tokens never exposed to the browser
- **YouTube Integration**: OAuth2 authentication with YouTube Data API v3
- **Amazon Affiliate**: Automatic affiliate link generation

## 🚀 Quick Start

### Automated Setup (Recommended)

Run the YouTube setup wizard to configure your environment:

```bash
npm run setup:youtube
```

The setup wizard will:
✅ Create your `.env` file from the template  
✅ Validate your configuration  
✅ Provide step-by-step guidance  
✅ Show you where to get API credentials  
✅ Guide you through YouTube OAuth2 setup
✅ Configure Amazon affiliate settings

### Manual Setup

If you prefer manual setup, follow these steps:

### Step 1: Configure Environment Variables

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your YouTube and Amazon credentials:
   ```
   YOUTUBE_CLIENT_ID=your_youtube_client_id_here
   YOUTUBE_CLIENT_SECRET=your_youtube_client_secret_here
   YOUTUBE_REDIRECT_URI=http://localhost:3000/oauth2callback
   YOUTUBE_REFRESH_TOKEN=your_youtube_refresh_token_here
   AMAZON_AFFILIATE_TAG=your_affiliate_tag_here
   AUTO_UPLOAD=false
   UPLOAD_SCHEDULE=0 10 * * *
   PORT=3000
   ```

**Where to get your credentials:**
- **YouTube API**: https://console.cloud.google.com/ (Enable YouTube Data API v3)
- **Amazon Affiliate**: https://affiliate-program.amazon.com/

### Step 2: Get YouTube API Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/oauth2callback`
5. Copy the Client ID and Client Secret to your `.env` file
6. Run the setup wizard to get your refresh token:
   ```bash
   npm run setup:youtube
   ```

### Step 3: Configure Amazon Affiliate

1. Sign up for [Amazon Associates](https://affiliate-program.amazon.com/)
2. Get your affiliate tag from the dashboard
3. Add it to your `.env` file

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Start the Server

```bash
npm start
```

The server will start on http://localhost:3000

### Step 6: Access the System

Open your browser and go to:
```
http://localhost:3000
```

## 🔒 Security Features

✅ **API credentials stored server-side** in environment variables  
✅ **OAuth2 authentication** for YouTube API  
✅ **No credentials in client-side code**  
✅ **CORS properly configured**  
✅ **`.env` file excluded from git**  
✅ **Rate limiting** on all API endpoints  
✅ **Security headers** with Helmet.js

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

### Docker Deployment

Build and run with Docker:
```bash
npm run docker:build
npm run docker:run
```

For production:
```bash
npm run docker:prod
```

## 📝 Architecture Overview

```
AI Videos → Video Processor → YouTube API
                ↓
         Amazon Affiliate Links
                ↓
         Automated Upload
```

The system:
- Scans the `./videos/` directory for new AI-generated videos
- Processes video metadata and configuration files
- Generates Amazon affiliate links from product ASINs
- Injects affiliate links into video descriptions
- Uploads videos to YouTube with proper metadata
- Tracks all uploads and maintains processing history

## 🎨 Customization

### Automation Schedule

Edit `.env` to change the upload schedule:
```env
# Daily at 10 AM
UPLOAD_SCHEDULE=0 10 * * *

# Weekdays at 2 PM
UPLOAD_SCHEDULE=0 14 * * 1-5

# Every 6 hours
UPLOAD_SCHEDULE=0 */6 * * *
```

### Video Privacy Settings

```env
DEFAULT_PRIVACY_STATUS=public   # or unlisted, private
```

### Video Directory

```env
VIDEO_DIRECTORY=./videos
PROCESSED_VIDEO_DIRECTORY=./videos/processed
```

## 🧪 Testing the System

1. **Add Videos**: Place `.mp4` files in `./videos/` directory
2. **Add Config** (optional): Create `video-name.json` files:
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
3. **Trigger Processing**: 
   ```bash
   curl -X POST http://localhost:3000/api/automation/trigger
   ```
4. **Check Status**:
   ```bash
   curl http://localhost:3000/api/automation/status
   ```

## 🔧 Troubleshooting

### Videos Not Uploading
- Check YouTube API credentials in `.env`
- Verify OAuth2 refresh token is valid
- Ensure video format is supported (mp4, mov, avi, mkv, webm)
- Check server logs for errors

### Affiliate Links Not Working
- Verify `AMAZON_AFFILIATE_TAG` is set correctly
- Test link generation: `POST /api/affiliate/generate`
- Check that product ASINs/URLs are valid

### Scheduler Not Running
- Ensure `AUTO_UPLOAD=true` in `.env`
- Verify cron schedule format is correct
- Check server logs for scheduler errors
- Restart the server

### Authentication Issues
- Re-run `npm run setup:youtube` to refresh OAuth token
- Check that redirect URI matches in Google Cloud Console
- Verify YouTube Data API v3 is enabled

## 📚 Resources

- [YouTube Data API Documentation](https://developers.google.com/youtube/v3)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Amazon Associates Program](https://affiliate-program.amazon.com/)

## 🎉 You're All Set!

Your YouTube Amazon Affiliate Automation System is ready to use. Place your AI-generated videos in the `./videos/` directory and let the automation handle the rest!

For detailed usage and advanced features, refer to:
- [README.md](README.md) - Main documentation
- [YOUTUBE_AUTOMATION.md](YOUTUBE_AUTOMATION.md) - Complete automation guide
- [AUTOMATION.md](AUTOMATION.md) - CI/CD and DevOps automation
