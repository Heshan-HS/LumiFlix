// Mobile Movie Details Inline Styles - Force Apply
// This script applies mobile styles directly via JavaScript to override any CSS conflicts

(function() {
    'use strict';
    
    // Check if mobile view
    function isMobileView() {
        return window.innerWidth <= 768;
    }
    
    // Apply mobile styles to movie details page
    function applyMobileMovieStyles() {
        if (!isMobileView()) return;
        
        console.log('Applying mobile movie details inline styles...');
        
        // 1. Movie details container - remove default padding
        const movieContainer = document.querySelector('.movie-details-container, .movie-details, main');
        if (movieContainer) {
            movieContainer.style.padding = '0';
            movieContainer.style.margin = '0';
        }
        
        // 2. All sections - reduce padding to 4px
        const sections = document.querySelectorAll('.movie-info, .movie-actions, .overview-section, .details-section, .ratings-section, .similar-movies, .recommended-section');
        sections.forEach(section => {
            section.style.paddingLeft = '4px';
            section.style.paddingRight = '4px';
        });
        
        // 3. Movie banner/backdrop
        const banner = document.querySelector('.movie-banner, .movie-backdrop, .hero-banner');
        if (banner) {
            banner.style.width = '100%';
            banner.style.padding = '0';
            banner.style.margin = '0';
        }
        
        // 4. Movie info card
        const infoCard = document.querySelector('.movie-info-card, .movie-header');
        if (infoCard) {
            infoCard.style.paddingLeft = '4px';
            infoCard.style.paddingRight = '4px';
            infoCard.style.paddingBottom = '12px';
        }
        
        // 5. Action buttons container
        const actionsContainer = document.querySelector('.movie-actions, .action-buttons, .cta-buttons');
        if (actionsContainer) {
            actionsContainer.style.paddingLeft = '4px';
            actionsContainer.style.paddingRight = '4px';
            actionsContainer.style.paddingBottom = '12px';
            actionsContainer.style.gap = '6px';
            actionsContainer.style.display = 'flex';
        }
        
        // 6. Overview section
        const overview = document.querySelector('.overview-section, .movie-description, #movie-description');
        if (overview) {
            overview.style.paddingLeft = '4px';
            overview.style.paddingRight = '4px';
            overview.style.paddingBottom = '16px';
        }
        
        // 7. Details grid
        const detailsGrid = document.querySelector('.movie-details-grid, .details-grid, .movie-info-grid');
        if (detailsGrid) {
            detailsGrid.style.paddingLeft = '4px';
            detailsGrid.style.paddingRight = '4px';
            detailsGrid.style.paddingBottom = '16px';
        }
        
        // 8. Ratings section
        const ratingsSection = document.querySelector('.ratings-section, .reviews-section, #ratings-reviews');
        if (ratingsSection) {
            ratingsSection.style.paddingLeft = '4px';
            ratingsSection.style.paddingRight = '4px';
            ratingsSection.style.paddingBottom = '16px';
        }
        
        // 9. Similar/More movies section - FULL WIDTH (0px padding)
        const similarMovies = document.querySelector('.similar-movies, .more-movies, .recommended-movies');
        if (similarMovies) {
            similarMovies.style.paddingLeft = '0';
            similarMovies.style.paddingRight = '0';
            similarMovies.style.paddingBottom = '80px';
            similarMovies.style.width = '100%';
        }
        
        // 9a. Similar movies title - add padding back for title only
        const similarTitle = document.querySelector('.similar-movies h2, .more-movies h2, .recommended-movies h2');
        if (similarTitle) {
            similarTitle.style.paddingLeft = '4px';
            similarTitle.style.paddingRight = '4px';
        }
        
        // 9b. Similar movies scroll container - full width
        const similarScroll = document.querySelector('.similar-movies .movie-grid, .more-movies .movie-grid, .similar-movies-scroll, .more-movies-scroll');
        if (similarScroll) {
            similarScroll.style.paddingLeft = '0';
            similarScroll.style.paddingRight = '0';
            similarScroll.style.width = '100%';
        }
        
        // 10. All containers with class containing 'container'
        const containers = document.querySelectorAll('[class*="container"]');
        containers.forEach(container => {
            if (container.classList.contains('movie-details-container') || 
                container.classList.contains('content-container')) {
                container.style.paddingLeft = '0';
                container.style.paddingRight = '0';
            }
        });
        
        // 11. Remove any max-width constraints
        const contentWrappers = document.querySelectorAll('.content-wrapper, .main-content, .page-content');
        contentWrappers.forEach(wrapper => {
            wrapper.style.maxWidth = '100%';
            wrapper.style.paddingLeft = '0';
            wrapper.style.paddingRight = '0';
        });
        
        console.log('Mobile movie details inline styles applied successfully!');
    }
    
    // Apply on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyMobileMovieStyles);
    } else {
        applyMobileMovieStyles();
    }
    
    // Reapply on resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(applyMobileMovieStyles, 250);
    });
    
    // Reapply when new content is loaded
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                applyMobileMovieStyles();
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
})();
