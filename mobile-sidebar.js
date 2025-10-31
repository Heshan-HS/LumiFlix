// Professional Mobile Sidebar Toggle Script
(function() {
    'use strict';
    
    // Get elements
    const hamburger = document.querySelector('.hamburger-menu');
    const sidebar = document.getElementById('mobile-nav');
    const backdrop = document.getElementById('mobile-nav-backdrop');
    const closeBtn = document.getElementById('mobile-nav-close');
    const downloadAppBtn = document.getElementById('mobile-download-app');
    
    // Open sidebar
    function openSidebar() {
        if (sidebar && backdrop) {
            sidebar.classList.add('active');
            backdrop.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (hamburger) {
                hamburger.classList.add('active');
            }
        }
    }
    
    // Close sidebar
    function closeSidebar() {
        if (sidebar && backdrop) {
            sidebar.classList.remove('active');
            backdrop.classList.remove('active');
            document.body.style.overflow = '';
            if (hamburger) {
                hamburger.classList.remove('active');
            }
        }
    }
    
    // Event listeners
    if (hamburger) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openSidebar();
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeSidebar();
        });
    }
    
    if (backdrop) {
        backdrop.addEventListener('click', closeSidebar);
    }
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });
    
    // Download app button handler
    if (downloadAppBtn) {
        downloadAppBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Trigger existing download app functionality
            const existingDownloadBtn = document.getElementById('download-app-link');
            if (existingDownloadBtn) {
                existingDownloadBtn.click();
            }
            closeSidebar();
        });
    }
    
    // Set active link based on current page
    function setActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const links = document.querySelectorAll('.mobile-nav-link');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Initialize
    setActiveLink();
    
    console.log('Mobile sidebar initialized successfully!');
})();
