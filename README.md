# 🤖 Stealth AI System
## Microstacking + Signal Compression for YouTube & Amazon Affiliate

A zero-leverage, low-resource AI automation system designed for creators with **no money, no audience, and no leverage**. Uses advanced signal compression and microstacking techniques to build presence efficiently.

---

## 🎯 Core Concepts

### Signal Compression
Compresses content to its essential signals, removing redundancy while maintaining meaning. Optimizes for:
- Maximum information density
- Minimal resource usage
- Stealth distribution patterns

### Microstacking
Creates small, frequent content pieces instead of large batches:
- Micro-content pieces (5-10 per stack)
- Distributed posting schedule
- Appears organic and non-spammy
- Builds presence gradually

---

## ⚡ Quick Start

### 1. Install
```bash
npm install
```

### 2. Configure
Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
# YouTube API
YOUTUBE_CLIENT_ID=your_client_id
YOUTUBE_CLIENT_SECRET=your_client_secret
YOUTUBE_REFRESH_TOKEN=your_refresh_token

# Amazon Affiliate
AMAZON_AFFILIATE_TAG=yourtag-20

# Stealth Settings
MICRO_STACK_SIZE=5
SIGNAL_COMPRESSION_LEVEL=high
POSTING_INTERVAL=0 */4 * * *
STEALTH_MODE=true
AUTO_POST=true

# Content Topics
CONTENT_TOPICS=tech,gadgets,reviews,tutorials
```

### 3. Authenticate YouTube
```bash
node index.js auth
```
Follow the URL, authorize, and add the refresh token to `.env`

### 4. Generate Content
```bash
# Generate micro-content from topics
node index.js generate

# Generate with Amazon products
node index.js generate B08XYZ123 B09ABC456
```

### 5. Start Stealth Mode
```bash
# Run with automated scheduler
node index.js run
```

---

## 📋 Commands

| Command | Description |
|---------|-------------|
| `node index.js generate [ASINs...]` | Generate micro-content pieces |
| `node index.js post` | Post next item from queue |
| `node index.js post-all` | Post all queued items |
| `node index.js status` | Show system status |
| `node index.js run` | Run with automated scheduler |
| `node index.js auth` | Get YouTube auth URL |

---

## 🏗️ Architecture

```
Stealth AI System
│
├── Signal Compressor (src/compressor.js)
│   ├── Text compression
│   ├── Key signal extraction
│   └── Metadata optimization
│
├── Micro-Stacker (src/microstacker.js)
│   ├── Micro-content generation
│   ├── Stack management
│   └── Distribution scheduling
│
├── Content Generator (src/generator.js)
│   ├── Template-based generation
│   ├── Batch processing
│   └── Topic parsing
│
├── Amazon Affiliate (src/affiliate.js)
│   ├── Link generation
│   ├── Description enhancement
│   └── FTC compliance
│
├── YouTube Manager (src/youtube.js)
│   ├── OAuth2 authentication
│   ├── Stealth posting
│   └── Video uploads
│
└── Stealth Engine (src/engine.js)
    ├── Orchestration
    ├── Queue management
    ├── Automated scheduling
    └── State persistence
```

---

## 🔧 Configuration Options

### Compression Levels
- **low**: 70% signal retention (more verbose)
- **medium**: 50% signal retention (balanced)
- **high**: 30% signal retention (maximum compression)

### Stack Sizes
- **3-5**: Rapid micro-posting
- **5-10**: Standard distribution
- **10+**: Batch-oriented

### Posting Intervals (Cron)
```bash
# Every 4 hours (stealth)
0 */4 * * *

# Every 6 hours
0 */6 * * *

# Twice daily
0 9,21 * * *

# Random-looking times
17 3,11,19 * * *
```

---

## 🚀 Usage Examples

### Basic Workflow
```bash
# 1. Generate content for your topics
node index.js generate

# 2. Check status
node index.js status

# 3. Post one item (test)
node index.js post

# 4. Run automated mode
node index.js run
```

### With Amazon Products
```bash
# Generate content with specific products
node index.js generate B08L8KC1J7 B09B4K1XYZ B07P9ZR9K3

# System will:
# 1. Create micro-content about your topics
# 2. Add affiliate links for these products
# 3. Queue them for posting
```

### Status Monitoring
```bash
# Check current status
node index.js status

# Output:
# 📊 Stealth AI System Status:
# ━━━━━━━━━━━━━━━━━━━━━━━━━━
# Queue Size: 15
# Stealth Mode: ✅ ACTIVE
# Scheduler: ✅ RUNNING
# YouTube Auth: ✅ OK
# Amazon Affiliate: ✅ OK
```

---

## 📂 Directory Structure

```
.
├── index.js                 # Main entry point
├── package.json             # Dependencies
├── .env                     # Configuration (create from .env.example)
├── .env.example             # Configuration template
├── README.md                # This file
│
├── src/
│   ├── engine.js            # Stealth Engine orchestrator
│   ├── generator.js         # Content generator
│   ├── compressor.js        # Signal compressor
│   ├── microstacker.js      # Micro-stacking logic
│   ├── affiliate.js         # Amazon affiliate manager
│   └── youtube.js           # YouTube API manager
│
├── data/
│   └── queue.json           # Content queue (auto-generated)
│
├── logs/
│   └── posts.log            # Post history (auto-generated)
│
└── output/
    └── (generated files)
```

---

## 🔐 Getting API Credentials

### YouTube API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project
3. Enable "YouTube Data API v3"
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/oauth2callback`
6. Copy Client ID and Client Secret to `.env`
7. Run `node index.js auth` to get refresh token

### Amazon Affiliate
1. Sign up at [Amazon Associates](https://affiliate-program.amazon.com/)
2. Get approved (may take 1-3 days)
3. Find your tracking ID in account settings
4. Add to `.env` as `AMAZON_AFFILIATE_TAG`

---

## 💡 Strategy Tips

### For Zero Leverage
1. **Start Small**: Generate 10-20 micro-pieces
2. **Post Gradually**: Use 4-6 hour intervals
3. **Be Consistent**: Run scheduler 24/7
4. **Track Results**: Monitor logs/posts.log
5. **Iterate**: Adjust topics based on what works

### Stealth Posting Pattern
- Random intervals (appear human)
- Small content chunks (not bulk uploads)
- Varied posting times
- Natural language patterns
- Gradual audience building

### Content Topics
Focus on:
- Evergreen content (timeless)
- Product reviews (affiliate revenue)
- Tutorials (high engagement)
- Niche topics (less competition)

---

## 🛡️ Privacy & Compliance

- ✅ FTC disclosure automatically added
- ✅ OAuth2 secure authentication
- ✅ No data collection
- ✅ Local state management
- ✅ Environment-based secrets

---

## 🔧 Troubleshooting

### "YouTube Auth: ❌ NOT CONFIGURED"
Run `node index.js auth` and complete OAuth flow

### "Amazon Affiliate: ❌ NOT CONFIGURED"
Add valid affiliate tag to `.env`

### Queue Not Posting
1. Check `AUTO_POST=true` in `.env`
2. Verify cron schedule is valid
3. Ensure `STEALTH_MODE=true` for auto-posting

### No Content Generated
1. Check `CONTENT_TOPICS` in `.env`
2. Run `node index.js generate` manually
3. Check logs for errors

---

## 📊 How It Works

```
1. GENERATE
   ↓
   Topics → Micro-Content → Signal Compression → Queue
   
2. STACK
   ↓
   Queue → Micro-Stacks (5 pieces each) → Distribution Plan
   
3. POST
   ↓
   Stack → Add Affiliate Links → YouTube API → Posted
   
4. REPEAT
   ↓
   Scheduler → Next Item → Post → Wait → Repeat
```

---

## 🎯 Use Cases

### Scenario 1: Product Reviewer
```bash
# Topics: tech reviews
# Products: Latest gadgets
# Strategy: Post 1 review every 4 hours
# Result: 6 posts/day, builds authority gradually
```

### Scenario 2: Tutorial Creator
```bash
# Topics: how-to, tutorials
# Products: Tools mentioned in tutorials
# Strategy: Post 1 tutorial every 6 hours
# Result: 4 posts/day, educational content
```

### Scenario 3: Niche Expert
```bash
# Topics: specialized niche
# Products: Niche-specific products
# Strategy: Post 1 piece every 8 hours
# Result: 3 posts/day, target audience building
```

---

## 🚀 Scaling

Once you have leverage (audience/revenue):
1. Increase `MICRO_STACK_SIZE` to 10-20
2. Add more content topics
3. Reduce posting intervals
4. Diversify product categories
5. A/B test different strategies

---

## 📝 Notes

- **Stealth Mode**: Posts appear organic, not automated
- **Signal Compression**: Maximum efficiency, minimal waste
- **Microstacking**: Gradual presence building
- **Zero Cost**: Uses only free APIs and tools
- **Zero Audience Required**: Builds from nothing

---

## 🤝 Philosophy

Built for creators starting from **absolute zero**:
- No money for ads
- No existing audience
- No social proof
- No leverage

Uses AI efficiency to **create leverage from nothing**.

---

## 📜 License

MIT - Build your presence freely.

---

**🤖 Execute. Compress. Stack. Repeat.**
