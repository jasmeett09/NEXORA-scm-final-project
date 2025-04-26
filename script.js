// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Change icon based on menu state
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
	// Newsletter form submission
    const newsletterForm = document.getElementById('newsletterForm');
    const formMessage = document.getElementById('formMessage');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailInput = document.getElementById('emailInput');
            const email = emailInput.value.trim();

            if (email === '') {
                showFormMessage('Please enter your email address', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showFormMessage('Please enter a valid email address', 'error');
                return;
            }

            // Simulate form submission
            showFormMessage('Thank you for subscribing!', 'success');
            emailInput.value = '';

            // Reset message after 3 seconds
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.className = 'form-message';
            }, 3000);
        });
    }

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show form message
    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = 'form-message ' + type;
    }


	// Cart functionality
    const cartItems = [];
    let cartTotal = 0;

    // Cart icon click
    const cartIcon = document.getElementById('cartIcon');
    const miniCart = document.getElementById('miniCart');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.getElementById('closeCart');

    if (cartIcon && miniCart) {
        cartIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            miniCart.style.display = miniCart.style.display === 'block' ? 'none' : 'block';
            cartOverlay.style.display = miniCart.style.display === 'block' ? 'block' : 'none';
        });
    }

    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        if (miniCart && miniCart.style.display === 'block' && !miniCart.contains(e.target) && e.target !== cartIcon) {
            miniCart.style.display = 'none';
            cartOverlay.style.display = 'none';
        }
    });

    // Close cart button
    if (closeCart) {
        closeCart.addEventListener('click', function() {
            miniCart.style.display = 'none';
            cartOverlay.style.display = 'none';
        });
    }

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            const productImage = this.getAttribute('data-image');

            // Check if product is already in cart
            const existingItem = cartItems.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cartItems.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }

            // Update cart
            updateCart();

            // Show mini cart
            miniCart.style.display = 'block';
            cartOverlay.style.display = 'block';

            // Show notification
            const productCard = this.closest('.product-card');
            showAddedToCartNotification(productCard);
        });
    });

    // Show "Added to Cart" notification
    function showAddedToCartNotification(productCard) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'added-notification';
        notification.innerHTML = '<i class="fas fa-check"></i> Added to cart';
        notification.style.position = 'absolute';
        notification.style.top = '50%';
        notification.style.left = '50%';
        notification.style.transform = 'translate(-50%, -50%)';
        notification.style.backgroundColor = 'rgba(124, 58, 237, 0.9)';
        notification.style.color = 'white';
        notification.style.padding = '12px 20px';
        notification.style.borderRadius = '8px';
        notification.style.zIndex = '100';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        notification.style.fontWeight = '600';

        // Add to product card
        const productImage = productCard.querySelector('.product-image');
        productImage.style.position = 'relative';
        productImage.appendChild(notification);

        // Show and hide notification
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                productImage.removeChild(notification);
            }, 300);
        }, 1500);
    }

    // Update cart function
    function updateCart() {
        const miniCartItems = document.getElementById('miniCartItems');
        const cartCountElement = document.querySelector('.cart-count');
        const cartTotalElement = document.getElementById('cartTotal');
        const emptyCartMessage = document.getElementById('emptyCartMessage');

        // Calculate total items and price
        let totalItems = 0;
        cartTotal = 0;

        cartItems.forEach(item => {
            totalItems += item.quantity;
            cartTotal += item.price * item.quantity;
        });

        // Update cart count
        cartCountElement.textContent = totalItems;

        // Update cart total
        cartTotalElement.textContent = '$' + cartTotal.toFixed(2);

        // Update cart items
        if (miniCartItems) {
            // Clear current items
            miniCartItems.innerHTML = '';

            if (cartItems.length === 0) {
                // Show empty cart message
                miniCartItems.appendChild(emptyCartMessage);
                emptyCartMessage.style.display = 'block';
            } else {
                // Hide empty cart message
                emptyCartMessage.style.display = 'none';

                // Add items to cart
                cartItems.forEach(item => {
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    cartItem.innerHTML = `
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                                <span class="quantity-value">${item.quantity}</span>
                                <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                                <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                            </div>
                        </div>
                    `;

                    miniCartItems.appendChild(cartItem);
                });

                // Add event listeners for quantity buttons
                const decreaseButtons = miniCartItems.querySelectorAll('.decrease-btn');
                const increaseButtons = miniCartItems.querySelectorAll('.increase-btn');
                const removeButtons = miniCartItems.querySelectorAll('.remove-item');

                decreaseButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const itemId = this.getAttribute('data-id');
                        decreaseQuantity(itemId);
                    });
                });

                increaseButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const itemId = this.getAttribute('data-id');
                        increaseQuantity(itemId);
                    });
                });

                removeButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const itemId = this.getAttribute('data-id');
                        removeItem(itemId);
                    });
                });
            }
        }
    }

    // Decrease item quantity
    function decreaseQuantity(itemId) {
        const item = cartItems.find(item => item.id === itemId);

        if (item) {
            item.quantity -= 1;

            if (item.quantity <= 0) {
                removeItem(itemId);
            } else {
                updateCart();
            }
        }
    }

    // Increase item quantity
    function increaseQuantity(itemId) {
        const item = cartItems.find(item => item.id === itemId);

        if (item) {
            item.quantity += 1;
            updateCart();
        }
    }

    // Remove item from cart
    function removeItem(itemId) {
        const itemIndex = cartItems.findIndex(item => item.id === itemId);

        if (itemIndex !== -1) {
            cartItems.splice(itemIndex, 1);
            updateCart();
        }
    }

    // Wishlist functionality
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');

    wishlistButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');

            if (icon.style.color === 'rgb(239, 68, 68)') {
                icon.style.color = '';
            } else {
                icon.style.color = '#EF4444';
            }
        });
    });

	// Implement AOS (Animate on Scroll) functionality
    const animatedElements = document.querySelectorAll('[data-aos]');

       // Simple intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

// Observe all elements with data-aos attribute
    animatedElements.forEach(element => {
        observer.observe(element);
        
        // Add delay if specified
        const delay = element.getAttribute('data-aos-delay');
        if (delay) {
            element.style.transitionDelay = `${delay}ms`;
        }
    });
});			  
// Password strength checker
    if (passwordInput) {
        passwordInput.addEventListener('input', checkPasswordStrength);
    }
    
    function checkPasswordStrength() {
        const password = passwordInput.value;
        let strength = 0;
        
        // Reset strength indicators
        resetPasswordStrength();
        
        if (password.length === 0) {
            return;
        }
        
        // Check password length
        if (password.length >= 8) {
            strength += 1;
        }
        
        // Check for lowercase and uppercase letters
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
            strength += 1;
        }
        
        // Check for numbers
        if (/\d/.test(password)) {
            strength += 1;
        }
        
        // Check for special characters
        if (/[^a-zA-Z0-9]/.test(password)) {
            strength += 1;
        }
        
        // Update strength meter
        for (let i = 0; i < strength; i++) {
            if (strength === 1) {
                strengthSegments[i].classList.add('weak');
            } else if (strength === 2 || strength === 3) {
                strengthSegments[i].classList.add('medium');
            } else if (strength === 4) {
                strengthSegments[i].classList.add('strong');
            }
        }
        
        // Update strength text - FIXED VERSION
        if (strength === 1) {
            strengthText.textContent = 'Weak password';
            strengthText.style.color = '#EF4444'; // Danger color
        } else if (strength === 2) {
            strengthText.textContent = 'Fair password';
            strengthText.style.color = '#FBBF24'; // Warning color
        } else if (strength === 3) {
            strengthText.textContent = 'Good password';
            strengthText.style.color = '#FBBF24'; // Warning color
        } else if (strength === 4) {
            strengthText.textContent = 'Strong password';
            strengthText.style.color = '#10B981'; // Success color
        }
    }
    
    function resetPasswordStrength() {
        strengthSegments.forEach(segment => {
            segment.classList.remove('weak', 'medium', 'strong');
        });
        strengthText.textContent = 'Password strength';
        strengthText.style.color = '';
    }
