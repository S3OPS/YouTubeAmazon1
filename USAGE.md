# 🎯 Stealth AI System - Complete Usage Guide

## Table of Contents
1. [Quick Start](#quick-start)
2. [Understanding the System](#understanding-the-system)
3. [Complete Walkthrough](#complete-walkthrough)
4. [Advanced Usage](#advanced-usage)
5. [Real-World Examples](#real-world-examples)

---

## Quick Start

### Installation (5 minutes)

```bash
# 1. Clone/download the repository
cd YouTubeAmazon1

# 2. Install dependencies
npm install

# 3. Run setup wizard
npm run setup

# 4. Authenticate with YouTube
node index.js auth
# Follow URL, authorize, and add refresh token to .env

# 5. Generate content
npm run generate B08XYZ123 B09ABC456

# 6. Start stealth mode
npm run run
```

---

## Understanding the System

### What is Signal Compression?

Signal compression extracts the **essential meaning** from content while removing redundancy:

**Before Compression:**
```
"This is a really amazing product that you should definitely check out"
```

**After Compression (High Level):**
```
"amazing product check"
```

**Benefits:**
- ✅ Maximum information density
- ✅ Faster to create/process
- ✅ Less spammy appearance
- ✅ Better for micro-content

### What is Microstacking?

Microstacking creates **small, frequent content pieces** instead of large batches:

**Traditional Approach:**
- Create 50 videos
- Upload all at once
- Looks spammy
- No momentum

**Microstacking Approach:**
- Create 50 micro-pieces
- Stack in groups of 5
- Post every 4 hours
- Builds gradually
- Appears organic

**Example Schedule:**
```
00:00 - Post micro-piece #1
04:00 - Post micro-piece #2
08:00 - Post micro-piece #3
12:00 - Post micro-piece #4
16:00 - Post micro-piece #5
20:00 - Post micro-piece #6
```

---

## Complete Walkthrough

### Step 1: Get API Credentials

#### YouTube API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (e.g., "Stealth AI System")
3. Enable "YouTube Data API v3"
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized redirect URIs: `http://localhost:3000/oauth2callback`
7. Copy Client ID and Client Secret

#### Amazon Affiliate
1. Sign up at [Amazon Associates](https://affiliate-program.amazon.com/)
2. Complete application (approval takes 1-3 days)
3. Once approved, go to Account Settings
4. Copy your Tracking ID (format: `yourname-20`)

### Step 2: Configure System

Run setup wizard:
```bash
npm run setup
```

Or manually create `.env`:
```env
YOUTUBE_CLIENT_ID=your_actual_client_id
YOUTUBE_CLIENT_SECRET=your_actual_secret
YOUTUBE_REDIRECT_URI=http://localhost:3000/oauth2callback
YOUTUBE_REFRESH_TOKEN=

AMAZON_AFFILIATE_TAG=yourname-20

MICRO_STACK_SIZE=5
SIGNAL_COMPRESSION_LEVEL=high
POSTING_INTERVAL=0 */4 * * *
STEALTH_MODE=true
AUTO_POST=true

CONTENT_TOPICS=tech,gadgets,reviews,tutorials
MIN_CONTENT_LENGTH=100
MAX_CONTENT_LENGTH=500
```

### Step 3: Authenticate YouTube

```bash
node index.js auth
```

Output:
```
🔐 YouTube Authentication:
━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Visit this URL:

https://accounts.google.com/o/oauth2/v2/auth?...

2. Authorize the app
3. Copy the code and set YOUTUBE_REFRESH_TOKEN in .env
```

1. Click the URL
2. Sign in to your YouTube account
3. Click "Allow"
4. You'll be redirected to a page with a code
5. Copy the refresh token
6. Add to `.env`: `YOUTUBE_REFRESH_TOKEN=your_refresh_token_here`

### Step 4: Generate Content

Generate content with Amazon products:
```bash
node index.js generate B08L8KC1J7 B09B4K1XYZ B07P9ZR9K3
```

This will:
1. Create micro-content for your configured topics
2. Add Amazon affiliate links for the products
3. Compress the content signals
4. Queue everything for posting

### Step 5: Test a Post

Before automating, test manually:
```bash
node index.js post
```

Check the output:
```
📝 Would post: Quick tech overview
✅ Posted: Quick tech overview
```

### Step 6: Run Automated Mode

```bash
npm run run
```

Output:
```
🎯 Starting Stealth AI System...
Press Ctrl+C to stop

⏰ Starting scheduler: 0 */4 * * *
🔄 Running scheduled post...
✅ Posted: Quick tech overview
```

The system will now:
- Post automatically every 4 hours
- Process the queue in order
- Log all posts to `logs/posts.log`
- Save queue state to `data/queue.json`

---

## Advanced Usage

### Custom Cron Schedules

```env
# Every 2 hours
POSTING_INTERVAL=0 */2 * * *

# Every 6 hours
POSTING_INTERVAL=0 */6 * * *

# Twice daily (9 AM and 9 PM)
POSTING_INTERVAL=0 9,21 * * *

# Weekdays only at 10 AM
POSTING_INTERVAL=0 10 * * 1-5

# Random-looking times (3:17 AM, 11:17 AM, 7:17 PM)
POSTING_INTERVAL=17 3,11,19 * * *
```

### Compression Levels

```env
# Low compression (70% content retained)
SIGNAL_COMPRESSION_LEVEL=low

# Medium compression (50% content retained)
SIGNAL_COMPRESSION_LEVEL=medium

# High compression (30% content retained)
SIGNAL_COMPRESSION_LEVEL=high
```

### Stack Sizes

```env
# Rapid micro-posting (3-5 pieces per stack)
MICRO_STACK_SIZE=3

# Standard distribution (5-10 pieces)
MICRO_STACK_SIZE=7

# Batch-oriented (10+ pieces)
MICRO_STACK_SIZE=15
```

---

## Real-World Examples

### Example 1: Tech Product Reviewer

**Scenario:** No audience, want to build as tech reviewer

**Configuration:**
```env
CONTENT_TOPICS=tech,gadgets,electronics,reviews,unboxing
MICRO_STACK_SIZE=5
POSTING_INTERVAL=0 */4 * * *
SIGNAL_COMPRESSION_LEVEL=high
```

**Workflow:**
```bash
# Weekly routine
node index.js generate B08ABC B08DEF B08GHI B08JKL B08MNO

# Let it run
npm run run
```

**Results:**
- 5 topics × 5 products = 25 micro-pieces
- Posted over ~4 days (every 4 hours)
- Appears organic, not bulk upload
- Builds presence gradually

### Example 2: Tutorial Creator

**Scenario:** Create how-to content with tool recommendations

**Configuration:**
```env
CONTENT_TOPICS=tutorials,howto,tips,guides,diy
MICRO_STACK_SIZE=7
POSTING_INTERVAL=0 */6 * * *
SIGNAL_COMPRESSION_LEVEL=medium
```

**Workflow:**
```bash
# Generate content about tools
node index.js generate B08TOOL1 B08TOOL2 B08TOOL3

# System posts 1 tutorial every 6 hours
```

### Example 3: Niche Expert

**Scenario:** Focus on specific niche (e.g., coffee equipment)

**Configuration:**
```env
CONTENT_TOPICS=coffee,espresso,brewing,equipment,reviews
MICRO_STACK_SIZE=3
POSTING_INTERVAL=0 8,20 * * *
SIGNAL_COMPRESSION_LEVEL=low
```

**Workflow:**
```bash
# Generate niche content
node index.js generate B08COFFEE1 B08COFFEE2

# Posts twice daily (8 AM, 8 PM)
```

---

## Monitoring & Management

### Check Status
```bash
npm run status
```

### View Queue
```bash
cat data/queue.json | jq
```

### View Post History
```bash
tail -f logs/posts.log
```

### Clear Queue
```bash
rm data/queue.json
```

### Generate More Content
```bash
# Add more to existing queue
node index.js generate B08NEW1 B08NEW2
```

---

## Troubleshooting

### Problem: "YouTube Auth: ❌ NOT CONFIGURED"

**Solution:**
1. Run `node index.js auth`
2. Complete OAuth flow
3. Add refresh token to `.env`

### Problem: "Queue is empty"

**Solution:**
```bash
node index.js generate B08PROD1 B08PROD2
```

### Problem: Posts not going out automatically

**Solution:**
1. Check `AUTO_POST=true` in `.env`
2. Ensure you're running `npm run run`
3. Verify cron schedule is valid

### Problem: Content looks too compressed

**Solution:**
Change compression level:
```env
SIGNAL_COMPRESSION_LEVEL=medium  # or low
```

---

## Best Practices

### For Zero Leverage
1. ✅ Start with 20-30 micro-pieces
2. ✅ Post every 4-6 hours
3. ✅ Focus on evergreen topics
4. ✅ Monitor what resonates
5. ✅ Iterate and optimize

### Content Strategy
1. ✅ Mix product types (electronics, books, tools)
2. ✅ Vary content types (reviews, tutorials, lists)
3. ✅ Stay consistent with posting
4. ✅ Track affiliate clicks
5. ✅ Adjust topics based on data

### Stealth Mode Tips
1. ✅ Use random-ish posting times
2. ✅ Keep stack sizes small (5-7)
3. ✅ High compression for efficiency
4. ✅ Vary content slightly
5. ✅ Don't spam same products

---

## Scaling Up

Once you have some traction:

1. **Increase Volume:**
   ```env
   MICRO_STACK_SIZE=10
   POSTING_INTERVAL=0 */3 * * *
   ```

2. **Add More Topics:**
   ```env
   CONTENT_TOPICS=tech,gaming,office,home,fitness,books
   ```

3. **Lower Compression:**
   ```env
   SIGNAL_COMPRESSION_LEVEL=medium
   ```

4. **More Products:**
   ```bash
   node index.js generate B08P1 B08P2 B08P3 B08P4 B08P5 B08P6
   ```

---

## Support & Resources

- 📖 [README.md](README.md) - Main documentation
- 🔧 `.env.example` - Configuration template
- 📝 `logs/posts.log` - Post history
- 💾 `data/queue.json` - Current queue

---

**🤖 Build your presence from zero. Execute. Compress. Stack. Repeat.**
