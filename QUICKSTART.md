# 🚀 Quick Start Example

This is a complete working example of the Stealth AI System.

## Zero to Running in 5 Minutes

### 1. Install
```bash
npm install
```

### 2. Quick Setup (Manual)

Create `.env` file:
```bash
# YouTube API (get from: https://console.cloud.google.com/)
YOUTUBE_CLIENT_ID=your_client_id_here
YOUTUBE_CLIENT_SECRET=your_client_secret_here
YOUTUBE_REDIRECT_URI=http://localhost:3000/oauth2callback
YOUTUBE_REFRESH_TOKEN=

# Amazon Affiliate (get from: https://affiliate-program.amazon.com/)
AMAZON_AFFILIATE_TAG=yourtag-20

# Stealth Settings
MICRO_STACK_SIZE=5
SIGNAL_COMPRESSION_LEVEL=high
POSTING_INTERVAL=0 */4 * * *
STEALTH_MODE=true
AUTO_POST=true

# Content Topics
CONTENT_TOPICS=tech,gadgets,reviews,tutorials
MIN_CONTENT_LENGTH=100
MAX_CONTENT_LENGTH=500
```

### 3. Test Without APIs

You can test the system WITHOUT configuring YouTube or Amazon:

```bash
# Generate content (works without APIs)
node index.js generate B08XYZ123 B09ABC456

# Check what was generated
node index.js status

# See the queue
cat data/queue.json
```

### 4. Test Posting (Dry Run)

With `STEALTH_MODE=false`, you can test posting without actually sending to YouTube:

```bash
# Set STEALTH_MODE=false in .env
# Then test posting
node index.js post
```

Output:
```
📝 Would post: Quick tech overview
✅ Posted: Quick tech overview
```

### 5. Full Production Setup

When ready for real posting:

**Step A: Get YouTube Token**
```bash
node index.js auth
# Follow URL, authorize, add token to .env
```

**Step B: Verify Configuration**
```bash
node index.js status
```

Should show:
```
YouTube Auth: ✅ OK
Amazon Affiliate: ✅ OK
```

**Step C: Generate Real Content**
```bash
# Generate with real Amazon product ASINs
node index.js generate B08L8KC1J7 B09B4K1XYZ B07P9ZR9K3
```

**Step D: Start Automation**
```bash
npm run run
```

## Example Workflow: Tech Reviewer

**Scenario:** You want to build a tech review channel from scratch.

**Setup:**
1. Topics: tech, gadgets, electronics, reviews
2. Products: Find popular tech products on Amazon
3. Schedule: Every 4 hours (6 posts per day)

**Commands:**
```bash
# Weekly routine
node index.js generate \
  B08L8KC1J7 \  # Gaming Mouse
  B09B4K1XYZ \  # Mechanical Keyboard
  B07P9ZR9K3 \  # USB Hub
  B08VWXYZ12 \  # Webcam
  B09ABCDEF3    # Headset

# System generates:
# - 5 topics × 5 products = 25 micro-pieces
# - Posted over 4 days (every 4 hours)
# - Each with affiliate links
# - All compressed and optimized

# Let it run
npm run run
```

## Understanding the Output

### Content Generation
```bash
$ node index.js generate B08XYZ123

🤖 Generating content for 4 topics...
✅ Generated 4 micro-pieces in 1 stacks
✅ Added 4 pieces to queue

✅ Content generated and queued
```

### Status Check
```bash
$ node index.js status

📊 Stealth AI System Status:
━━━━━━━━━━━━━━━━━━━━━━━━━━
Queue Size: 4
Stealth Mode: ✅ ACTIVE
Scheduler: ❌ STOPPED
YouTube Auth: ❌ NOT CONFIGURED
Amazon Affiliate: ❌ NOT CONFIGURED
━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Queue Contents
```bash
$ cat data/queue.json
```

```json
[
  {
    "title": "Quick tech overview",
    "description": "Product insights tech...",
    "topic": "tech",
    "products": [
      {
        "name": "Product B08XYZ123",
        "asin": "B08XYZ123",
        "url": "B08XYZ123"
      }
    ],
    "compressed": true
  }
]
```

## Testing Signal Compression

See how content gets compressed:

```javascript
// Before: "This is a very amazing product"
// After:  "amazing product"

// Before: "You should really check out this item"
// After:  "check item"

// Before: "Top 5 Gaming Accessories 2024"
// After:  "Top Gaming Accessories"
```

## Testing Microstacking

Generate multiple pieces and see stacking:

```bash
# Generate for 4 topics
node index.js generate B08A B08B B08C

# Creates:
# - Topic 1 (tech) + 3 products = 1 micro-piece
# - Topic 2 (gadgets) + 3 products = 1 micro-piece
# - Topic 3 (reviews) + 3 products = 1 micro-piece
# - Topic 4 (tutorials) + 3 products = 1 micro-piece

# Total: 4 micro-pieces stacked together
```

## No-API Testing

You can test the entire system WITHOUT any API credentials:

```bash
# 1. Leave APIs unconfigured in .env
YOUTUBE_CLIENT_ID=test
AMAZON_AFFILIATE_TAG=test-20

# 2. Set stealth mode off
STEALTH_MODE=false

# 3. Generate content
node index.js generate TEST1 TEST2

# 4. Test posting (dry run)
node index.js post

# Output:
# 📝 Would post: Quick tech overview
# ✅ Posted: Quick tech overview
```

## Common Commands

```bash
# Setup wizard
npm run setup

# Generate content
npm run generate

# Post next item
npm run post

# Check status
npm run status

# Run automation
npm run run

# Get YouTube auth URL
node index.js auth

# Post all queued items
node index.js post-all
```

## Troubleshooting Quick Tests

**Queue empty?**
```bash
node index.js generate B08TEST1 B08TEST2
```

**Want to see compression?**
```bash
cat data/queue.json | grep title
```

**Check logs?**
```bash
cat logs/posts.log
```

**Clear everything and start fresh?**
```bash
rm -rf data/ logs/
node index.js generate B08NEW1 B08NEW2
```

## Next Steps

1. ✅ Read [README.md](README.md) for full overview
2. ✅ Read [USAGE.md](USAGE.md) for detailed guide
3. ✅ Run `npm run setup` for wizard
4. ✅ Test with dry run first
5. ✅ Configure real APIs when ready
6. ✅ Start building your presence

---

**Remember:** This system is designed for zero leverage. Start small, be consistent, let it build gradually.

**🤖 Execute. Compress. Stack. Repeat.**
