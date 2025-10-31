// Firebase Configuration and Initialization
// This connects your HTML website to the same Firebase backend as your Flutter app

// Firebase Configuration (Updated with correct credentials from movieverse-hub project)
const firebaseConfig = {
    apiKey: "AIzaSyBHmvvI4iqCWnfP7Ajny6Ux3KCB7IjvvBw",
    authDomain: "movieverse-hub.firebaseapp.com",
    databaseURL: "https://movieverse-hub-default-rtdb.firebaseio.com",
    projectId: "movieverse-hub",
    storageBucket: "movieverse-hub.firebasestorage.app",
    messagingSenderId: "795431296409",
    appId: "1:795431296409:web:ed8d33050a9afeff7a0708",
    measurementId: "G-4PX63998EK"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firebase Realtime Database reference
const database = firebase.database();
const moviesRef = database.ref('movies');

// Global variable to store movies (replaces movies.js)
let movieList = [];
let moviesLoaded = false;

// Load movies from Firebase (Real-time)
function loadMoviesFromFirebase() {
    return new Promise((resolve, reject) => {
        console.log('🔥 Loading movies from Firebase...');
        
        moviesRef.on('value', (snapshot) => {
            const data = snapshot.val();
            
            if (data) {
                // Convert Firebase data to array
                movieList = Object.keys(data).map(key => {
                    const movie = data[key];
                    return {
                        id: key,
                        title: movie.title || '',
                        year: movie.year?.toString() || '',
                        genre: Array.isArray(movie.genre) ? movie.genre : 
                               (movie.genre ? movie.genre.split(',').map(g => g.trim()) : []),
                        rating: movie.rating?.toString() || '0.0',
                        cast: Array.isArray(movie.cast) ? movie.cast : [],
                        poster: movie.posterUrl || movie.poster || '',
                        banner: movie.bannerUrl || movie.backdropUrl || movie.banner || movie.poster || '',
                        englishDescription: movie.description || movie.englishDescription || '',
                        description: movie.sinhalaDescription || movie.description || '',
                        trailerLink: movie.trailerUrl || movie.trailerLink || '',
                        downloadLink: movie.telegramBotLink || movie.downloadLink || '',
                        gallery: Array.isArray(movie.gallery) ? movie.gallery : [],
                        releaseDate: movie.releaseDate || movie.year || ''
                    };
                });
                
                moviesLoaded = true;
                console.log(`✅ Loaded ${movieList.length} movies from Firebase`);
                resolve(movieList);
                
                // Trigger custom event for other scripts
                const event = new CustomEvent('moviesLoaded', { detail: movieList });
                document.dispatchEvent(event);
            } else {
                console.warn('⚠️ No movies found in Firebase');
                movieList = [];
                moviesLoaded = true;
                resolve([]);
            }
        }, (error) => {
            console.error('❌ Error loading movies:', error);
            reject(error);
        });
    });
}

// Wait for movies to load before initializing page
function waitForMovies() {
    return new Promise((resolve) => {
        if (moviesLoaded) {
            resolve(movieList);
        } else {
            document.addEventListener('moviesLoaded', (e) => {
                resolve(e.detail);
            }, { once: true });
        }
    });
}

// Auto-load movies when script loads
loadMoviesFromFirebase().catch(error => {
    console.error('Failed to load movies:', error);
    alert('Failed to load movies from database. Please refresh the page.');
});
