// Favorites & Watchlist Web Service
// Matches Flutter app's favorites/watchlist system
// Real-time Firebase Firestore integration

class FavoritesService {
    constructor() {
        this.favorites = [];
        this.watchlist = [];
        this.favoritesListener = null;
        this.watchlistListener = null;
    }

    // Initialize real-time listeners
    initializeListeners(userId) {
        if (!userId) {
            console.log('⚠️ No user ID provided for favorites/watchlist listeners');
            return;
        }

        // Listen to favorites changes
        this.favoritesListener = firebase.firestore()
            .collection('users')
            .doc(userId)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    this.favorites = data.favorites || [];
                    console.log('✅ Favorites updated:', this.favorites.length);
                    this.notifyFavoritesChanged();
                }
            }, (error) => {
                console.error('❌ Error listening to favorites:', error);
            });

        // Listen to watchlist changes
        this.watchlistListener = firebase.firestore()
            .collection('users')
            .doc(userId)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    this.watchlist = data.watchlist || [];
                    console.log('✅ Watchlist updated:', this.watchlist.length);
                    this.notifyWatchlistChanged();
                }
            }, (error) => {
                console.error('❌ Error listening to watchlist:', error);
            });
    }

    // Stop listeners (on logout)
    stopListeners() {
        if (this.favoritesListener) {
            this.favoritesListener();
            this.favoritesListener = null;
        }
        if (this.watchlistListener) {
            this.watchlistListener();
            this.watchlistListener = null;
        }
        this.favorites = [];
        this.watchlist = [];
    }

    // ==================== FAVORITES OPERATIONS ====================

    // Add movie to favorites
    async addToFavorites(movieId) {
        try {
            // Get user ID from Firebase Auth directly
            const firebaseUser = firebase.auth().currentUser;
            const userId = firebaseUser?.uid;
            
            console.log('🔐 Adding to favorites - Firebase user:', firebaseUser?.uid);
            
            if (!userId) {
                console.log('❌ Cannot add to favorites: User not logged in');
                return { success: false, message: 'Please login to add favorites' };
            }

            console.log('📝 Adding movie to favorites:', movieId, 'for user:', userId);
            
            await firebase.firestore().collection('users').doc(userId).set({
                favorites: firebase.firestore.FieldValue.arrayUnion(movieId),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            console.log('✅ Added to favorites:', movieId);
            
            // Update local array immediately
            if (!this.favorites.includes(movieId)) {
                this.favorites.push(movieId);
                console.log('✅ Updated local favorites array:', this.favorites);
            }
            
            return { success: true, message: 'Added to favorites!' };

        } catch (error) {
            console.error('❌ Error adding to favorites:', error);
            return { success: false, message: 'Failed to add to favorites' };
        }
    }

    // Remove movie from favorites
    async removeFromFavorites(movieId) {
        try {
            // Get user ID from Firebase Auth directly
            const firebaseUser = firebase.auth().currentUser;
            const userId = firebaseUser?.uid;
            
            if (!userId) {
                console.log('❌ Cannot remove from favorites: User not logged in');
                return { success: false, message: 'User not logged in' };
            }

            await firebase.firestore().collection('users').doc(userId).update({
                favorites: firebase.firestore.FieldValue.arrayRemove(movieId),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('✅ Removed from favorites:', movieId);
            
            // Update local array immediately
            const index = this.favorites.indexOf(movieId);
            if (index > -1) {
                this.favorites.splice(index, 1);
                console.log('✅ Updated local favorites array:', this.favorites);
            }
            
            return { success: true, message: 'Removed from favorites' };

        } catch (error) {
            console.error('❌ Error removing from favorites:', error);
            return { success: false, message: 'Failed to remove from favorites' };
        }
    }

    // Toggle favorite
    async toggleFavorite(movieId) {
        if (this.isInFavorites(movieId)) {
            return await this.removeFromFavorites(movieId);
        } else {
            return await this.addToFavorites(movieId);
        }
    }

    // Check if movie is in favorites
    isInFavorites(movieId) {
        return this.favorites.includes(movieId);
    }

    // Alias for compatibility with script.js
    isFavorite(movieId) {
        return this.isInFavorites(movieId);
    }

    // Alias methods for script.js compatibility
    async addFavorite(movieId) {
        return await this.addToFavorites(movieId);
    }

    async removeFavorite(movieId) {
        return await this.removeFromFavorites(movieId);
    }

    // Get all favorites
    getFavorites() {
        return [...this.favorites];
    }

    // Get favorites count
    getFavoritesCount() {
        return this.favorites.length;
    }

    // ==================== WATCHLIST OPERATIONS ====================

    // Add movie to watchlist
    async addToWatchlist(movieId) {
        try {
            // Get user ID from Firebase Auth directly
            const firebaseUser = firebase.auth().currentUser;
            const userId = firebaseUser?.uid;
            
            if (!userId) {
                console.log('❌ Cannot add to watchlist: User not logged in');
                return { success: false, message: 'Please login to add to watchlist' };
            }

            await firebase.firestore().collection('users').doc(userId).set({
                watchlist: firebase.firestore.FieldValue.arrayUnion(movieId),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            console.log('✅ Added to watchlist:', movieId);
            
            // Update local array immediately
            if (!this.watchlist.includes(movieId)) {
                this.watchlist.push(movieId);
                console.log('✅ Updated local watchlist array:', this.watchlist);
            }
            
            return { success: true, message: 'Added to watchlist!' };

        } catch (error) {
            console.error('❌ Error adding to watchlist:', error);
            return { success: false, message: 'Failed to add to watchlist' };
        }
    }

    // Remove movie from watchlist
    async removeFromWatchlist(movieId) {
        try {
            // Get user ID from Firebase Auth directly
            const firebaseUser = firebase.auth().currentUser;
            const userId = firebaseUser?.uid;
            
            if (!userId) {
                console.log('❌ Cannot remove from watchlist: User not logged in');
                return { success: false, message: 'User not logged in' };
            }

            await firebase.firestore().collection('users').doc(userId).update({
                watchlist: firebase.firestore.FieldValue.arrayRemove(movieId),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('✅ Removed from watchlist:', movieId);
            
            // Update local array immediately
            const index = this.watchlist.indexOf(movieId);
            if (index > -1) {
                this.watchlist.splice(index, 1);
                console.log('✅ Updated local watchlist array:', this.watchlist);
            }
            
            return { success: true, message: 'Removed from watchlist' };

        } catch (error) {
            console.error('❌ Error removing from watchlist:', error);
            return { success: false, message: 'Failed to remove from watchlist' };
        }
    }

    // Toggle watchlist
    async toggleWatchlist(movieId) {
        if (this.isInWatchlist(movieId)) {
            return await this.removeFromWatchlist(movieId);
        } else {
            return await this.addToWatchlist(movieId);
        }
    }

    // Check if movie is in watchlist
    isInWatchlist(movieId) {
        return this.watchlist.includes(movieId);
    }

    // Alias methods for script.js compatibility (already exist with correct names)
    // addToWatchlist and removeFromWatchlist are already correctly named

    // Get all watchlist
    getWatchlist() {
        return [...this.watchlist];
    }

    // Get watchlist count
    getWatchlistCount() {
        return this.watchlist.length;
    }

    // ==================== UI UPDATE NOTIFICATIONS ====================

    // Notify favorites changed (update UI)
    notifyFavoritesChanged() {
        // Update all favorite icons on page
        document.querySelectorAll('.favorite-icon').forEach(icon => {
            const movieId = icon.dataset.movieId;
            if (movieId) {
                this.updateFavoriteIcon(icon, this.isInFavorites(movieId));
            }
        });

        // Update favorites count in user menu
        this.updateFavoritesCount();

        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('favoritesChanged', {
            detail: { favorites: this.favorites }
        }));
    }

    // Notify watchlist changed (update UI)
    notifyWatchlistChanged() {
        // Update all watchlist icons on page
        document.querySelectorAll('.watchlist-icon').forEach(icon => {
            const movieId = icon.dataset.movieId;
            if (movieId) {
                this.updateWatchlistIcon(icon, this.isInWatchlist(movieId));
            }
        });

        // Update watchlist count in user menu
        this.updateWatchlistCount();

        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('watchlistChanged', {
            detail: { watchlist: this.watchlist }
        }));
    }

    // Update favorite icon visual state
    updateFavoriteIcon(icon, isFavorite) {
        if (isFavorite) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            icon.style.color = '#ff4757';
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            icon.style.color = '#ffffff';
        }
    }

    // Update watchlist icon visual state
    updateWatchlistIcon(icon, isInWatchlist) {
        if (isInWatchlist) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            icon.style.color = '#ffa502';
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            icon.style.color = '#ffffff';
        }
    }

    // Update favorites count display
    updateFavoritesCount() {
        const countElements = document.querySelectorAll('.favorites-count');
        countElements.forEach(el => {
            el.textContent = this.getFavoritesCount();
        });
    }

    // Update watchlist count display
    updateWatchlistCount() {
        const countElements = document.querySelectorAll('.watchlist-count');
        countElements.forEach(el => {
            el.textContent = this.getWatchlistCount();
        });
    }

    // Show toast notification
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `favorites-toast ${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('active'), 10);
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    // ==================== LOAD FAVORITES/WATCHLIST DATA ====================

    // Load user's favorites and watchlist from Firestore
    async loadUserData(userId) {
        try {
            const doc = await firebase.firestore().collection('users').doc(userId).get();
            if (doc.exists) {
                const data = doc.data();
                this.favorites = data.favorites || [];
                this.watchlist = data.watchlist || [];
                console.log('✅ Loaded favorites:', this.favorites.length);
                console.log('✅ Loaded watchlist:', this.watchlist.length);
            }
        } catch (error) {
            console.error('❌ Error loading user data:', error);
        }
    }
}

// Create global favorites service instance
const favoritesService = new FavoritesService();

// Expose to window for access from other scripts
window.favoritesService = favoritesService;

// Initialize listeners when user logs in (with delay to ensure auth is ready)
setTimeout(() => {
    // Use Firebase Auth directly
    const firebaseUser = firebase.auth().currentUser;
    const userId = firebaseUser?.uid;
    
    console.log('🔄 Checking Firebase Auth for favoritesService initialization...');
    console.log('   - Firebase currentUser:', firebaseUser?.uid);
    
    if (userId) {
        console.log('🔄 Initializing favoritesService for user:', userId);
        favoritesService.initializeListeners(userId);
        favoritesService.loadUserData(userId);
    } else {
        console.log('⏳ User not logged in, favoritesService waiting for auth...');
    }
}, 1500); // Wait 1.5 seconds for auth to load

// Listen for Firebase auth state changes directly
firebase.auth().onAuthStateChanged((firebaseUser) => {
    console.log('🔄 Firebase auth state changed:', firebaseUser ? 'Logged in' : 'Logged out');
    
    if (firebaseUser && firebaseUser.uid) {
        console.log('🔄 Initializing favoritesService for user:', firebaseUser.uid);
        favoritesService.initializeListeners(firebaseUser.uid);
        favoritesService.loadUserData(firebaseUser.uid);
    } else {
        console.log('🔄 User logged out, stopping listeners');
        favoritesService.stopListeners();
    }
});
