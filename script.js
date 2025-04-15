// Theme Toggle Functionality - Removed as it's now in theme.js

// Update active navigation link
document.addEventListener('DOMContentLoaded', function () {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath.split('/').pop()) {
            link.classList.add('active');
        }
    });

    // Add other functionality here that doesn't conflict with theme.js
}); 