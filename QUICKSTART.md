# Quick Start Guide - YouTube Amazon Affiliate Automation

Get your YouTube Amazon Affiliate Automation System running in minutes with our **100% automated setup**.

## 🚀 Super Quick Start (Recommended)

### One-Command Build-Configure-Test

```bash
npm run build-configure-test
```

That's it! The automated workflow will:
- ✅ Check system requirements (Node.js, npm)
- ✅ Install dependencies
- ✅ Run the setup wizard (creates `.env`)
- ✅ Validate configuration
- ✅ Run security and integration tests
- ✅ Run lint and formatting checks
- ✅ Retry the full workflow up to 3 times on failure

**Time to complete:** ~3-5 minutes (includes lint/format checks)

## 📋 Prerequisites

✅ **Node.js v14+** - [Download](https://nodejs.org/)  
✅ **npm v6+** - Comes with Node.js  
✅ **YouTube Account** - [Create one](https://www.youtube.com/)  
✅ **Google Cloud Project** - [Console](https://console.cloud.google.com/)  
✅ **Amazon Associates Account** - [Sign up](https://affiliate-program.amazon.com/)

## 🎯 Manual Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure YouTube Automation

```bash
npm run setup:youtube
```

The wizard will guide you through:
- YouTube API credentials setup
- Amazon affiliate configuration
- Automation schedule
- Directory setup

### 3. Start Server

```bash
npm start
```

### 4. Open Browser

Visit: `http://localhost:3000`

## 🐳 Docker Quick Start

```bash
cp .env.example .env
# Edit .env with your YouTube and Amazon credentials
npm run docker:run
```

## ✅ Verify Installation

```bash
npm test
```

Expected: All security and integration tests pass ✅

## 📹 Add Your First Video

1. Place AI-generated video in `./videos/` directory
2. Optionally create a config file `video-name.json`:
   ```json
   {
     "title": "Amazing Product Review",
     "description": "Check out these products!",
     "products": [
       { "name": "Cool Gadget", "url": "B08XXXXX" }
     ],
     "tags": ["review", "tech", "amazon"]
   }
   ```
3. Trigger upload:
   ```bash
   curl -X POST http://localhost:3000/api/automation/trigger
   ```

## 📚 Documentation

- [README.md](README.md) - Main documentation
- [YOUTUBE_AUTOMATION.md](YOUTUBE_AUTOMATION.md) - Complete automation guide
- [AUTOMATION.md](AUTOMATION.md) - CI/CD and DevOps automation
- [SETUP.md](SETUP.md) - Detailed setup instructions

---

**Automation level:** 100% ✅  
**Primary Focus:** YouTube Video Automation with Amazon Affiliate Links
