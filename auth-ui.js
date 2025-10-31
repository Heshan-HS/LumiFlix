// Authentication UI - Modals and User Interface
// Professional signup/login modals matching app design

class AuthUI {
    constructor() {
        this.currentModal = null;
        this.isClosing = false; // Flag to prevent rapid open/close
        this.lastCloseTime = 0; // Track last close time
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Setup signup button click
        document.addEventListener('DOMContentLoaded', () => {
            const signupBtns = document.querySelectorAll('.navbar-signup-btn');
            signupBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.showSignupModal();
                });
            });
        });
    }

    // Show Signup Modal
    showSignupModal() {
        // Prevent opening if currently closing or just closed (100ms cooldown)
        const now = Date.now();
        if (this.isClosing || (now - this.lastCloseTime < 100)) {
            console.log('⏸️ Modal opening blocked - cooldown active');
            return;
        }
        
        const modal = this.createModal('signup');
        document.body.appendChild(modal);
        this.currentModal = modal;
        
        // Animate in
        setTimeout(() => modal.classList.add('active'), 10);

        // Setup close button
        const closeBtn = modal.querySelector('.auth-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeModal();
            });
        }

        // Close on overlay click
        const overlay = modal.querySelector('.auth-modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeModal();
            });
        }

        // Setup switch to login link
        const switchLink = modal.querySelector('.auth-switch-link');
        if (switchLink) {
            switchLink.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔄 Switching from signup to login...');
                this.closeModal();
                setTimeout(() => {
                    this.showLoginModal();
                }, 400); // Wait for close animation
            });
        }

        // Setup form handlers
        this.setupSignupHandlers(modal);
    }

    // Show Login Modal
    showLoginModal() {
        // Prevent opening if currently closing or just closed (100ms cooldown)
        const now = Date.now();
        if (this.isClosing || (now - this.lastCloseTime < 100)) {
            console.log('⏸️ Modal opening blocked - cooldown active');
            return;
        }
        
        const modal = this.createModal('login');
        document.body.appendChild(modal);
        this.currentModal = modal;
        
        // Animate in
        setTimeout(() => modal.classList.add('active'), 10);

        // Setup close button
        const closeBtn = modal.querySelector('.auth-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeModal();
            });
        }

        // Close on overlay click
        const overlay = modal.querySelector('.auth-modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeModal();
            });
        }

        // Setup switch to signup link
        const switchLink = modal.querySelector('.auth-switch-link');
        if (switchLink) {
            switchLink.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔄 Switching from login to signup...');
                this.closeModal();
                setTimeout(() => {
                    this.showSignupModal();
                }, 400); // Wait for close animation
            });
        }

        // Setup form handlers
        this.setupLoginHandlers(modal);
    }

    // Create Modal HTML
    createModal(type) {
        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        
        if (type === 'signup') {
            modal.innerHTML = `
                <div class="auth-modal-overlay"></div>
                <div class="auth-modal-content">
                    <button class="auth-modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                    
                    <div class="auth-modal-header">
                        <h2>Create Account</h2>
                        <p>Join LumiFlix and start watching amazing movies</p>
                    </div>

                    <form class="auth-form" id="signup-form">
                        <div class="auth-form-group">
                            <label>Username</label>
                            <input type="text" id="signup-username" placeholder="Choose a username" required>
                            <span class="auth-form-hint">Letters, numbers, underscore (3-20 chars)</span>
                        </div>

                        <div class="auth-form-group">
                            <label>Email</label>
                            <input type="email" id="signup-email" placeholder="Enter your email" required>
                        </div>

                        <div class="auth-form-group">
                            <label>Password</label>
                            <div class="auth-password-field">
                                <input type="password" id="signup-password" placeholder="Create a password" required>
                                <button type="button" class="auth-password-toggle">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                            <span class="auth-form-hint">Minimum 6 characters</span>
                        </div>

                        <div class="auth-form-group">
                            <label>Confirm Password</label>
                            <div class="auth-password-field">
                                <input type="password" id="signup-confirm-password" placeholder="Confirm your password" required>
                                <button type="button" class="auth-password-toggle">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>

                        <div class="auth-error" style="display: none;"></div>

                        <button type="submit" class="auth-submit-btn">
                            <span class="auth-btn-text">Create Account</span>
                            <span class="auth-btn-loader" style="display: none;">
                                <i class="fas fa-spinner fa-spin"></i>
                            </span>
                        </button>
                    </form>

                    <div class="auth-modal-footer">
                        <p>Already have an account? <a href="#" class="auth-switch-link" data-target="login">Log In</a></p>
                    </div>
                </div>
            `;
        } else if (type === 'login') {
            modal.innerHTML = `
                <div class="auth-modal-overlay"></div>
                <div class="auth-modal-content">
                    <button class="auth-modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                    
                    <div class="auth-modal-header">
                        <h2>Welcome Back</h2>
                        <p>Log in to continue watching</p>
                    </div>

                    <form class="auth-form" id="login-form">
                        <div class="auth-form-group">
                            <label>Email or Username</label>
                            <input type="text" id="login-email" placeholder="Enter your email or username" required>
                        </div>

                        <div class="auth-form-group">
                            <label>Password</label>
                            <div class="auth-password-field">
                                <input type="password" id="login-password" placeholder="Enter your password" required>
                                <button type="button" class="auth-password-toggle">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>

                        <div class="auth-error" style="display: none;"></div>

                        <button type="submit" class="auth-submit-btn">
                            <span class="auth-btn-text">Log In</span>
                            <span class="auth-btn-loader" style="display: none;">
                                <i class="fas fa-spinner fa-spin"></i>
                            </span>
                        </button>
                    </form>

                    <div class="auth-modal-footer">
                        <p>Don't have an account? <a href="#" class="auth-switch-link" data-target="signup">Sign Up</a></p>
                    </div>
                </div>
            `;
        }

        // Close button handler
        const closeBtn = modal.querySelector('.auth-modal-close');
        const overlay = modal.querySelector('.auth-modal-overlay');
        
        closeBtn.addEventListener('click', () => this.closeModal());
        overlay.addEventListener('click', () => this.closeModal());

        // Switch link handler
        const switchLink = modal.querySelector('.auth-switch-link');
        if (switchLink) {
            switchLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.currentTarget.dataset.target;
                this.closeModal();
                setTimeout(() => {
                    if (target === 'login') {
                        this.showLoginModal();
                    } else {
                        this.showSignupModal();
                    }
                }, 300);
            });
        }

        // Password toggle handlers
        modal.querySelectorAll('.auth-password-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const input = e.currentTarget.previousElementSibling;
                const icon = e.currentTarget.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });

        return modal;
    }

    // Setup Signup Form Handlers
    setupSignupHandlers(modal) {
        const form = modal.querySelector('#signup-form');
        const submitBtn = modal.querySelector('.auth-submit-btn');
        const errorDiv = modal.querySelector('.auth-error');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = form.querySelector('#signup-username').value.trim();
            const email = form.querySelector('#signup-email').value.trim();
            const password = form.querySelector('#signup-password').value;
            const confirmPassword = form.querySelector('#signup-confirm-password').value;
            
            console.log('📝 Form values:', { username, email, passwordLength: password.length });

            // Validate
            if (!authService.isValidUsername(username)) {
                this.showError(errorDiv, 'Username must be 3-20 characters (letters, numbers, underscore only)');
                return;
            }

            if (!authService.isValidEmail(email)) {
                this.showError(errorDiv, 'Please enter a valid email address');
                return;
            }

            if (!authService.isValidPassword(password)) {
                this.showError(errorDiv, 'Password must be at least 6 characters');
                return;
            }

            if (password !== confirmPassword) {
                this.showError(errorDiv, 'Passwords do not match');
                return;
            }

            // Show loading
            this.setLoading(submitBtn, true);
            errorDiv.style.display = 'none';

            // Check username availability first
            console.log('🔍 Checking username availability before signup...');
            const isAvailable = await authService.checkUsernameAvailability(username);
            
            if (!isAvailable) {
                this.setLoading(submitBtn, false);
                this.showError(errorDiv, 'Username is already taken. Please choose another one.');
                return;
            }

            // Attempt signup
            console.log('✅ Username is available, proceeding with signup...');
            const result = await authService.signup(username, email, password);

            this.setLoading(submitBtn, false);

            if (result.success) {
                this.showSuccess('Account created successfully! Welcome to LumiFlix!');
                this.closeModal();
                
                // Reload page after 1.5 seconds to show logged-in state
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                this.showError(errorDiv, result.message);
            }
        });
    }

    // Setup Login Form Handlers
    setupLoginHandlers(modal) {
        const form = modal.querySelector('#login-form');
        const submitBtn = modal.querySelector('.auth-submit-btn');
        const errorDiv = modal.querySelector('.auth-error');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailOrUsername = form.querySelector('#login-email').value.trim();
            const password = form.querySelector('#login-password').value;
            
            console.log('📝 Login form values:', { emailOrUsername, passwordLength: password.length });

            // Validate
            if (!emailOrUsername || !password) {
                this.showError(errorDiv, 'Please fill in all fields');
                return;
            }

            // Show loading
            this.setLoading(submitBtn, true);
            errorDiv.style.display = 'none';

            // Attempt login
            const result = await authService.login(emailOrUsername, password);

            this.setLoading(submitBtn, false);

            if (result.success) {
                this.showSuccess('Login successful! Welcome back!');
                this.closeModal();
                
                // Reload page after 1.5 seconds to show logged-in state
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                this.showError(errorDiv, result.message);
            }
        });
    }

    // Show User Menu (Dropdown)
    showUserMenu() {
        const existingMenu = document.querySelector('.auth-user-menu');
        if (existingMenu) {
            existingMenu.remove();
            return;
        }

        const menu = document.createElement('div');
        menu.className = 'auth-user-menu';
        
        // Get favorites and watchlist counts
        const favoritesCount = (typeof favoritesService !== 'undefined') ? favoritesService.getFavoritesCount() : 0;
        const watchlistCount = (typeof favoritesService !== 'undefined') ? favoritesService.getWatchlistCount() : 0;
        
        menu.innerHTML = `
            <div class="auth-user-menu-header">
                <div class="auth-user-menu-username">${authService.currentUser?.username || 'User'}</div>
                <div class="auth-user-menu-email">${authService.currentUser?.email || ''}</div>
            </div>
            <div class="auth-user-menu-divider"></div>
            <div class="auth-user-menu-item" data-action="favorites">
                <span class="auth-user-menu-label">Favorites</span>
                <span class="auth-user-menu-badge">${favoritesCount}</span>
            </div>
            <div class="auth-user-menu-item" data-action="watchlist">
                <span class="auth-user-menu-label">Watchlist</span>
                <span class="auth-user-menu-badge">${watchlistCount}</span>
            </div>
            <div class="auth-user-menu-divider"></div>
            <div class="auth-user-menu-item auth-logout-btn" data-action="logout">
                <span class="auth-user-menu-label">Logout</span>
            </div>
        `;

        // Position menu
        const signupBtn = document.querySelector('.navbar-signup-btn');
        if (signupBtn) {
            const rect = signupBtn.getBoundingClientRect();
            menu.style.top = `${rect.bottom + 10}px`;
            menu.style.right = `${window.innerWidth - rect.right}px`;
        }

        document.body.appendChild(menu);

        // Close on outside click
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target) && !e.target.closest('.navbar-signup-btn')) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 100);

        // Favorites handler
        const favoritesItem = menu.querySelector('[data-action="favorites"]');
        if (favoritesItem) {
            favoritesItem.addEventListener('click', () => {
                window.location.href = 'favorites.html';
            });
        }

        // Watchlist handler
        const watchlistItem = menu.querySelector('[data-action="watchlist"]');
        if (watchlistItem) {
            watchlistItem.addEventListener('click', () => {
                window.location.href = 'watchlist.html';
            });
        }

        // Logout handler
        menu.querySelector('[data-action="logout"]').addEventListener('click', async () => {
            console.log('🚪 Logout button clicked');
            menu.remove();
            
            const result = await authService.logout();
            console.log('🚪 Logout result:', result);
            
            if (result.success) {
                console.log('✅ Logout successful, reloading page...');
                location.reload();
            } else {
                console.error('❌ Logout failed:', result.message);
                alert('Logout failed. Please try again.');
            }
        });
    }

    // Close Modal
    closeModal() {
        if (this.currentModal) {
            console.log('🚪 Closing modal...');
            const modalToClose = this.currentModal; // Store reference!
            this.currentModal = null; // Clear immediately to prevent double-close
            this.isClosing = true; // Set closing flag
            
            modalToClose.classList.remove('active');
            setTimeout(() => {
                if (modalToClose && modalToClose.parentNode) {
                    modalToClose.remove();
                }
                this.isClosing = false; // Clear closing flag
                this.lastCloseTime = Date.now(); // Record close time
                console.log('✅ Modal closed completely');
            }, 300);
        }
    }

    // Show Error
    showError(errorDiv, message) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    // Show Success Toast
    showSuccess(message) {
        const toast = document.createElement('div');
        toast.className = 'auth-toast success';
        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('active'), 10);
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Set Loading State
    setLoading(btn, loading) {
        const text = btn.querySelector('.auth-btn-text');
        const loader = btn.querySelector('.auth-btn-loader');

        if (loading) {
            text.style.display = 'none';
            loader.style.display = 'inline-block';
            btn.disabled = true;
        } else {
            text.style.display = 'inline-block';
            loader.style.display = 'none';
            btn.disabled = false;
        }
    }
}

// Create global auth UI instance
const authUI = new AuthUI();
