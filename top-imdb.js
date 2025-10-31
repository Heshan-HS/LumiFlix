// Top IMDb Rated Movies Page JavaScript

let allTopMovies = [];
let currentPage = 1;
const moviesPerPage = 18; // 3 rows × 6 cards

document.addEventListener('DOMContentLoaded', async () => {
    console.log('⭐ Loading Top IMDb Rated Movies page...');
    
    try {
        // Check if waitForMovies function exists
        if (typeof waitForMovies !== 'function') {
            console.error('❌ waitForMovies function not found');
            displayErrorMessage('Required functions not loaded. Please refresh the page.');
            return;
        }
        
        // Wait for Firebase movies to load
        await waitForMovies();
        
        // Check if movieList is available
        if (typeof movieList === 'undefined' || !movieList || movieList.length === 0) {
            console.error('❌ movieList is empty or not defined');
            displayErrorMessage('No movies found in database.');
            return;
        }
        
        console.log(`✅ movieList loaded with ${movieList.length} movies`);
        
        // Check if createMovieCard function exists
        if (typeof createMovieCard !== 'function') {
            console.error('❌ createMovieCard function not found');
            displayErrorMessage('Movie card renderer not loaded. Please refresh the page.');
            return;
        }
        
        // Load movies
        loadTopIMDbMovies();
        
    } catch (error) {
        console.error('❌ Error loading Top IMDb movies:', error);
        displayErrorMessage('An error occurred while loading movies.');
    }
});

function loadTopIMDbMovies() {
    const grid = document.getElementById('top-imdb-movies-grid');
    
    if (!grid) {
        console.error('❌ Top IMDb movies grid not found');
        return;
    }
    
    // Filter movies that have ratings and sort by rating (highest first)
    const ratedMovies = movieList.filter(movie => {
        const rating = parseFloat(movie.rating);
        return !isNaN(rating) && rating > 0;
    });
    
    // Sort by rating (highest first)
    const topRatedMovies = ratedMovies.sort((a, b) => {
        const ratingA = parseFloat(a.rating) || 0;
        const ratingB = parseFloat(b.rating) || 0;
        return ratingB - ratingA; // Highest rating first
    });
    
    // Store all top movies
    allTopMovies = topRatedMovies;
    
    if (allTopMovies.length === 0) {
        grid.innerHTML = '<p class="no-results">No rated movies found.</p>';
        return;
    }
    
    // Display first page
    displayPage(1);
    
    // Setup pagination
    setupPagination();
    
    console.log(`✅ Loaded ${allTopMovies.length} top-rated movies`);
}

function displayPage(page) {
    const grid = document.getElementById('top-imdb-movies-grid');
    if (!grid) return;
    
    // Calculate start and end indices
    const startIndex = (page - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    const moviesToShow = allTopMovies.slice(startIndex, endIndex);
    
    // Clear grid
    grid.innerHTML = '';
    
    // Add movies for current page with IMDb ratings
    moviesToShow.forEach((movie, index) => {
        const card = createMovieCard(movie);
        
        // Add IMDb rating badge to all movies (compact horizontal style)
        if (movie.rating) {
            const imdbRatingBadge = document.createElement('div');
            imdbRatingBadge.className = 'imdb-rating-badge-compact';
            imdbRatingBadge.innerHTML = `
                <span class="rating-number">${movie.rating}</span>
                <span class="imdb-label">IMDb</span>
            `;
            card.style.position = 'relative';
            card.appendChild(imdbRatingBadge);
        }
        
        grid.appendChild(card);
    });
    
    // Update current page
    currentPage = page;
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupPagination() {
    const paginationContainer = document.getElementById('pagination-container');
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(allTopMovies.length / moviesPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }
    
    paginationContainer.innerHTML = '';
    paginationContainer.style.display = 'flex';
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-btn';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i> Previous';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            displayPage(currentPage - 1);
            setupPagination();
        }
    });
    paginationContainer.appendChild(prevBtn);
    
    // Page numbers
    const pageNumbersDiv = document.createElement('div');
    pageNumbersDiv.className = 'pagination-numbers';
    
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'pagination-number';
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            displayPage(i);
            setupPagination();
        });
        pageNumbersDiv.appendChild(pageBtn);
    }
    paginationContainer.appendChild(pageNumbersDiv);
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-btn';
    nextBtn.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            displayPage(currentPage + 1);
            setupPagination();
        }
    });
    paginationContainer.appendChild(nextBtn);
}

function displayErrorMessage(message = 'Failed to load movies') {
    const grid = document.getElementById('top-imdb-movies-grid');
    if (grid) {
        grid.innerHTML = `
            <div class="error-message-container">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Failed to Load Movies</h3>
                <p>${message}</p>
                <p>Please check your internet connection and try again.</p>
                <a href="index.html" class="btn btn-primary">Go to Home</a>
            </div>
        `;
    }
}
