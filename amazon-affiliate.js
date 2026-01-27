// Amazon Affiliate Link Management Module
// Handles generation and management of Amazon affiliate links

const logger = require('./logger');

class AmazonAffiliate {
    constructor() {
        this.affiliateTag = process.env.AMAZON_AFFILIATE_TAG;
        this.trackingId = process.env.AMAZON_TRACKING_ID || this.affiliateTag;
        this.baseUrl = 'https://www.amazon.com';
        this.initialized = false;
    }

    /**
     * Initialize Amazon Affiliate module
     */
    initialize() {
        if (!this.affiliateTag) {
            throw new Error('Missing AMAZON_AFFILIATE_TAG environment variable');
        }

        this.initialized = true;
        logger.info('Amazon Affiliate module initialized', {
            tag: this.affiliateTag,
        });
    }

    /**
     * Generate affiliate link for a product
     * @param {string} productUrl - Amazon product URL or ASIN
     * @param {Object} options - Additional options
     * @param {string} options.campaign - Campaign name for tracking
     * @param {string} options.content - Content identifier
     * @returns {string} Affiliate link
     */
    generateLink(productUrl, options = {}) {
        if (!this.initialized) {
            this.initialize();
        }

        try {
            let asin = '';
            let url = '';

            // Check if input is an ASIN (10 characters, alphanumeric)
            if (/^[A-Z0-9]{10}$/.test(productUrl)) {
                asin = productUrl;
                url = `${this.baseUrl}/dp/${asin}`;
            } else {
                // Extract ASIN from URL
                const asinMatch = productUrl.match(/\/([A-Z0-9]{10})(?:[/?]|$)/);
                if (asinMatch) {
                    asin = asinMatch[1];
                    url = `${this.baseUrl}/dp/${asin}`;
                } else {
                    // Use the URL as-is
                    url = productUrl;
                }
            }

            // Build affiliate link
            const urlModule = require('url');
            const params = new urlModule.URLSearchParams({
                tag: this.affiliateTag,
            });

            // Add optional tracking parameters
            if (options.campaign) {
                params.append('campaign', options.campaign);
            }
            if (options.content) {
                params.append('content', options.content);
            }

            const affiliateLink = `${url}?${params.toString()}`;

            logger.info('Generated affiliate link', {
                asin,
                url: affiliateLink.substring(0, 100) + '...',
            });

            return affiliateLink;
        } catch (error) {
            logger.error('Failed to generate affiliate link', {
                error: error.message,
                productUrl,
            });
            throw error;
        }
    }

    /**
     * Generate multiple affiliate links
     * @param {Array<string>} products - Array of product URLs or ASINs
     * @param {Object} options - Options for link generation
     * @returns {Array<string>} Array of affiliate links
     */
    generateLinks(products, options = {}) {
        if (!this.initialized) {
            this.initialize();
        }

        return products.map((product, index) => {
            const linkOptions = {
                ...options,
                content: options.content || `product-${index + 1}`,
            };
            return this.generateLink(product, linkOptions);
        });
    }

    /**
     * Create formatted description with affiliate links
     * @param {Object} params - Description parameters
     * @param {string} params.title - Video title/description
     * @param {Array<Object>} params.products - Array of product objects
     * @param {string} params.products[].name - Product name
     * @param {string} params.products[].url - Product URL or ASIN
     * @param {string} params.disclaimer - Affiliate disclaimer text
     * @returns {string} Formatted description with affiliate links
     */
    createDescription(params) {
        if (!this.initialized) {
            this.initialize();
        }

        const {
            title = '',
            products = [],
            disclaimer = '* As an Amazon Associate, I earn from qualifying purchases.',
        } = params;

        let description = title ? `${title}\n\n` : '';

        // Add products section
        if (products.length > 0) {
            description += '🛒 Products Featured:\n\n';
            products.forEach((product, index) => {
                const affiliateLink = this.generateLink(product.url, {
                    content: `product-${index + 1}`,
                });
                description += `${index + 1}. ${product.name}\n   ${affiliateLink}\n\n`;
            });
        }

        // Add disclaimer
        if (disclaimer) {
            description += `\n---\n${disclaimer}\n`;
        }

        logger.info('Created affiliate description', {
            productCount: products.length,
            length: description.length,
        });

        return description;
    }

    /**
     * Extract product information from description
     * @param {string} description - Description text
     * @returns {Array<Object>} Extracted products
     */
    extractProducts(description) {
        const products = [];
        const asinRegex = /amazon\.com\/(?:dp|gp\/product)\/([A-Z0-9]{10})/g;

        let match;
        while ((match = asinRegex.exec(description)) !== null) {
            products.push({
                asin: match[1],
                url: `${this.baseUrl}/dp/${match[1]}`,
            });
        }

        return products;
    }

    /**
     * Validate affiliate link
     * @param {string} link - Link to validate
     * @returns {boolean} True if valid affiliate link
     */
    isValidAffiliateLink(link) {
        if (!this.affiliateTag) {
            return false;
        }

        try {
            const urlModule = require('url');
            const parsedUrl = new urlModule.URL(link);
            const tag = parsedUrl.searchParams.get('tag');
            return tag === this.affiliateTag;
        } catch {
            return false;
        }
    }

    /**
     * Get earnings tracking URL
     * @returns {string} Amazon Associates dashboard URL
     */
    getTrackingUrl() {
        return 'https://affiliate-program.amazon.com/home';
    }
}

// Export singleton instance
module.exports = new AmazonAffiliate();
