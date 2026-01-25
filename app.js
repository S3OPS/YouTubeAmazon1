// Printify Dropshipping Store - Main Application

// Configuration - Backend API endpoint
const config = {
    apiBaseUrl: '/api'  // Backend API endpoint (proxies to Printify)
};

// State management
const state = {
    products: [],
    filteredProducts: [],
    cart: [],
    currentCategory: 'all',
    searchTerm: ''
};

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing Printify Dropshipping Store...');
    
    // Load mock products (replace with actual API call when configured)
    await loadProducts();
    
    // Set up event listeners
    setupEventListeners();
    
    // Render products
    renderProducts();
});

// Load products from Printify API
async function loadProducts() {
    const productsContainer = document.getElementById('products-container');
    
    try {
        // Make API call to backend which proxies to Printify
        const response = await fetch(`${config.apiBaseUrl}/products`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch products from backend');
        }
        
        const data = await response.json();
        
        // Check if backend is in demo mode
        if (data.demo || !data.data || data.data.length === 0) {
            console.log('Using mock data. Configure API credentials in .env file.');
            state.products = getMockProducts();
            state.filteredProducts = state.products;
            return;
        }
        
        state.products = formatPrintifyProducts(data);
        state.filteredProducts = state.products;
        
    } catch (error) {
        console.error('Error loading products:', error);
        productsContainer.innerHTML = `
            <div class="loading">
                <p>Error loading products. Using demo data.</p>
                <p style="font-size: 0.9rem; color: #999;">Configure your Printify API credentials in .env file</p>
            </div>
        `;
        state.products = getMockProducts();
        state.filteredProducts = state.products;
    }
}

// Format Printify API products
function formatPrintifyProducts(printifyData) {
    return printifyData.data.map(product => ({
        id: product.id,
        title: product.title,
        description: product.description || 'High-quality print-on-demand product',
        price: product.variants && product.variants.length > 0 
            ? (product.variants[0].price / 100).toFixed(2) 
            : '29.99',
        image: product.images && product.images.length > 0 
            ? product.images[0].src 
            : null,
        category: product.tags && product.tags.length > 0 
            ? product.tags[0] 
            : 'apparel',
        variants: product.variants || []
    }));
}

// Mock products for demo
function getMockProducts() {
    return [
        {
            id: '1',
            title: 'Premium T-Shirt',
            description: 'High-quality cotton t-shirt with custom print',
            price: '24.99',
            image: null,
            category: 'apparel',
            emoji: '👕'
        },
        {
            id: '2',
            title: 'Hoodie',
            description: 'Comfortable hoodie with vibrant prints',
            price: '44.99',
            image: null,
            category: 'apparel',
            emoji: '🧥'
        },
        {
            id: '3',
            title: 'Coffee Mug',
            description: 'Ceramic mug with custom design',
            price: '14.99',
            image: null,
            category: 'home',
            emoji: '☕'
        },
        {
            id: '4',
            title: 'Canvas Print',
            description: 'Premium canvas wall art',
            price: '39.99',
            image: null,
            category: 'home',
            emoji: '🖼️'
        },
        {
            id: '5',
            title: 'Tote Bag',
            description: 'Eco-friendly tote bag with custom print',
            price: '19.99',
            image: null,
            category: 'accessories',
            emoji: '👜'
        },
        {
            id: '6',
            title: 'Phone Case',
            description: 'Durable phone case with custom design',
            price: '16.99',
            image: null,
            category: 'accessories',
            emoji: '📱'
        },
        {
            id: '7',
            title: 'Sweatshirt',
            description: 'Cozy sweatshirt with premium print',
            price: '34.99',
            image: null,
            category: 'apparel',
            emoji: '👔'
        },
        {
            id: '8',
            title: 'Poster',
            description: 'High-quality poster print',
            price: '12.99',
            image: null,
            category: 'home',
            emoji: '🎨'
        }
    ];
}

// Render products to the grid
function renderProducts() {
    const productsContainer = document.getElementById('products-container');
    
    if (state.filteredProducts.length === 0) {
        productsContainer.innerHTML = '<div class="loading">No products found</div>';
        return;
    }
    
    const productsHTML = state.filteredProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                ${product.image 
                    ? `<img src="${product.image}" alt="${product.title}" style="width: 100%; height: 100%; object-fit: cover;">` 
                    : `<span>${product.emoji || '🎁'}</span>`
                }
            </div>
            <div class="product-info">
                <div class="product-title">${product.title}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">$${product.price}</div>
                <button class="btn-primary add-to-cart" data-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
    
    productsContainer.innerHTML = productsHTML;
    
    // Add click listeners to add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = button.dataset.id;
            addToCart(productId);
        });
    });
}

// Filter products
function filterProducts() {
    state.filteredProducts = state.products.filter(product => {
        const matchesCategory = state.currentCategory === 'all' || product.category === state.currentCategory;
        const matchesSearch = product.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(state.searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    renderProducts();
}

// Add product to cart
function addToCart(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = state.cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        state.cart.push({ ...product, quantity: 1 });
    }
    
    updateCartCount();
    showNotification('Product added to cart!');
}

// Remove from cart
function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCart();
}

// Update cart count badge
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Render cart modal
function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (state.cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 2rem; color: #999;">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    const cartHTML = state.cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">$${item.price} × ${item.quantity}</div>
            </div>
            <button class="cart-item-remove" data-id="${item.id}">Remove</button>
        </div>
    `).join('');
    
    // Calculate total (Note: For production, use integer-based calculations in cents to avoid floating-point precision errors)
    const total = state.cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    
    cartItems.innerHTML = cartHTML;
    cartTotal.textContent = total.toFixed(2);
    
    // Add remove listeners
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.id;
            removeFromCart(productId);
        });
    });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Setup event listeners
function setupEventListeners() {
    // Category filter
    document.getElementById('category-filter').addEventListener('change', (e) => {
        state.currentCategory = e.target.value;
        filterProducts();
    });
    
    // Search
    document.getElementById('search-input').addEventListener('input', (e) => {
        state.searchTerm = e.target.value;
        filterProducts();
    });
    
    // Cart icon click
    document.querySelector('.cart-icon').addEventListener('click', () => {
        const cartModal = document.getElementById('cart-modal');
        cartModal.classList.remove('hidden');
        cartModal.classList.add('active');
        renderCart();
    });
    
    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
            this.closest('.modal').classList.add('hidden');
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
            e.target.classList.add('hidden');
        }
    });
    
    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (state.cart.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }
        document.getElementById('cart-modal').classList.remove('active');
        document.getElementById('cart-modal').classList.add('hidden');
        document.getElementById('checkout-modal').classList.remove('hidden');
        document.getElementById('checkout-modal').classList.add('active');
    });
    
    // Checkout form submission
    document.getElementById('checkout-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await processOrder();
    });
}

// Process order
async function processOrder() {
    const formData = {
        name: document.getElementById('customer-name').value,
        email: document.getElementById('customer-email').value,
        address: document.getElementById('customer-address').value,
        city: document.getElementById('customer-city').value,
        zip: document.getElementById('customer-zip').value,
        country: document.getElementById('customer-country').value,
        items: state.cart,
        total: state.cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0)
    };
    
    console.log('Processing order:', formData);
    
    try {
        // Create order via backend API
        const nameParts = formData.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || nameParts[0] || 'Customer';
        
        const orderData = {
            external_id: `ORDER-${Date.now()}`,
            line_items: state.cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity
            })),
            shipping_method: 1,
            send_shipping_notification: false,
            address_to: {
                first_name: firstName,
                last_name: lastName,
                email: formData.email,
                address1: formData.address,
                city: formData.city,
                zip: formData.zip,
                country: formData.country
            }
        };
        
        // Send order to backend API
        const response = await fetch(`${config.apiBaseUrl}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to create order');
        }
        
        console.log('Order created successfully');
        
        // Show success message
        showNotification('Order placed successfully! Thank you for your purchase.');
        
        // Clear cart and close modal
        state.cart = [];
        updateCartCount();
        document.getElementById('checkout-modal').classList.remove('active');
        document.getElementById('checkout-modal').classList.add('hidden');
        document.getElementById('checkout-form').reset();
        
    } catch (error) {
        console.error('Error processing order:', error);
        showNotification('Error processing order. Please try again.');
    }
}

// Add CSS animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
