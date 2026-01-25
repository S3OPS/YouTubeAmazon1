// Backend API Server for Printify Dropshipping Store
// This server proxies requests to Printify API with secure server-side credentials

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security middleware - Helmet for security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"]
        }
    }
}));

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
    origin: NODE_ENV === 'production' 
        ? (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',')
        : '*',
    credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Printify API configuration
const PRINTIFY_API_TOKEN = process.env.PRINTIFY_API_TOKEN;
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID;
const PRINTIFY_API_BASE_URL = process.env.PRINTIFY_API_BASE_URL || 'https://api.printify.com/v1';

// Validate environment variables
if (!PRINTIFY_API_TOKEN || !PRINTIFY_SHOP_ID) {
    if (NODE_ENV === 'production') {
        console.error('FATAL: Printify API credentials not configured in production!');
        console.error('Set PRINTIFY_API_TOKEN and PRINTIFY_SHOP_ID in environment variables');
        process.exit(1);
    }
}

// Helper function to make Printify API requests
async function makePrintifyRequest(endpoint, options = {}) {
    const url = `${PRINTIFY_API_BASE_URL}${endpoint}`;
    const headers = {
        'Authorization': `Bearer ${PRINTIFY_API_TOKEN}`,
        'Content-Type': 'application/json',
        ...options.headers
    };

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Printify API error: ${response.status} - ${errorText}`);
    }

    return response.json();
}

// API Routes

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        if (!PRINTIFY_API_TOKEN || !PRINTIFY_SHOP_ID) {
            return res.json({ 
                error: 'API not configured',
                demo: true,
                data: []
            });
        }

        const data = await makePrintifyRequest(`/shops/${PRINTIFY_SHOP_ID}/products.json`);
        res.json(data);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to fetch products',
            message: NODE_ENV === 'development' ? error.message : 'Internal server error',
            demo: true,
            data: []
        });
    }
});

// Get single product
app.get('/api/products/:productId', async (req, res) => {
    try {
        if (!PRINTIFY_API_TOKEN || !PRINTIFY_SHOP_ID) {
            return res.status(503).json({ 
                error: 'API not configured'
            });
        }

        const { productId } = req.params;
        const data = await makePrintifyRequest(`/shops/${PRINTIFY_SHOP_ID}/products/${productId}.json`);
        res.json(data);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to fetch product',
            message: NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Create order with validation
app.post('/api/orders', [
    body('external_id').notEmpty().trim(),
    body('line_items').isArray({ min: 1 }),
    body('address_to.first_name').notEmpty().trim(),
    body('address_to.last_name').notEmpty().trim(),
    body('address_to.email').isEmail().normalizeEmail(),
    body('address_to.address1').notEmpty().trim(),
    body('address_to.city').notEmpty().trim(),
    body('address_to.zip').notEmpty().trim(),
    body('address_to.country').notEmpty().trim().isLength({ min: 2, max: 2 })
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Validation failed',
                errors: errors.array()
            });
        }
        
        if (!PRINTIFY_API_TOKEN || !PRINTIFY_SHOP_ID) {
            return res.status(503).json({ 
                error: 'API not configured',
                message: 'Cannot create orders in demo mode'
            });
        }

        const orderData = req.body;
        
        const data = await makePrintifyRequest(`/shops/${PRINTIFY_SHOP_ID}/orders.json`, {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
        
        res.json(data);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to create order',
            message: NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok',
        configured: !!(PRINTIFY_API_TOKEN && PRINTIFY_SHOP_ID),
        timestamp: new Date().toISOString()
    });
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
const server = app.listen(PORT, () => {
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
