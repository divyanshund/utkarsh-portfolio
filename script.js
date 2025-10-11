// ============================================
// CONFIGURATION
// ============================================
const PHOTO_CHANGE_INTERVAL = 1000; // 1 second - easily adjustable

// Photo URLs for the main slideshow
const PHOTOS = [
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1200&q=80',
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1200&q=80'
];

// ============================================
// Main Initialization
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize photo slideshow
    initPhotoSlideshow();
    
    // Initialize scroll animations for gallery items
    initScrollAnimations();
    
    // Add header scroll effect for gallery pages
    initHeaderScroll();
});

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
// Preload Images
// ============================================
window.addEventListener('load', function() {
    // Preload slideshow images for smooth transitions
    PHOTOS.forEach(url => {
        const img = new Image();
        img.src = url;
    });
});
