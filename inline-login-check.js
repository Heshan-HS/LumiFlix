// Inline Login Protection - Simpler approach
// Intercept ALL favorite/watchlist button clicks at document level

console.log('🔐 Inline login protection loaded');

// Use event delegation to catch all button clicks
document.addEventListener('click', function(e) {
    // Check if clicked element is a favorite or watchlist button
    const target = e.target;
    const button = target.closest('.favorite-btn, .watchlist-btn');
    
    if (button) {
        console.log('🎯 BUTTON CLICKED!', button.className);
        
        // Check if user is logged in via Firebase directly
        if (typeof firebase !== 'undefined' && firebase.auth) {
            const user = firebase.auth().currentUser;
            console.log('👤 Current user:', user ? user.uid : 'null');
            
            if (!user) {
                // User NOT logged in - prevent action and show modal
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                console.log('⚠️ User not logged in - showing modal');
                
                // Show login modal
                if (typeof authUI !== 'undefined' && authUI.showSignupModal) {
                    console.log('✅ Calling authUI.showSignupModal()');
                    authUI.showSignupModal();
                } else {
                    console.error('❌ authUI not available');
                    alert('Please login first');
                }
                
                return false;
            } else {
                console.log('✅ User logged in - allowing button action');
            }
        }
    }
}, true); // Use capture phase to catch early

console.log('✅ Inline login protection active');
