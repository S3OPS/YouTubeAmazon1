// Printify Dropshipping Store - Main Application

// Configuration - Backend API endpoint
const config = {
    apiBaseUrl: window.API_BASE_URL || '/api', // Backend API endpoint (proxies to Printify)
};

// Helper function to safely escape HTML to prevent XSS attacks
function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') {
        return '';
    }
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Helper function to convert dollars to cents for precise calculations
function dollarsToCents(dollars) {
    return Math.round(parseFloat(dollars) * 100);
}

// Helper function to convert cents to dollars for display
function centsToDollars(cents) {
    return (cents / 100).toFixed(2);
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate required field
function isValidRequired(value) {
    return value && value.trim().length > 0;
}

// Validate zip code (basic)
function isValidZip(zip) {
    return zip && zip.trim().length >= 3;
}

// State management
const state = {
    products: [],
    filteredProducts: [],
    cart: [],
    currentCategory: 'all',
    searchTerm: '',
};

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load products (uses API or mock data)
        await loadProducts();

        // Set up event listeners
        setupEventListeners();

        // Render products
        renderProducts();
    } catch (error) {
        console.error('Failed to initialize application:', error);
        const productsContainer = document.getElementById('products-container');
        if (productsContainer) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'loading';
            errorDiv.textContent = 'Error initializing application. Please refresh the page.';
            productsContainer.appendChild(errorDiv);
        }
    }
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
            state.products = getMockProducts();
            state.filteredProducts = state.products;
            return;
        }

        state.products = formatPrintifyProducts(data);
        state.filteredProducts = state.products;
    } catch {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'loading';

        const errorText = document.createElement('p');
        errorText.textContent = 'Error loading products. Using demo data.';
        errorDiv.appendChild(errorText);

        const configText = document.createElement('p');
        configText.style.fontSize = '0.9rem';
        configText.style.color = '#999';
        configText.textContent = 'Configure your Printify API credentials in .env file';
        errorDiv.appendChild(configText);

        productsContainer.innerHTML = '';
        productsContainer.appendChild(errorDiv);

        state.products = getMockProducts();
        state.filteredProducts = state.products;
    }
}

// Format Printify API products
function formatPrintifyProducts(printifyData) {
    return printifyData.data.map((product) => ({
        id: product.id,
        title: product.title,
        description: product.description || 'High-quality print-on-demand product',
        price:
            product.variants && product.variants.length > 0
                ? (product.variants[0].price / 100).toFixed(2)
                : '29.99',
        image: product.images && product.images.length > 0 ? product.images[0].src : null,
        category: product.tags && product.tags.length > 0 ? product.tags[0] : 'apparel',
        variants: product.variants || [],
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
            emoji: '👕',
        },
        {
            id: '2',
            title: 'Hoodie',
            description: 'Comfortable hoodie with vibrant prints',
            price: '44.99',
            image: null,
            category: 'apparel',
            emoji: '🧥',
        },
        {
            id: '3',
            title: 'Coffee Mug',
            description: 'Ceramic mug with custom design',
            price: '14.99',
            image: null,
            category: 'home',
            emoji: '☕',
        },
        {
            id: '4',
            title: 'Canvas Print',
            description: 'Premium canvas wall art',
            price: '39.99',
            image: null,
            category: 'home',
            emoji: '🖼️',
        },
        {
            id: '5',
            title: 'Tote Bag',
            description: 'Eco-friendly tote bag with custom print',
            price: '19.99',
            image: null,
            category: 'accessories',
            emoji: '👜',
        },
        {
            id: '6',
            title: 'Phone Case',
            description: 'Durable phone case with custom design',
            price: '16.99',
            image: null,
            category: 'accessories',
            emoji: '📱',
        },
        {
            id: '7',
            title: 'Sweatshirt',
            description: 'Cozy sweatshirt with premium print',
            price: '34.99',
            image: null,
            category: 'apparel',
            emoji: '👔',
        },
        {
            id: '8',
            title: 'Poster',
            description: 'High-quality poster print',
            price: '12.99',
            image: null,
            category: 'home',
            emoji: '🎨',
        },
    ];
}

// Render products to the grid
function renderProducts() {
    const productsContainer = document.getElementById('products-container');

    if (state.filteredProducts.length === 0) {
        productsContainer.innerHTML = '';
        const noProductsDiv = document.createElement('div');
        noProductsDiv.className = 'loading';
        noProductsDiv.textContent = 'No products found';
        productsContainer.appendChild(noProductsDiv);
        return;
    }

    // Clear container
    productsContainer.innerHTML = '';

    // Create product cards using safe DOM methods
    state.filteredProducts.forEach((product) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-id', product.id);

        // Product image
        const productImage = document.createElement('div');
        productImage.className = 'product-image';

        if (product.image) {
            const img = document.createElement('img');
            img.src = product.image;
            img.alt = escapeHtml(product.title);
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            productImage.appendChild(img);
        } else {
            const emoji = document.createElement('span');
            emoji.textContent = product.emoji || '🎁';
            productImage.appendChild(emoji);
        }

        // Product info
        const productInfo = document.createElement('div');
        productInfo.className = 'product-info';

        const productTitle = document.createElement('div');
        productTitle.className = 'product-title';
        productTitle.textContent = product.title;

        const productDescription = document.createElement('div');
        productDescription.className = 'product-description';
        productDescription.textContent = product.description;

        const productPrice = document.createElement('div');
        productPrice.className = 'product-price';
        productPrice.textContent = `$${product.price}`;

        const addButton = document.createElement('button');
        addButton.className = 'btn-primary add-to-cart';
        addButton.setAttribute('data-id', product.id);
        addButton.textContent = 'Add to Cart';
        addButton.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(product.id);
        });

        productInfo.appendChild(productTitle);
        productInfo.appendChild(productDescription);
        productInfo.appendChild(productPrice);
        productInfo.appendChild(addButton);

        productCard.appendChild(productImage);
        productCard.appendChild(productInfo);

        productsContainer.appendChild(productCard);
    });
}

// Filter products
function filterProducts() {
    state.filteredProducts = state.products.filter((product) => {
        const matchesCategory =
            state.currentCategory === 'all' || product.category === state.currentCategory;
        const matchesSearch =
            product.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(state.searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    renderProducts();
}

// Add product to cart
function addToCart(productId) {
    const product = state.products.find((p) => p.id === productId);
    if (!product) {
        return;
    }

    const existingItem = state.cart.find((item) => item.id === productId);
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
    state.cart = state.cart.filter((item) => item.id !== productId);
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
        cartItems.innerHTML = '';
        const emptyMessage = document.createElement('p');
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.padding = '2rem';
        emptyMessage.style.color = '#999';
        emptyMessage.textContent = 'Your cart is empty';
        cartItems.appendChild(emptyMessage);
        cartTotal.textContent = '0.00';
        return;
    }

    // Clear cart items
    cartItems.innerHTML = '';

    // Calculate total in cents for precision
    let totalCents = 0;

    // Create cart items using safe DOM methods
    state.cart.forEach((item) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        const cartItemInfo = document.createElement('div');
        cartItemInfo.className = 'cart-item-info';

        const cartItemTitle = document.createElement('div');
        cartItemTitle.className = 'cart-item-title';
        cartItemTitle.textContent = item.title;

        const cartItemPrice = document.createElement('div');
        cartItemPrice.className = 'cart-item-price';
        cartItemPrice.textContent = `$${item.price} × ${item.quantity}`;

        const removeButton = document.createElement('button');
        removeButton.className = 'cart-item-remove';
        removeButton.setAttribute('data-id', item.id);
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => {
            removeFromCart(item.id);
        });

        cartItemInfo.appendChild(cartItemTitle);
        cartItemInfo.appendChild(cartItemPrice);
        cartItem.appendChild(cartItemInfo);
        cartItem.appendChild(removeButton);

        cartItems.appendChild(cartItem);

        // Add to total (using cents for precision)
        const itemCents = dollarsToCents(item.price);
        totalCents += itemCents * item.quantity;
    });

    cartTotal.textContent = centsToDollars(totalCents);
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
    document.querySelectorAll('.close').forEach((closeBtn) => {
        closeBtn.addEventListener('click', function () {
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
    // Get form values
    const name = document.getElementById('customer-name').value;
    const email = document.getElementById('customer-email').value;
    const address = document.getElementById('customer-address').value;
    const city = document.getElementById('customer-city').value;
    const zip = document.getElementById('customer-zip').value;
    const country = document.getElementById('customer-country').value;

    // Validate all fields
    const errors = [];

    if (!isValidRequired(name)) {
        errors.push('Name is required');
    }
    if (!isValidEmail(email)) {
        errors.push('Valid email is required');
    }
    if (!isValidRequired(address)) {
        errors.push('Address is required');
    }
    if (!isValidRequired(city)) {
        errors.push('City is required');
    }
    if (!isValidZip(zip)) {
        errors.push('Valid zip code is required');
    }
    if (!isValidRequired(country)) {
        errors.push('Country is required');
    }

    // Show validation errors
    if (errors.length > 0) {
        showNotification('Please fix: ' + errors.join(', '));
        return;
    }

    // Calculate total in cents for precision
    let totalCents = 0;
    state.cart.forEach((item) => {
        const itemCents = dollarsToCents(item.price);
        totalCents += itemCents * item.quantity;
    });

    const formData = {
        name: name,
        email: email,
        address: address,
        city: city,
        zip: zip,
        country: country,
        items: state.cart,
        total: centsToDollars(totalCents),
    };

    try {
        // Create order via backend API
        const nameParts = formData.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || nameParts[0] || 'Customer';

        const orderData = {
            external_id: `ORDER-${Date.now()}`,
            line_items: state.cart.map((item) => ({
                product_id: item.id,
                quantity: item.quantity,
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
                country: formData.country,
            },
        };

        // Send order to backend API
        const response = await fetch(`${config.apiBaseUrl}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create order');
        }

        // Show success message
        showNotification('Order placed successfully! Thank you for your purchase.');

        // Clear cart and close modal
        state.cart = [];
        updateCartCount();
        document.getElementById('checkout-modal').classList.remove('active');
        document.getElementById('checkout-modal').classList.add('hidden');
        document.getElementById('checkout-form').reset();
    } catch (error) {
        showNotification('Error processing order: ' + error.message);
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
