// ============================================
// Do We All Breathe the Same - Horizontal Scroll
// Vertical scroll drives horizontal movement. Page in center gets focus (shadow, stroke).
// Adjacent pages are slightly smaller. Based on Figma design.
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const scrollTrigger = document.getElementById('bookScrollTrigger');
    const gallery = document.getElementById('bookHorizontalGallery');

    if (!scrollTrigger || !gallery) return;

    const pageItems = gallery.querySelectorAll('.book-page-item');
    const pageCount = pageItems.length;
    const PAGE_GAP = 48;

    function getPageWidth() {
        return Math.min(420, window.innerWidth * 0.38);
    }

    function getPageHeight() {
        return Math.min(680, window.innerHeight * 0.65);
    }

    function updateLayout() {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const pageW = getPageWidth();
        const pageH = getPageHeight();

        // Total width of gallery
        const totalWidth = pageCount * pageW + (pageCount - 1) * PAGE_GAP;
        const maxTranslate = Math.max(0, totalWidth - vw);

        // Scroll trigger height
        scrollTrigger.style.height = totalWidth + 'px';

        // Translate based on scroll
        const scrollTop = window.scrollY;
        const maxScroll = Math.max(0, totalWidth - vh);
        const progress = maxScroll > 0 ? Math.min(1, scrollTop / maxScroll) : 0;
        const translateX = -progress * maxTranslate;

        gallery.style.transform = `translate(${translateX}px, -50%)`;

        // Find which page is closest to viewport center
        const viewportCenterX = vw / 2;
        let focusIndex = 0;
        let minDist = Infinity;

        for (let i = 0; i < pageCount; i++) {
            const pageLeft = i * (pageW + PAGE_GAP) + translateX;
            const pageCenter = pageLeft + pageW / 2;
            const dist = Math.abs(pageCenter - viewportCenterX);
            if (dist < minDist) {
                minDist = dist;
                focusIndex = i;
            }
        }

        // Apply focus class to centered page
        pageItems.forEach((item, i) => {
            if (i === focusIndex) {
                item.classList.add('book-page-focus');
            } else {
                item.classList.remove('book-page-focus');
            }
        });
    }

    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(function() {
                updateLayout();
                ticking = false;
            });
            ticking = true;
        }
    }

    // Horizontal scroll (sideways wheel/trackpad) also moves the gallery
    window.addEventListener('wheel', function(e) {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            e.preventDefault();
            const totalWidth = pageCount * getPageWidth() + (pageCount - 1) * PAGE_GAP;
            const maxScroll = Math.max(0, totalWidth - window.innerHeight);
            const newScroll = Math.max(0, Math.min(maxScroll, window.scrollY + e.deltaX));
            window.scrollTo(0, newScroll);
        }
    }, { passive: false });

    updateLayout();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function() {
        updateLayout();
    });
});
