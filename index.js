/**
 * Stealth AI System - Main Entry Point
 * Microstacking + Signal Compression for YouTube + Amazon Affiliate
 */

require('dotenv').config();
const StealthEngine = require('./src/engine');

// Configuration from environment
const config = {
  // YouTube
  youtubeClientId: process.env.YOUTUBE_CLIENT_ID,
  youtubeClientSecret: process.env.YOUTUBE_CLIENT_SECRET,
  youtubeRedirectUri: process.env.YOUTUBE_REDIRECT_URI || 'http://localhost:3000/oauth2callback',
  youtubeRefreshToken: process.env.YOUTUBE_REFRESH_TOKEN,
  
  // Amazon
  amazonTag: process.env.AMAZON_AFFILIATE_TAG,
  
  // Stealth settings
  stackSize: parseInt(process.env.MICRO_STACK_SIZE) || 5,
  compressionLevel: process.env.SIGNAL_COMPRESSION_LEVEL || 'high',
  postingInterval: process.env.POSTING_INTERVAL || '0 */4 * * *',
  stealthMode: process.env.STEALTH_MODE === 'true',
  autoPost: process.env.AUTO_POST === 'true',
  
  // Content
  topics: process.env.CONTENT_TOPICS || 'tech,reviews',
  minLength: parseInt(process.env.MIN_CONTENT_LENGTH) || 100,
  maxLength: parseInt(process.env.MAX_CONTENT_LENGTH) || 500
};

// Initialize engine
const engine = new StealthEngine(config);

// CLI Interface
const args = process.argv.slice(2);
const command = args[0];

async function main() {
  await engine.initialize();

  switch (command) {
    case 'generate':
      // Generate content
      const topics = config.topics.split(',').map(t => t.trim());
      const products = args.slice(1).map(asin => ({
        name: `Product ${asin}`,
        asin: asin,
        url: asin
      }));
      
      await engine.generateContent(topics, products);
      console.log('\n✅ Content generated and queued');
      break;

    case 'post':
      // Post next item
      await engine.postNext();
      break;

    case 'post-all':
      // Post all queued items
      console.log('🚀 Posting all queued content...');
      await engine.postAll();
      console.log('✅ All items posted');
      break;

    case 'status':
      // Show status
      const status = engine.getStatus();
      console.log('\n📊 Stealth AI System Status:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`Queue Size: ${status.queueSize}`);
      console.log(`Stealth Mode: ${status.stealthMode ? '✅ ACTIVE' : '❌ OFF'}`);
      console.log(`Scheduler: ${status.schedulerActive ? '✅ RUNNING' : '❌ STOPPED'}`);
      console.log(`YouTube Auth: ${status.authenticated ? '✅ OK' : '❌ NOT CONFIGURED'}`);
      console.log(`Amazon Affiliate: ${status.affiliateConfigured ? '✅ OK' : '❌ NOT CONFIGURED'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      break;

    case 'run':
      // Run with scheduler
      console.log('\n🎯 Starting Stealth AI System...');
      console.log('Press Ctrl+C to stop\n');
      
      // Keep process alive
      process.on('SIGINT', () => {
        console.log('\n\n👋 Shutting down...');
        engine.stopScheduler();
        process.exit(0);
      });
      
      // Just keep running
      await new Promise(() => {});
      break;

    case 'auth':
      // Get YouTube auth URL
      console.log('\n🔐 YouTube Authentication:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n1. Visit this URL:\n');
      console.log(engine.youtube.getAuthUrl());
      console.log('\n2. Authorize the app');
      console.log('3. Copy the code and set YOUTUBE_REFRESH_TOKEN in .env\n');
      break;

    default:
      // Show help
      console.log('\n🤖 Stealth AI System - Microstacking + Signal Compression\n');
      console.log('Commands:');
      console.log('  generate [ASINs...]  Generate micro-content (optionally with product ASINs)');
      console.log('  post                 Post next item from queue');
      console.log('  post-all             Post all queued items');
      console.log('  status               Show system status');
      console.log('  run                  Run with automated scheduler');
      console.log('  auth                 Get YouTube authorization URL');
      console.log('\nExamples:');
      console.log('  node index.js generate B08XYZ123 B09ABC456');
      console.log('  node index.js post');
      console.log('  node index.js run');
      console.log('\n');
  }

  // Exit if not running scheduler
  if (command !== 'run') {
    process.exit(0);
  }
}

// Run
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
