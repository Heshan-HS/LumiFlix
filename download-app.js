// Download App Handler
console.log('📱 Download App script loaded');

document.addEventListener('DOMContentLoaded', () => {
    const downloadLinks = document.querySelectorAll('.download-app-btn, #download-app-link, .mobile-download-app-btn, #mobile-download-app, #download-app-footer');
    
    downloadLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('📥 Download App clicked');
            
            // Google Drive direct download link for LumiFlix APK
            // Converted from: https://drive.google.com/file/d/1cGLqS9dz8rvjjFwImcKr65s_HvAJx7fl/view?usp=sharing
            const apkUrl = 'https://drive.google.com/uc?export=download&id=1cGLqS9dz8rvjjFwImcKr65s_HvAJx7fl';
            
            // Show downloading message
            showDownloadNotification();
            
            // Trigger download
            const downloadLink = document.createElement('a');
            downloadLink.href = apkUrl;
            downloadLink.download = 'LumiFlix-App.apk';
            downloadLink.target = '_blank';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            console.log('✅ Download started');
        });
    });
    
    console.log('✅ Download App handlers set up for', downloadLinks.length, 'links');
});

// Show download notification
function showDownloadNotification() {
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-download"></i>
            <div class="notification-text">
                <strong>Downloading LumiFlix App...</strong>
                <p>Your download will start shortly</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .download-notification {
        position: fixed;
        bottom: -100px;
        right: 2rem;
        background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
        color: white;
        padding: 1.25rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transition: bottom 0.3s ease;
        max-width: 350px;
    }
    
    .download-notification.show {
        bottom: 2rem;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .notification-content i {
        font-size: 2rem;
        opacity: 0.9;
    }
    
    .notification-text strong {
        display: block;
        font-size: 1rem;
        margin-bottom: 0.25rem;
    }
    
    .notification-text p {
        font-size: 0.875rem;
        opacity: 0.9;
        margin: 0;
    }
    
    /* Download App button highlight */
    .download-app-btn {
        background: linear-gradient(135deg, rgba(170, 0, 255, 0.15), rgba(128, 0, 255, 0.15)) !important;
        border: 1px solid rgba(170, 0, 255, 0.3) !important;
        border-radius: 8px !important;
    }
    
    .download-app-btn:hover {
        background: linear-gradient(135deg, rgba(170, 0, 255, 0.25), rgba(128, 0, 255, 0.25)) !important;
        border-color: rgba(170, 0, 255, 0.5) !important;
        transform: translateX(8px);
    }
    
    @media (max-width: 768px) {
        .download-notification {
            right: 1rem;
            left: 1rem;
            max-width: none;
        }
    }
`;
document.head.appendChild(style);
