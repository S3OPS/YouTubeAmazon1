#!/usr/bin/env node
/**
 * Setup Wizard for Stealth AI System
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

async function setup() {
  console.log('\n🤖 Stealth AI System - Setup Wizard\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const config = {};

  // YouTube Configuration
  console.log('📺 YouTube API Configuration:');
  console.log('Get credentials from: https://console.cloud.google.com/\n');
  
  config.YOUTUBE_CLIENT_ID = await question('YouTube Client ID: ');
  config.YOUTUBE_CLIENT_SECRET = await question('YouTube Client Secret: ');
  config.YOUTUBE_REDIRECT_URI = await question('Redirect URI (default: http://localhost:3000/oauth2callback): ') || 'http://localhost:3000/oauth2callback';
  
  console.log('\n💰 Amazon Affiliate Configuration:');
  console.log('Get your tag from: https://affiliate-program.amazon.com/\n');
  
  config.AMAZON_AFFILIATE_TAG = await question('Amazon Affiliate Tag: ');

  console.log('\n⚙️  Stealth System Configuration:\n');
  
  const stackSize = await question('Micro Stack Size (default: 5): ');
  config.MICRO_STACK_SIZE = stackSize || '5';
  
  const compressionLevel = await question('Signal Compression Level (low/medium/high, default: high): ');
  config.SIGNAL_COMPRESSION_LEVEL = compressionLevel || 'high';
  
  const interval = await question('Posting Interval in cron format (default: 0 */4 * * *): ');
  config.POSTING_INTERVAL = interval || '0 */4 * * *';
  
  const stealth = await question('Enable Stealth Mode? (yes/no, default: yes): ');
  config.STEALTH_MODE = stealth.toLowerCase() === 'no' ? 'false' : 'true';
  
  const autoPost = await question('Enable Auto-Posting? (yes/no, default: yes): ');
  config.AUTO_POST = autoPost.toLowerCase() === 'no' ? 'false' : 'true';

  console.log('\n📝 Content Configuration:\n');
  
  const topics = await question('Content Topics (comma-separated, default: tech,gadgets,reviews,tutorials): ');
  config.CONTENT_TOPICS = topics || 'tech,gadgets,reviews,tutorials';

  // Generate .env file
  console.log('\n💾 Generating .env file...');
  
  const envContent = `# YouTube API Configuration
YOUTUBE_CLIENT_ID=${config.YOUTUBE_CLIENT_ID}
YOUTUBE_CLIENT_SECRET=${config.YOUTUBE_CLIENT_SECRET}
YOUTUBE_REDIRECT_URI=${config.YOUTUBE_REDIRECT_URI}
YOUTUBE_REFRESH_TOKEN=

# Amazon Affiliate Configuration
AMAZON_AFFILIATE_TAG=${config.AMAZON_AFFILIATE_TAG}

# Stealth System Configuration
MICRO_STACK_SIZE=${config.MICRO_STACK_SIZE}
SIGNAL_COMPRESSION_LEVEL=${config.SIGNAL_COMPRESSION_LEVEL}
POSTING_INTERVAL=${config.POSTING_INTERVAL}
STEALTH_MODE=${config.STEALTH_MODE}
AUTO_POST=${config.AUTO_POST}

# Content Configuration
CONTENT_TOPICS=${config.CONTENT_TOPICS}
MIN_CONTENT_LENGTH=100
MAX_CONTENT_LENGTH=500
`;

  fs.writeFileSync('.env', envContent);
  
  console.log('✅ Configuration saved to .env\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('🔐 Next Steps:\n');
  console.log('1. Run: node index.js auth');
  console.log('2. Follow the authorization URL');
  console.log('3. Add YOUTUBE_REFRESH_TOKEN to .env');
  console.log('4. Run: node index.js generate');
  console.log('5. Run: node index.js run\n');
  
  rl.close();
}

setup().catch(error => {
  console.error('❌ Setup failed:', error);
  process.exit(1);
});
