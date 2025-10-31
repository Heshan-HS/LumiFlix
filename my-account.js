// My Account Page JavaScript
// Load user data and populate the page

console.log('📄 My Account script loaded');

// IMMEDIATE AUTH CHECK - Redirect if not logged in
setTimeout(() => {
    console.log('🔍 Checking immediate auth state...');
    if (typeof firebase !== 'undefined') {
        const user = firebase.auth().currentUser;
        console.log('👤 Current user:', user ? user.uid : 'null');
        if (!user) {
            console.log('⚠️ No user logged in, redirecting to home in 2 seconds...');
            alert('Please login to access My Account page');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    }
}, 2000); // Check after 2 seconds

// Wait for Firebase to be ready
function waitForFirebase() {
    return new Promise((resolve) => {
        if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
            console.log('✅ Firebase is ready');
            resolve();
        } else {
            console.log('⏳ Waiting for Firebase...');
            setTimeout(() => waitForFirebase().then(resolve), 100);
        }
    });
}

// Wait for auth service to be ready
function waitForAuthService() {
    return new Promise((resolve) => {
        if (typeof authService !== 'undefined' && authService.isLoggedIn) {
            console.log('✅ Auth service is ready');
            resolve();
        } else {
            console.log('⏳ Waiting for auth service...');
            setTimeout(() => waitForAuthService().then(resolve), 100);
        }
    });
}

// Initialize page
async function initializePage() {
    console.log('🔐 Initializing My Account page...');
    
    try {
        // Wait for Firebase
        await waitForFirebase();
        
        // Check authentication
        const user = firebase.auth().currentUser;
        if (!user) {
            console.log('⚠️ No user logged in, waiting for auth...');
            // Wait for auth state
            await new Promise((resolve) => {
                firebase.auth().onAuthStateChanged((authUser) => {
                    if (authUser) {
                        console.log('✅ User authenticated:', authUser.uid);
                        resolve();
                    } else {
                        console.log('❌ No user, redirecting to home...');
                        window.location.href = 'index.html';
                    }
                });
            });
        } else {
            console.log('✅ User already logged in:', user.uid);
        }
        
        // Wait for auth service
        await waitForAuthService();
        
        // Load user data
        await loadUserData();
        
        // Load statistics (wait a bit for favorites service)
        setTimeout(() => loadStatistics(), 1000);
        
        // Setup logout button
        setupLogoutButton();
        
        console.log('✅ My Account page fully initialized');
        
    } catch (error) {
        console.error('❌ Error initializing page:', error);
    }
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}

// Load user data from Firebase
async function loadUserData() {
    try {
        const user = firebase.auth().currentUser;
        if (!user) return;

        console.log('📊 Loading user data...');

        // Get user document from Firestore
        const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            
            // Populate profile information
            // Use authService username first (already loaded), then Firestore, then fallback
            const username = (authService && authService.currentUser && authService.currentUser.username) 
                           || userData.username 
                           || user.email.split('@')[0];
            document.getElementById('profile-username').textContent = username;
            document.getElementById('profile-email').textContent = userData.email || user.email;
            
            // Format join date
            const joinDate = userData.createdAt ? new Date(userData.createdAt.seconds * 1000) : new Date();
            document.getElementById('profile-joined').textContent = joinDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            console.log('✅ User data loaded successfully');
        } else {
            console.warn('⚠️ User document not found, using auth data');
            // Use authService username if available, else email prefix
            const username = (authService && authService.currentUser && authService.currentUser.username) 
                           || user.email.split('@')[0];
            document.getElementById('profile-username').textContent = username;
            document.getElementById('profile-email').textContent = user.email;
            document.getElementById('profile-joined').textContent = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    } catch (error) {
        console.error('❌ Error loading user data:', error);
        document.getElementById('profile-username').textContent = 'Error loading';
        document.getElementById('profile-email').textContent = 'Error loading';
        document.getElementById('profile-joined').textContent = 'Error loading';
    }
}

// Load user statistics
async function loadStatistics() {
    try {
        console.log('📊 Loading statistics...');
        
        // Wait for favorites service to be available
        if (typeof favoritesService === 'undefined') {
            console.log('⏳ Waiting for favoritesService...');
            setTimeout(loadStatistics, 500);
            return;
        }
        
        // Get favorites count
        const favoritesCount = favoritesService.getFavoritesCount();
        document.getElementById('stat-favorites').textContent = favoritesCount;
        
        // Get watchlist count
        const watchlistCount = favoritesService.getWatchlistCount();
        document.getElementById('stat-watchlist').textContent = watchlistCount;
        
        console.log('✅ Statistics loaded:', { favoritesCount, watchlistCount });
        
        // Listen for changes
        window.addEventListener('authStateChanged', () => {
            setTimeout(() => {
                const newFavCount = favoritesService.getFavoritesCount();
                const newWatchCount = favoritesService.getWatchlistCount();
                document.getElementById('stat-favorites').textContent = newFavCount;
                document.getElementById('stat-watchlist').textContent = newWatchCount;
            }, 500);
        });
        
    } catch (error) {
        console.error('❌ Error loading statistics:', error);
        document.getElementById('stat-favorites').textContent = '0';
        document.getElementById('stat-watchlist').textContent = '0';
    }
}

// Setup logout button
function setupLogoutButton() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            console.log('🚪 Logout button clicked');
            
            if (confirm('Are you sure you want to logout?')) {
                try {
                    await firebase.auth().signOut();
                    console.log('✅ Logout successful');
                    window.location.href = 'index.html';
                } catch (error) {
                    console.error('❌ Logout error:', error);
                    alert('Logout failed. Please try again.');
                }
            }
        });
        
        console.log('✅ Logout button configured');
    }
}
