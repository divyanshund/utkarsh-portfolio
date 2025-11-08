// ============================================
// CONFIGURATION
// ============================================
const PHOTO_CHANGE_INTERVAL = 1000; // 1 second - easily adjustable

// Photo URLs for the main slideshow
const PHOTOS = [
    'images/header/2.jpg',
    'images/header/4.jpg',
    'images/header/6.jpg',
    'images/header/7.jpg',
    'images/header/10.jpg',
    'images/header/12.jpg',
    'images/header/DSC09168.jpg'
];

// ============================================
// Main Initialization
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dark mode
    initDarkMode();
    
    // Initialize photo slideshow
    initPhotoSlideshow();
    
    // Initialize scroll animations for gallery items
    initScrollAnimations();
    
    // Add smooth parallax scroll effects
    initParallaxScroll();
    
    // Add header scroll effect for gallery pages
    initHeaderScroll();
    
    // Initialize decorative frames scroll behavior
    initDecorativeFramesScroll();
    
    // Hide scroll indicator on scroll
    initScrollIndicatorHide();
    
    // Initialize navigation scroll effect
    initNavScroll();
    
    // Initialize repelling text effect
    initRepellingText();
    
    // Initialize parallax effect on work images
    initWorkImageParallax();
    
    // Initialize project gallery animations
    initProjectGalleryAnimations();
});

// ============================================
// Dark Mode Toggle
// ============================================
function initDarkMode() {
    const themeToggle = document.getElementById('themeToggle');
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    
    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            // Save preference
            const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
        });
    }
}

// ============================================
// Photo Slideshow - Instant Changes
// ============================================
function initPhotoSlideshow() {
    const mainPhoto = document.getElementById('mainPhoto');
    if (!mainPhoto) return;
    
    let currentIndex = 0;
    
    function changePhoto() {
        currentIndex = (currentIndex + 1) % PHOTOS.length;
        mainPhoto.src = PHOTOS[currentIndex];
    }
    
    // Change photo every interval (instant, no transition)
    setInterval(changePhoto, PHOTO_CHANGE_INTERVAL);
}

// ============================================
// Scroll Animations
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe section cards
    const sectionCards = document.querySelectorAll('.section-card');
    sectionCards.forEach(card => {
        observer.observe(card);
    });

    // Observe gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(item);
    });

    // Observe fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        observer.observe(element);
    });
    
    // Observe work items
    const workItems = document.querySelectorAll('.work-item');
    workItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        item.style.transitionDelay = `${index * 0.2}s`;
        observer.observe(item);
    });
}

// ============================================
// Header Scroll Effect for Gallery Pages
// ============================================
function initHeaderScroll() {
    const header = document.querySelector('.gallery-header');
    if (!header) return;

    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        } else {
            header.style.boxShadow = 'none';
        }
        
        // Hide/show header on scroll
        if (currentScroll > lastScroll && currentScroll > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

// ============================================
// Decorative Frames Scroll Behavior
// ============================================
function initDecorativeFramesScroll() {
    const decorativeFrames = document.querySelectorAll('.decorative-frame');
    const hero = document.querySelector('.hero');
    
    if (hero && decorativeFrames.length > 0) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            
            // Hide frames quickly after just a bit of scrolling
            if (scrollPosition > 100) {
                decorativeFrames.forEach(frame => {
                    frame.classList.add('hidden');
                });
            } else {
                decorativeFrames.forEach(frame => {
                    frame.classList.remove('hidden');
                });
            }
        });
    }
}

// ============================================
// Hide Scroll Indicator on Scroll
// ============================================
function initScrollIndicatorHide() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                scrollIndicator.classList.add('hidden');
            } else {
                scrollIndicator.classList.remove('hidden');
            }
        });
    }
}

// ============================================
// Navigation Scroll Effect
// ============================================
function initNavScroll() {
    const nav = document.querySelector('.nav');
    
    if (nav) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }
}

// ============================================
// Apple-like Smooth Parallax Scroll
// ============================================
function initParallaxScroll() {
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrolled = window.pageYOffset;
                
                // Parallax effect on hero section
                const hero = document.querySelector('.hero');
                if (hero && scrolled < window.innerHeight) {
                    const photoFrame = document.querySelector('.photo-frame');
                    const artistInfo = document.querySelector('.artist-info');
                    
                    if (photoFrame) {
                        photoFrame.style.transform = `translateY(${scrolled * 0.3}px) scale(${1 - scrolled * 0.0001})`;
                        photoFrame.style.opacity = 1 - (scrolled * 0.001);
                    }
                    
                    if (artistInfo) {
                        artistInfo.style.transform = `translateY(${scrolled * 0.5}px)`;
                        artistInfo.style.opacity = 1 - (scrolled * 0.0015);
                    }
                }
                
                // Fade in works on scroll
                const workItems = document.querySelectorAll('.work-item');
                workItems.forEach(item => {
                    const rect = item.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    
                    if (rect.top < windowHeight * 0.85) {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }
                });
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

// ============================================
// Gallery Item Click Handlers
// ============================================
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        const video = this.querySelector('video');
        
        if (video) {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        }
    });
});

// ============================================
// Smooth Scroll for Anchor Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// Repelling Text Effect
// ============================================
function initRepellingText() {
    const artistName = document.getElementById('artistName');
    if (!artistName) return;
    
    // Configuration
    const REPULSION_STRENGTH = 28; // Max pixels letters can move
    const REPULSION_RADIUS = 120; // Cursor proximity needed to affect letters
    
    // Split text into individual letter spans
    const text = artistName.textContent;
    artistName.innerHTML = '';
    
    text.split('').forEach(char => {
        const span = document.createElement('span');
        span.className = 'letter';
        span.textContent = char;
        // Preserve spaces
        if (char === ' ') {
            span.style.width = '0.3em';
        }
        artistName.appendChild(span);
    });
    
    const letters = artistName.querySelectorAll('.letter');
    
    // Store original positions
    const letterPositions = [];
    letters.forEach(letter => {
        const rect = letter.getBoundingClientRect();
        letterPositions.push({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        });
    });
    
    // Mouse move handler
    artistName.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        letters.forEach((letter, index) => {
            const pos = letterPositions[index];
            
            // Calculate distance from cursor to letter
            const deltaX = pos.x - mouseX;
            const deltaY = pos.y - mouseY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // Only repel if cursor is within radius
            if (distance < REPULSION_RADIUS) {
                // Calculate repulsion strength (stronger when closer)
                const force = (REPULSION_RADIUS - distance) / REPULSION_RADIUS;
                
                // Calculate push direction (normalized)
                const pushX = (deltaX / distance) * force * REPULSION_STRENGTH;
                const pushY = (deltaY / distance) * force * REPULSION_STRENGTH;
                
                // Apply transform
                letter.style.transform = `translate(${pushX}px, ${pushY}px)`;
            } else {
                // Reset to original position if cursor is far
                letter.style.transform = 'translate(0, 0)';
            }
        });
    });
    
    // Reset all letters when mouse leaves
    artistName.addEventListener('mouseleave', function() {
        letters.forEach(letter => {
            letter.style.transform = 'translate(0, 0)';
        });
    });
    
    // Update positions on window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            letters.forEach((letter, index) => {
                const rect = letter.getBoundingClientRect();
                letterPositions[index] = {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2
                };
            });
        }, 250);
    });
}

// ============================================
// Parallax Effect on Work Images
// ============================================
function initWorkImageParallax() {
    const workImages = document.querySelectorAll('.work-image');
    if (workImages.length === 0) return;
    
    let ticking = false;
    
    function updateParallax() {
        workImages.forEach(workImage => {
            const rect = workImage.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Calculate how far the image is in the viewport
            // 0 = top of screen, 1 = bottom of screen
            const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
            
            // Only apply parallax when image is in viewport
            if (scrollProgress >= -0.2 && scrollProgress <= 1.2) {
                const img = workImage.querySelector('img');
                if (img) {
                    // Multi-layer parallax effect
                    // The image moves slower than scroll (creating depth)
                    const translateY = (scrollProgress - 0.5) * -50; // Vertical movement
                    const scale = 1 + Math.abs(scrollProgress - 0.5) * 0.05; // Subtle scale
                    
                    img.style.transform = `translateY(${translateY}px) scale(${scale})`;
                }
            }
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    // Initial call
    updateParallax();
    
    // Update on scroll
    window.addEventListener('scroll', requestTick);
    
    // Update on resize
    window.addEventListener('resize', () => {
        setTimeout(updateParallax, 100);
    });
}

// ============================================
// Project Gallery Scroll Animations
// ============================================
function initProjectGalleryAnimations() {
    const galleryElements = document.querySelectorAll('.gallery-full, .gallery-row-2, .gallery-row-3');
    
    if (galleryElements.length === 0) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Don't unobserve so animation persists
            }
        });
    }, observerOptions);
    
    galleryElements.forEach((element, index) => {
        // Stagger initial state
        element.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(element);
    });
}

// ============================================
// Preload Images
// ============================================
window.addEventListener('load', function() {
    // Preload slideshow images for smooth transitions
    PHOTOS.forEach(url => {
        const img = new Image();
        img.src = url;
    });
});
