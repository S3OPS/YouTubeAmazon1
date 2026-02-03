/**
 * Signal Compressor
 * Compresses content signals for stealth posting
 * Optimizes message density while maintaining meaning
 */

class SignalCompressor {
  constructor(compressionLevel = 'high') {
    this.compressionLevel = compressionLevel;
    this.compressionRates = {
      low: 0.7,
      medium: 0.5,
      high: 0.3
    };
  }

  /**
   * Compress text content using signal compression techniques
   */
  compressText(text) {
    const rate = this.compressionRates[this.compressionLevel] || 0.5;
    
    // Remove redundant words and phrases
    let compressed = text
      .replace(/\b(very|really|actually|basically|literally)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Extract key signals (important words)
    const words = compressed.split(' ');
    const keySignals = this.extractKeySignals(words, rate);
    
    return keySignals.join(' ');
  }

  /**
   * Extract key signal words based on importance
   */
  extractKeySignals(words, rate) {
    // Keep most important words (nouns, verbs, key adjectives)
    const targetLength = Math.max(Math.floor(words.length * rate), 5);
    
    // Simple importance scoring
    const scored = words.map((word, idx) => ({
      word,
      score: this.calculateWordImportance(word, idx, words.length)
    }));

    // Sort by importance and take top signals
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, targetLength).map(s => s.word);
  }

  /**
   * Calculate word importance for signal extraction
   */
  calculateWordImportance(word, position, totalWords) {
    let score = 1;
    
    // Boost for longer words (usually more meaningful)
    score += word.length / 10;
    
    // Boost for position (beginning and end are important)
    if (position < 3 || position > totalWords - 3) {
      score += 2;
    }
    
    // Boost for capitalized words (proper nouns, brands)
    if (word[0] === word[0].toUpperCase()) {
      score += 1.5;
    }
    
    // Penalize common filler words
    const fillers = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'];
    if (fillers.includes(word.toLowerCase())) {
      score -= 2;
    }
    
    return score;
  }

  /**
   * Compress metadata for stealth posting
   */
  compressMetadata(metadata) {
    return {
      title: this.compressText(metadata.title),
      description: this.compressText(metadata.description),
      tags: metadata.tags ? metadata.tags.slice(0, 5) : [],
      compressed: true
    };
  }
}

module.exports = SignalCompressor;
