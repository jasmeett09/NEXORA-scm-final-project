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
