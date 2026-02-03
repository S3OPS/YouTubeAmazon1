# 🎮 Command Reference

Quick reference for all available commands in the Stealth AI System.

---

## Core Commands

### Help
```bash
node index.js
```
Displays help menu with all available commands.

### Generate Content
```bash
# Generate with Amazon product ASINs
node index.js generate B08L8KC1J7 B09B4K1XYZ B07P9ZR9K3

# Generate without products (uses configured topics only)
node index.js generate

# Via npm script
npm run generate
```
Generates micro-content pieces with signal compression and adds them to the queue.

### Post Content
```bash
# Post next item from queue
node index.js post

# Post all queued items
node index.js post-all

# Via npm script
npm run post
```
Posts content from the queue to YouTube with affiliate links.

### Check Status
```bash
node index.js status

# Via npm script
npm run status
```
Shows system status including queue size, configuration, and authentication status.

### Run Automation
```bash
node index.js run

# Via npm script
npm run run
```
Starts the automated scheduler. Posts according to configured cron schedule.

### YouTube Authentication
```bash
node index.js auth
```
Generates YouTube OAuth2 authorization URL. Follow the URL to get a refresh token.

---

## Setup Commands

### Setup Wizard
```bash
npm run setup
```
Interactive setup wizard to configure the system.

### Install Dependencies
```bash
npm install
```
Installs all required Node.js packages.

---

## Testing Commands

### Run All Tests
```bash
./test-system.sh
```
Runs the complete automated test suite.

### Run Demo
```bash
./demo.sh
```
Runs a live demonstration of the system.

### Final Verification
```bash
./final-test.sh
```
Comprehensive system verification.

---

## Configuration

### View Configuration
```bash
cat .env
```
Shows current configuration.

### Edit Configuration
```bash
nano .env
# or
vim .env
```
Edit environment variables manually.

---

## Queue Management

### View Queue
```bash
cat data/queue.json
```
Shows current content queue.

### View Queue (formatted)
```bash
cat data/queue.json | jq
```
Shows queue with JSON formatting (requires jq).

### Clear Queue
```bash
rm data/queue.json
```
Clears the content queue.

---

## Monitoring

### View Post History
```bash
cat logs/posts.log
```
Shows all posted content.

### Tail Post Log
```bash
tail -f logs/posts.log
```
Watch posts in real-time.

### View Recent Posts
```bash
tail -20 logs/posts.log
```
Shows last 20 posts.

---

## NPM Scripts

All available npm scripts from `package.json`:

```bash
npm start          # Same as: node index.js
npm run setup      # Run setup wizard
npm run generate   # Generate content
npm run post       # Post next item
npm run status     # Check status
npm run run        # Run automation
```

---

## Common Workflows

### Daily Routine
```bash
# Morning: Generate new content
node index.js generate B08NEW1 B08NEW2 B08NEW3

# Check queue
node index.js status

# Let it run (scheduler handles posting)
npm run run
```

### Testing Workflow
```bash
# 1. Generate test content
node index.js generate TEST1 TEST2

# 2. Check what was created
cat data/queue.json | head -20

# 3. Test posting (dry run if STEALTH_MODE=false)
node index.js post

# 4. Check logs
cat logs/posts.log
```

### Fresh Start
```bash
# Clear everything and start over
rm -rf data/ logs/
node index.js generate B08FRESH1 B08FRESH2
npm run run
```

---

## Environment Variables

Key configuration options in `.env`:

```bash
# YouTube
YOUTUBE_CLIENT_ID=...
YOUTUBE_CLIENT_SECRET=...
YOUTUBE_REFRESH_TOKEN=...

# Amazon
AMAZON_AFFILIATE_TAG=yourtag-20

# System
MICRO_STACK_SIZE=5
SIGNAL_COMPRESSION_LEVEL=high
POSTING_INTERVAL=0 */4 * * *
STEALTH_MODE=true
AUTO_POST=true

# Content
CONTENT_TOPICS=tech,gadgets,reviews,tutorials
```

---

## Troubleshooting Commands

### Check Node Version
```bash
node --version
```
Requires Node.js 14 or higher.

### Check NPM Version
```bash
npm --version
```

### Reinstall Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### View System Info
```bash
node index.js status
```

### Debug Mode
```bash
DEBUG=* node index.js [command]
```

---

## File Locations

```
data/queue.json          # Content queue
logs/posts.log           # Post history
.env                     # Configuration
src/                     # Source code
```

---

## Quick Tips

**Generate more content:**
```bash
node index.js generate $(cat examples.json | jq -r '.categories.tech[]')
```

**Count queue items:**
```bash
cat data/queue.json | grep -c "compressed"
```

**Count posts:**
```bash
wc -l logs/posts.log
```

**Check last post:**
```bash
tail -1 logs/posts.log | jq
```

---

## Keyboard Shortcuts

When running `npm run run`:
- `Ctrl+C` - Stop the scheduler gracefully
- `Ctrl+Z` - Suspend the process

---

**🤖 For more details, see:**
- [README.md](README.md) - System overview
- [USAGE.md](USAGE.md) - Detailed guide
- [QUICKSTART.md](QUICKSTART.md) - Quick start

