// Favorites & Watchlist UI Integration
// Adds favorite/watchlist icons to movie cards

// Add favorite/watchlist buttons to movie card
function addFavoriteWatchlistButtons(movieCard, movieId) {
    // Check if buttons already exist
    if (movieCard.querySelector('.movie-card-actions')) {
        return;
    }

    // Create action buttons container
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'movie-card-actions';

    // Create favorite button
    const favoriteBtn = document.createElement('button');
    favoriteBtn.className = 'favorite-btn';
    favoriteBtn.setAttribute('aria-label', 'Add to favorites');
    favoriteBtn.innerHTML = `<i class="far fa-heart favorite-icon" data-movie-id="${movieId}"></i>`;
    favoriteBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleFavoriteClick(movieId, favoriteBtn);
    };

    // Create watchlist button
    const watchlistBtn = document.createElement('button');
    watchlistBtn.className = 'watchlist-btn';
    watchlistBtn.setAttribute('aria-label', 'Add to watchlist');
    watchlistBtn.innerHTML = `<i class="far fa-bookmark watchlist-icon" data-movie-id="${movieId}"></i>`;
    watchlistBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleWatchlistClick(movieId, watchlistBtn);
    };

    // Add buttons to container
    actionsContainer.appendChild(favoriteBtn);
    actionsContainer.appendChild(watchlistBtn);

    // Add container to movie card
    movieCard.style.position = 'relative';
    movieCard.appendChild(actionsContainer);

    // Update button states if user is logged in
    if (authService && authService.isLoggedIn && favoritesService) {
        updateFavoriteButtonState(favoriteBtn, movieId);
        updateWatchlistButtonState(watchlistBtn, movieId);
    }
}

// Handle favorite button click
async function handleFavoriteClick(movieId, button) {
    console.log('❤️ FAVORITE CLICK - movieId:', movieId);
    console.log('🔍 authService exists:', typeof authService !== 'undefined');
    console.log('🔍 authService.isLoggedIn:', authService?.isLoggedIn);
    console.log('🔍 authUI exists:', typeof authUI !== 'undefined');
    console.log('🔍 authUI.showSignupModal:', typeof authUI?.showSignupModal);
    
    // Check if user is logged in
    if (!authService || !authService.isLoggedIn) {
        console.log('⚠️ User NOT logged in - attempting to show signup modal...');
        if (authUI && typeof authUI.showSignupModal === 'function') {
            console.log('✅ Calling authUI.showSignupModal()...');
            authUI.showSignupModal();
        } else {
            console.error('❌ authUI.showSignupModal NOT AVAILABLE!');
            console.log('authUI value:', authUI);
            alert('Please login first (authUI not ready)');
        }
        return;
    }

    // Disable button during operation
    button.disabled = true;

    // Toggle favorite
    const result = await favoritesService.toggleFavorite(movieId);

    // Re-enable button
    button.disabled = false;

    // Show toast notification
    if (result.success) {
        favoritesService.showToast(result.message, 'success');
    } else {
        favoritesService.showToast(result.message, 'error');
    }
}

// Handle watchlist button click
async function handleWatchlistClick(movieId, button) {
    console.log('🔖 WATCHLIST CLICK - movieId:', movieId);
    console.log('🔍 authService exists:', typeof authService !== 'undefined');
    console.log('🔍 authService.isLoggedIn:', authService?.isLoggedIn);
    console.log('🔍 authUI exists:', typeof authUI !== 'undefined');
    console.log('🔍 authUI.showSignupModal:', typeof authUI?.showSignupModal);
    
    // Check if user is logged in
    if (!authService || !authService.isLoggedIn) {
        console.log('⚠️ User NOT logged in - attempting to show signup modal...');
        if (authUI && typeof authUI.showSignupModal === 'function') {
            console.log('✅ Calling authUI.showSignupModal()...');
            authUI.showSignupModal();
        } else {
            console.error('❌ authUI.showSignupModal NOT AVAILABLE!');
            console.log('authUI value:', authUI);
            alert('Please login first (authUI not ready)');
        }
        return;
    }

    // Disable button during operation
    button.disabled = true;

    // Toggle watchlist
    const result = await favoritesService.toggleWatchlist(movieId);

    // Re-enable button
    button.disabled = false;

    // Show toast notification
    if (result.success) {
        favoritesService.showToast(result.message, 'success');
    } else {
        favoritesService.showToast(result.message, 'error');
    }
}

// Update favorite button state
function updateFavoriteButtonState(button, movieId) {
    const icon = button.querySelector('.favorite-icon');
    if (!icon) return;

    if (favoritesService && favoritesService.isInFavorites(movieId)) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        icon.style.color = '#ff4757';
        button.setAttribute('aria-label', 'Remove from favorites');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        icon.style.color = '#ffffff';
        button.setAttribute('aria-label', 'Add to favorites');
    }
}

// Update watchlist button state
function updateWatchlistButtonState(button, movieId) {
    const icon = button.querySelector('.watchlist-icon');
    if (!icon) return;

    if (favoritesService && favoritesService.isInWatchlist(movieId)) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        icon.style.color = '#ffa502';
        button.setAttribute('aria-label', 'Remove from watchlist');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        icon.style.color = '#ffffff';
        button.setAttribute('aria-label', 'Add to watchlist');
    }
}

// Add buttons to all existing movie cards
function addButtonsToAllCards() {
    const movieCards = document.querySelectorAll('.movie-card');
    movieCards.forEach(card => {
        const movieId = card.dataset.movieId;
        if (movieId) {
            addFavoriteWatchlistButtons(card, movieId);
        }
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for movies to load
    setTimeout(() => {
        addButtonsToAllCards();
    }, 500);

    // Also add when favorites/watchlist changes
    window.addEventListener('favoritesChanged', () => {
        addButtonsToAllCards();
    });

    window.addEventListener('watchlistChanged', () => {
        addButtonsToAllCards();
    });
});

// Observe for dynamically added movie cards
if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.classList && node.classList.contains('movie-card')) {
                    const movieId = node.dataset.movieId;
                    if (movieId) {
                        addFavoriteWatchlistButtons(node, movieId);
                    }
                }
            });
        });
    });

    // Start observing
    document.addEventListener('DOMContentLoaded', () => {
        const moviesGrid = document.querySelector('.movies-grid, #trending-movies-grid, #top-imdb-movies-grid');
        if (moviesGrid) {
            observer.observe(moviesGrid, {
                childList: true,
                subtree: true
            });
        }
    });
}
