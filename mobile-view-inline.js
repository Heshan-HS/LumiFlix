// Mobile View Inline Styles - Force Apply
// This script applies mobile styles directly via JavaScript to override any CSS conflicts

(function() {
    'use strict';
    
    // Check if mobile view
    function isMobileView() {
        return window.innerWidth <= 768;
    }
    
    // Apply mobile styles
    function applyMobileStyles() {
        if (!isMobileView()) return;
        
        console.log('Applying mobile inline styles...');
        
        // 1. Main content padding
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.padding = '0 4px 80px 4px';
            mainContent.style.marginTop = '120px';
        }
        
        // 2. Movie grids - Force 3 columns
        const movieGrids = document.querySelectorAll('.movie-grid, #trending-grid, #new-releases-grid, #featured-movies-grid, #recommended-movies-grid');
        movieGrids.forEach(grid => {
            grid.style.display = 'grid';
            grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
            grid.style.gap = '4px';
            grid.style.width = '100%';
            grid.style.animation = 'none';
        });
        
        // 3. Movie cards
        const movieCards = document.querySelectorAll('.movie-card');
        movieCards.forEach(card => {
            card.style.borderRadius = '12px';
            card.style.overflow = 'hidden';
            card.style.position = 'relative';
            card.style.aspectRatio = '2/3';
            card.style.margin = '0';
            card.style.width = '100%';
            
            // Card image
            const img = card.querySelector('img');
            if (img) {
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
            }
            
            // Card footer (title + year)
            const footer = card.querySelector('.card-footer');
            if (footer) {
                footer.style.position = 'relative';
                footer.style.padding = '8px 4px';
                footer.style.background = 'transparent';
            }
            
            // Title
            const title = card.querySelector('h3');
            if (title) {
                title.style.fontSize = '0.85rem';
                title.style.fontWeight = '600';
                title.style.margin = '0 0 4px 0';
                title.style.color = '#ffffff';
                title.style.lineHeight = '1.3';
                title.style.overflow = 'hidden';
                title.style.textOverflow = 'ellipsis';
                title.style.display = '-webkit-box';
                title.style.webkitLineClamp = '2';
                title.style.webkitBoxOrient = 'vertical';
            }
            
            // Year
            const year = card.querySelector('p');
            if (year) {
                year.style.fontSize = '0.75rem';
                year.style.color = 'rgba(255, 255, 255, 0.7)';
                year.style.margin = '0';
            }
        });
        
        // 4. Movies sections
        const moviesSections = document.querySelectorAll('.movies-section');
        moviesSections.forEach(section => {
            section.style.marginBottom = '1rem';
            section.style.padding = '0';
        });
        
        // 5. Hero section
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.style.height = '320px';
            heroSection.style.maxHeight = '320px';
            heroSection.style.minHeight = '320px';
            heroSection.style.marginBottom = '16px';
        }
        
        // 6. Hero buttons
        const heroButtons = document.querySelector('.hero-buttons');
        if (heroButtons) {
            heroButtons.style.position = 'absolute';
            heroButtons.style.bottom = '16px';
            heroButtons.style.left = '16px';
            heroButtons.style.display = 'flex';
            heroButtons.style.flexDirection = 'row';
            heroButtons.style.gap = '8px';
            
            const buttons = heroButtons.querySelectorAll('.btn');
            buttons.forEach(btn => {
                btn.style.padding = '8px 16px';
                btn.style.fontSize = '0.8rem';
                btn.style.borderRadius = '6px';
            });
        }
        
        // 7. Section titles
        const sectionTitles = document.querySelectorAll('.movies-section h2, .section-header');
        sectionTitles.forEach(title => {
            title.style.fontSize = '1rem';
            title.style.fontWeight = '700';
            title.style.textTransform = 'uppercase';
            title.style.margin = '16px 0 10px 0';
        });
        
        // 8. Scrolling wrapper (disable mask)
        const scrollingWrapper = document.querySelector('.scrolling-wrapper');
        if (scrollingWrapper) {
            scrollingWrapper.style.overflow = 'visible';
            scrollingWrapper.style.webkitMaskImage = 'none';
            scrollingWrapper.style.maskImage = 'none';
        }
        
        console.log('Mobile inline styles applied successfully!');
    }
    
    // Apply on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyMobileStyles);
    } else {
        applyMobileStyles();
    }
    
    // Reapply on resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(applyMobileStyles, 250);
    });
    
    // Reapply when new movies are loaded
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                applyMobileStyles();
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
})();
