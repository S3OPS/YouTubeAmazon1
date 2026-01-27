// Backend API Server for Printify Dropshipping Store
// This server proxies requests to Printify API with secure server-side credentials

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { randomUUID } = require('crypto');
const logger = require('./logger');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Request ID middleware for tracking
app.use((req, res, next) => {
    req.id = randomUUID();
    res.setHeader('X-Request-ID', req.id);
    next();
});

// Request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info('HTTP Request', {
            requestId: req.id,
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
        });
    });
    next();
});

// Security middleware - Helmet for security headers
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", 'data:', 'https:'],
                connectSrc: ["'self'"],
            },
        },
    })
);

// Rate limiting to prevent abuse
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply rate limiting to API routes
app.use('/api/', apiLimiter);

// CORS configuration - whitelist for production
const corsOptions = {
    origin:
        NODE_ENV === 'production'
            ? (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',')
            : '*',
    credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Static files with caching
app.use(
    express.static(path.join(__dirname), {
        maxAge: NODE_ENV === 'production' ? '1d' : 0,
        etag: true,
        lastModified: true,
    })
);

// Printify API configuration
const PRINTIFY_API_TOKEN = process.env.PRINTIFY_API_TOKEN;
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID;
const PRINTIFY_API_BASE_URL = process.env.PRINTIFY_API_BASE_URL || 'https://api.printify.com/v1';

// Placeholder values from .env.example
const PLACEHOLDER_API_TOKEN = 'your_api_token_here';
const PLACEHOLDER_SHOP_ID = 'your_shop_id_here';

// Validate environment variables
const hasValidCredentials = !!(
    PRINTIFY_API_TOKEN &&
    PRINTIFY_SHOP_ID &&
    PRINTIFY_API_TOKEN !== PLACEHOLDER_API_TOKEN &&
    PRINTIFY_SHOP_ID !== PLACEHOLDER_SHOP_ID
);

if (!hasValidCredentials) {
    if (NODE_ENV === 'production') {
        logger.error('FATAL: Printify API credentials not configured in production!');
        logger.error('Set PRINTIFY_API_TOKEN and PRINTIFY_SHOP_ID in environment variables');
        logger.error('Get your API token from: https://printify.com/app/account/api');
        process.exit(1);
    } else {
        logger.warn('⚠️  Printify API credentials not configured - running in demo mode');
        logger.warn('To connect to Printify API:');
        logger.warn('1. Copy .env.example to .env');
        logger.warn('2. Get your API token from: https://printify.com/app/account/api');
        logger.warn('3. Update PRINTIFY_API_TOKEN and PRINTIFY_SHOP_ID in .env file');
    }
}

// Helper function to make Printify API requests
async function makePrintifyRequest(endpoint, options = {}) {
    // Validate credentials before making API request
    if (!hasValidCredentials) {
        throw new Error(
            'Printify API credentials not configured. Please set PRINTIFY_API_TOKEN and PRINTIFY_SHOP_ID in your .env file.'
        );
    }

    const url = `${PRINTIFY_API_BASE_URL}${endpoint}`;
    const headers = {
        Authorization: `Bearer ${PRINTIFY_API_TOKEN}`,
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorText = await response.text();
        // Provide helpful error messages for common issues
        if (response.status === 401) {
            throw new Error(
                `Authentication failed. Please check your PRINTIFY_API_TOKEN in .env file. Status: ${response.status}`
            );
        }
        throw new Error(`Printify API error: ${response.status} - ${errorText}`);
    }

    return response.json();
}

// API Routes

// Get all products with pagination
app.get('/api/products', async (req, res) => {
    try {
        // Set cache headers
        res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes

        if (!hasValidCredentials) {
            return res.status(503).json({
                error: 'Printify API not configured',
                message: 'Please configure PRINTIFY_API_TOKEN and PRINTIFY_SHOP_ID in .env file',
                demo: true,
                data: [],
            });
        }

        // Extract pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;

        // Validate pagination parameters
        if (page < 1 || limit < 1 || limit > 100) {
            return res.status(400).json({
                error: 'Invalid pagination parameters',
                message: 'Page must be >= 1, limit must be 1-100',
            });
        }

        const endpoint = `/shops/${PRINTIFY_SHOP_ID}/products.json?page=${page}&limit=${limit}`;
        const data = await makePrintifyRequest(endpoint);

        res.json({
            ...data,
            pagination: {
                page,
                limit,
                total: data.data?.length || 0,
            },
        });
    } catch (error) {
        logger.error('Error fetching products', {
            requestId: req.id,
            error: error.message,
            stack: NODE_ENV === 'development' ? error.stack : undefined,
        });
        res.status(500).json({
            error: 'Failed to fetch products',
            message: NODE_ENV === 'development' ? error.message : 'Internal server error',
            demo: true,
            data: [],
        });
    }
});

// Get single product
app.get('/api/products/:productId', async (req, res) => {
    try {
        if (!hasValidCredentials) {
            return res.status(503).json({
                error: 'Printify API not configured',
                message: 'Please configure PRINTIFY_API_TOKEN and PRINTIFY_SHOP_ID in .env file',
            });
        }

        const { productId } = req.params;
        const data = await makePrintifyRequest(
            `/shops/${PRINTIFY_SHOP_ID}/products/${productId}.json`
        );
        res.json(data);
    } catch (error) {
        logger.error('Error fetching product', {
            requestId: req.id,
            productId: req.params.productId,
            error: error.message,
        });
        res.status(500).json({
            error: 'Failed to fetch product',
            message: NODE_ENV === 'development' ? error.message : 'Internal server error',
        });
    }
});

// Create order with validation
app.post(
    '/api/orders',
    [
        body('external_id').notEmpty().trim().withMessage('Order ID is required'),
        body('line_items').isArray({ min: 1 }).withMessage('At least one item required'),
        body('address_to.first_name').notEmpty().trim().withMessage('First name is required'),
        body('address_to.last_name').notEmpty().trim().withMessage('Last name is required'),
        body('address_to.email').isEmail().normalizeEmail().withMessage('Valid email is required'),
        body('address_to.address1').notEmpty().trim().withMessage('Address is required'),
        body('address_to.city').notEmpty().trim().withMessage('City is required'),
        body('address_to.zip').notEmpty().trim().withMessage('ZIP code is required'),
        body('address_to.country')
            .notEmpty()
            .trim()
            .isLength({ min: 2, max: 2 })
            .withMessage('Country must be a 2-letter ISO code (e.g., US, GB, CA)')
            .isISO31661Alpha2()
            .withMessage('Invalid country code'),
    ],
    async (req, res) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: 'Validation failed',
                    errors: errors.array(),
                });
            }

            if (!hasValidCredentials) {
                return res.status(503).json({
                    error: 'Printify API not configured',
                    message:
                        'Cannot create orders - please configure PRINTIFY_API_TOKEN and PRINTIFY_SHOP_ID in .env file',
                });
            }

            const orderData = req.body;

            const data = await makePrintifyRequest(`/shops/${PRINTIFY_SHOP_ID}/orders.json`, {
                method: 'POST',
                body: JSON.stringify(orderData),
            });

            res.json(data);
        } catch (error) {
            logger.error('Error creating order', {
                requestId: req.id,
                error: error.message,
                orderData: req.body.external_id,
            });
            res.status(500).json({
                error: 'Failed to create order',
                message: NODE_ENV === 'development' ? error.message : 'Internal server error',
            });
        }
    }
);

// ===========================================
// YouTube Automation API Endpoints
// ===========================================

const youtubeApi = require('./youtube-api');
const amazonAffiliate = require('./amazon-affiliate');
const videoProcessor = require('./video-processor');
const automationScheduler = require('./automation-scheduler');

// Initialize automation on startup if enabled
(async () => {
    try {
        const autoUpload = process.env.AUTO_UPLOAD === 'true';
        if (autoUpload) {
            await automationScheduler.initialize();
            automationScheduler.start();
            logger.info('Automation scheduler started successfully');
        }
    } catch (error) {
        logger.error('Failed to start automation scheduler', {
            error: error.message,
        });
    }
})();

// Get automation status
app.get('/api/automation/status', (req, res) => {
    try {
        const status = automationScheduler.getStatus();
        res.json({
            success: true,
            ...status,
        });
    } catch (error) {
        logger.error('Error getting automation status', {
            requestId: req.id,
            error: error.message,
        });
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

// Manually trigger video processing and upload
app.post('/api/automation/trigger', async (req, res) => {
    try {
        logger.info('Manual trigger requested', { requestId: req.id });
        const results = await automationScheduler.triggerNow();
        res.json({
            success: true,
            results,
        });
    } catch (error) {
        logger.error('Error triggering automation', {
            requestId: req.id,
            error: error.message,
        });
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

// Generate Amazon affiliate link
app.post(
    '/api/affiliate/generate',
    [body('productUrl').notEmpty().trim().withMessage('Product URL or ASIN is required')],
    (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array(),
                });
            }

            const { productUrl, campaign, content } = req.body;
            const affiliateLink = amazonAffiliate.generateLink(productUrl, { campaign, content });

            res.json({
                success: true,
                affiliateLink,
                productUrl,
            });
        } catch (error) {
            logger.error('Error generating affiliate link', {
                requestId: req.id,
                error: error.message,
            });
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }
);

// Upload video to YouTube
app.post(
    '/api/youtube/upload',
    [
        body('filePath').notEmpty().trim().withMessage('Video file path is required'),
        body('title').notEmpty().trim().withMessage('Video title is required'),
        body('description').optional().trim(),
        body('tags').optional().isArray(),
        body('products').optional().isArray(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array(),
                });
            }

            const { filePath, title, description, tags, products } = req.body;

            // Process video with affiliate links
            const processedMetadata = await videoProcessor.processVideo({
                filePath,
                title,
                description,
                products: products || [],
                tags: tags || [],
            });

            // Upload to YouTube
            const uploadResult = await youtubeApi.uploadVideo({
                filePath: processedMetadata.filePath,
                title: processedMetadata.title,
                description: processedMetadata.description,
                tags: processedMetadata.tags,
                privacyStatus: req.body.privacyStatus || 'public',
            });

            if (uploadResult.success) {
                await videoProcessor.markAsUploaded(
                    filePath,
                    uploadResult.videoId,
                    uploadResult.videoUrl
                );
            }

            res.json(uploadResult);
        } catch (error) {
            logger.error('Error uploading video', {
                requestId: req.id,
                error: error.message,
            });
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }
);

// Get YouTube OAuth URL
app.get('/api/youtube/auth-url', (req, res) => {
    try {
        const authUrl = youtubeApi.getAuthUrl();
        res.json({
            success: true,
            authUrl,
        });
    } catch (error) {
        logger.error('Error getting auth URL', {
            requestId: req.id,
            error: error.message,
        });
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

// OAuth2 callback
app.get('/oauth2callback', async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) {
            return res.status(400).send('Authorization code missing');
        }

        const tokens = await youtubeApi.getTokensFromCode(code);

        res.send(`
            <h1>Authorization Successful!</h1>
            <p>Copy this refresh token to your .env file:</p>
            <pre>YOUTUBE_REFRESH_TOKEN=${tokens.refresh_token}</pre>
            <p>You can close this window.</p>
        `);
    } catch (error) {
        logger.error('Error in OAuth callback', {
            error: error.message,
        });
        res.status(500).send('Authorization failed: ' + error.message);
    }
});

// Scan for videos
app.get('/api/videos/scan', async (req, res) => {
    try {
        const videos = await videoProcessor.scanForVideos();
        res.json({
            success: true,
            count: videos.length,
            videos,
        });
    } catch (error) {
        logger.error('Error scanning for videos', {
            requestId: req.id,
            error: error.message,
        });
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json({
        status: 'ok',
        configured: hasValidCredentials,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: NODE_ENV,
    });
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
const server = app.listen(PORT, () => {
    logger.info(`Server starting`, {
        port: PORT,
        environment: NODE_ENV,
        apiConfigured: hasValidCredentials,
    });

    if (NODE_ENV === 'development') {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📦 API endpoints available at http://localhost:${PORT}/api`);

        if (hasValidCredentials) {
            console.log('✅ Printify API configured');
        } else {
            console.log('⚠️  Running in DEMO mode - configure .env file for real API access');
            console.log('📝 Copy .env.example to .env and add your Printify credentials');
            console.log('🔑 Get API token: https://printify.com/app/account/api');
        }
    }
});

module.exports = server;
