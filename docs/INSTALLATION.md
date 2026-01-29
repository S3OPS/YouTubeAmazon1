# Installation & Setup Guide

**Complete step-by-step guide to install, configure, and run the YouTube Amazon Affiliate Automation System**

This guide consolidates all setup, configuration, and installation instructions into a single sequential workflow. Follow these steps in order for a successful setup.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (Automated Setup)](#quick-start-automated-setup)
3. [Manual Installation](#manual-installation)
4. [Configuration](#configuration)
5. [Getting API Credentials](#getting-api-credentials)
6. [Starting the System](#starting-the-system)
7. [Testing Your Setup](#testing-your-setup)
8. [Deployment Options](#deployment-options)
9. [Troubleshooting](#troubleshooting)
10. [Next Steps](#next-steps)

---

## Prerequisites

Before you begin, ensure you have the following:

### Required Software
- ✅ **Node.js v14+** - [Download](https://nodejs.org/)
- ✅ **npm v6+** - Comes with Node.js
- ✅ **Git** - For version control

### Required Accounts
- ✅ **YouTube Account** - [Create one](https://www.youtube.com/)
- ✅ **Google Cloud Project** - [Console](https://console.cloud.google.com/)
- ✅ **Amazon Associates Account** - [Sign up](https://affiliate-program.amazon.com/)

### Verify Prerequisites

```bash
# Check Node.js version
node --version  # Should be v14 or higher

# Check npm version
npm --version   # Should be v6 or higher

# Check Git
git --version
```

---

## Quick Start (Automated Setup)

**Recommended for most users** - This automated workflow handles everything for you.

### One-Command Setup

```bash
npm run build-configure-test
```

This single command will:
- ✅ Check system requirements (Node.js, npm)
- ✅ Install all dependencies
- ✅ Run the setup wizard (creates `.env` file)
- ✅ Validate your configuration
- ✅ Run security and integration tests
- ✅ Run lint and formatting checks
- ✅ Retry up to 3 times on failure

**Time to complete:** ~3-5 minutes

### Alternative Quick Setup

If you want more control over each step:

```bash
# Step 1: Install dependencies
npm install

# Step 2: Run setup wizard
npm run setup:youtube

# Step 3: Start the server
npm start
```

Once the automated setup completes, skip to [Testing Your Setup](#testing-your-setup).

---

## Manual Installation

Follow these steps if you prefer manual configuration or the automated setup doesn't work for your environment.

### Step 1: Clone the Repository

```bash
git clone https://github.com/S3OPS/666.git
cd 666
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required Node.js packages including:
- Express.js - Web server framework
- Google APIs - YouTube integration
- Node-cron - Scheduling automation
- Helmet.js - Security headers
- And more...

### Step 3: Install Video Generation Tools (Optional but Recommended)

To enable automatic video generation from product configurations, install the required tools:

```bash
npm run setup:video-generation
```

This will install:
- **FFmpeg** - Video composition and encoding (required for video generation)
- **ImageMagick** - High-quality text rendering (optional, improves quality)
- **espeak** - Text-to-speech narration (optional, for voice narration)

**Manual Installation (if automated setup fails):**

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y ffmpeg imagemagick espeak
```

**macOS:**
```bash
brew install ffmpeg imagemagick espeak
```

**Windows:**
- FFmpeg: https://ffmpeg.org/download.html
- ImageMagick: https://imagemagick.org/script/download.php
- espeak: http://espeak.sourceforge.net/

**Skip this step** if you plan to use pre-made videos instead of generating them automatically.

### Step 4: Create Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

This creates your configuration file that will store all your API credentials and settings.

---

## Configuration

### Understanding the .env File

The `.env` file contains all your configuration settings. Here's what each section does:

#### YouTube API Configuration

```env
YOUTUBE_CLIENT_ID=your_youtube_client_id_here
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret_here
YOUTUBE_REDIRECT_URI=http://localhost:3000/oauth2callback
YOUTUBE_REFRESH_TOKEN=your_youtube_refresh_token_here
```

**Purpose:** Authenticates your application with YouTube to upload videos.

#### Amazon Affiliate Configuration

```env
AMAZON_AFFILIATE_TAG=your_affiliate_tag_here
AMAZON_TRACKING_ID=your_tracking_id_here
```

**Purpose:** Generates affiliate links for products in your video descriptions.

#### Video Processing Configuration

```env
VIDEO_DIRECTORY=./videos
PROCESSED_VIDEO_DIRECTORY=./videos/processed
```

**Purpose:** Defines where to find videos and where to store processing metadata.

#### Video Generation Configuration (NEW!)

```env
TEMP_DIRECTORY=./temp
VIDEO_WIDTH=1920
VIDEO_HEIGHT=1080
VIDEO_FPS=30
SLIDE_DURATION=3
```

**Purpose:** Controls automatic video generation settings.

**Settings Explained:**
- `VIDEO_WIDTH/HEIGHT` - Video resolution (1920x1080 = 1080p, 1280x720 = 720p)
- `VIDEO_FPS` - Frame rate (24-60 fps, 30 is standard)
- `SLIDE_DURATION` - How many seconds each product slide shows (2-5 seconds)

**Skip this section** if not using video generation.

#### Automation Configuration

```env
AUTO_UPLOAD=false
UPLOAD_SCHEDULE=0 10 * * *
DEFAULT_PRIVACY_STATUS=public
```

**Purpose:** Controls automatic video uploads and scheduling.

**Schedule Examples:**
- `0 10 * * *` - Daily at 10 AM
- `0 14 * * 1-5` - Weekdays at 2 PM
- `0 */6 * * *` - Every 6 hours

**Privacy Options:** `public`, `unlisted`, or `private`

#### Server Configuration

```env
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

**Purpose:** Server port, environment, and CORS settings.

---

## Getting API Credentials

This section provides detailed instructions for obtaining all required API credentials.

### Step 1: Get YouTube API Credentials

#### A. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Enter a project name (e.g., "YouTube Automation")
4. Click **"Create"**
5. Wait for the project to be created

#### B. Enable YouTube Data API v3

1. In your project dashboard, go to **"APIs & Services"** → **"Library"**
2. Search for **"YouTube Data API v3"**
3. Click on it, then click **"Enable"**
4. Wait for the API to be enabled

#### C. Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
3. If prompted, configure the consent screen:
   - Click **"Configure Consent Screen"**
   - Select **"External"** (or Internal if using Google Workspace)
   - Fill in application name and your email
   - Click **"Save and Continue"** through the steps
4. Return to **"Credentials"** → **"Create Credentials"** → **"OAuth 2.0 Client ID"**
5. Select **"Web application"** as the application type
6. Add **Authorized redirect URI**: `http://localhost:3000/oauth2callback`
7. Click **"Create"**
8. **Copy the Client ID and Client Secret** - you'll need these!

#### D. Add Credentials to .env

Edit your `.env` file and add:

```env
YOUTUBE_CLIENT_ID=your_copied_client_id
YOUTUBE_CLIENT_SECRET=your_copied_client_secret
YOUTUBE_REDIRECT_URI=http://localhost:3000/oauth2callback
```

#### E. Get YouTube Refresh Token

**Important:** You must complete this step to enable YouTube uploads.

1. Start the server:
   ```bash
   npm start
   ```

2. In your browser, visit:
   ```
   http://localhost:3000/api/youtube/auth-url
   ```

3. The page will display an authorization URL. **Copy this URL**.

4. Open the authorization URL in your browser.

5. Sign in with your **YouTube account**.

6. Grant the requested permissions.

7. You'll be redirected to `http://localhost:3000/oauth2callback`

8. The page will display your **refresh token**. Copy it!

9. Add the refresh token to your `.env` file:
   ```env
   YOUTUBE_REFRESH_TOKEN=your_copied_refresh_token
   ```

10. **Restart the server** for changes to take effect:
    ```bash
    # Press Ctrl+C to stop, then:
    npm start
    ```

### Step 2: Get Amazon Affiliate Credentials

#### A. Sign Up for Amazon Associates

1. Go to [Amazon Associates](https://affiliate-program.amazon.com/)
2. Click **"Join Now for Free"**
3. Sign in with your Amazon account or create a new one
4. Complete the application form:
   - Enter your website or mobile app information
   - Describe how you'll use affiliate links
   - Enter your payment and tax information
5. Submit your application

#### B. Get Your Affiliate Tag

1. Once approved, log in to your Amazon Associates account
2. Go to **"Product Linking"** → **"Product Links"**
3. Your affiliate tag is displayed in the format: `yourname-20`
4. Copy your affiliate tag

#### C. Add to .env

Edit your `.env` file:

```env
AMAZON_AFFILIATE_TAG=yourname-20
AMAZON_TRACKING_ID=yourname-20
```

---

## Starting the System

### Development Mode

Start the server in development mode:

```bash
npm start
```

The server will start on `http://localhost:3000`

You should see output like:
```
Server running on port 3000
YouTube Automation: Ready
Amazon Affiliate: Configured
Scheduler: Initialized
```

### Production Mode

For production deployment:

```bash
NODE_ENV=production npm start
```

### Using Docker

Build and run with Docker:

```bash
# Build Docker image
npm run docker:build

# Run with Docker Compose
npm run docker:run

# For production
npm run docker:prod
```

### Monitoring

Start continuous health monitoring:

```bash
npm run monitor
```

This runs automated health checks every 60 seconds.

---

## Testing Your Setup

### Step 1: Verify Server is Running

Open your browser and go to:
```
http://localhost:3000
```

You should see the web interface.

### Step 2: Check Health Endpoint

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Step 3: Check Automation Status

```bash
curl http://localhost:3000/api/automation/status
```

Expected response includes:
```json
{
  "schedulerRunning": true,
  "autoUploadEnabled": false,
  "schedule": "0 10 * * *"
}
```

### Step 4: Run Test Suite

Run all tests to verify your setup:

```bash
# All tests
npm test

# Security tests only
npm run test:security

# Integration tests only
npm run test:integration
```

Expected: All tests pass ✅

### Step 5: Test Video Processing (Without Upload)

Create a test video configuration:

```bash
cat > videos/test-video.json << 'EOF'
{
  "title": "Test Product Review",
  "description": "This is a test configuration",
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

Scan for videos:

```bash
curl http://localhost:3000/api/videos/scan
```

### Step 6: Test Affiliate Link Generation

```bash
curl -X POST http://localhost:3000/api/affiliate/generate \
  -H "Content-Type: application/json" \
  -d '{"productUrl": "B08C4KWM9T"}'
```

Expected response:
```json
{
  "affiliateUrl": "https://www.amazon.com/dp/B08C4KWM9T?tag=yourname-20"
}
```

### Step 7: Test Manual Upload (Private Video)

**Important:** Use private mode for testing!

If you have a test video file:

```bash
curl -X POST http://localhost:3000/api/youtube/upload \
  -H "Content-Type: application/json" \
  -d '{
    "filePath": "./videos/test-video.mp4",
    "title": "Test Upload - Private",
    "description": "Testing the automation system",
    "products": [
      {"name": "Test Product", "url": "B08C4KWM9T"}
    ],
    "privacyStatus": "private"
  }'
```

Check your YouTube channel to verify the video was uploaded as private.

---

## Deployment Options

### Option 1: Heroku (Recommended for Node.js)

1. **Sign up** at [https://heroku.com](https://heroku.com)

2. **Install Heroku CLI**:
   ```bash
   # On macOS
   brew tap heroku/brew && brew install heroku
   
   # On Ubuntu
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

3. **Login and create app**:
   ```bash
   heroku login
   heroku create your-app-name
   ```

4. **Set environment variables**:
   ```bash
   heroku config:set YOUTUBE_CLIENT_ID=your_client_id
   heroku config:set YOUTUBE_CLIENT_SECRET=your_client_secret
   heroku config:set YOUTUBE_REFRESH_TOKEN=your_refresh_token
   heroku config:set AMAZON_AFFILIATE_TAG=your_tag
   # ... set all other variables
   ```

5. **Deploy**:
   ```bash
   git push heroku main
   ```

6. **Open your app**:
   ```bash
   heroku open
   ```

### Option 2: DigitalOcean App Platform

1. Sign up at [https://digitalocean.com](https://digitalocean.com)
2. Click **"Create"** → **"Apps"**
3. Connect your GitHub repository
4. Configure environment variables in the dashboard
5. Deploy - automatic deployments on push!

### Option 3: AWS Elastic Beanstalk

1. Install AWS CLI and EB CLI
2. Configure AWS credentials
3. Initialize Elastic Beanstalk:
   ```bash
   eb init -p node.js your-app-name
   ```
4. Create environment:
   ```bash
   eb create your-environment
   ```
5. Set environment variables in AWS console
6. Deploy:
   ```bash
   eb deploy
   ```

### Option 4: VPS (DigitalOcean, Linode, Vultr)

1. **Create a Linux server** (Ubuntu 20.04+ recommended)

2. **SSH into your server**:
   ```bash
   ssh root@your_server_ip
   ```

3. **Install Node.js**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Install PM2** (process manager):
   ```bash
   sudo npm install -g pm2
   ```

5. **Clone and setup**:
   ```bash
   git clone https://github.com/S3OPS/666.git
   cd 666
   npm install
   cp .env.example .env
   # Edit .env with your credentials
   nano .env
   ```

6. **Start with PM2**:
   ```bash
   pm2 start server.js --name youtube-automation
   pm2 startup
   pm2 save
   ```

7. **Setup Nginx** (optional, for HTTPS):
   ```bash
   sudo apt-get install nginx
   # Configure nginx as reverse proxy
   ```

### Docker Deployment

**Development:**
```bash
npm run docker:run
```

**Production:**
```bash
npm run docker:prod
```

**Manual Docker:**
```bash
docker build -t youtube-automation .
docker run -d -p 3000:3000 \
  -v $(pwd)/videos:/app/videos \
  -v $(pwd)/.env:/app/.env \
  youtube-automation
```

---

## Troubleshooting

### Videos Not Uploading

**Problem:** Videos are not being uploaded to YouTube

**Solutions:**

1. **Check YouTube API credentials**
   ```bash
   # Verify credentials are in .env
   grep YOUTUBE .env
   ```

2. **Verify OAuth2 refresh token**
   - Re-run authorization: Visit `http://localhost:3000/api/youtube/auth-url`
   - Complete the flow and update `YOUTUBE_REFRESH_TOKEN` in `.env`

3. **Ensure video format is supported**
   - Supported: `.mp4`, `.mov`, `.avi`, `.mkv`, `.webm`
   - Recommended: `.mp4` with H.264 codec

4. **Check server logs**
   ```bash
   # Look for error messages in console output
   ```

5. **Verify YouTube Data API v3 is enabled**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Check "APIs & Services" → "Enabled APIs"

### Affiliate Links Not Working

**Problem:** Amazon affiliate links are not being generated

**Solutions:**

1. **Verify affiliate tag**
   ```bash
   grep AMAZON_AFFILIATE_TAG .env
   ```

2. **Test link generation**
   ```bash
   curl -X POST http://localhost:3000/api/affiliate/generate \
     -H "Content-Type: application/json" \
     -d '{"productUrl": "B08C4KWM9T"}'
   ```

3. **Check ASIN format**
   - Valid: `B08C4KWM9T` (alphanumeric, 10 characters)
   - Can also use full Amazon URL

4. **Verify Amazon Associates account is active**
   - Log in to [Amazon Associates](https://affiliate-program.amazon.com/)
   - Ensure account is in good standing

### Scheduler Not Running

**Problem:** Automatic uploads are not happening

**Solutions:**

1. **Enable auto-upload**
   ```env
   AUTO_UPLOAD=true
   ```

2. **Verify cron schedule format**
   ```env
   UPLOAD_SCHEDULE=0 10 * * *
   ```
   - Test format at [Crontab Guru](https://crontab.guru/)

3. **Check server logs**
   - Look for "Scheduler initialized" message
   - Watch for scheduled execution messages

4. **Restart the server**
   ```bash
   # Stop with Ctrl+C, then:
   npm start
   ```

### Authentication Issues

**Problem:** "Unauthorized" or "Invalid credentials" errors

**Solutions:**

1. **Re-run setup wizard**
   ```bash
   npm run setup:youtube
   ```

2. **Verify redirect URI**
   - In Google Cloud Console, check OAuth credentials
   - Must exactly match: `http://localhost:3000/oauth2callback`
   - For production, add your domain's callback URL

3. **Check YouTube Data API v3 is enabled**
   - In Google Cloud Console
   - "APIs & Services" → "Library" → Search "YouTube Data API v3"

4. **Review consent screen settings**
   - "APIs & Services" → "OAuth consent screen"
   - Ensure your email is added as a test user (if using External)

### Environment Variable Issues

**Problem:** Variables not being loaded

**Solutions:**

1. **Check .env file exists**
   ```bash
   ls -la .env
   ```

2. **Verify .env format**
   - No spaces around `=`
   - No quotes needed for most values
   - Each variable on its own line

3. **Restart after changes**
   - Changes to `.env` require server restart

### Port Already in Use

**Problem:** Error: "Port 3000 is already in use"

**Solutions:**

1. **Change port in .env**
   ```env
   PORT=3001
   ```

2. **Or kill the process using port 3000**
   ```bash
   # On Linux/Mac
   lsof -ti:3000 | xargs kill -9
   
   # On Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

### Docker Issues

**Problem:** Docker build or run fails

**Solutions:**

1. **Clear Docker cache**
   ```bash
   docker system prune -a
   ```

2. **Rebuild image**
   ```bash
   npm run docker:build
   ```

3. **Check Docker logs**
   ```bash
   npm run docker:logs
   ```

4. **Verify .env file exists**
   ```bash
   ls -la .env
   ```

### Permission Errors

**Problem:** EACCES or permission denied errors

**Solutions:**

1. **Check file permissions**
   ```bash
   ls -la videos/
   chmod 755 videos/
   ```

2. **Fix npm permissions** (if npm install fails)
   ```bash
   sudo chown -R $USER ~/.npm
   ```

3. **Run without sudo**
   - Never use `sudo npm install`
   - Fix npm permissions instead

### Testing Failures

**Problem:** Tests fail after setup

**Solutions:**

1. **Ensure server is running** (for integration tests)
   ```bash
   npm start
   # In another terminal:
   npm run test:integration
   ```

2. **Check .env configuration**
   ```bash
   npm run test:security
   ```

3. **Run tests individually**
   ```bash
   npm run test:security    # Security tests
   npm run test:integration # Integration tests
   ```

---

## Next Steps

### 1. Complete Initial Setup ✅

You've now completed the installation! Verify:
- ✅ Server starts without errors
- ✅ All tests pass
- ✅ You can access http://localhost:3000
- ✅ API health check returns healthy status

### 2. Test with a Private Video

Before going live, test the full workflow:

1. **Create a test video** or use a sample video
2. **Create configuration file** (see `videos/README.md`)
3. **Upload as PRIVATE** to test:
   ```bash
   curl -X POST http://localhost:3000/api/youtube/upload \
     -H "Content-Type: application/json" \
     -d '{
       "filePath": "./videos/test.mp4",
       "title": "Test Upload",
       "privacyStatus": "private"
     }'
   ```
4. **Verify upload** on your YouTube channel
5. **Check affiliate links** in description

### 3. Configure Your Workflow

Choose your automation pattern:

**Pattern A: Daily Automated Uploads**
```env
AUTO_UPLOAD=true
UPLOAD_SCHEDULE=0 10 * * *  # Daily at 10 AM
DEFAULT_PRIVACY_STATUS=public
```

**Pattern B: Manual Batch Processing**
```env
AUTO_UPLOAD=false
```
Then trigger manually when ready:
```bash
curl -X POST http://localhost:3000/api/automation/trigger
```

**Pattern C: Scheduled Batches**
```env
AUTO_UPLOAD=true
UPLOAD_SCHEDULE=0 10 * * 1,3,5  # Mon, Wed, Fri at 10 AM
```

### 4. Add Your Videos

1. Place AI-generated videos in `./videos/` directory
2. Create `.json` config files for each video
3. System will process based on your schedule

### 5. Monitor Your System

```bash
# Check automation status
curl http://localhost:3000/api/automation/status

# View video queue
curl http://localhost:3000/api/videos/scan

# Monitor continuously
npm run monitor
```

### 6. Go Live! 🚀

Once you've tested thoroughly:

1. Set `DEFAULT_PRIVACY_STATUS=public` in `.env`
2. Enable automation: `AUTO_UPLOAD=true`
3. Restart server: `npm start`
4. Monitor your uploads on YouTube!

---

## Additional Resources

### Documentation
- **[README.md](README.md)** - Project overview and features
- **[YOUTUBE_AUTOMATION.md](YOUTUBE_AUTOMATION.md)** - Complete automation guide
- **[AUTOMATION.md](AUTOMATION.md)** - CI/CD and DevOps automation
- **[SECURITY.md](SECURITY.md)** - Security guidelines and best practices
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contributing guidelines
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Extended troubleshooting guide
- **[videos/README.md](videos/README.md)** - Video configuration guide

### External Resources
- [YouTube Data API v3 Documentation](https://developers.google.com/youtube/v3)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Amazon Associates Program](https://affiliate-program.amazon.com/)
- [Crontab Guru](https://crontab.guru/) - Cron schedule helper
- [Express.js Documentation](https://expressjs.com/)

### Support
- Create a GitHub issue for bugs or questions
- Check existing issues for common problems
- Review server logs for detailed error messages

---

## Security Best Practices

- ✅ **Never commit `.env` files** - Already in `.gitignore`
- ✅ **Keep API tokens secret** - Store only in environment variables
- ✅ **Use OAuth2** for YouTube authentication
- ✅ **Enable HTTPS** in production
- ✅ **Keep dependencies updated** - Run `npm audit` regularly
- ✅ **Use strong passwords** for server access
- ✅ **Enable rate limiting** - Already configured in `server.js`
- ✅ **Monitor logs** for suspicious activity

---

## Architecture Overview

```
AI Videos → Video Processor → YouTube API
                ↓
         Amazon Affiliate Links
                ↓
         Automated Upload
                ↓
         YouTube Channel
```

**Components:**
- **Video Processor** (`video-processor.js`) - Scans and processes videos
- **YouTube API** (`youtube-api.js`) - Handles uploads and OAuth
- **Amazon Affiliate** (`amazon-affiliate.js`) - Generates affiliate links
- **Automation Scheduler** (`automation-scheduler.js`) - Cron-based scheduling
- **API Server** (`server.js`) - Express API and web interface

---

## System Requirements Summary

**Minimum:**
- Node.js 14+
- 512 MB RAM
- 1 GB disk space

**Recommended:**
- Node.js 18+
- 1 GB RAM
- 5 GB disk space (for video storage)

**Network:**
- Stable internet connection
- Access to YouTube API
- Access to Amazon Associates

---

**🎉 Congratulations! Your YouTube Amazon Affiliate Automation System is now installed and ready to use!**

For questions or issues, please refer to the [Troubleshooting](#troubleshooting) section or create a GitHub issue.

---

*Last updated: 2024*
*Installation automation level: 100% ✅*
