/**
 * Stealth Automation Engine
 * Orchestrates the entire stealth AI system
 */

const cron = require('node-cron');
const fs = require('fs').promises;
const path = require('path');

const ContentGenerator = require('./generator');
const AmazonAffiliate = require('./affiliate');
const YouTubeManager = require('./youtube');

class StealthEngine {
  constructor(config) {
    this.config = config;
    this.generator = new ContentGenerator({
      compressionLevel: config.compressionLevel,
      stackSize: config.stackSize
    });
    this.affiliate = new AmazonAffiliate(config.amazonTag);
    this.youtube = new YouTubeManager({
      clientId: config.youtubeClientId,
      clientSecret: config.youtubeClientSecret,
      redirectUri: config.youtubeRedirectUri,
      refreshToken: config.youtubeRefreshToken
    });
    this.queue = [];
    this.scheduler = null;
  }

  /**
   * Initialize the stealth engine
   */
  async initialize() {
    console.log('🚀 Initializing Stealth AI Engine...');
    
    // Load existing queue if available
    await this.loadQueue();
    
    // Set up automation scheduler
    if (this.config.autoPost) {
      this.startScheduler();
    }
    
    console.log('✅ Stealth Engine initialized');
    console.log(`📊 Queue: ${this.queue.length} items`);
    console.log(`🤖 Stealth Mode: ${this.config.stealthMode ? 'ACTIVE' : 'OFF'}`);
  }

  /**
   * Start automated posting scheduler
   */
  startScheduler() {
    if (this.scheduler) {
      return;
    }

    console.log(`⏰ Starting scheduler: ${this.config.postingInterval}`);
    
    this.scheduler = cron.schedule(this.config.postingInterval, async () => {
      console.log('🔄 Running scheduled post...');
      await this.postNext();
    });
  }

  /**
   * Stop scheduler
   */
  stopScheduler() {
    if (this.scheduler) {
      this.scheduler.stop();
      this.scheduler = null;
      console.log('⏸️  Scheduler stopped');
    }
  }

  /**
   * Generate content batch
   */
  async generateContent(topics, products = []) {
    console.log('🎯 Generating stealth content...');
    
    const batch = this.generator.generateBatch(topics, products);
    
    // Add to queue
    this.queue.push(...batch.pieces);
    await this.saveQueue();
    
    console.log(`✅ Added ${batch.pieces.length} pieces to queue`);
    
    return batch;
  }

  /**
   * Post next item from queue
   */
  async postNext() {
    if (this.queue.length === 0) {
      console.log('📭 Queue is empty');
      return null;
    }

    const content = this.queue.shift();
    
    try {
      // Add affiliate links
      content.description = this.affiliate.addLinksToDescription(
        content.description,
        content.products || []
      );

      // Post to YouTube (stealth mode)
      let result;
      if (this.config.stealthMode) {
        result = await this.youtube.createPost(content);
      } else {
        console.log('📝 Would post:', content.title);
        result = { success: true, mode: 'dry-run' };
      }

      // Log result
      await this.logPost(content, result);
      await this.saveQueue();

      console.log(`✅ Posted: ${content.title}`);
      return result;
    } catch (error) {
      console.error('❌ Post failed:', error.message);
      // Re-add to queue on failure
      this.queue.unshift(content);
      throw error;
    }
  }

  /**
   * Post all queued items
   */
  async postAll() {
    const results = [];
    
    while (this.queue.length > 0) {
      try {
        const result = await this.postNext();
        results.push(result);
        
        // Stealth delay between posts (random 1-5 seconds)
        if (this.config.stealthMode) {
          const delay = 1000 + Math.random() * 4000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        console.error('Error in batch posting:', error);
        break;
      }
    }
    
    return results;
  }

  /**
   * Get queue status
   */
  getStatus() {
    return {
      queueSize: this.queue.length,
      stealthMode: this.config.stealthMode,
      schedulerActive: this.scheduler !== null,
      authenticated: this.youtube.isAuthenticated(),
      affiliateConfigured: this.affiliate.isValidTag()
    };
  }

  /**
   * Save queue to disk
   */
  async saveQueue() {
    try {
      const queuePath = path.join(__dirname, '../data/queue.json');
      await fs.mkdir(path.dirname(queuePath), { recursive: true });
      await fs.writeFile(queuePath, JSON.stringify(this.queue, null, 2));
    } catch (error) {
      console.error('Error saving queue:', error.message);
    }
  }

  /**
   * Load queue from disk
   */
  async loadQueue() {
    try {
      const queuePath = path.join(__dirname, '../data/queue.json');
      const data = await fs.readFile(queuePath, 'utf8');
      this.queue = JSON.parse(data);
      console.log(`📥 Loaded ${this.queue.length} items from queue`);
    } catch (error) {
      // Queue doesn't exist yet, that's ok
      this.queue = [];
    }
  }

  /**
   * Log posted content
   */
  async logPost(content, result) {
    try {
      const logPath = path.join(__dirname, '../logs/posts.log');
      await fs.mkdir(path.dirname(logPath), { recursive: true });
      
      const logEntry = {
        timestamp: new Date().toISOString(),
        title: content.title,
        result: result,
        products: content.products?.length || 0
      };
      
      await fs.appendFile(logPath, JSON.stringify(logEntry) + '\n');
    } catch (error) {
      console.error('Error logging post:', error.message);
    }
  }
}

module.exports = StealthEngine;
