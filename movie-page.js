document.addEventListener('DOMContentLoaded', async () => {
    const movieDetailContent = document.getElementById('movie-detail-content');
    
    if (!movieDetailContent) return;

    try {
        // Wait for Firebase movies to load
        console.log('⏳ Waiting for Firebase movies...');
        await waitForMovies();
        console.log('✅ Movies loaded, loading movie details...');

        if (typeof movieList === 'undefined' || !movieList || movieList.length === 0) {
            console.error('❌ movieList is empty or not defined');
            movieDetailContent.innerHTML = '<p class="error-message">❌ Database connection failed. Please return to the <a href="index.html">home page</a>.</p>';
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const movieTitle = urlParams.get('title');
        const movieData = findMovieByTitle(movieTitle);

        if (!movieData) {
            movieDetailContent.innerHTML = `<p class="error-message">Movie not found. Please return to the <a href="index.html">home page</a>.</p>`;
            return;
        }

        updateMetaTags(movieData);
        renderMoviePage(movieData);
        createSimilarMoviesSection();
        renderSimilarMovies(movieData);
        setupTrailerModal(movieData);
    } catch (error) {
        console.error('❌ Error loading movie:', error);
        movieDetailContent.innerHTML = '<p class="error-message">❌ Error loading movie. Please <a href="index.html">go back</a> and try again.</p>';
    }
});

function updateMetaTags(movie) {
    const baseUrl = 'http://movieversehub.gt.tc';
    const pageUrl = `${baseUrl}/movie.html?title=${encodeURIComponent(movie.title)}`;
    const posterUrl = new URL(movie.poster, baseUrl).href;

    document.title = `${movie.title} - MOVIEVERSE HUB`;

    // SEO
    document.getElementById('meta-description').setAttribute('content', movie.description);
    document.getElementById('meta-keywords').setAttribute('content', `movies, ${movie.title}, ${movie.genre}, ${movie.year}, download, trailer`);
    document.getElementById('canonical-link').setAttribute('href', pageUrl);

    // Open Graph
    document.getElementById('og-title').setAttribute('content', `${movie.title} - MOVIEVERSE HUB`);
    document.getElementById('og-description').setAttribute('content', movie.description);
    document.getElementById('og-url').setAttribute('content', pageUrl);
    document.getElementById('og-image').setAttribute('content', posterUrl);

    // Twitter
    document.getElementById('twitter-title').setAttribute('content', `${movie.title} - MOVIEVERSE HUB`);
    document.getElementById('twitter-description').setAttribute('content', movie.description);
    document.getElementById('twitter-url').setAttribute('content', pageUrl);
    document.getElementById('twitter-image').setAttribute('content', posterUrl);
}

function findMovieByTitle(title) {
    return movieList.find(movie => movie.title.toLowerCase() === title.toLowerCase());
}

function renderMoviePage(movie) {
    const movieDetailContent = document.getElementById('movie-detail-content');

    // Add the 'Watch Trailer' button directly into the HTML template
    movieDetailContent.innerHTML = `
        <div class="movie-detail-container">
            <div class="movie-banner">
                <div class="movie-banner-poster">
                    <img src="${movie.poster}" alt="Movie Poster">
                </div>
                <div class="movie-banner-details">
                    <h1>${movie.title} ${movie.year}</h1>
                    ${movie.englishDescription ? `<p class="banner-description">${movie.englishDescription}</p>` : ''}

                    <div class="movie-info-list">
                        ${movie.releaseDate ? `<div class="info-item"><strong>Release Date:</strong> ${movie.releaseDate}</div>` : ''}
                        ${movie.rating ? `<div class="info-item"><strong>Rating:</strong> ${movie.rating} <span class="imdb-tag">IMDb</span></div>` : ''}
                        ${movie.cast && movie.cast.length > 0 ? `
                            <div class="info-item cast-section">
                                <strong>Cast</strong>
                                <p class="cast-list">${movie.cast.join(', ')}</p>
                            </div>
                        ` : ''}
                    </div>
                    <div class="banner-buttons" style="margin-top: 1.5rem;">
                        ${movie.trailerLink ? `<a href="#" class="btn btn-primary btn-trailer"><i class="fas fa-play"></i> Watch Trailer</a>` : ''}
                    </div>
                </div>
            </div>

            <div class="movie-download-section">
                <h2>Movie Description</h2>
                <p>${movie.description}</p>
                <div class="download-content">
                    <div class="download-details">
                        <h3>Download Links</h3>
                        <div class="download-links">
                            <a href="${movie.downloadLink}" class="download-btn" target="_blank">Download Movie | සිංහල උපසිරසි සමඟ</a>
                        </div>
                    </div>
                    <div class="screenshot-gallery">
                        ${(movie.gallery || []).slice(0, 3).map(imgUrl => `<img src="${imgUrl}" alt="Screenshot">`).join('')}
                    </div>
                </div>
            </div>
    `;

    const banner = movieDetailContent.querySelector('.movie-banner');
    if (banner && movie.banner) {
        banner.style.backgroundImage = `url('${movie.banner}')`;
    }
}

function createSimilarMoviesSection() {
    const movieDetailContainer = document.querySelector('.movie-detail-container');
    if (!movieDetailContainer) return;

    const similarMoviesSection = document.createElement('section');
    similarMoviesSection.className = 'movies-section similar-movies';
    // Remove inline padding for mobile - let CSS handle it
    if (window.innerWidth > 768) {
        similarMoviesSection.style.padding = '2rem 3rem'; // Desktop only
    } else {
        similarMoviesSection.style.padding = '0'; // Mobile: full width
    }
    similarMoviesSection.innerHTML = `
        <h2 class="section-header">You Might Also Like</h2>
        <div class="scrolling-wrapper">
            <div class="scrolling-grid" id="similar-movies-grid"></div>
        </div>
    `;
    movieDetailContainer.appendChild(similarMoviesSection);
}

function getYouTubeVideoId(url) {
    let videoId = '';
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes('youtube.com')) {
            videoId = urlObj.searchParams.get('v');
        } else if (urlObj.hostname.includes('youtu.be')) {
            videoId = urlObj.pathname.substring(1);
        }
    } catch (e) {
        console.error('Invalid URL for YouTube video ID extraction', e);
    }
    return videoId;
}

function setupTrailerModal(movie) {
    const trailerModal = document.getElementById('trailer-modal');
    const closeBtn = trailerModal.querySelector('.close-btn');
    const trailerIframe = document.getElementById('trailer-iframe');
    const trailerButton = document.querySelector('.btn-trailer');

    if (!trailerButton || !trailerModal || !closeBtn || !trailerIframe) return;

    trailerButton.addEventListener('click', (e) => {
        e.preventDefault();
        const videoId = getYouTubeVideoId(movie.trailerLink);
        if (videoId) {
            trailerIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
            trailerModal.classList.add('show');
        }
    });

    const closeModal = () => {
        trailerModal.classList.remove('show');
        trailerIframe.src = ''; // Stop video playback
    };

    closeBtn.addEventListener('click', closeModal);
    trailerModal.addEventListener('click', (e) => {
        if (e.target === trailerModal) {
            closeModal();
        }
    });
}

function createMovieCard(movie) {
    const card = document.createElement('div');
    card.classList.add('movie-card');
    card.innerHTML = `
        <img src="${movie.poster}" alt="${movie.title}" class="card-background-image">
        <div class="card-overlay">
            <span class="movie-card-category">${Array.isArray(movie.genre) ? movie.genre.join(' / ') : movie.genre}</span>
            <div class="card-footer">
                <h3>${movie.title} (${movie.year})</h3>
                <p>${Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}</p>
            </div>
        </div>
    `;
    card.addEventListener('click', () => {
        window.location.href = `movie.html?title=${encodeURIComponent(movie.title)}`;
    });
    return card;
}

function renderSimilarMovies(currentMovie) {
    const similarMoviesGrid = document.getElementById('similar-movies-grid');
    if (!similarMoviesGrid) return;

    // Get ALL movies from database except current movie
    const similarMovies = movieList.filter(movie => 
        movie.title.toLowerCase() !== currentMovie.title.toLowerCase()
    );

    if (similarMovies.length === 0) {
        similarMoviesGrid.innerHTML = '<p style="color: #fff; text-align: center; padding: 2rem;">No other movies available.</p>';
        return;
    }

    similarMoviesGrid.innerHTML = '';
    
    // Display ALL movie cards for auto-scroll
    similarMovies.forEach(movie => {
        similarMoviesGrid.appendChild(createMovieCard(movie));
    });
    
    // Duplicate ALL cards for seamless infinite loop
    similarMovies.forEach(movie => {
        similarMoviesGrid.appendChild(createMovieCard(movie));
    });
}
