// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Auth Modal Elements
    const profileIcon = document.getElementById('profileIcon');
    const authModal = document.getElementById('authModal');
    const authOverlay = document.getElementById('authOverlay');
    const closeAuth = document.getElementById('closeAuth');
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginMessage = document.getElementById('loginMessage');
    const signupMessage = document.getElementById('signupMessage');

    // Password toggle elements
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    // Password strength elements
    const passwordInput = document.getElementById('signupPassword');
    const confirmPasswordInput = document.getElementById('signupConfirmPassword');
    const strengthSegments = document.querySelectorAll('.strength-segment');
    const strengthText = document.querySelector('.strength-text');

   // Check if user is logged in
    const isLoggedIn = localStorage.getItem('nexoraLoggedIn') === 'true';
    const currentUser = JSON.parse(localStorage.getItem('nexoraCurrentUser'));
    
    // Update profile icon if user is logged in
    if (isLoggedIn && currentUser) {
        updateProfileIcon(currentUser.name);
    }
    
    // Open auth modal when profile icon is clicked
    if (profileIcon) {
        profileIcon.addEventListener('click', function() {
            if (isLoggedIn) {
                // Show user dropdown if logged in
                showUserDropdown();
            } else {
                // Show auth modal if not logged in
                authModal.classList.add('active');
                authOverlay.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        });
    }

    // Close auth modal
    if (closeAuth) {
        closeAuth.addEventListener('click', closeAuthModal);
    }
    
    // Close auth modal when clicking on overlay
    if (authOverlay) {
        authOverlay.addEventListener('click', closeAuthModal);
    }
    
    // Close auth modal function
    function closeAuthModal() {
        authModal.classList.remove('active');
        authOverlay.style.display = 'none';
        document.body.style.overflow = ''; // Re-enable scrolling
        
        // Reset forms
        loginForm.reset();
        signupForm.reset();
        
        // Clear messages
        loginMessage.textContent = '';
        loginMessage.className = 'auth-message';
        signupMessage.textContent = '';
        signupMessage.className = 'auth-message';
        
        // Reset password strength
        resetPasswordStrength();
    }

    // Switch between login and signup tabs
    if (loginTab && signupTab) {
        loginTab.addEventListener('click', function() {
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        });
        
        signupTab.addEventListener('click', function() {
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
        });
    }
    
    // Toggle password visibility
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
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
    
