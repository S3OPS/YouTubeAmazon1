/**
 * Micro-Stacker
 * Creates micro-content stacks for stealth distribution
 * Generates small, frequent content pieces instead of large batches
 */

class MicroStacker {
  constructor(stackSize = 5) {
    this.stackSize = stackSize;
    this.stack = [];
  }

  /**
   * Generate micro-content from topics
   */
  generateMicroContent(topics, products = []) {
    const microPieces = [];
    
    for (const topic of topics) {
      const piece = this.createMicroPiece(topic, products);
      microPieces.push(piece);
    }

    return microPieces;
  }

  /**
   * Create a single micro-content piece
   */
  createMicroPiece(topic, products = []) {
    const templates = [
      `Quick look at {topic} - check out these options`,
      `{topic} worth considering`,
      `Fast {topic} overview`,
      `Essential {topic} you need to know`,
      `{topic} - straight to the point`
    ];

    const template = templates[Math.floor(Math.random() * templates.length)];
    const title = template.replace('{topic}', topic);

    // Create minimal description
    let description = `Quick insights on ${topic}.\n\n`;
    
    // Add product links if available
    if (products.length > 0) {
      description += 'Products mentioned:\n';
      products.forEach(product => {
        description += `- ${product.name}\n`;
      });
    }

    return {
      title,
      description,
      topic,
      products,
      timestamp: Date.now(),
      type: 'micro'
    };
  }

  /**
   * Stack micro-content into batches
   */
  stackContent(microPieces) {
    const stacks = [];
    
    for (let i = 0; i < microPieces.length; i += this.stackSize) {
      const stack = microPieces.slice(i, i + this.stackSize);
      stacks.push({
        id: `stack-${Date.now()}-${i}`,
        pieces: stack,
        size: stack.length,
        created: Date.now()
      });
    }

    return stacks;
  }

  /**
   * Get next micro-piece from stack
   */
  getNextPiece() {
    if (this.stack.length === 0) {
      return null;
    }
    return this.stack.shift();
  }

  /**
   * Add pieces to internal stack
   */
  addToStack(pieces) {
    this.stack.push(...pieces);
    return this.stack.length;
  }

  /**
   * Get stack status
   */
  getStackStatus() {
    return {
      size: this.stack.length,
      stackSize: this.stackSize,
      ready: this.stack.length > 0
    };
  }
}

module.exports = MicroStacker;
