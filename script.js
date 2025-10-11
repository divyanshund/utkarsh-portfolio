// ============================================
// CONFIGURATION - Easily adjustable settings
// ============================================
const SLIDESHOW_INTERVAL = 2000; // Time between slides in milliseconds (2000 = 2 seconds)
const SLIDESHOW_TRANSITION = 1500; // Fade transition duration in milliseconds

// ============================================
// Main Initialization
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize slideshow
    initSlideshow();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Add parallax effect
    initParallaxEffect();
    
    // Add header scroll effect for gallery pages
    initHeaderScroll();
});

// ============================================
// Slideshow Functionality
// ============================================
function initSlideshow() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return; // Exit if no slides found
    
    let currentSlide = 0;
    
    function nextSlide() {
        // Remove active class from current slide
        slides[currentSlide].classList.remove('active');
        
        // Move to next slide (loop back to 0 if at end)
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Add active class to new slide
        slides[currentSlide].classList.add('active');
    }
    
    // Start the slideshow
    setInterval(nextSlide, SLIDESHOW_INTERVAL);
}

// Scroll Animations
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

    // Observe section cards on homepage
    const sectionCards = document.querySelectorAll('.section-card');
    sectionCards.forEach(card => {
        observer.observe(card);
    });

    // Observe gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        // Add staggered delay
        item.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(item);
    });

    // Observe fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// Parallax Effect for Hero Section
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const slideshow = document.querySelector('.slideshow-container');
        const scrollIndicator = document.querySelector('.scroll-indicator');
        
        if (slideshow) {
            // Subtle zoom effect on scroll
            slideshow.style.transform = `scale(${1 + scrolled * 0.0003})`;
        }
        
        if (scrollIndicator) {
            scrollIndicator.style.opacity = 1 - (scrolled * 0.003);
        }
    });
}

// Header Scroll Effect
function initHeaderScroll() {
    const header = document.querySelector('.gallery-header');
    if (!header) return;

    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'linear-gradient(to bottom, rgba(0, 0, 0, 0.9), transparent)';
            header.style.backdropFilter = 'none';
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

// Lazy Loading for Images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Smooth scroll for anchor links
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

// Cursor effect for enhanced UX
document.addEventListener('mousemove', function(e) {
    const cards = document.querySelectorAll('.section-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 30;
            const rotateY = (centerX - x) / 30;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        } else {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        }
    });
});

// Reset card transform when mouse leaves
document.querySelectorAll('.section-card').forEach(card => {
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
});

// Gallery Item Click - Full Screen View (Optional Enhancement)
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        const img = this.querySelector('img');
        const video = this.querySelector('video');
        
        if (img) {
            // You can implement a lightbox/modal here
            console.log('Image clicked:', img.src);
        } else if (video) {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        }
    });
});

// Preload critical assets
window.addEventListener('load', function() {
    // Add loaded class to body for CSS animations
    document.body.classList.add('loaded');
});

// Performance optimization - Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add resize handler with debounce
window.addEventListener('resize', debounce(function() {
    // Recalculate animations on resize if needed
    initScrollAnimations();
}, 250));

