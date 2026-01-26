// Backend API Server for Printify Dropshipping Store
// This server proxies requests to Printify API with secure server-side credentials

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const logger = require('./logger');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Request ID middleware for tracking
app.use((req, res, next) => {
    req.id = uuidv4();
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

// Validate environment variables
if (!PRINTIFY_API_TOKEN || !PRINTIFY_SHOP_ID) {
    if (NODE_ENV === 'production') {
        logger.error('FATAL: Printify API credentials not configured in production!');
        logger.error('Set PRINTIFY_API_TOKEN and PRINTIFY_SHOP_ID in environment variables');
        process.exit(1);
    } else {
        logger.warn('Printify API credentials not configured - running in demo mode');
    }
}

// Helper function to make Printify API requests
async function makePrintifyRequest(endpoint, options = {}) {
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

        if (!PRINTIFY_API_TOKEN || !PRINTIFY_SHOP_ID) {
            return res.json({
                error: 'API not configured',
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
        if (!PRINTIFY_API_TOKEN || !PRINTIFY_SHOP_ID) {
            return res.status(503).json({
                error: 'API not configured',
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

            if (!PRINTIFY_API_TOKEN || !PRINTIFY_SHOP_ID) {
                return res.status(503).json({
                    error: 'API not configured',
                    message: 'Cannot create orders in demo mode',
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

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json({
        status: 'ok',
        configured: !!(PRINTIFY_API_TOKEN && PRINTIFY_SHOP_ID),
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
        apiConfigured: !!(PRINTIFY_API_TOKEN && PRINTIFY_SHOP_ID),
    });

    if (NODE_ENV === 'development') {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📦 API endpoints available at http://localhost:${PORT}/api`);

        if (PRINTIFY_API_TOKEN && PRINTIFY_SHOP_ID) {
            console.log('✅ Printify API configured');
        } else {
            console.log('⚠️  Running in DEMO mode - configure .env file for real API access');
        }
    }
});

module.exports = server;
