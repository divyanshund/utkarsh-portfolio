// ============================================
// CONFIGURATION
// ============================================
const PHOTO_CHANGE_INTERVAL = 2000; // 2 seconds - easily adjustable

// Photo bases for the main slideshow. Most have a -1280w variant; a/c/o only
// have a -640w plus a small base file, so they fall back to the base.
const PHOTO_BASES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'IMG_7114'];
const PHOTO_NO_1280 = ['a', 'c', 'o'];

// Build responsive sources so the slideshow never loads the multi-MB full-res
// files. The largest candidate is the -1280w variant (or the small base file).
const PHOTOS = PHOTO_BASES.map(function (base) {
    var dir = 'images/homepage/';
    var has1280 = PHOTO_NO_1280.indexOf(base) === -1;
    if (has1280) {
        return {
            src: dir + base + '-1280w.webp',
            srcset: dir + base + '-640w.webp 640w, ' + dir + base + '-1280w.webp 1280w'
        };
    }
    return {
        src: dir + base + '.webp',
        srcset: dir + base + '-640w.webp 640w, ' + dir + base + '.webp 1280w'
    };
});

// ============================================
// Main Initialization
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dark mode
    initDarkMode();
    
    // Initialize active navigation state
    initActiveNav();
    
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

    // Initialize the mobile hamburger menu
    initMobileNav();
    
    // Initialize repelling text effect
    initRepellingText();
    
    // Initialize cursor glow
    initCursorGlow();
    
    // Initialize parallax effect on work images
    initWorkImageParallax();
    
    // Initialize project gallery animations
    initProjectGalleryAnimations();

    // Initialize scattered gallery reveal
    initScatterGallery();

    // Initialize horizontal scroll galleries (commissioned project pages)
    initScrollGallery();
    
    // Initialize hero text reveal on scroll
    initHeroTextReveal();

    // Initialize lazy image fade-in
    initLazyImageFadeIn();
});

// ============================================
// Dark Mode Toggle
// ============================================
function initDarkMode() {
    const themeToggle = document.getElementById('themeToggle');
    
    // Check for saved theme preference or default to dark mode (lights off)
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
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
// Active Navigation State
// ============================================
function initActiveNav() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;
    
    // Check if we're on the about page
    if (currentPath.includes('about.html')) {
        navLinks.forEach(link => {
            if (link.getAttribute('href') === 'about.html') {
                link.classList.add('active');
            }
        });
        return; // Exit early for about page
    }
    
    // For homepage with sections, use intersection observer
    const sections = document.querySelectorAll('section[id]');
    
    if (sections.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px', // Trigger when section is in the middle of viewport
        threshold: 0
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                
                // Update active state for all nav links
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    
                    // Remove active from all
                    link.classList.remove('active');
                    
                    // Add active to matching section
                    if (href === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Set initial active state based on current position
    const currentHash = window.location.hash;
    if (currentHash) {
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentHash) {
                link.classList.add('active');
            }
        });
    } else {
        // Default to home if no hash
        navLinks.forEach(link => {
            if (link.getAttribute('href') === '#home') {
                link.classList.add('active');
            }
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

    // Warm the cache for the next photo only (not all 17 at once).
    function preloadNext(index) {
        const next = PHOTOS[(index + 1) % PHOTOS.length];
        const img = new Image();
        img.src = next.src;
    }

    function changePhoto() {
        currentIndex = (currentIndex + 1) % PHOTOS.length;
        const photo = PHOTOS[currentIndex];
        mainPhoto.srcset = photo.srcset;
        mainPhoto.src = photo.src;
        preloadNext(currentIndex);
    }

    // Prepare the photo following the initial hero frame.
    preloadNext(currentIndex);

    // Change photo every interval (instant, no transition)
    setInterval(changePhoto, PHOTO_CHANGE_INTERVAL);
}

// ============================================
// Scroll Animations
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.05,
        rootMargin: '0px 0px 100px 0px'
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
        item.style.transitionDelay = `${index * 0.05}s`;
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
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.4s ease, border-color 0.4s ease';
        item.style.transitionDelay = `${index * 0.08}s`;
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
    const hero = document.querySelector('.hero');
    const themeToggle = document.getElementById('themeToggle');
    
    if (nav) {
        if (hero) {
            nav.classList.add('has-hero');
        }

        // Initial check for scrolled state
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
            if (themeToggle && hero) themeToggle.classList.add('visible');
        } else {
            nav.classList.remove('scrolled');
            if (themeToggle && hero) themeToggle.classList.remove('visible');
        }

        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
                if (themeToggle && hero) themeToggle.classList.add('visible');
            } else {
                nav.classList.remove('scrolled');
                if (themeToggle && hero) themeToggle.classList.remove('visible');
            }
        });
    }
    
    // Show theme toggle on non-hero pages immediately
    if (!hero && themeToggle) {
        themeToggle.classList.add('visible');
    }
}

// ============================================
// Mobile Hamburger Menu
// The desktop nav is a single centered row of links which overflows small
// screens, so on mobile we inject a hamburger button (no per-page HTML edits)
// that toggles the links into a full-screen overlay. Purely additive: the
// button is hidden by CSS on desktop and the overlay styles are mobile-only.
// ============================================
function initMobileNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    const navContent = nav.querySelector('.nav-content');
    if (!navContent) return;

    if (!navContent.id) navContent.id = 'primaryNav';

    const toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Open menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', navContent.id);
    toggle.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(toggle);

    function setOpen(open) {
        document.body.classList.toggle('nav-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    toggle.addEventListener('click', function () {
        setOpen(!document.body.classList.contains('nav-open'));
    });

    // Close the menu after tapping a link so navigation/anchors feel natural.
    navContent.addEventListener('click', function (e) {
        if (e.target.closest('.nav-link')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
            setOpen(false);
        }
    });

    // Never leave the menu stuck open when growing back to desktop width.
    const mq = window.matchMedia('(max-width: 768px)');
    function onChange() { if (!mq.matches) setOpen(false); }
    if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', onChange);
    } else if (typeof mq.addListener === 'function') {
        mq.addListener(onChange);
    }
}

// Global flag for hero text reveal state
let heroTextRevealComplete = false;

// ============================================
// Apple-like Smooth Parallax Scroll
// ============================================
function initParallaxScroll() {
    let ticking = false;
    
    function updateParallax() {
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
            
            // Only control artistInfo opacity after initial reveal is complete
            if (artistInfo && heroTextRevealComplete) {
                artistInfo.style.transform = `translateY(${scrolled * 0.5}px)`;
                
                // Fade out as we scroll past hero
                const fadeOutOpacity = 1 - (scrolled * 0.0015);
                artistInfo.style.opacity = Math.max(0, Math.min(1, fadeOutOpacity));
                
                // Also fade out the bottom gradient
                const bottomGradient = document.querySelector('.hero-bottom-gradient');
                if (bottomGradient) {
                    bottomGradient.style.opacity = Math.max(0, Math.min(1, fadeOutOpacity));
                }
            }
        }
        
        // Fade in works on scroll
        const workItems = document.querySelectorAll('.work-item');
        workItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight * 0.92) {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }
        });
        
        ticking = false;
    }

    // Initial call
    updateParallax();

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });

    // Fix: When tab is backgrounded, rAF is paused so ticking never resets.
    // When user returns, reset ticking so scroll handlers work again.
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            ticking = false;
            updateParallax();
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
            // Skip cards where the image is centered/contained on a blurred
            // backdrop — the parallax shift would break the intended padding.
            if (workImage.closest('.blur-fill')) return;

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

    // Fix: When tab is backgrounded, rAF is paused so ticking never resets.
    // When user returns, reset ticking so scroll handlers work again.
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            ticking = false;
            updateParallax();
        }
    });
}

// ============================================
// Project Gallery Scroll Animations
// ============================================
function initProjectGalleryAnimations() {
    const galleryElements = document.querySelectorAll('.gallery-full, .gallery-row-2, .gallery-row-3');
    
    if (galleryElements.length === 0) return;
    
    const observerOptions = {
        threshold: 0.05,
        rootMargin: '0px 0px 200px 0px' // Trigger 200px before entering viewport
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
        element.style.transitionDelay = `${index * 0.05}s`;
        observer.observe(element);
    });
}

// ============================================
// Horizontal Scroll Gallery
// Vertical scroll pans the track right; photos reveal one by one.
// ============================================
function initScatterGallery() {
    const section = document.querySelector('.hscroll-section');

    if (!section) return;

    const sticky = section.querySelector('.hscroll-sticky');
    const track = section.querySelector('.hscroll-track');
    const items = Array.from(section.querySelectorAll('.hscroll-item'));

    // Disable the horizontal-pan behaviour on small screens (CSS falls back
    // to a vertical stack); just reveal items as they enter the viewport.
    const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

    function revealVisible() {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        items.forEach(item => {
            if (item.classList.contains('revealed')) return;
            const r = item.getBoundingClientRect();
            const inView = isMobile()
                ? (r.top < vh * 0.85 && r.bottom > 0)
                : (r.left < vw * 0.9 && r.right > 0);
            if (inView) item.classList.add('revealed');
        });
    }

    let ticking = false;
    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            if (!isMobile()) {
                const scrollable = section.offsetHeight - sticky.offsetHeight;
                const progress = scrollable > 0
                    ? Math.min(Math.max(-section.getBoundingClientRect().top / scrollable, 0), 1)
                    : 0;
                const maxX = track.scrollWidth - sticky.offsetWidth;
                track.style.transform = `translateX(${-progress * maxX}px)`;
            } else {
                track.style.transform = '';
            }
            revealVisible();
            ticking = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
}

// ============================================
// Scroll-driven Horizontal Gallery (commissioned project pages)
// Vertical scroll pans the track sideways. The layout is established
// immediately from each image's reserved width/height aspect ratio, so the
// gallery is scrollable before the images finish downloading and images can
// load lazily into their reserved slots instead of blocking the whole view.
// ============================================
function initScrollGallery() {
    const wrappers = document.querySelectorAll('.scroll-gallery-wrapper');
    if (!wrappers.length) return;

    // On phones the desktop "vertical scroll pans sideways" interaction is
    // awkward, so we fall back to a native, swipeable, scroll-snapping carousel
    // (styled in CSS). This query decides which mode each gallery runs in and
    // is re-evaluated whenever the viewport crosses the breakpoint.
    const mq = window.matchMedia('(max-width: 768px)');

    const galleries = [];

    function setup(wrapper) {
        const track = wrapper.querySelector('.scroll-gallery-track');
        const slides = wrapper.querySelectorAll('.scroll-gallery-slide');
        const imgs = wrapper.querySelectorAll('img');
        if (!track || !slides.length) return;

        const sticky = wrapper.querySelector('.scroll-gallery-sticky') || track.parentNode;

        // Metrics measured only during layout/resize/image-load — never on scroll.
        let slideCenters = [];   // each slide's center x at translateX = 0
        let wrapperTop = 0;      // wrapper top relative to the document
        let totalScrollable = 0;
        let maxTranslate = 0;
        let viewCenter = 0;
        let lastFocusIndex = -1;

        // --- Mobile swipe affordances (slide counter + one-time swipe hint) ---
        // Built once for every gallery but hidden on desktop via CSS, so they
        // never affect the desktop layout.
        const progressEl = document.createElement('div');
        progressEl.className = 'scroll-gallery-progress';
        const hintEl = document.createElement('div');
        hintEl.className = 'scroll-gallery-hint';
        hintEl.innerHTML = 'swipe <span class="swipe-arrow" aria-hidden="true">&rarr;</span>';
        sticky.appendChild(progressEl);
        sticky.appendChild(hintEl);

        let hintDismissed = false;
        let progressScheduled = false;

        function updateProgress() {
            const total = slides.length;
            const slideW = track.clientWidth || 1;
            let idx = Math.round(track.scrollLeft / slideW);
            idx = Math.max(0, Math.min(total - 1, idx));
            progressEl.textContent = (idx + 1) + ' / ' + total;
        }

        function onTrackScroll() {
            if (!mq.matches || progressScheduled) return;
            progressScheduled = true;
            window.requestAnimationFrame(function () {
                updateProgress();
                if (!hintDismissed && track.scrollLeft > 8) {
                    hintEl.classList.add('hidden');
                    hintDismissed = true;
                }
                progressScheduled = false;
            });
        }

        track.addEventListener('scroll', onTrackScroll, { passive: true });

        // Clears every inline style the desktop scroll-pan writes so the CSS
        // swipe carousel can take over cleanly on mobile.
        function reset() {
            track.style.transform = '';
            track.style.paddingLeft = '';
            wrapper.style.height = '';
            if (lastFocusIndex >= 0 && slides[lastFocusIndex]) {
                slides[lastFocusIndex].classList.remove('focused');
            }
            lastFocusIndex = -1;
        }

        function centerFirstImage() {
            const firstImg = imgs[0];
            if (!firstImg) return;
            const firstImgWidth = firstImg.getBoundingClientRect().width;
            const leftPad = Math.max(0, (window.innerWidth - firstImgWidth) / 2);
            track.style.paddingLeft = leftPad + 'px';
        }

        function setHeight() {
            const overscroll = track.scrollWidth - window.innerWidth;
            wrapper.style.height = (window.innerHeight + Math.max(0, overscroll)) + 'px';
        }

        // Cache every layout-dependent value up front so the scroll path can run
        // without forcing synchronous reflows.
        function measure() {
            const rect = wrapper.getBoundingClientRect();
            wrapperTop = rect.top + window.pageYOffset;
            totalScrollable = wrapper.offsetHeight - window.innerHeight;
            maxTranslate = Math.max(0, track.scrollWidth - window.innerWidth);
            viewCenter = window.innerWidth / 2;
            slideCenters = Array.prototype.map.call(slides, function (slide) {
                return slide.offsetLeft + slide.offsetWidth / 2;
            });
        }

        function updateFocus(tx) {
            let closestIndex = 0;
            let closestDist = Infinity;
            for (let i = 0; i < slideCenters.length; i++) {
                const dist = Math.abs(slideCenters[i] + tx - viewCenter);
                if (dist < closestDist) { closestDist = dist; closestIndex = i; }
            }
            if (closestIndex !== lastFocusIndex) {
                if (lastFocusIndex >= 0 && slides[lastFocusIndex]) {
                    slides[lastFocusIndex].classList.remove('focused');
                }
                if (slides[closestIndex]) slides[closestIndex].classList.add('focused');
                lastFocusIndex = closestIndex;
            }
        }

        // Scroll-time path: pure math + style writes, no layout reads.
        function update() {
            if (mq.matches) return;   // mobile carousel is CSS/touch driven
            const scrolled = window.pageYOffset - wrapperTop;
            const progress = totalScrollable > 0
                ? Math.max(0, Math.min(1, scrolled / totalScrollable))
                : 0;
            const translateX = -progress * maxTranslate;
            track.style.transform = 'translateX(' + translateX + 'px)';
            updateFocus(translateX);
        }

        function layout() {
            if (mq.matches) {
                // Mobile: hand control to the CSS swipe carousel.
                reset();
                updateProgress();
                return;
            }
            centerFirstImage();
            setHeight();
            measure();
            update();
        }

        // Lay out right away using the reserved aspect-ratio widths.
        layout();

        // Re-measure once each image's real dimensions are known (a no-op when
        // they match the reserved ratio, but keeps things correct otherwise).
        imgs.forEach(function (img) {
            if (!(img.complete && img.naturalWidth > 0)) {
                img.addEventListener('load', layout);
                img.addEventListener('error', layout);
            }
        });

        galleries.push({ layout: layout, update: update });
    }

    wrappers.forEach(setup);

    // Batch scroll updates into a single rAF so we never run more often than the
    // browser paints, and reads/writes stay grouped to avoid layout thrashing.
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                galleries.forEach(function (g) { g.update(); });
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    window.addEventListener('resize', function () {
        galleries.forEach(function (g) { g.layout(); });
    });

    // Re-lay out whenever we cross the mobile/desktop breakpoint so the gallery
    // switches between the scroll-pan and the swipe carousel cleanly.
    function onBreakpointChange() {
        galleries.forEach(function (g) { g.layout(); });
    }
    if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', onBreakpointChange);
    } else if (typeof mq.addListener === 'function') {
        mq.addListener(onBreakpointChange); // Safari < 14 fallback
    }

    // rAF pauses while the tab is backgrounded, which can leave `ticking` stuck.
    // Reset and re-sync when the page becomes visible again.
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') {
            ticking = false;
            galleries.forEach(function (g) { g.update(); });
        }
    });
}

// ============================================
// Hero Text Reveal on First Scroll
// ============================================
function initHeroTextReveal() {
    const artistInfo = document.querySelector('.artist-info');
    const heroSection = document.querySelector('.hero');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const bottomGradient = document.querySelector('.hero-bottom-gradient');
    
    // Only apply to homepage with hero section
    if (!artistInfo || !heroSection) return;
    
    let textRevealed = false;
    const alreadySeen = sessionStorage.getItem('heroRevealed');
    
    if (alreadySeen) {
        // Returning visit — show everything immediately, no scroll lock
        artistInfo.style.opacity = '1';
        artistInfo.style.transform = 'translateY(0)';
        if (bottomGradient) bottomGradient.style.opacity = '1';
        if (scrollIndicator) scrollIndicator.style.opacity = '0.4';
        heroTextRevealComplete = true;
        textRevealed = true;
        return;
    }
    
    // First visit — animate the reveal
    artistInfo.style.opacity = '0';
    artistInfo.style.transform = 'translateY(20px)';
    artistInfo.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    function revealText() {
        if (textRevealed) return;
        textRevealed = true;
        
        sessionStorage.setItem('heroRevealed', '1');
        
        if (bottomGradient) {
            bottomGradient.style.opacity = '1';
        }
        
        artistInfo.style.opacity = '1';
        artistInfo.style.transform = 'translateY(0)';
        
        if (scrollIndicator) {
            scrollIndicator.style.opacity = '0.4';
        }
        
        setTimeout(() => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            
            heroTextRevealComplete = true;
            
            window.removeEventListener('wheel', handleWheel, true);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('keydown', handleKeydown);
        }, 800);
    }
    
    function handleWheel(e) {
        if (!textRevealed && e.deltaY > 0) {
            e.preventDefault();
            e.stopPropagation();
            revealText();
        }
    }
    
    let touchStartY = 0;
    
    function handleTouchStart(e) {
        touchStartY = e.touches[0].clientY;
    }
    
    function handleTouchMove(e) {
        if (!textRevealed) {
            const touchY = e.touches[0].clientY;
            const deltaY = touchStartY - touchY;
            
            if (deltaY > 20) {
                e.preventDefault();
                revealText();
            }
        }
    }
    
    function handleKeydown(e) {
        if (!textRevealed) {
            if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
                e.preventDefault();
                revealText();
            }
        }
    }
    
    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('keydown', handleKeydown);

    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible' && !textRevealed) {
            revealText();
        }
    });

    // Fallback: Auto-unlock after 15s if user never scrolled (e.g. left tab immediately).
    setTimeout(function() {
        if (!textRevealed) {
            revealText();
        }
    }, 15000);
    
    // Also reveal on click of scroll indicator
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function(e) {
            if (!textRevealed) {
                e.preventDefault();
                revealText();
            }
        });
    }
}

// ============================================
// Lazy Image Fade-In
// ============================================
function initLazyImageFadeIn() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    // Show a spinner only for images that are actually downloading and near the
    // viewport, so off-screen lazy images don't animate spinners needlessly.
    const spinnerObserver = ('IntersectionObserver' in window)
        ? new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const img = entry.target;
                obs.unobserve(img);
                if (!(img.complete && img.naturalHeight > 0) && img.parentElement) {
                    img.parentElement.classList.add('img-loading');
                }
            });
        }, { rootMargin: '200px' })
        : null;

    function markLoaded(img) {
        img.classList.add('img-loaded');
        if (img.parentElement) img.parentElement.classList.remove('img-loading');
        if (spinnerObserver) spinnerObserver.unobserve(img);
    }

    lazyImages.forEach(img => {
        if (img.complete && img.naturalHeight > 0) {
            img.classList.add('img-loaded');
        } else {
            img.addEventListener('load', () => markLoaded(img));
            img.addEventListener('error', () => markLoaded(img));
            if (spinnerObserver) {
                spinnerObserver.observe(img);
            } else if (img.parentElement) {
                img.parentElement.classList.add('img-loading');
            }
        }
    });
}

// ============================================
// Camera Shutter Animation (About Page)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const cameraShutter = document.getElementById('cameraShutter');
    
    if (!cameraShutter) return; // Only run on about page
    
    // Create flash element
    const flash = document.createElement('div');
    flash.className = 'page-flash';
    document.body.appendChild(flash);
    
    let isAnimating = false;
    
    cameraShutter.addEventListener('click', function() {
        if (isAnimating) return;
        
        isAnimating = true;
        
        // Close shutter
        cameraShutter.classList.add('shuttering');
        
        // Flash effect at the moment of "capture"
        setTimeout(() => {
            flash.classList.add('active');
            setTimeout(() => {
                flash.classList.remove('active');
            }, 100);
        }, 240);
        
        // Open shutter
        setTimeout(() => {
            cameraShutter.classList.remove('shuttering');
            cameraShutter.classList.add('opening');
        }, 280);
        
        // Reset
        setTimeout(() => {
            cameraShutter.classList.remove('opening');
            isAnimating = false;
        }, 700);
    });
});

// ============================================
// Gallery Lightbox
// ============================================
function initGalleryLightbox() {
    const galleryImages = document.querySelectorAll('.gallery-full img, .gallery-item img, .hscroll-item img');
    
    if (galleryImages.length === 0) return;
    
    // Create lightbox HTML
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="" alt="" class="lightbox-image">
        </div>
        <button class="lightbox-close" aria-label="Close">&times;</button>
        <button class="lightbox-nav lightbox-prev" aria-label="Previous">‹</button>
        <button class="lightbox-nav lightbox-next" aria-label="Next">›</button>
        <div class="lightbox-counter"></div>
    `;
    document.body.appendChild(lightbox);
    
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const counter = lightbox.querySelector('.lightbox-counter');
    
    let currentIndex = 0;
    let imagesArray = Array.from(galleryImages);
    
    function openLightbox(index) {
        currentIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lightboxImage.classList.remove('loaded');
    }
    
    function updateLightboxImage() {
        lightboxImage.classList.remove('loaded');
        const img = imagesArray[currentIndex];
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        
        // Update counter
        counter.textContent = `${currentIndex + 1} / ${imagesArray.length}`;
        
        // Load image
        lightboxImage.onload = () => {
            lightboxImage.classList.add('loaded');
        };
    }
    
    function showPrevious() {
        currentIndex = (currentIndex - 1 + imagesArray.length) % imagesArray.length;
        updateLightboxImage();
    }
    
    function showNext() {
        currentIndex = (currentIndex + 1) % imagesArray.length;
        updateLightboxImage();
    }
    
    // Add click handlers to gallery images
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(index));
    });
    
    // Close button
    closeBtn.addEventListener('click', closeLightbox);
    
    // Navigation buttons
    prevBtn.addEventListener('click', showPrevious);
    nextBtn.addEventListener('click', showNext);
    
    // Click outside image to close
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevious();
        if (e.key === 'ArrowRight') showNext();
    });
}

// Initialize lightbox on page load
document.addEventListener('DOMContentLoaded', function() {
    initGalleryLightbox();
    initCommissionedFilters();
});

// ============================================
// Commissioned Work Filters - Scroll to Section
// ============================================
function initCommissionedFilters() {
    const filterBtns = document.querySelectorAll('.commissioned-filter-btn');
    
    if (filterBtns.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            const section = document.getElementById(target);
            
            if (section) {
                section.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// Cursor Glow
// ============================================
function initCursorGlow() {
    if ('ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches) return;

    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    let targetX = -200, targetY = -200;
    let currentX = -200, currentY = -200;
    let fadeTimeout;

    window.addEventListener('mousemove', function (e) {
        targetX = e.clientX;
        targetY = e.clientY;
        glow.style.opacity = '1';

        clearTimeout(fadeTimeout);
        fadeTimeout = setTimeout(() => {
            glow.style.opacity = '0';
        }, 150);
    });

    function animate() {
        currentX += (targetX - currentX) * 0.15;
        currentY += (targetY - currentY) * 0.15;
        glow.style.left = currentX + 'px';
        glow.style.top = currentY + 'px';
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

// ============================================
// Scroll-to-top button (project pages only)
// ============================================
(function initScrollToTop() {
    // Skip on the homepage and about page
    const path = window.location.pathname;
    const isHomePage = path === '/' || path.endsWith('index.html');
    if (isHomePage) return;

    const btn = document.createElement('button');
    btn.className = 'scroll-to-top';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = '↑';
    document.body.appendChild(btn);

    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });

    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();
