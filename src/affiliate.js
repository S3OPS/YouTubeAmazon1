/**
 * Amazon Affiliate Manager
 * Handles Amazon affiliate link generation and integration
 */

class AmazonAffiliate {
  constructor(affiliateTag) {
    this.affiliateTag = affiliateTag;
  }

  /**
   * Generate affiliate link from ASIN or product URL
   */
  generateLink(productIdentifier) {
    // Extract ASIN if URL provided
    let asin = productIdentifier;
    
    if (productIdentifier.includes('amazon.com')) {
      const asinMatch = productIdentifier.match(/\/dp\/([A-Z0-9]{10})/i) ||
                       productIdentifier.match(/\/gp\/product\/([A-Z0-9]{10})/i);
      if (asinMatch) {
        asin = asinMatch[1];
      }
    }

    // Generate affiliate link
    return `https://www.amazon.com/dp/${asin}?tag=${this.affiliateTag}`;
  }

  /**
   * Add affiliate links to description
   */
  addLinksToDescription(description, products) {
    if (!products || products.length === 0) {
      return description;
    }

    let enhancedDescription = description + '\n\n';
    
    // Add disclosure
    enhancedDescription += '━━━━━━━━━━━━━━\n';
    enhancedDescription += '🔗 Links:\n\n';
    
    products.forEach((product, idx) => {
      const link = this.generateLink(product.asin || product.url);
      enhancedDescription += `${idx + 1}. ${product.name}\n${link}\n\n`;
    });

    // FTC compliance
    enhancedDescription += '━━━━━━━━━━━━━━\n';
    enhancedDescription += '📢 Disclosure: Links may earn commission at no extra cost to you.\n';

    return enhancedDescription;
  }

  /**
   * Validate affiliate tag
   */
  isValidTag() {
    return this.affiliateTag && 
           this.affiliateTag.length > 0 && 
           this.affiliateTag !== 'yourtag-20';
  }
}

module.exports = AmazonAffiliate;
