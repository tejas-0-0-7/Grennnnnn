// Theme switching functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');

    // Check for saved theme preference or use dark theme as default
    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Always set dark as default if not set
    if (!localStorage.getItem('theme')) {
        localStorage.setItem('theme', 'dark');
    }

    document.documentElement.setAttribute('data-theme', currentTheme);
    updateIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Update theme
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Update icon with animation
        updateIcon(newTheme);
    });

    function updateIcon(theme) {
        icon.classList.remove('fa-sun', 'fa-moon');
        if (theme === 'dark') {
            icon.classList.add('fa-moon');
            icon.style.transform = 'rotate(0deg)';
        } else {
            icon.classList.add('fa-sun');
            icon.style.transform = 'rotate(180deg)';
        }
    }
}); 