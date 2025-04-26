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

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // Validate inputs
            if (!email || !password) {
                showMessage(loginMessage, 'Please fill in all fields', 'error');
                return;
            }
            
            // Check if user exists
            const users = JSON.parse(localStorage.getItem('nexoraUsers')) || [];
            const user = users.find(u => u.email === email);
            
            if (!user) {
                showMessage(loginMessage, 'User not found. Please check your email or sign up', 'error');
                return;
            }
            
            // Check password
            if (user.password !== password) {
                showMessage(loginMessage, 'Incorrect password. Please try again', 'error');
                return;
            }
            
            // Login successful
            localStorage.setItem('nexoraLoggedIn', 'true');
            localStorage.setItem('nexoraCurrentUser', JSON.stringify({
                name: user.name,
                email: user.email
            }));
            
            if (rememberMe) {
                localStorage.setItem('nexoraRememberMe', 'true');
            } else {
                localStorage.removeItem('nexoraRememberMe');
            }
            
            showMessage(loginMessage, 'Login successful! Redirecting...', 'success');
            
            // Update profile icon
            updateProfileIcon(user.name);
            
            // Close modal after delay
            setTimeout(() => {
                closeAuthModal();
                // Refresh page to update UI
                window.location.reload();
            }, 1500);
        });
    }
    
    // Handle signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signupName').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;
            const agreeTerms = document.getElementById('agreeTerms').checked;
            
            // Validate inputs
            if (!name || !email || !password || !confirmPassword) {
                showMessage(signupMessage, 'Please fill in all fields', 'error');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage(signupMessage, 'Please enter a valid email address', 'error');
                return;
            }
            
            // Check password strength
            if (password.length < 8) {
                showMessage(signupMessage, 'Password must be at least 8 characters long', 'error');
                return;
            }
            
            // Check if passwords match
            if (password !== confirmPassword) {
                showMessage(signupMessage, 'Passwords do not match', 'error');
                return;
            }
            
            // Check terms agreement
            if (!agreeTerms) {
                showMessage(signupMessage, 'Please agree to the Terms of Service and Privacy Policy', 'error');
                return;
            }
            
            // Check if user already exists
            const users = JSON.parse(localStorage.getItem('nexoraUsers')) || [];
            if (users.some(user => user.email === email)) {
                showMessage(signupMessage, 'Email already registered. Please login instead', 'error');
                return;
            }
            
            // Create new user
            const newUser = {
                name,
                email,
                password,
                createdAt: new Date().toISOString()
            };
            
            // Add user to storage
            users.push(newUser);
            localStorage.setItem('nexoraUsers', JSON.stringify(users));
            
            // Auto login after signup
            localStorage.setItem('nexoraLoggedIn', 'true');
            localStorage.setItem('nexoraCurrentUser', JSON.stringify({
                name: newUser.name,
                email: newUser.email
            }));
            
            showMessage(signupMessage, 'Account created successfully! Redirecting...', 'success');
            
            // Update profile icon
            updateProfileIcon(newUser.name);
            
            // Close modal after delay
            setTimeout(() => {
                closeAuthModal();
                // Refresh page to update UI
                window.location.reload();
            }, 1500);
        });
    }
    
    // Show message function
    function showMessage(element, message, type) {
        element.textContent = message;
        element.className = 'auth-message ' + type;
    }
    
    // Update profile icon function
    function updateProfileIcon(name) {
        if (profileIcon) {
            // Create initials from name
            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
            
            // Remove existing icon
            profileIcon.innerHTML = '';
            
            // Create avatar element
            const avatar = document.createElement('div');
            avatar.className = 'user-avatar';
            avatar.textContent = initials;
            avatar.style.backgroundColor = generateAvatarColor(name);
            avatar.style.color = 'white';
            avatar.style.width = '100%';
            avatar.style.height = '100%';
            avatar.style.borderRadius = '50%';
            avatar.style.display = 'flex';
            avatar.style.alignItems = 'center';
            avatar.style.justifyContent = 'center';
            avatar.style.fontSize = '14px';
            avatar.style.fontWeight = '600';
            
            profileIcon.appendChild(avatar);
        }
    }
    
    // Generate consistent color based on name
    function generateAvatarColor(name) {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        const colors = [
            '#7C3AED', // Primary color
            '#6D28D9', // Primary dark
            '#8B5CF6',
            '#A78BFA',
            '#06B6D4', // Secondary color
            '#0891B2'
        ];
        
        const index = Math.abs(hash) % colors.length;
        return colors[index];
    }
    
    // Show user dropdown function
    function showUserDropdown() {
        // Check if dropdown already exists
        if (document.getElementById('userDropdown')) {
            return;
        }
        
        const currentUser = JSON.parse(localStorage.getItem('nexoraCurrentUser'));
        
        // Create dropdown
        const dropdown = document.createElement('div');
        dropdown.id = 'userDropdown';
        dropdown.className = 'user-dropdown';
        dropdown.style.position = 'absolute';
        dropdown.style.top = '50px';
        dropdown.style.right = '0';
        dropdown.style.width = '220px';
        dropdown.style.backgroundColor = 'white';
        dropdown.style.borderRadius = '12px';
        dropdown.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        dropdown.style.padding = '16px';
        dropdown.style.zIndex = '1001';
        
        // Add user info
        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';
        userInfo.style.display = 'flex';
        userInfo.style.alignItems = 'center';
        userInfo.style.marginBottom = '16px';
        userInfo.style.padding = '0 0 16px 0';
        userInfo.style.borderBottom = '1px solid #E2E8F0';
        
        // Create avatar for dropdown
        const avatar = document.createElement('div');
        avatar.className = 'user-avatar-large';
        avatar.textContent = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
        avatar.style.backgroundColor = generateAvatarColor(currentUser.name);
        avatar.style.color = 'white';
        avatar.style.width = '40px';
        avatar.style.height = '40px';
        avatar.style.borderRadius = '50%';
        avatar.style.display = 'flex';
        avatar.style.alignItems = 'center';
        avatar.style.justifyContent = 'center';
        avatar.style.fontSize = '16px';
        avatar.style.fontWeight = '600';
        avatar.style.marginRight = '12px';
        
        const userDetails = document.createElement('div');
        userDetails.className = 'user-details';
        
        const userName = document.createElement('div');
        userName.className = 'user-name';
        userName.textContent = currentUser.name;
        userName.style.fontWeight = '600';
        
        const userEmail = document.createElement('div');
        userEmail.className = 'user-email';
        userEmail.textContent = currentUser.email;
        userEmail.style.fontSize = '0.75rem';
        userEmail.style.color = '#64748B';
        
        userDetails.appendChild(userName);
        userDetails.appendChild(userEmail);
        
        userInfo.appendChild(avatar);
        userInfo.appendChild(userDetails);
        
        // Add dropdown links
        const links = [
            { text: 'My Profile', icon: 'fa-user' },
            { text: 'My Orders', icon: 'fa-shopping-bag' },
            { text: 'Wishlist', icon: 'fa-heart' },
            { text: 'Settings', icon: 'fa-cog' }
        ];
        
        const linksList = document.createElement('ul');
        linksList.style.listStyle = 'none';
        linksList.style.padding = '0';
        linksList.style.margin = '0 0 16px 0';
        
        links.forEach(link => {
            const listItem = document.createElement('li');
            listItem.style.marginBottom = '12px';
            
            const linkElement = document.createElement('a');
            linkElement.href = '#';
            linkElement.style.display = 'flex';
            linkElement.style.alignItems = 'center';
            linkElement.style.color = '#1E293B';
            linkElement.style.transition = 'all 0.3s ease';
            
            const icon = document.createElement('i');
            icon.className = `fas ${link.icon}`;
            icon.style.width = '20px';
            icon.style.marginRight = '12px';
            icon.style.color = '#7C3AED';
            
            const text = document.createTextNode(link.text);
            
            linkElement.appendChild(icon);
            linkElement.appendChild(text);
            listItem.appendChild(linkElement);
            linksList.appendChild(listItem);
            
            // Add hover effect
            linkElement.addEventListener('mouseenter', function() {
                this.style.color = '#7C3AED';
                this.style.transform = 'translateX(5px)';
            });
            
            linkElement.addEventListener('mouseleave', function() {
                this.style.color = '#1E293B';
                this.style.transform = 'translateX(0)';
            });
        });
        
        // Add logout button
        const logoutButton = document.createElement('button');
        logoutButton.className = 'logout-btn';
        logoutButton.style.width = '100%';
        logoutButton.style.padding = '12px';
        logoutButton.style.backgroundColor = 'rgba(124, 58, 237, 0.1)';
        logoutButton.style.color = '#7C3AED';
        logoutButton.style.border = 'none';
        logoutButton.style.borderRadius = '12px';
        logoutButton.style.fontWeight = '600';
        logoutButton.style.cursor = 'pointer';
        logoutButton.style.transition = 'all 0.3s ease';
        logoutButton.style.display = 'flex';
        logoutButton.style.alignItems = 'center';
        logoutButton.style.justifyContent = 'center';
        
        const logoutIcon = document.createElement('i');
        logoutIcon.className = 'fas fa-sign-out-alt';
        logoutIcon.style.marginRight = '8px';
        
        logoutButton.appendChild(logoutIcon);
        logoutButton.appendChild(document.createTextNode('Logout'));
        
        // Add hover effect
        logoutButton.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#7C3AED';
            this.style.color = 'white';
        });
        
        logoutButton.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'rgba(124, 58, 237, 0.1)';
            this.style.color = '#7C3AED';
        });
        
        // Add logout functionality
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('nexoraLoggedIn');
            localStorage.removeItem('nexoraCurrentUser');
            
            // Refresh page to update UI
            window.location.reload();
        });
        
        // Assemble dropdown
        dropdown.appendChild(userInfo);
        dropdown.appendChild(linksList);
        dropdown.appendChild(logoutButton);
        
        // Add dropdown to profile icon
        profileIcon.style.position = 'relative';
        profileIcon.appendChild(dropdown);
        
        // Add click outside to close
        document.addEventListener('click', function closeDropdown(e) {
            if (!profileIcon.contains(e.target)) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        });
    }
});
