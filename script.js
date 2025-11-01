// Admin Key (reads from config.js which supports environment variables)
const ADMIN_KEY = window.APP_CONFIG.admin.key;

// Session Management
const ADMIN_SESSION_KEY = 'admin_authenticated';

// Products will be loaded from Supabase
let productsData = null;

// Categories and Materials will be loaded from Supabase
let categoriesData = [];
let materialsData = [];

// Category icon mapping
const categoryIcons = {
    'screws': 'fa-bolt',
    'bolts': 'fa-grip-lines',
    'nuts': 'fa-circle-notch',
    'washers': 'fa-circle',
    'anchors': 'fa-anchor',
    'rivets': 'fa-dot-circle',
    'one-way-clutch': 'fa-cog'
};

// Default Product Database
const defaultProducts = [
    // Screws
    {
        id: 1,
        name: 'Stainless Steel Phillips Head Screw',
        category: 'screws',
        material: 'stainless-steel',
        finish: 'plain',
        price: 0.15,
        size: 'M6 x 40mm',
        description: 'High-quality stainless steel Phillips head screws, corrosion-resistant and suitable for both indoor and outdoor applications.',
        image: 'https://images.unsplash.com/photo-1615733487868-c5d05d1c5d39?w=400&h=400&fit=crop'
    },
    {
        id: 2,
        name: 'Zinc Plated Wood Screw',
        category: 'screws',
        material: 'carbon-steel',
        finish: 'zinc-plated',
        price: 0.08,
        size: '#8 x 1.5"',
        description: 'Durable wood screws with zinc plating for enhanced corrosion resistance. Perfect for carpentry and woodworking projects.',
        image: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=400&h=400&fit=crop'
    },
    {
        id: 3,
        name: 'Black Oxide Machine Screw',
        category: 'screws',
        material: 'carbon-steel',
        finish: 'black-oxide',
        price: 0.12,
        size: 'M5 x 30mm',
        description: 'Precision machine screws with black oxide finish. Ideal for mechanical assemblies and equipment manufacturing.',
        image: 'https://images.unsplash.com/photo-1598659003036-f29a25efb6b5?w=400&h=400&fit=crop'
    },
    {
        id: 4,
        name: 'Brass Flathead Screw',
        category: 'screws',
        material: 'brass',
        finish: 'plain',
        price: 0.22,
        size: 'M4 x 25mm',
        description: 'Premium brass flathead screws offering excellent conductivity and aesthetic appeal for decorative applications.',
        image: 'https://images.unsplash.com/photo-1615733487868-c5d05d1c5d39?w=400&h=400&fit=crop&sat=-100'
    },

    // Bolts
    {
        id: 5,
        name: 'Hex Head Bolt Grade 8.8',
        category: 'bolts',
        material: 'carbon-steel',
        finish: 'zinc-plated',
        price: 0.35,
        size: 'M10 x 60mm',
        description: 'High-strength hex head bolts rated Grade 8.8. Suitable for structural applications requiring reliable fastening.',
        image: 'https://images.unsplash.com/photo-1504326046-fa3bcc4c3461?w=400&h=400&fit=crop'
    },
    {
        id: 6,
        name: 'Stainless Steel Carriage Bolt',
        category: 'bolts',
        material: 'stainless-steel',
        finish: 'plain',
        price: 0.42,
        size: 'M8 x 50mm',
        description: 'Smooth dome head carriage bolts in stainless steel. Perfect for wood-to-wood or wood-to-metal connections.',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop'
    },
    {
        id: 7,
        name: 'Galvanized U-Bolt',
        category: 'bolts',
        material: 'carbon-steel',
        finish: 'galvanized',
        price: 1.25,
        size: '1/2" x 4"',
        description: 'Heavy-duty U-bolts with galvanized finish. Commonly used for pipe mounting and vehicle suspension systems.',
        image: 'https://images.unsplash.com/photo-1587653915936-5623ea0b949a?w=400&h=400&fit=crop'
    },
    {
        id: 8,
        name: 'Aluminum Eye Bolt',
        category: 'bolts',
        material: 'aluminum',
        finish: 'plain',
        price: 0.95,
        size: 'M12 x 70mm',
        description: 'Lightweight aluminum eye bolts for lifting and rigging applications. Corrosion-resistant and durable.',
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop'
    },

    // Nuts
    {
        id: 9,
        name: 'Hex Nut Grade A',
        category: 'nuts',
        material: 'carbon-steel',
        finish: 'zinc-plated',
        price: 0.05,
        size: 'M10',
        description: 'Standard hex nuts with zinc plating. Compatible with metric bolts for general fastening applications.',
        image: 'https://images.unsplash.com/photo-1599932193825-8c13cc8e5b3b?w=400&h=400&fit=crop'
    },
    {
        id: 10,
        name: 'Stainless Steel Lock Nut',
        category: 'nuts',
        material: 'stainless-steel',
        finish: 'plain',
        price: 0.18,
        size: 'M8',
        description: 'Self-locking nuts with nylon insert to prevent loosening from vibration. Marine-grade stainless steel.',
        image: 'https://images.unsplash.com/photo-1593115057582-0bc2316d050e?w=400&h=400&fit=crop'
    },
    {
        id: 11,
        name: 'Wing Nut Brass',
        category: 'nuts',
        material: 'brass',
        finish: 'plain',
        price: 0.28,
        size: 'M6',
        description: 'Hand-tightenable wing nuts in brass. Ideal for applications requiring frequent assembly and disassembly.',
        image: 'https://images.unsplash.com/photo-1599932193825-8c13cc8e5b3b?w=400&h=400&fit=crop&hue=30'
    },
    {
        id: 12,
        name: 'Square Nut Heavy Duty',
        category: 'nuts',
        material: 'carbon-steel',
        finish: 'black-oxide',
        price: 0.15,
        size: 'M12',
        description: 'Square nuts designed to resist rotation. Excellent for wood applications and rough construction.',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop&sat=-50'
    },

    // Washers
    {
        id: 13,
        name: 'Flat Washer Stainless',
        category: 'washers',
        material: 'stainless-steel',
        finish: 'plain',
        price: 0.03,
        size: 'M10',
        description: 'Standard flat washers to distribute load and protect surfaces. Corrosion-resistant stainless steel.',
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop&contrast=20'
    },
    {
        id: 14,
        name: 'Spring Lock Washer',
        category: 'washers',
        material: 'carbon-steel',
        finish: 'zinc-plated',
        price: 0.04,
        size: 'M8',
        description: 'Split ring spring washers to prevent loosening under vibration. Zinc-plated for corrosion resistance.',
        image: 'https://images.unsplash.com/photo-1587653915936-5623ea0b949a?w=400&h=400&fit=crop&contrast=30'
    },
    {
        id: 15,
        name: 'Fender Washer Large',
        category: 'washers',
        material: 'carbon-steel',
        finish: 'galvanized',
        price: 0.08,
        size: '1/4" x 1.5"',
        description: 'Extra-large diameter washers for distributing load over soft materials. Galvanized for outdoor use.',
        image: 'https://images.unsplash.com/photo-1504326046-fa3bcc4c3461?w=400&h=400&fit=crop&contrast=40'
    },
    {
        id: 16,
        name: 'Rubber Washer Seal',
        category: 'washers',
        material: 'rubber',
        finish: 'plain',
        price: 0.06,
        size: 'M10',
        description: 'EPDM rubber washers for sealing applications. Weather-resistant and suitable for plumbing installations.',
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop&sat=-80'
    },

    // Anchors
    {
        id: 17,
        name: 'Concrete Wedge Anchor',
        category: 'anchors',
        material: 'carbon-steel',
        finish: 'zinc-plated',
        price: 0.65,
        size: 'M12 x 100mm',
        description: 'Heavy-duty wedge anchors for concrete and masonry. Provides high pull-out and shear strength.',
        image: 'https://images.unsplash.com/photo-1504326046-fa3bcc4c3461?w=400&h=400&fit=crop&brightness=-10'
    },
    {
        id: 18,
        name: 'Plastic Wall Anchor',
        category: 'anchors',
        material: 'nylon',
        finish: 'plain',
        price: 0.08,
        size: '#10 x 1"',
        description: 'Ribbed plastic anchors for drywall and hollow walls. Easy installation for light to medium loads.',
        image: 'https://images.unsplash.com/photo-1615733487868-c5d05d1c5d39?w=400&h=400&fit=crop&hue=210'
    },
    {
        id: 19,
        name: 'Toggle Bolt Heavy Duty',
        category: 'anchors',
        material: 'carbon-steel',
        finish: 'zinc-plated',
        price: 0.45,
        size: '1/4" x 3"',
        description: 'Spring-loaded toggle bolts for hollow walls. Excellent holding power for heavy fixtures and shelves.',
        image: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=400&h=400&fit=crop&brightness=-5'
    },
    {
        id: 20,
        name: 'Sleeve Anchor Stainless',
        category: 'anchors',
        material: 'stainless-steel',
        finish: 'plain',
        price: 0.85,
        size: 'M10 x 75mm',
        description: 'Versatile sleeve anchors for concrete, brick, and block. Stainless steel for marine and coastal applications.',
        image: 'https://images.unsplash.com/photo-1598659003036-f29a25efb6b5?w=400&h=400&fit=crop&brightness=5'
    },

    // Rivets
    {
        id: 21,
        name: 'Aluminum Pop Rivet',
        category: 'rivets',
        material: 'aluminum',
        finish: 'plain',
        price: 0.12,
        size: '1/8" x 1/4"',
        description: 'Standard blind rivets in aluminum. Quick installation for joining thin sheet materials.',
        image: 'https://images.unsplash.com/photo-1599932193825-8c13cc8e5b3b?w=400&h=400&fit=crop&brightness=10'
    },
    {
        id: 22,
        name: 'Stainless Steel Rivet',
        category: 'rivets',
        material: 'stainless-steel',
        finish: 'plain',
        price: 0.18,
        size: '3/16" x 1/2"',
        description: 'Corrosion-resistant stainless steel rivets. Perfect for marine, food service, and outdoor applications.',
        image: 'https://images.unsplash.com/photo-1593115057582-0bc2316d050e?w=400&h=400&fit=crop&brightness=-5'
    },
    {
        id: 23,
        name: 'Brass Solid Rivet',
        category: 'rivets',
        material: 'brass',
        finish: 'plain',
        price: 0.25,
        size: '#10 x 3/8"',
        description: 'Traditional solid brass rivets for decorative and electrical applications. Requires rivet setting tools.',
        image: 'https://images.unsplash.com/photo-1599932193825-8c13cc8e5b3b?w=400&h=400&fit=crop&hue=40'
    },
    {
        id: 24,
        name: 'Multi-Grip Rivet Steel',
        category: 'rivets',
        material: 'carbon-steel',
        finish: 'zinc-plated',
        price: 0.15,
        size: '1/8" x 3/8"',
        description: 'Versatile multi-grip rivets for varying material thickness. Zinc-plated steel with aluminum mandrel.',
        image: 'https://images.unsplash.com/photo-1587653915936-5623ea0b949a?w=400&h=400&fit=crop&brightness=-10'
    }
];

// Products array - will be loaded from Supabase
let products = [];

// Flag to track if initial data load is complete
let isDataLoaded = false;

// Function to load products from Supabase
async function loadProductsFromDB() {
    try {
        const data = await db.products.getAll();
        products = data.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            material: p.material,
            price: parseFloat(p.price),
            size: p.size,
            description: p.description,
            image: p.image
        }));
        isDataLoaded = true;
        renderProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        alert('Failed to load products. Please refresh the page.');
    }
}

async function loadCategoriesFromDB() {
    try {
        categoriesData = await db.categories.getAll();
        updateCategoryOptions();
        renderCategorySidebar(); // Update sidebar when categories change
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Get display name based on current language
function getDisplayName(item, type = 'category') {
    const lang = i18n.currentLang;
    if (lang === 'zh' && item.name_zh) {
        return item.name_zh;
    }
    return item.display_name || item.name;
}

// Render categories in sidebar
function renderCategorySidebar() {
    const categoryList = document.getElementById('categoryList');
    if (!categoryList) return;

    // Keep the "All Products" button and clear the rest
    const allProductsBtn = categoryList.querySelector('[data-category="all"]');
    categoryList.innerHTML = '';
    if (allProductsBtn) {
        categoryList.appendChild(allProductsBtn);
    } else {
        categoryList.innerHTML = `
            <button class="category-btn active" data-category="all">
                <i class="fas fa-th"></i> <span data-i18n="products_all">All Products</span>
            </button>
        `;
    }

    // Add categories from database
    categoriesData.forEach(cat => {
        const icon = categoryIcons[cat.name] || 'fa-tag'; // Use default icon if not mapped
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.setAttribute('data-category', cat.name);
        btn.innerHTML = `<i class="fas ${icon}"></i> ${getDisplayName(cat)}`;
        categoryList.appendChild(btn);
    });

    // Re-attach event listeners
    attachCategoryListeners();
}

// Attach event listeners to category buttons
function attachCategoryListeners() {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderProducts();
        });
    });
}

async function loadMaterialsFromDB() {
    try {
        materialsData = await db.materials.getAll();
        updateMaterialOptions();
    } catch (error) {
        console.error('Error loading materials:', error);
    }
}

// State Management
let cart = [];
let currentCategory = 'all';
let currentFilters = { material: '' };
let currentSort = 'name';
let searchQuery = '';
let selectedProduct = null;

// Admin search state
let adminSearchQuery = '';

// Enquiry submission throttle (30 seconds cooldown)
const ENQUIRY_COOLDOWN_MS = 30000;
let lastEnquiryTime = 0;

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
    initializeEventListeners();
    initializeAdminListeners();
    initializeLanguageSystem();
    updateCartCount();
    checkAdminSession();

    // Load data from Supabase
    await Promise.all([
        loadProductsFromDB(),
        loadCategoriesFromDB(),
        loadMaterialsFromDB()
    ]);
});

// Event Listeners
function initializeEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            const target = link.getAttribute('href');
            document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Category Buttons (handled by attachCategoryListeners() when categories are loaded)

    // Filters
    document.getElementById('materialFilter').addEventListener('change', (e) => {
        currentFilters.material = e.target.value;
        renderProducts();
    });

    document.getElementById('clearFilters').addEventListener('click', () => {
        currentFilters = { material: '' };
        document.getElementById('materialFilter').value = '';
        renderProducts();
    });

    // Search
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderProducts();
    });

    // Sort
    document.getElementById('sortSelect').addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderProducts();
    });

    // Cart Modal
    document.getElementById('cartBtn').addEventListener('click', openCartModal);
    document.getElementById('closeCart').addEventListener('click', closeCartModal);
    document.getElementById('closeCart2').addEventListener('click', closeCartModal);

    // Enquiry Modal
    document.getElementById('proceedEnquiry').addEventListener('click', openEnquiryModal);
    document.getElementById('closeEnquiry').addEventListener('click', closeEnquiryModal);
    document.getElementById('closeEnquiry2').addEventListener('click', closeEnquiryModal);
    document.getElementById('submitEnquiry').addEventListener('click', submitEnquiry);

    // Product Detail Modal
    document.getElementById('closeProduct').addEventListener('click', closeProductModal);

    // Batch Product Upload Modal
    document.getElementById('addProductBtnBatch').addEventListener('click', () => {
        document.getElementById('xlsxToolModal').classList.add('active');
    });
    document.getElementById('closeProductBatch').addEventListener('click', closeProductBatch);

    function closeProductBatch() {
        document.getElementById('xlsxToolModal').classList.remove('active');
    }

    // Quantity Controls
    document.getElementById('decreaseQty').addEventListener('click', () => {
        const input = document.getElementById('quantityInput');
        if (input.value > 1) input.value = parseInt(input.value) - 1;
    });

    document.getElementById('increaseQty').addEventListener('click', () => {
        const input = document.getElementById('quantityInput');
        input.value = parseInt(input.value) + 1;
    });

    document.getElementById('addToCartBtn').addEventListener('click', addToCart);

    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
}

// Render Products
function renderProducts() {
    let filteredProducts = products.filter(product => {
        // Category filter
        if (currentCategory !== 'all' && product.category !== currentCategory) return false;

        // Material filter
        if (currentFilters.material && product.material !== currentFilters.material) return false;

        // Smart search filter - search all fields with normalization
        if (searchQuery) {
            const normalizedQuery = normalizeText(searchQuery);

            // All searchable fields including ID, name, size, category, material, description, price
            const searchableFields = [
                product.id.toString(),
                product.name,
                product.size,
                product.category,
                product.material,
                product.description,
                product.price.toString()
            ];

            // Check if any field matches the normalized query
            const hasMatch = searchableFields.some(field =>
                normalizeText(field).includes(normalizedQuery)
            );

            if (!hasMatch) return false;
        }

        return true;
    });

    // Sort products
    filteredProducts.sort((a, b) => {
        switch (currentSort) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            default:
                return 0;
        }
    });

    const grid = document.getElementById('productsGrid');

    if (filteredProducts.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-gray);">No products found matching your criteria.</div>';
        return;
    }

    grid.innerHTML = filteredProducts.map(product => {
        // Get translated category and material names
        const category = categoriesData.find(c => c.name === product.category);
        const categoryDisplay = category ? getDisplayName(category) : formatMaterial(product.category);

        const material = materialsData.find(m => m.name === product.material);
        const materialDisplay = material ? getDisplayName(material) : formatMaterial(product.material);

        return `
            <div class="product-card" onclick="openProductModal('${product.id}')">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <span class="product-category">${categoryDisplay}</span>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-specs">
                    ${product.size} | ${materialDisplay}
                </div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
            </div>
        `;
    }).join('');
}

// Format helper functions
function formatMaterial(material) {
    return material.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Smart search normalization function
function normalizeText(text) {
    if (text === null || text === undefined) return '';
    return text.toString()
        .toLowerCase()
        .replace(/[-\s*x×]/g, '')  // Remove hyphens, spaces, *, x, ×
        .replace(/[$,]/g, '')      // Remove $, commas
        .trim();
}

// Product Modal
function openProductModal(productId) {
    selectedProduct = products.find(p => String(p.id) === String(productId));
    if (!selectedProduct) return;

    document.getElementById('modalProductName').textContent = selectedProduct.name;
    document.getElementById('modalProductImage').src = selectedProduct.image;
    document.getElementById('modalProductPrice').textContent = `$${selectedProduct.price.toFixed(2)} ${i18n.t('product_per_unit')}`;
    document.getElementById('modalProductDescription').textContent = getProductDescription(selectedProduct);

    // Get category display name
    const category = categoriesData.find(c => c.name === selectedProduct.category);
    const categoryDisplay = category ? getDisplayName(category) : formatMaterial(selectedProduct.category);

    // Get material display name
    const material = materialsData.find(m => m.name === selectedProduct.material);
    const materialDisplay = material ? getDisplayName(material) : formatMaterial(selectedProduct.material);

    const specsHtml = `
        <div class="spec-item">
            <span class="spec-label">${i18n.t('product_category')}</span>
            <span class="spec-value">${categoryDisplay}</span>
        </div>
        <div class="spec-item">
            <span class="spec-label">${i18n.t('product_size')}</span>
            <span class="spec-value">${selectedProduct.size}</span>
        </div>
        <div class="spec-item">
            <span class="spec-label">${i18n.t('product_material')}</span>
            <span class="spec-value">${materialDisplay}</span>
        </div>
    `;

    document.getElementById('modalProductSpecs').innerHTML = specsHtml;
    document.getElementById('quantityInput').value = 1;
    document.getElementById('productModal').classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    selectedProduct = null;
}

// Cart Functions
function addToCart() {
    if (!selectedProduct) return;

    const quantity = parseInt(document.getElementById('quantityInput').value);
    const existingItem = cart.find(item => String(item.id) === String(selectedProduct.id));

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...selectedProduct,
            quantity: quantity
        });
    }

    updateCartCount();
    closeProductModal();

    // Show brief notification
    alert(i18n.t('msg_added_to_cart', { quantity: quantity, name: selectedProduct.name }));
}

function removeFromCart(productId) {
    cart = cart.filter(item => String(item.id) !== String(productId));
    updateCartCount();
    renderCartItems();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = totalItems;
}

function openCartModal() {
    renderCartItems();
    document.getElementById('cartModal').classList.add('active');
}

function closeCartModal() {
    document.getElementById('cartModal').classList.remove('active');
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    document.getElementById('totalItems').textContent = totalItems;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-details">
                    ${i18n.t('cart_quantity')} ${item.quantity} | $${(item.price * item.quantity).toFixed(2)}
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// Enquiry Functions
function openEnquiryModal() {
    if (cart.length === 0) {
        alert(i18n.t('cart_empty'));
        return;
    }

    closeCartModal();
    renderEnquirySummary();
    document.getElementById('enquiryModal').classList.add('active');
}

function closeEnquiryModal() {
    document.getElementById('enquiryModal').classList.remove('active');
}

function renderEnquirySummary() {
    const summary = cart.map(item => {
        // Get translated material name
        const material = materialsData.find(m => m.name === item.material);
        const materialDisplay = material ? getDisplayName(material) : formatMaterial(item.material);

        return `
            <div class="enquiry-item">
                <strong>${item.name}</strong><br>
                ${i18n.t('cart_quantity')} ${item.quantity} | ${i18n.t('product_unit_price')}: $${item.price.toFixed(2)} | ${i18n.t('product_subtotal')}: $${(item.price * item.quantity).toFixed(2)}<br>
                ${i18n.t('product_specifications')}: ${item.size} | ${materialDisplay}
            </div>
        `;
    }).join('');

    document.getElementById('enquirySummary').innerHTML = summary;
}

async function submitEnquiry() {
    // Check rate limiting (30 seconds cooldown)
    const now = Date.now();
    if (now - lastEnquiryTime < ENQUIRY_COOLDOWN_MS) {
        const remainingSeconds = Math.ceil((ENQUIRY_COOLDOWN_MS - (now - lastEnquiryTime)) / 1000);
        alert(`⏳ Please wait ${remainingSeconds} seconds before submitting another enquiry.\n\nThis helps us prevent spam and ensure quality service.`);
        return;
    }

    const form = document.getElementById('enquiryForm');

    // Validate required fields
    const name = document.getElementById('customerName').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();

    if (!name || !email || !phone) {
        alert(i18n.t('msg_fill_required'));
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert(i18n.t('msg_invalid_email'));
        return;
    }

    // Phone validation (basic)
    if (phone.length < 8) {
        alert(i18n.t('msg_invalid_phone'));
        return;
    }

    // Disable submit button to prevent double submission
    const submitBtn = document.getElementById('submitEnquiry');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    // Prepare enquiry data for Supabase
    const enquiryData = {
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        company_name: document.getElementById('companyName').value?.trim() || null,
        customer_address: document.getElementById('customerAddress').value?.trim() || null,
        products: cart.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            specs: `${item.size} | ${item.material}`
        })),
        notes: document.getElementById('additionalNotes').value?.trim() || null
    };

    try {
        // TODO: Add Turnstile/reCAPTCHA verification here (future enhancement)
        // const captchaToken = await verifyCaptcha();
        // enquiryData.captcha_token = captchaToken;

        // Save enquiry to Supabase database
        await db.enquiries.create(enquiryData);

        // Update last submission time
        lastEnquiryTime = now;

        // Send email notification via self-hosted mail service
        await sendMail(enquiryData);

        // Show success message
        alert(`✅ Thank you for your enquiry, ${name}!\n\nWe have received your request for ${cart.length} product(s). Our team will contact you shortly at ${email}.\n\nEnquiry Details:\n${cart.map(item => `- ${item.name} (Qty: ${item.quantity})`).join('\n')}`);

        // Clear cart and close modals
        cart = [];
        updateCartCount();
        closeEnquiryModal();
        form.reset();
    } catch (error) {
        console.error('❌ Error submitting enquiry:', error);
        console.error('Error details:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
        });

        // User-friendly error messages based on error type
        let errorMessage = '提交失败，请稍后重试或直接联系我们。\n\nFailed to submit enquiry. Please try again later or contact us directly.\n\n';

        if (error.code === '42501') {
            // RLS policy violation
            errorMessage += '错误原因：数据库权限配置问题\nReason: Database permission issue\n\n请联系管理员或通过以下方式联系我们：\nPlease contact admin or reach us via:\n📧 Email: zhangyanbin_1@hotmail.com\n📞 Phone: 0404693189';
        } else if (error.code === 'PGRST116') {
            // RLS policy not found
            errorMessage += '错误原因：数据库策略未配置\nReason: Database policy not configured\n\n请联系管理员。\nPlease contact admin.';
        } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
            // Network error
            errorMessage += '错误原因：网络连接问题\nReason: Network connection issue\n\n请检查网络连接后重试。\nPlease check your network and try again.';
        } else {
            // Generic error
            errorMessage += `错误详情：${error.message || 'Unknown error'}\nError details: ${error.message || 'Unknown error'}`;
        }

        alert(errorMessage);
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
}

// TODO: Captcha verification function (placeholder for future enhancement)
async function verifyCaptcha() {
    // Placeholder for Turnstile/reCAPTCHA integration
    // return await turnstile.verify() or grecaptcha.execute();
    return null;
}

// Admin Functions
function checkAdminSession() {
    const isAuthenticated = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (isAuthenticated === 'true') {
        showAdminDashboard();
    }
}

function openAdminLogin() {
    document.getElementById('adminLoginModal').classList.add('active');
    document.getElementById('adminKeyInput').value = '';
    document.getElementById('adminLoginError').classList.remove('show');
}

function closeAdminLogin() {
    document.getElementById('adminLoginModal').classList.remove('active');
}

function submitAdminLogin() {
    const keyInput = document.getElementById('adminKeyInput').value;
    const errorMsg = document.getElementById('adminLoginError');

    if (keyInput.length !== 32) {
        errorMsg.textContent = i18n.t('admin_login_error_length');
        errorMsg.classList.add('show');
        return;
    }

    if (keyInput === ADMIN_KEY) {
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
        closeAdminLogin();
        showAdminDashboard();
    } else {
        errorMsg.textContent = i18n.t('admin_login_error');
        errorMsg.classList.add('show');
    }
}

function showAdminDashboard() {
    document.getElementById('adminDashboard').classList.add('active');
    renderAdminProducts();
}

function hideAdminDashboard() {
    document.getElementById('adminDashboard').classList.remove('active');
}

function logoutAdmin() {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    hideAdminDashboard();
}

function openProductForm(productId = null) {
    const modal = document.getElementById('productFormModal');
    const form = document.getElementById('productForm');
    const title = document.getElementById('productFormTitle');

    form.reset();
    removeSelectedImage(); // Clear image upload state

    if (productId) {
        const product = products.find(p => String(p.id) === String(productId));
        if (product) {
            title.textContent = i18n.t('product_form_edit');
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productMaterial').value = product.material;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productSize').value = product.size;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productDescriptionZh').value = product.description_zh || '';
            document.getElementById('productImageUrl').value = product.image;

            // Store current image URL
            currentImageUrl = product.image;

            // Show existing image preview
            document.getElementById('previewImg').src = product.image;
            document.getElementById('imagePreview').style.display = 'block';
            document.getElementById('imageFileName').textContent = i18n.t('product_image_current');
        }
    } else {
        title.textContent = i18n.t('product_form_add');
        document.getElementById('productId').value = '';
        currentImageUrl = null;
    }

    modal.classList.add('active');
}

function closeProductForm() {
    document.getElementById('productFormModal').classList.remove('active');
}

async function saveProduct() {
    const form = document.getElementById('productForm');

    // Validate required fields
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Check if image is provided (either file or existing URL)
    if (!selectedImageFile && !currentImageUrl) {
        alert(i18n.t('msg_select_image'));
        return;
    }

    const productId = document.getElementById('productId').value;
    let imageUrl = currentImageUrl;

    try {
        // Upload new image if selected
        if (selectedImageFile) {
            // Show uploading message
            const saveBtn = document.getElementById('saveProduct');
            const originalText = saveBtn.textContent;
            saveBtn.textContent = 'Uploading image...';
            saveBtn.disabled = true;

            // Upload to Supabase Storage
            imageUrl = await db.storage.uploadImage(selectedImageFile);

            saveBtn.textContent = originalText;
            saveBtn.disabled = false;
        }

        const productData = {
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            material: document.getElementById('productMaterial').value,
            price: parseFloat(document.getElementById('productPrice').value),
            size: document.getElementById('productSize').value,
            image: imageUrl,
            description: document.getElementById('productDescription').value,
            description_zh: document.getElementById('productDescriptionZh').value || null
        };

        if (productId) {
            // Edit existing product in Supabase
            await db.products.update(productId, productData);
        } else {
            // Add new product to Supabase
            await db.products.create(productData);
        }

        // Reload products from database
        await loadProductsFromDB();
        renderAdminProducts();
        closeProductForm();

        // Reset image upload state
        selectedImageFile = null;
        currentImageUrl = null;
    } catch (error) {
        console.error('Error saving product:', error);
        alert('Failed to save product. Please try again.\nError: ' + error.message);

        // Re-enable button if disabled
        const saveBtn = document.getElementById('saveProduct');
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Product';
    }
}

function editProduct(productId) {
    openProductForm(productId);
}

async function deleteProduct(productId) {
    if (confirm(i18n.t('msg_delete_confirm'))) {
        try {
            await db.products.delete(productId);
            // Reload products from database
            await loadProductsFromDB();
            renderAdminProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert(i18n.t('msg_error_deleting'));
        }
    }
}

// Image upload state
let selectedImageFile = null;
let currentImageUrl = null;

// Initialize Admin Event Listeners
function initializeAdminListeners() {
    // Admin button
    document.getElementById('adminBtn').addEventListener('click', () => {
        const isAuthenticated = sessionStorage.getItem(ADMIN_SESSION_KEY);
        if (isAuthenticated === 'true') {
            showAdminDashboard();
        } else {
            openAdminLogin();
        }
    });

    // Admin login modal
    document.getElementById('closeAdminLogin').addEventListener('click', closeAdminLogin);
    document.getElementById('cancelAdminLogin').addEventListener('click', closeAdminLogin);
    document.getElementById('submitAdminLogin').addEventListener('click', submitAdminLogin);

    // Enter key for admin login
    document.getElementById('adminKeyInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitAdminLogin();
        }
    });

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', logoutAdmin);

    // Add product button
    document.getElementById('addProductBtn').addEventListener('click', () => openProductForm());

    // Admin search
    const adminSearchInput = document.getElementById('adminSearchInput');
    if (adminSearchInput) {
        adminSearchInput.addEventListener('input', (e) => {
            adminSearchQuery = e.target.value.toLowerCase();
            renderAdminProducts();
        });
    }

    // Product form modal
    document.getElementById('closeProductForm').addEventListener('click', closeProductForm);
    document.getElementById('cancelProductForm').addEventListener('click', closeProductForm);
    document.getElementById('saveProduct').addEventListener('click', saveProduct);

    // Image upload handlers
    document.getElementById('selectImageBtn').addEventListener('click', () => {
        document.getElementById('productImageFile').click();
    });

    document.getElementById('productImageFile').addEventListener('change', handleImageSelect);
    document.getElementById('removeImageBtn').addEventListener('click', removeSelectedImage);
}

// Image upload functions
function handleImageSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        alert(i18n.t('msg_invalid_file_type'));
        event.target.value = '';
        return;
    }

    // Validate file size (20MB = 20 * 1024 * 1024 bytes)
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
        alert(i18n.t('msg_file_too_large'));
        event.target.value = '';
        return;
    }

    // Store the file
    selectedImageFile = file;

    // Update file name display
    document.getElementById('imageFileName').textContent = file.name;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('previewImg').src = e.target.result;
        document.getElementById('imagePreview').style.display = 'block';
    };
    reader.readAsDataURL(file);
}

function removeSelectedImage() {
    selectedImageFile = null;
    document.getElementById('productImageFile').value = '';
    document.getElementById('imageFileName').textContent = '';
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('previewImg').src = '';
}

// ============================================================
// Category and Material Management Functions
// ============================================================

function updateCategoryOptions() {
    // Update product form dropdown
    const categorySelect = document.getElementById('productCategory');
    if (categorySelect) {
        const currentValue = categorySelect.value;
        categorySelect.innerHTML = `<option value="">${i18n.t('product_select_category')}</option>` +
            categoriesData.map(cat => `<option value="${cat.name}">${getDisplayName(cat)}</option>`).join('');
        if (currentValue) categorySelect.value = currentValue;
    }

    // Update material filter dropdown
    const materialFilter = document.getElementById('materialFilter');
    if (materialFilter) {
        const currentValue = materialFilter.value;
        materialFilter.innerHTML = `<option value="">${i18n.t('filter_all_materials')}</option>` +
            materialsData.map(mat => `<option value="${mat.name}">${getDisplayName(mat)}</option>`).join('');
        if (currentValue) materialFilter.value = currentValue;
    }

    // Update categories list in admin
    renderCategoriesList();
}

function updateMaterialOptions() {
    // Update product form dropdown
    const materialSelect = document.getElementById('productMaterial');
    if (materialSelect) {
        const currentValue = materialSelect.value;
        materialSelect.innerHTML = `<option value="">${i18n.t('product_select_material')}</option>` +
            materialsData.map(mat => `<option value="${mat.name}">${getDisplayName(mat)}</option>`).join('');
        if (currentValue) materialSelect.value = currentValue;
    }

    // Update materials list in admin
    renderMaterialsList();
}

function renderCategoriesList() {
    const container = document.getElementById('categoriesList');
    if (!container) return;

    if (categoriesData.length === 0) {
        container.innerHTML = '<p style="color: var(--text-gray); text-align: center;">No categories available</p>';
        return;
    }

    container.innerHTML = categoriesData.map(cat => `
        <div class="option-item">
            <div class="option-item-info">
                <div class="option-item-name">${cat.name}</div>
                <div class="option-item-display">${cat.display_name}</div>
            </div>
            <button class="btn btn-danger btn-small" onclick="deleteCategory('${cat.id}', '${cat.name}')">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `).join('');
}

function renderMaterialsList() {
    const container = document.getElementById('materialsList');
    if (!container) return;

    if (materialsData.length === 0) {
        container.innerHTML = '<p style="color: var(--text-gray); text-align: center;">No materials available</p>';
        return;
    }

    container.innerHTML = materialsData.map(mat => `
        <div class="option-item">
            <div class="option-item-info">
                <div class="option-item-name">${mat.name}</div>
                <div class="option-item-display">${mat.display_name}</div>
            </div>
            <button class="btn btn-danger btn-small" onclick="deleteMaterial('${mat.id}', '${mat.name}')">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `).join('');
}

async function addCategory() {
    const nameInput = document.getElementById('newCategoryName');
    const displayInput = document.getElementById('newCategoryDisplay');
    const nameZhInput = document.getElementById('newCategoryNameZh');

    const name = nameInput.value.trim();
    const displayName = displayInput.value.trim();
    const nameZh = nameZhInput.value.trim();

    if (!name || !displayName) {
        alert(i18n.t('msg_fill_both_names'));
        return;
    }

    try {
        await db.categories.create({
            name: name,
            display_name: displayName,
            name_zh: nameZh || null
        });

        // Reload categories
        await loadCategoriesFromDB();

        // Clear inputs
        nameInput.value = '';
        displayInput.value = '';
        nameZhInput.value = '';

        alert(i18n.t('msg_category_added'));
    } catch (error) {
        console.error('Error adding category:', error);
        alert('❌ Failed to add category: ' + error.message);
    }
}

async function addMaterial() {
    const nameInput = document.getElementById('newMaterialName');
    const displayInput = document.getElementById('newMaterialDisplay');
    const nameZhInput = document.getElementById('newMaterialNameZh');

    const name = nameInput.value.trim();
    const displayName = displayInput.value.trim();
    const nameZh = nameZhInput.value.trim();

    if (!name || !displayName) {
        alert(i18n.t('msg_fill_both_names'));
        return;
    }

    try {
        await db.materials.create({
            name: name,
            display_name: displayName,
            name_zh: nameZh || null
        });

        // Reload materials
        await loadMaterialsFromDB();

        // Clear inputs
        nameInput.value = '';
        displayInput.value = '';
        nameZhInput.value = '';

        alert(i18n.t('msg_material_added'));
    } catch (error) {
        console.error('Error adding material:', error);
        alert('❌ Failed to add material: ' + error.message);
    }
}

async function deleteCategory(id, name) {
    if (!confirm(i18n.t('msg_delete_category_confirm', { name }))) {
        return;
    }

    try {
        await db.categories.delete(id);
        await loadCategoriesFromDB();
        alert(i18n.t('msg_category_deleted'));
    } catch (error) {
        console.error('Error deleting category:', error);
        if (error.message.includes('该选项正在被使用中')) {
            alert(i18n.t('msg_category_in_use'));
        } else {
            alert('❌ ' + error.message);
        }
    }
}

async function deleteMaterial(id, name) {
    if (!confirm(i18n.t('msg_delete_material_confirm', { name }))) {
        return;
    }

    try {
        await db.materials.delete(id);
        await loadMaterialsFromDB();
        alert(i18n.t('msg_material_deleted'));
    } catch (error) {
        console.error('Error deleting material:', error);
        if (error.message.includes('该选项正在被使用中')) {
            alert(i18n.t('msg_material_in_use'));
        } else {
            alert('❌ ' + error.message);
        }
    }
}

// ============================================================
// Admin Search Functionality
// ============================================================

function renderAdminProducts() {
    const tableContainer = document.getElementById('adminProductsTable');

    // Filter products based on admin search
    let filteredProducts = products;
    if (adminSearchQuery) {
        const normalizedQuery = normalizeText(adminSearchQuery);
        filteredProducts = products.filter(product => {
            const searchableFields = [
                product.id.toString(),
                product.name,
                product.size,
                product.category,
                product.material,
                product.description,
                product.price.toString()
            ];

            return searchableFields.some(field =>
                normalizeText(field).includes(normalizedQuery)
            );
        });
    }

    if (filteredProducts.length === 0) {
        tableContainer.innerHTML = '<p style="text-align: center; color: var(--text-gray); padding: 2rem;">No products found.</p>';
        return;
    }

    const tableHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th data-i18n="admin_table_image">${i18n.t('admin_table_image')}</th>
                    <th data-i18n="admin_table_name">${i18n.t('admin_table_name')}</th>
                    <th data-i18n="admin_table_category">${i18n.t('admin_table_category')}</th>
                    <th data-i18n="admin_table_price">${i18n.t('admin_table_price')}</th>
                    <th data-i18n="admin_table_material">${i18n.t('admin_table_material')}</th>
                    <th data-i18n="admin_table_size">${i18n.t('admin_table_size')}</th>
                    <th data-i18n="admin_table_actions">${i18n.t('admin_table_actions')}</th>
                </tr>
            </thead>
            <tbody>
                ${filteredProducts.map(product => {
                    // Get translated category and material names
                    const category = categoriesData.find(c => c.name === product.category);
                    const categoryDisplay = category ? getDisplayName(category) : formatMaterial(product.category);

                    const material = materialsData.find(m => m.name === product.material);
                    const materialDisplay = material ? getDisplayName(material) : formatMaterial(product.material);

                    return `
                        <tr>
                            <td><img src="${product.image}" class="product-img-small" alt="${product.name}"></td>
                            <td>${product.name}</td>
                            <td>${categoryDisplay}</td>
                            <td>$${product.price.toFixed(2)}</td>
                            <td>${materialDisplay}</td>
                            <td>${product.size}</td>
                            <td>
                                <div class="admin-actions">
                                    <button class="btn btn-edit btn-icon btn-small" onclick="editProduct('${product.id}')">
                                        <i class="fas fa-edit"></i> <span data-i18n="admin_edit">${i18n.t('admin_edit')}</span>
                                    </button>
                                    <button class="btn btn-danger btn-icon btn-small" onclick="deleteProduct('${product.id}')">
                                        <i class="fas fa-trash"></i> <span data-i18n="admin_delete">${i18n.t('admin_delete')}</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;

    tableContainer.innerHTML = tableHTML;
}

// ============================================================
// Language System Functions
// ============================================================

function initializeLanguageSystem() {
    // Language button click handler
    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const newLang = i18n.currentLang === 'en' ? 'zh' : 'en';
            i18n.setLanguage(newLang);
        });
    }

    // Listen for language change events
    document.addEventListener('languageChanged', () => {
        // Re-render categories and materials with new language
        renderCategorySidebar();
        updateMaterialOptions();

        // Re-render products to show translated descriptions
        renderProducts();

        // Re-render admin if open
        if (document.getElementById('adminDashboard').classList.contains('active')) {
            renderAdminProducts();
            renderCategoriesList();
            renderMaterialsList();
        }
    });
}

// Get product description based on current language
function getProductDescription(product) {
    const lang = i18n.currentLang;
    if (lang === 'zh' && product.description_zh) {
        return product.description_zh;
    }
    return product.description;
}

// Expose functions to global scope for onclick handlers
window.openProductModal = openProductModal;
window.removeFromCart = removeFromCart;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.addCategory = addCategory;
window.addMaterial = addMaterial;
window.deleteCategory = deleteCategory;
window.deleteMaterial = deleteMaterial;