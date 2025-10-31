// Search Functionality for Trending and Top IMDb Pages
console.log('🔍 Page search functionality loaded');

// Initialize search on page load
document.addEventListener('DOMContentLoaded', () => {
    setupPageSearch();
});

function setupPageSearch() {
    const searchInput = document.getElementById('search-input');
    const suggestionsBox = document.getElementById('suggestions-box');
    const searchHistoryBox = document.getElementById('search-history-box');
    
    if (!searchInput) {
        console.warn('⚠️ Search input not found');
        return;
    }
    
    console.log('✅ Setting up page search...');
    
    // Search input handler
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        handlePageSearch(query);
    });
    
    // Focus handler - show search history
    searchInput.addEventListener('focus', () => {
        displaySearchHistory();
    });
    
    // Click outside to hide suggestions
    document.addEventListener('click', (event) => {
        const searchBar = document.querySelector('.search-bar');
        if (!searchBar || !searchBar.contains(event.target)) {
            if (suggestionsBox) suggestionsBox.style.display = 'none';
            if (searchHistoryBox) searchHistoryBox.style.display = 'none';
        }
    });
    
    console.log('✅ Page search handlers attached');
}

function handlePageSearch(query) {
    const suggestionsBox = document.getElementById('suggestions-box');
    const searchHistoryBox = document.getElementById('search-history-box');
    
    // Hide history when typing
    if (searchHistoryBox) {
        searchHistoryBox.style.display = 'none';
    }
    
    if (!query) {
        if (suggestionsBox) {
            suggestionsBox.style.display = 'none';
        }
        return;
    }
    
    // Check if movieList is available
    if (typeof movieList === 'undefined' || !movieList || movieList.length === 0) {
        console.warn('⚠️ movieList not available for search');
        return;
    }
    
    // Search through movies
    const results = movieList.filter(movie => {
        // Get genre as string (handle arrays, null, undefined)
        let genreStr = '';
        if (movie.genre) {
            if (Array.isArray(movie.genre)) {
                genreStr = movie.genre.join(' ');
            } else {
                genreStr = String(movie.genre);
            }
        }
        
        return movie.title.toLowerCase().includes(query) ||
               (movie.description && movie.description.toLowerCase().includes(query)) ||
               (genreStr && genreStr.toLowerCase().includes(query));
    }).slice(0, 5); // Limit to 5 suggestions
    
    // Display suggestions
    if (results.length > 0 && suggestionsBox) {
        displaySuggestions(results, query);
    } else if (suggestionsBox) {
        suggestionsBox.innerHTML = '<div style="padding: 1rem; text-align: center; color: rgba(255,255,255,0.5);">No results found</div>';
        suggestionsBox.style.display = 'block';
    }
}

function cleanTitle(title) {
    if (!title) return '';
    
    console.log('Original title:', title);
    
    // Remove episode/season info (e.g., "- Season 1, Episode 1: Winter Is Coming")
    let cleaned = title.replace(/\s*-\s*Season\s+\d+.*$/i, '');
    
    // Remove episode info after dash
    cleaned = cleaned.replace(/\s*-\s*Episode\s+\d+.*$/i, '');
    
    // Truncate if too long (max 50 characters for better display)
    if (cleaned.length > 50) {
        cleaned = cleaned.substring(0, 47) + '...';
    }
    
    const result = cleaned.trim();
    console.log('Cleaned title:', result);
    
    return result;
}

function displaySuggestions(results, query) {
    const suggestionsBox = document.getElementById('suggestions-box');
    if (!suggestionsBox) return;
    
    console.log('📊 Displaying', results.length, 'suggestions');
    
    suggestionsBox.innerHTML = results.map(movie => {
        const cleanedTitle = cleanTitle(movie.title);
        
        // Handle genre (array or string)
        let genreDisplay = '';
        if (movie.genre) {
            if (Array.isArray(movie.genre)) {
                genreDisplay = movie.genre.join(', ');
            } else {
                genreDisplay = String(movie.genre);
            }
        }
        
        return `
            <div class="suggestion-item" data-title="${movie.title}">
                <img src="${movie.thumbnail || 'placeholder.jpg'}" 
                     alt="${cleanedTitle}" 
                     class="suggestion-thumb"
                     onerror="this.style.display='none';"
                     style="width: 50px; height: 70px; object-fit: cover; border-radius: 6px; flex-shrink: 0;">
                <div class="suggestion-info" style="flex: 1; display: flex; flex-direction: column; gap: 0.25rem;">
                    <div class="suggestion-title" style="font-size: 0.95rem; font-weight: 500; color: #ffffff; line-height: 1.3;">${highlightMatch(cleanedTitle, query)}</div>
                    <div class="suggestion-meta" style="font-size: 0.8rem; color: rgba(255, 255, 255, 0.6);">${movie.year || ''} ${genreDisplay ? '• ' + genreDisplay : ''}</div>
                </div>
            </div>
        `;
    }).join('');
    
    // Apply styles (inline as fallback if CSS doesn't load)
    suggestionsBox.style.display = 'block';
    suggestionsBox.style.position = 'absolute';
    suggestionsBox.style.top = 'calc(100% + 10px)';
    suggestionsBox.style.left = '0';
    suggestionsBox.style.right = '0';
    suggestionsBox.style.background = 'linear-gradient(135deg, rgba(26, 28, 47, 0.98), rgba(15, 17, 30, 0.98))';
    suggestionsBox.style.backdropFilter = 'blur(20px)';
    suggestionsBox.style.borderRadius = '12px';
    suggestionsBox.style.border = '1px solid rgba(170, 0, 255, 0.2)';
    suggestionsBox.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.5)';
    suggestionsBox.style.zIndex = '1000';
    suggestionsBox.style.maxHeight = '400px';
    suggestionsBox.style.overflowY = 'auto';
    
    // Add click handlers to suggestions
    suggestionsBox.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            const title = item.dataset.title;
            addSearchToHistory(title);
            window.location.href = `movie.html?title=${encodeURIComponent(title)}`;
        });
    });
}

function highlightMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
}

function displaySearchHistory() {
    const searchHistoryBox = document.getElementById('search-history-box');
    const suggestionsBox = document.getElementById('suggestions-box');
    
    if (!searchHistoryBox) return;
    
    // Hide suggestions when showing history
    if (suggestionsBox) {
        suggestionsBox.style.display = 'none';
    }
    
    const history = getSearchHistory();
    
    if (history.length === 0) {
        searchHistoryBox.style.display = 'none';
        return;
    }
    
    searchHistoryBox.innerHTML = `
        <div class="search-history-header">
            <span>Recent Searches</span>
            <button class="clear-history-btn" onclick="clearSearchHistory()">Clear All</button>
        </div>
        ${history.map(term => `
            <div class="history-item" data-term="${term}">
                <i class="fas fa-history"></i>
                <span>${term}</span>
            </div>
        `).join('')}
    `;
    
    searchHistoryBox.style.display = 'block';
    
    // Add click handlers to history items
    searchHistoryBox.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => {
            const term = item.dataset.term;
            const movie = findMovieByTitle(term);
            if (movie) {
                window.location.href = `movie.html?title=${encodeURIComponent(movie.title)}`;
            }
        });
    });
}

function getSearchHistory() {
    try {
        const history = localStorage.getItem('searchHistory');
        return history ? JSON.parse(history) : [];
    } catch (e) {
        console.error('Error reading search history:', e);
        return [];
    }
}

function addSearchToHistory(term) {
    if (!term || term.trim() === '') return;
    
    try {
        let history = getSearchHistory();
        
        // Remove if already exists
        history = history.filter(item => item.toLowerCase() !== term.toLowerCase());
        
        // Add to beginning
        history.unshift(term);
        
        // Keep only last 10
        history = history.slice(0, 10);
        
        localStorage.setItem('searchHistory', JSON.stringify(history));
    } catch (e) {
        console.error('Error saving search history:', e);
    }
}

function clearSearchHistory() {
    try {
        localStorage.removeItem('searchHistory');
        const searchHistoryBox = document.getElementById('search-history-box');
        if (searchHistoryBox) {
            searchHistoryBox.style.display = 'none';
        }
    } catch (e) {
        console.error('Error clearing search history:', e);
    }
}

function findMovieByTitle(title) {
    if (typeof movieList === 'undefined' || !movieList) return null;
    return movieList.find(movie => 
        movie.title.toLowerCase() === title.toLowerCase()
    );
}

console.log('✅ Page search functions ready');
