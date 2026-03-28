// Shopping Cart Functionality
let cart = [];
let cartCount = 0;
let wishlist = [];
let wishlistCount = 0;

// DOM Elements
const cartIcon = document.querySelector('.cart-icon');
const cartCountElement = document.querySelector('.cart-count');
const cartModal = document.getElementById('cart-modal');
const closeModal = document.querySelector('.close');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
const filterButtons = document.querySelectorAll('.filter-btn');
const chairboxes = document.querySelectorAll('.chairbox');
const searchInput = document.getElementById('searchInput');
const checkoutBtn = document.querySelector('.checkout-btn');
const contactForm = document.querySelector('.contact-form');
const newsletterForm = document.querySelector('.newsletter-form');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
    setupEventListeners();
    initializeCarousel();
    initializeFAQ();
});

// Setup Event Listeners
function setupEventListeners() {
    // Cart functionality
    cartIcon.addEventListener('click', openCart);
    closeModal.addEventListener('click', closeCart);
    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            closeCart();
        }
    });

    // Add to cart buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    // Wishlist buttons
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', toggleWishlist);
    });

    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterProducts(this.dataset.filter);
            updateActiveFilter(this);
        });
    });

    // Search functionality
    searchInput.addEventListener('input', function() {
        searchProducts(this.value);
    });

    // Checkout button
    checkoutBtn.addEventListener('click', proceedToCheckout);

    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Newsletter form
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSignup);
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
}

// Cart Functions
function addToCart(e) {
    const button = e.currentTarget;
    const name = button.dataset.name;
    const price = parseInt(button.dataset.price);
    
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showNotification(`${name} added to cart!`);
    
    // Animate button
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCartDisplay();
}

function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(name);
        } else {
            updateCartDisplay();
        }
    }
}

function updateCartDisplay() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = cartCount;
    
    // Update cart modal
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>€${item.price}</p>
                    </div>
                    <div class="cart-item-controls">
                        <button onclick="updateQuantity('${item.name}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity('${item.name}', 1)">+</button>
                        <button onclick="removeFromCart('${item.name}')" class="remove-btn">Remove</button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotalElement) {
        cartTotalElement.textContent = total;
    }
}

function openCart() {
    cartModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderDetails = cart.map(item => 
        `${item.name} x${item.quantity} = €${item.price * item.quantity}`
    ).join('\n');
    
    if (confirm(`Order Summary:\n${orderDetails}\n\nTotal: €${total}\n\nProceed to checkout?`)) {
        showNotification('Proceeding to checkout... (This would connect to payment system)');
        cart = [];
        updateCartDisplay();
        closeCart();
    }
}

// Wishlist Functions
function toggleWishlist(e) {
    const button = e.currentTarget;
    const chairbox = button.closest('.chairbox');
    const chairName = chairbox.querySelector('h4').textContent;
    
    if (wishlist.includes(chairName)) {
        wishlist = wishlist.filter(item => item !== chairName);
        button.classList.remove('active');
        button.innerHTML = '<i class="far fa-heart"></i>';
        showNotification(`${chairName} removed from wishlist`);
    } else {
        wishlist.push(chairName);
        button.classList.add('active');
        button.innerHTML = '<i class="fas fa-heart"></i>';
        showNotification(`${chairName} added to wishlist!`);
    }
    
    updateWishlistDisplay();
}

function updateWishlistDisplay() {
    wishlistCount = wishlist.length;
    const wishlistCountElement = document.querySelector('.wishlist-count');
    if (wishlistCountElement) {
        wishlistCountElement.textContent = wishlistCount;
    }
}

// Product Filtering
function filterProducts(category) {
    chairboxes.forEach(chairbox => {
        if (category === 'all' || chairbox.dataset.category === category) {
            chairbox.style.display = 'block';
            setTimeout(() => {
                chairbox.style.opacity = '1';
                chairbox.style.transform = 'translateY(0)';
            }, 10);
        } else {
            chairbox.style.opacity = '0';
            chairbox.style.transform = 'translateY(20px)';
            setTimeout(() => {
                chairbox.style.display = 'none';
            }, 300);
        }
    });
}

function updateActiveFilter(activeButton) {
    filterButtons.forEach(button => {
        button.classList.remove('active');
    });
    activeButton.classList.add('active');
}

// Search Functionality
function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    
    chairboxes.forEach(chairbox => {
        const productName = chairbox.querySelector('h4').textContent.toLowerCase();
        const productDescription = chairbox.textContent.toLowerCase();
        
        if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
            chairbox.style.display = 'block';
            setTimeout(() => {
                chairbox.style.opacity = '1';
                chairbox.style.transform = 'translateY(0)';
            }, 10);
        } else {
            chairbox.style.opacity = '0';
            chairbox.style.transform = 'translateY(20px)';
            setTimeout(() => {
                chairbox.style.display = 'none';
            }, 300);
        }
    });
}

// Contact Form Handler
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = e.target.querySelector('input[type="text"]').value;
    const email = e.target.querySelector('input[type="email"]').value;
    const message = e.target.querySelector('textarea').value;
    
    if (name && email && message) {
        showNotification('Thank you for your message! We will get back to you soon.');
        e.target.reset();
    } else {
        showNotification('Please fill in all fields.');
    }
}

// Newsletter Handler
function handleNewsletterSignup(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (email) {
        showNotification('Thank you for subscribing! Check your email for a welcome message.');
        e.target.reset();
    } else {
        showNotification('Please enter a valid email address.');
    }
}

// FAQ Functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Testimonials Carousel
function initializeCarousel() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
    
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Auto-rotate slides
    setInterval(nextSlide, 5000);
}

// Notification System
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #e67e22;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Quick View Functionality
document.querySelectorAll('.quick-view-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        e.stopPropagation();
        const chairbox = this.closest('.chairbox');
        const chairName = chairbox.querySelector('h4').textContent;
        const chairPrice = chairbox.querySelector('.chairprice strong').textContent;
        const chairImage = chairbox.querySelector('img').src;
        
        showQuickView(chairName, chairPrice, chairImage);
    });
});

function showQuickView(name, price, image) {
    const quickViewModal = document.createElement('div');
    quickViewModal.className = 'modal quick-view-modal';
    quickViewModal.style.display = 'block';
    quickViewModal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <div class="quick-view-content">
                <img src="${image}" alt="${name}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">
                <h2>${name}</h2>
                <p style="font-size: 1.5rem; color: #e67e22; margin: 1rem 0;">${price}</p>
                <p style="color: #666; line-height: 1.6;">Experience the perfect blend of comfort and style with this premium chair. Crafted with attention to detail and designed for ultimate support.</p>
                <button class="add-to-cart-btn" style="width: 100%; margin-top: 1rem;" onclick="addToCartFromQuickView('${name}', '${price}')">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(quickViewModal);
    document.body.style.overflow = 'hidden';
    
    // Close handlers
    const closeBtn = quickViewModal.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(quickViewModal);
        document.body.style.overflow = 'auto';
    });
    
    quickViewModal.addEventListener('click', function(e) {
        if (e.target === quickViewModal) {
            document.body.removeChild(quickViewModal);
            document.body.style.overflow = 'auto';
        }
    });
}

function addToCartFromQuickView(name, price) {
    const numericPrice = parseInt(price.replace('€', '').replace(' ', ''));
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: name,
            price: numericPrice,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showNotification(`${name} added to cart!`);
    
    // Close quick view modal
    const modal = document.querySelector('.quick-view-modal');
    if (modal) {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    }
}

// Add CSS for cart items
const cartStyles = document.createElement('style');
cartStyles.textContent = `
    .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid #ddd;
    }
    
    .cart-item-info h4 {
        margin: 0 0 0.5rem 0;
        color: #2c3e50;
    }
    
    .cart-item-info p {
        margin: 0;
        color: #666;
    }
    
    .cart-item-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .cart-item-controls button {
        padding: 0.3rem 0.6rem;
        border: 1px solid #ddd;
        background: white;
        cursor: pointer;
        border-radius: 4px;
        transition: background 0.3s ease;
    }
    
    .cart-item-controls button:hover {
        background: #f8f9fa;
    }
    
    .remove-btn {
        background: #e74c3c !important;
        color: white !important;
        border-color: #e74c3c !important;
    }
    
    .remove-btn:hover {
        background: #c0392b !important;
    }
    
    @media (max-width: 768px) {
        .cart-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }
        
        .cart-item-controls {
            width: 100%;
            justify-content: space-between;
        }
    }
`;
document.head.appendChild(cartStyles);
