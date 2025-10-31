// Web Authentication Service
// Matches Flutter app's authentication system

class AuthService {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.initializeAuth();
    }

    // Initialize authentication state
    async initializeAuth() {
        try {
            console.log('🔐 Initializing authentication...');
            
            // Check Firebase auth state
            firebase.auth().onAuthStateChanged(async (user) => {
                console.log('🔐 Auth state changed:', user ? 'Logged in' : 'Logged out');
                
                if (user) {
                    this.currentUser = user;
                    this.isLoggedIn = true;
                    
                    // Load user data first, then update UI
                    await this.loadUserData(user.uid);
                    
                    // Wait a bit for DOM to be ready
                    setTimeout(() => {
                        console.log('✅ Updating UI for logged in user:', this.currentUser.username);
                        this.updateUIForLoggedIn();
                        
                        // Force another update after 500ms to ensure visual refresh
                        setTimeout(() => {
                            console.log('🔄 Force refresh navbar after 500ms');
                            this.updateUIForLoggedIn();
                        }, 500);
                        
                        // And another at 1000ms for slow pages
                        setTimeout(() => {
                            console.log('🔄 Final force refresh at 1000ms');
                            this.updateUIForLoggedIn();
                        }, 1000);
                        
                        // Dispatch auth state changed event
                        window.dispatchEvent(new CustomEvent('authStateChanged', {
                            detail: { user: this.currentUser }
                        }));
                    }, 100);
                } else {
                    this.currentUser = null;
                    this.isLoggedIn = false;
                    this.updateUIForLoggedOut();
                    
                    // Dispatch auth state changed event
                    window.dispatchEvent(new CustomEvent('authStateChanged', {
                        detail: { user: null }
                    }));
                }
            });
        } catch (error) {
            console.error('❌ Error initializing auth:', error);
        }
    }

    // Load user data from Firestore
    async loadUserData(uid) {
        try {
            console.log('🔍 Loading user data for uid:', uid);
            
            const userDoc = await firebase.firestore().collection('users').doc(uid).get();
            
            console.log('🔍 User doc exists:', userDoc.exists);
            
            if (userDoc.exists) {
                const userData = userDoc.data();
                
                console.log('🔍 User data from Firestore:', {
                    username: userData.username,
                    email: userData.email,
                    premium: userData.premium,
                    hasUsername: !!userData.username
                });
                
                // Use username from Firestore, or fallback to email prefix
                const username = userData.username || this.currentUser?.email?.split('@')[0] || 'User';
                
                this.currentUser = {
                    ...this.currentUser,
                    username: username,
                    email: userData.email || this.currentUser?.email,
                    premium: userData.premium || false,
                    favorites: userData.favorites || [],
                    watchlist: userData.watchlist || []
                };
                
                console.log('✅ User data loaded successfully:', {
                    username: this.currentUser.username,
                    email: this.currentUser.email
                });
            } else {
                console.warn('⚠️ User document not found in Firestore, using fallback');
                
                // Fallback: use email prefix as username
                const username = this.currentUser?.email?.split('@')[0] || 'User';
                this.currentUser = {
                    ...this.currentUser,
                    username: username,
                    premium: false,
                    favorites: [],
                    watchlist: []
                };
                
                console.log('✅ Using fallback username:', username);
            }
        } catch (error) {
            console.error('❌ Error loading user data:', error);
            
            // Fallback on error: use email prefix as username
            const username = this.currentUser?.email?.split('@')[0] || 'User';
            this.currentUser = {
                ...this.currentUser,
                username: username
            };
            
            console.log('✅ Error fallback, using username:', username);
        }
    }

    // Sign up with email and password
    async signup(username, email, password) {
        try {
            // Check if username is available
            const isAvailable = await this.checkUsernameAvailability(username);
            if (!isAvailable) {
                return {
                    success: false,
                    message: 'Username is already taken'
                };
            }

            // Create Firebase auth user
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Create user document in Firestore
            await firebase.firestore().collection('users').doc(user.uid).set({
                uid: user.uid,
                username: username.toLowerCase().trim(),
                email: email.toLowerCase().trim(),
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                premium: false,
                favorites: [],
                watchlist: [],
                watched: []
            });

            // Store username mapping
            await firebase.firestore().collection('usernames').doc(username.toLowerCase().trim()).set({
                uid: user.uid,
                username: username.toLowerCase().trim()
            });

            console.log('✅ Signup successful:', username);
            return {
                success: true,
                message: 'Account created successfully!'
            };

        } catch (error) {
            console.error('❌ Signup error:', error);
            let message = 'Signup failed. Please try again.';
            
            if (error.code === 'auth/email-already-in-use') {
                message = 'Email is already in use';
            } else if (error.code === 'auth/weak-password') {
                message = 'Password is too weak';
            } else if (error.code === 'auth/invalid-email') {
                message = 'Invalid email address';
            }

            return {
                success: false,
                message: message
            };
        }
    }

    // Login with email or username and password
    async login(emailOrUsername, password) {
        try {
            let email = emailOrUsername.toLowerCase().trim();

            // Check if input is username (not email format)
            if (!email.includes('@')) {
                // Get uid from username
                const usernameDoc = await firebase.firestore().collection('usernames').doc(email).get();
                
                if (!usernameDoc.exists) {
                    return {
                        success: false,
                        message: 'Username not found'
                    };
                }

                const uid = usernameDoc.data().uid;
                
                // Get email from user document
                const userDoc = await firebase.firestore().collection('users').doc(uid).get();
                if (!userDoc.exists) {
                    return {
                        success: false,
                        message: 'User not found'
                    };
                }

                email = userDoc.data().email;
            }

            // Sign in with Firebase
            await firebase.auth().signInWithEmailAndPassword(email, password);

            console.log('✅ Login successful');
            return {
                success: true,
                message: 'Login successful!'
            };

        } catch (error) {
            console.error('❌ Login error:', error);
            let message = 'Login failed. Please try again.';

            if (error.code === 'auth/user-not-found') {
                message = 'Account not found';
            } else if (error.code === 'auth/wrong-password') {
                message = 'Incorrect password';
            } else if (error.code === 'auth/invalid-credential') {
                message = 'Invalid email or password';
            } else if (error.code === 'auth/too-many-requests') {
                message = 'Too many failed attempts. Please try again later';
            }

            return {
                success: false,
                message: message
            };
        }
    }

    // Logout
    async logout() {
        try {
            await firebase.auth().signOut();
            console.log('👋 Logout successful');
            return {
                success: true,
                message: 'Logged out successfully'
            };
        } catch (error) {
            console.error('❌ Logout error:', error);
            return {
                success: false,
                message: 'Logout failed'
            };
        }
    }

    // Check username availability
    async checkUsernameAvailability(username) {
        try {
            const normalizedUsername = username.toLowerCase().trim();
            
            console.log('🔍 Checking username availability:', normalizedUsername);
            
            const doc = await firebase.firestore().collection('usernames').doc(normalizedUsername).get();
            
            const isAvailable = !doc.exists;
            console.log(`✅ Username "${normalizedUsername}" is ${isAvailable ? 'available' : 'taken'}`);
            
            return isAvailable;
        } catch (error) {
            console.error('❌ Error checking username:', error);
            // On error, assume username is available (optimistic)
            // Better to allow signup attempt than block all signups
            return true;
        }
    }

    // Update UI for logged in state
    updateUIForLoggedIn() {
        console.log('🎨 Updating UI for logged in state...');
        console.log('🔍 Current user:', {
            exists: !!this.currentUser,
            username: this.currentUser?.username,
            email: this.currentUser?.email,
            isLoggedIn: this.isLoggedIn
        });
        
        // Get ALL signup buttons (some pages have multiple - mobile + desktop)
        const signupBtns = document.querySelectorAll('.navbar-signup-btn');
        const socialLinks = document.querySelector('.social-links');
        
        console.log('🔍 Found', signupBtns.length, 'navbar button(s)');
        
        if (signupBtns.length > 0 && this.currentUser && this.currentUser.username) {
            console.log('✅ UPDATING ALL', signupBtns.length, 'NAVBAR BUTTONS');
            console.log('🔍 Username:', this.currentUser.username);
            
            // Update EACH button
            signupBtns.forEach((signupBtn, index) => {
                console.log(`🔄 Updating button ${index + 1}/${signupBtns.length}`);
                
                // Get parent container
                const parent = signupBtn.parentNode;
                
                // COMPLETELY REMOVE old button
                signupBtn.remove();
                console.log(`🔥 Button ${index + 1} REMOVED from DOM`);
                
                // Wait a moment for DOM to update
                setTimeout(() => {
                    // Create COMPLETELY NEW button element from scratch
                    const newBtn = document.createElement('button');
                    newBtn.className = 'navbar-signup-btn';
                    newBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${this.currentUser.username}`;
                    newBtn.setAttribute('data-user-button', 'true');
                    
                    // Add click handler
                    newBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (authUI && typeof authUI.showUserMenu === 'function') {
                            authUI.showUserMenu();
                        }
                    });
                    
                    // Insert new button into DOM
                    parent.appendChild(newBtn);
                    
                    console.log(`✅ NEW button ${index + 1} inserted:`, {
                        text: newBtn.textContent,
                        visible: newBtn.offsetWidth > 0,
                        className: newBtn.className
                    });
                    
                    // Force repaint
                    newBtn.offsetHeight;
                    
                    if (index === signupBtns.length - 1) {
                        console.log('✅ ALL', signupBtns.length, 'NAVBAR BUTTONS UPDATED!');
                    }
                }, 50 + (index * 10)); // Stagger updates slightly
            });
        } else {
            console.warn('⚠️ Cannot update navbar:', {
                hasButton: !!signupBtn,
                hasUser: !!this.currentUser,
                hasUsername: !!this.currentUser?.username,
                username: this.currentUser?.username
            });
        }

        // Update mobile nav
        const mobileSignupBtn = document.querySelector('.mobile-nav .navbar-signup-btn');
        if (mobileSignupBtn && this.currentUser && this.currentUser.username) {
            console.log('✅ Updating mobile navbar with username:', this.currentUser.username);
            
            // Clone button to remove all old event listeners
            const newMobileBtn = mobileSignupBtn.cloneNode(false);
            newMobileBtn.innerHTML = `
                <i class="fas fa-user-circle"></i> 
                ${this.currentUser.username}
            `;
            newMobileBtn.className = mobileSignupBtn.className;
            newMobileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (authUI && typeof authUI.showUserMenu === 'function') {
                    authUI.showUserMenu();
                }
            });
            mobileSignupBtn.parentNode.replaceChild(newMobileBtn, mobileSignupBtn);
            
            console.log('✅ Mobile navbar updated successfully');
        }
    }

    // Update UI for logged out state
    updateUIForLoggedOut() {
        const signupBtn = document.querySelector('.navbar-signup-btn');
        
        if (signupBtn) {
            signupBtn.textContent = 'Sign Up';
            signupBtn.onclick = () => authUI.showSignupModal();
        }

        const mobileSignupBtn = document.querySelector('.mobile-nav .navbar-signup-btn');
        if (mobileSignupBtn) {
            mobileSignupBtn.textContent = 'Sign Up';
            mobileSignupBtn.onclick = () => authUI.showSignupModal();
        }
    }

    // Show user menu dropdown
    showUserMenu() {
        if (authUI && typeof authUI.showUserMenu === 'function') {
            authUI.showUserMenu();
        }
    }

    // Check if user is logged in
    isUserLoggedIn() {
        return this.isLoggedIn && this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Validate email format
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Validate password
    isValidPassword(password) {
        return password.length >= 6;
    }

    // Validate username
    isValidUsername(username) {
        const regex = /^[a-zA-Z0-9_]{3,20}$/;
        const isValid = regex.test(username);
        console.log(`🔍 Validating username "${username}" (length: ${username.length}):`, isValid ? '✅ Valid' : '❌ Invalid');
        return isValid;
    }
}

// Create global auth service instance
const authService = new AuthService();
