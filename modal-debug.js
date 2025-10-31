// MODAL DEBUG SCRIPT - Diagnose why modal keeps reopening
console.log('🔍 MODAL DEBUG SCRIPT LOADED');

// Track all modals created
let modalCount = 0;

// Override authUI.showLoginModal to track calls
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (typeof authUI !== 'undefined' && authUI.showLoginModal) {
            const originalShowLoginModal = authUI.showLoginModal.bind(authUI);
            
            authUI.showLoginModal = function() {
                modalCount++;
                console.log('🚨 showLoginModal CALLED! Count:', modalCount);
                console.trace('Call stack:'); // Shows WHERE it was called from
                return originalShowLoginModal();
            };
            
            console.log('✅ Modal debug wrapper installed');
        }
        
        if (typeof authUI !== 'undefined' && authUI.closeModal) {
            const originalCloseModal = authUI.closeModal.bind(authUI);
            
            authUI.closeModal = function() {
                console.log('🚪 closeModal CALLED! Current modal count:', modalCount);
                console.trace('Close call stack:');
                return originalCloseModal();
            };
            
            console.log('✅ Close debug wrapper installed');
        }
    }, 1000);
});

// Monitor all click events on document
document.addEventListener('click', (e) => {
    console.log('👆 CLICK:', e.target.tagName, e.target.className, e.target.textContent?.substring(0, 30));
}, true); // Use capture phase

// Monitor all modals in DOM
setInterval(() => {
    const modals = document.querySelectorAll('.auth-modal');
    if (modals.length > 0) {
        console.log('📊 Active modals in DOM:', modals.length);
    }
}, 2000);

console.log('🔍 Debug script ready. Open console to see logs.');
