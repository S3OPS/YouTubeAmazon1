/**
 * Content Generator
 * Generates AI-driven micro-content using templates and patterns
 */

const SignalCompressor = require('./compressor');
const MicroStacker = require('./microstacker');

class ContentGenerator {
  constructor(config = {}) {
    this.config = config;
    this.compressor = new SignalCompressor(config.compressionLevel || 'high');
    this.microStacker = new MicroStacker(config.stackSize || 5);
  }

  /**
   * Generate content batch from topics
   */
  generateBatch(topics, products = []) {
    console.log(`🤖 Generating content for ${topics.length} topics...`);
    
    // Create micro-content pieces
    const microContent = this.microStacker.generateMicroContent(topics, products);
    
    // Compress signals
    const compressed = microContent.map(piece => ({
      ...piece,
      title: this.compressor.compressText(piece.title),
      description: this.compressor.compressText(piece.description),
      compressed: true
    }));

    // Stack for distribution
    const stacks = this.microStacker.stackContent(compressed);
    
    console.log(`✅ Generated ${compressed.length} micro-pieces in ${stacks.length} stacks`);
    
    return {
      pieces: compressed,
      stacks,
      metadata: {
        generated: Date.now(),
        count: compressed.length,
        stackCount: stacks.length
      }
    };
  }

  /**
   * Generate single piece
   */
  generateSingle(topic, products = []) {
    const piece = this.microStacker.createMicroPiece(topic, products);
    
    return {
      ...piece,
      title: this.compressor.compressText(piece.title),
      description: this.compressor.compressText(piece.description),
      compressed: true
    };
  }

  /**
   * Parse topics from configuration
   */
  parseTopics(topicString) {
    return topicString.split(',').map(t => t.trim()).filter(t => t.length > 0);
  }

  /**
   * Generate product data from ASINs
   */
  generateProductData(asins) {
    return asins.map((asin, idx) => ({
      name: `Product ${idx + 1}`,
      asin: asin,
      url: asin
    }));
  }
}

module.exports = ContentGenerator;
