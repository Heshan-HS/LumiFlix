// Favorites Page Logic
// Displays user's favorite movies

// Wait for auth to be ready
let authReady = false;
let authEventFired = false;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 Loading Favorites page...');
    
    // Show loading initially
    const loadingEl = document.getElementById('favorites-loading');
    if (loadingEl) loadingEl.style.display = 'flex';
});

// Listen for auth state changes
window.addEventListener('authStateChanged', async (event) => {
    console.log('🔐 Auth state changed on Favorites page:', event.detail);
    
    authEventFired = true; // Mark that auth event has fired
    
    if (event.detail.user && event.detail.user.username) {
        // User is logged in with username loaded
        console.log('✅ User authenticated with username:', event.detail.user.username);
        authReady = true;
        
        // Wait for movies to load
        await waitForMovies();
        
        // Load favorites
        loadFavorites();
    } else if (event.detail.user) {
        // User exists but username not loaded yet - wait for it
        console.log('⌛ User authenticated but waiting for username...');
    } else {
        // User is not logged in
        console.log('❌ User not authenticated, showing login required');
        showLoginRequired();
    }
});

// Listen for favorites changes
window.addEventListener('favoritesChanged', () => {
    if (authReady) {
        loadFavorites();
    }
});

// If auth service is already ready, trigger load
// Increased timeout to 2000ms to ensure username is loaded
setTimeout(() => {
    console.log('🔍 Checking auth after 2000ms:', {
        authService: !!authService,
        isLoggedIn: authService?.isLoggedIn,
        currentUser: authService?.currentUser,
        username: authService?.currentUser?.username,
        authReady: authReady,
        authEventFired: authEventFired
    });
    
    // Don't show login required if auth event already fired or is in progress
    if (authEventFired || authReady) {
        console.log('✅ Auth event already handled, skipping timeout check');
        return;
    }
    
    if (authService && authService.isLoggedIn && authService.currentUser && authService.currentUser.username) {
        console.log('✅ Auth is ready (timeout), loading favorites...');
        authReady = true;
        waitForMovies().then(() => loadFavorites());
    } else if (!authReady && !authEventFired) {
        console.log('❌ Auth not ready after 2000ms, showing login required...');
        showLoginRequired();
    }
}, 2000);

// Show login required message
function showLoginRequired() {
    const loadingEl = document.getElementById('favorites-loading');
    const emptyEl = document.getElementById('favorites-empty');
    
    if (loadingEl) loadingEl.style.display = 'none';
    if (emptyEl) {
        emptyEl.style.display = 'flex';
        emptyEl.querySelector('h2').textContent = 'Login Required';
        emptyEl.querySelector('p').textContent = 'Please login to view your favorites';
        emptyEl.querySelector('.favorites-empty-btn').textContent = 'Login / Sign Up';
        emptyEl.querySelector('.favorites-empty-btn').onclick = () => {
            if (authUI && typeof authUI.showSignupModal === 'function') {
                authUI.showSignupModal();
            }
        };
    }
}

// Load and display favorites
async function loadFavorites() {
    const loadingEl = document.getElementById('favorites-loading');
    const emptyEl = document.getElementById('favorites-empty');
    const gridEl = document.getElementById('favorites-grid');
    const statsEl = document.getElementById('favorites-stats');

    // Show loading
    if (loadingEl) loadingEl.style.display = 'flex';
    if (emptyEl) emptyEl.style.display = 'none';
    if (gridEl) gridEl.style.display = 'none';

    try {
        // Get favorite movie IDs
        const favoriteIds = favoritesService.getFavorites();
        console.log('✅ Favorite IDs:', favoriteIds);
        console.log('✅ Favorite IDs type:', typeof favoriteIds[0]);
        console.log('✅ Total movies in movieList:', movieList.length);
        console.log('✅ Sample movie IDs from movieList:', movieList.slice(0, 3).map(m => ({id: m.id, type: typeof m.id})));

        // Update stats
        const count = favoriteIds.length;
        document.querySelectorAll('.favorites-count').forEach(el => {
            el.textContent = count;
        });

        // If no favorites, show empty state
        if (count === 0) {
            console.log('⚠️ No favorites found, showing empty state');
            if (loadingEl) loadingEl.style.display = 'none';
            if (emptyEl) emptyEl.style.display = 'flex';
            if (statsEl) statsEl.style.display = 'none';
            return;
        }

        // Show stats
        if (statsEl) statsEl.style.display = 'flex';

        // Get favorite movies from movieList (try both string and direct comparison)
        const favoriteMovies = movieList.filter(movie => {
            const match = favoriteIds.includes(movie.id) || favoriteIds.includes(movie.id.toString());
            if (match) {
                console.log('✅ Found favorite movie:', movie.title, 'ID:', movie.id);
            }
            return match;
        });

        console.log('✅ Favorite movies found:', favoriteMovies.length);
        console.log('✅ Favorite movie titles:', favoriteMovies.map(m => m.title));

        // Display movies
        if (gridEl) {
            gridEl.innerHTML = '';
            favoriteMovies.forEach(movie => {
                const card = createMovieCard(movie);
                gridEl.appendChild(card);
            });
            gridEl.style.display = 'grid';
        }

        // Add favorite/watchlist buttons to cards
        setTimeout(() => {
            addButtonsToAllCards();
        }, 100);

        // Hide loading
        if (loadingEl) loadingEl.style.display = 'none';

    } catch (error) {
        console.error('❌ Error loading favorites:', error);
        if (loadingEl) loadingEl.style.display = 'none';
        if (emptyEl) {
            emptyEl.style.display = 'flex';
            emptyEl.querySelector('h2').textContent = 'Error Loading Favorites';
            emptyEl.querySelector('p').textContent = 'Please try again later';
        }
    }
}

// Create movie card element (matching home page structure)
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.dataset.movieId = movie.id;

    const posterUrl = movie.poster || movie.posterUrl || 'placeholder.jpg';
    const title = movie.title || 'Unknown';
    const year = movie.year || '';
    const rating = movie.rating || 'N/A';
    const genre = movie.genre ? (Array.isArray(movie.genre) ? movie.genre.join(' / ') : movie.genre) : 'Unknown';

    // Check if movie is in favorites/watchlist
    const isFavorite = window.favoritesService?.isFavorite(movie.id) || false;
    const isInWatchlist = window.favoritesService?.isInWatchlist(movie.id) || false;

    card.innerHTML = `
        <img src="${posterUrl}" alt="${title}" class="card-background-image" style="width: 100%; height: 800px; object-fit: cover;" onerror="this.src='placeholder.jpg'">
        <div class="card-overlay">
            <span class="movie-card-category">${genre}</span>
            
            <!-- Favorites & Watchlist Icons -->
            <div class="card-action-icons">
                <button class="card-icon-btn favorite-btn ${isFavorite ? 'active' : ''}" 
                        data-movie-id="${movie.id}" 
                        data-movie-title="${title}"
                        title="${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}">
                    <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                </button>
                <button class="card-icon-btn watchlist-btn ${isInWatchlist ? 'active' : ''}" 
                        data-movie-id="${movie.id}" 
                        data-movie-title="${title}"
                        title="${isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}">
                    <i class="${isInWatchlist ? 'fas' : 'far'} fa-bookmark"></i>
                </button>
            </div>
            
            <div class="card-footer">
                <h3>${title} (${year})</h3>
                <p>${genre}</p>
            </div>
        </div>
    `;

    // Add click handler for card (but not for icons)
    card.addEventListener('click', (e) => {
        // Don't navigate if clicking on action buttons
        if (e.target.closest('.card-icon-btn')) {
            return;
        }
        window.location.href = `movie.html?title=${encodeURIComponent(title)}`;
    });

    return card;
}
