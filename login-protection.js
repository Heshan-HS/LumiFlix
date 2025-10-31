// Login Protection - Show login modal if user not logged in
// For My Account link and Favorite/Watchlist buttons

console.log('🔐 Login protection script loaded');

// Protect My Account link
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔗 Setting up My Account link protection...');
    
    // Find all My Account links
    const myAccountLinks = document.querySelectorAll('a[href="my-account.html"]');
    
    myAccountLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            console.log('🔍 My Account clicked, checking login state...');
            
            // Check if user is logged in
            if (typeof firebase !== 'undefined' && firebase.auth) {
                const user = firebase.auth().currentUser;
                
                if (!user) {
                    // User not logged in - prevent navigation and show login
                    e.preventDefault();
                    console.log('❌ User not logged in, showing login modal...');
                    
                    // Show login modal if authUI exists
                    if (typeof authUI !== 'undefined' && authUI.showLoginModal) {
                        authUI.showLoginModal();
                    } else {
                        alert('Please login to access My Account');
                    }
                } else {
                    console.log('✅ User logged in, allowing navigation');
                    // Let the link navigate normally
                }
            } else {
                // Firebase not ready yet, prevent navigation
                e.preventDefault();
                console.log('⏳ Firebase not ready, showing login prompt...');
                
                setTimeout(() => {
                    if (typeof authUI !== 'undefined' && authUI.showLoginModal) {
                        authUI.showLoginModal();
                    } else {
                        alert('Please login to access My Account');
                    }
                }, 500);
            }
        });
    });
    
    console.log('✅ My Account protection set up for', myAccountLinks.length, 'links');
});

// Export for use in other scripts
window.loginProtection = {
    checkLoginAndShowModal: function() {
        if (typeof firebase !== 'undefined' && firebase.auth) {
            const user = firebase.auth().currentUser;
            
            if (!user) {
                // User not logged in - show login modal
                if (typeof authUI !== 'undefined' && authUI.showLoginModal) {
                    authUI.showLoginModal();
                    return false; // Not logged in
                } else {
                    alert('Please login first');
                    return false;
                }
            }
            
            return true; // Logged in
        }
        
        return false; // Firebase not ready
    }
};
