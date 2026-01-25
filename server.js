// Backend API Server for Printify Dropshipping Store
// This server proxies requests to Printify API with secure server-side credentials

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Printify API configuration
const PRINTIFY_API_TOKEN = process.env.PRINTIFY_API_TOKEN;
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID;
const PRINTIFY_API_BASE_URL = process.env.PRINTIFY_API_BASE_URL || 'https://api.printify.com/v1';

// Validate environment variables
if (!PRINTIFY_API_TOKEN || !PRINTIFY_SHOP_ID) {
    console.warn('⚠️  WARNING: Printify API credentials not configured!');
    console.warn('   Set PRINTIFY_API_TOKEN and PRINTIFY_SHOP_ID in .env file');
    console.warn('   Server will run in demo mode.');
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
        console.error('Error fetching products:', error);
        res.status(500).json({ 
            error: 'Failed to fetch products',
            message: error.message,
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
        console.error('Error fetching product:', error);
        res.status(500).json({ 
            error: 'Failed to fetch product',
            message: error.message
        });
    }
});

// Create order
app.post('/api/orders', async (req, res) => {
    try {
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
        console.error('Error creating order:', error);
        res.status(500).json({ 
            error: 'Failed to create order',
            message: error.message
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
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📦 API endpoints available at http://localhost:${PORT}/api`);
    
    if (PRINTIFY_API_TOKEN && PRINTIFY_SHOP_ID) {
        console.log('✅ Printify API configured');
    } else {
        console.log('⚠️  Running in DEMO mode - configure .env file for real API access');
    }
});
