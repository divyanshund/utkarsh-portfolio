// ============================================
// Do We All Breathe the Same - 3D Book Page Flip
// Scroll-driven and arrow-navigated page turning with CSS 3D transforms.
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    var section = document.getElementById('bookFlipSection');
    var book = document.getElementById('bookFlip');
    var prevBtn = document.getElementById('bookPrev');
    var nextBtn = document.getElementById('bookNext');
    var indicator = document.getElementById('bookIndicator');
    var scrollHint = document.getElementById('bookScrollHint');
    var bookScrollArrow = document.getElementById('bookScrollArrow');

    if (!book || !section) return;

    var leaves = Array.from(book.querySelectorAll('.book-leaf'));
    var totalPages = leaves.length;
    var currentPage = 0;       // leaves currently flipped (visual state)
    var targetPage = 0;        // where the scroll/nav wants us to be
    var stepTimer = null;      // drives sequential one-at-a-time flips
    var STEP_MS = 170;         // base delay between consecutive page turns
    var SCROLL_PER_PAGE = 260;
    var SCROLL_BUFFER = 150;
    var FLIP_DURATION = 800;
    var zIndexTimeout;

    // --- Layout ---

    function updateLayout() {
        var scrollDistance = SCROLL_BUFFER + (totalPages - 1) * SCROLL_PER_PAGE;
        section.style.height = (scrollDistance + window.innerHeight) + 'px';
    }

    updateLayout();
    window.addEventListener('resize', updateLayout);

    // --- Z-index management ---

    function setRestingZIndexes() {
        for (var i = 0; i < totalPages; i++) {
            if (i < currentPage) {
                leaves[i].style.zIndex = i + 1;
            } else if (i === currentPage) {
                leaves[i].style.zIndex = totalPages;
            } else {
                leaves[i].style.zIndex = totalPages - i;
            }
        }
    }

    function scheduleZIndexSettle() {
        clearTimeout(zIndexTimeout);
        zIndexTimeout = setTimeout(setRestingZIndexes, 50);
    }

    setRestingZIndexes();

    leaves.forEach(function(leaf) {
        leaf.addEventListener('transitionend', function(e) {
            if (e.propertyName === 'transform') {
                scheduleZIndexSettle();
            }
        });
    });

    // --- Core page flip ---

    // Apply flipped classes for the current visual state and lift the single
    // leaf that is actively turning above both page stacks.
    function applyFlipState(animatingIndex) {
        for (var i = 0; i < totalPages; i++) {
            if (i < currentPage) {
                leaves[i].classList.add('flipped');
            } else {
                leaves[i].classList.remove('flipped');
            }

            if (i === animatingIndex) {
                leaves[i].style.zIndex = totalPages + 5;
            } else if (i < currentPage) {
                leaves[i].style.zIndex = i + 1;
            } else if (i === currentPage) {
                leaves[i].style.zIndex = totalPages;
            } else {
                leaves[i].style.zIndex = totalPages - i;
            }
        }

        updateIndicator();
        updateArrows();
    }

    // Turn exactly one page toward the target, then schedule the next turn.
    // This keeps fast scrolls from collapsing many pages into one instant flip.
    function stepToward() {
        stepTimer = null;
        if (currentPage === targetPage) return;

        var animatingIndex;
        if (targetPage > currentPage) {
            animatingIndex = currentPage;   // top-right leaf turns left
            currentPage++;
        } else {
            currentPage--;
            animatingIndex = currentPage;   // top-left leaf turns back right
        }

        applyFlipState(animatingIndex);

        var pending = Math.abs(targetPage - currentPage);
        if (pending > 0) {
            // Catch up a little faster the further behind we are, so big
            // jumps cascade as a quick riffle rather than dragging on.
            var interval = Math.max(80, STEP_MS - pending * 10);
            stepTimer = setTimeout(stepToward, interval);
        }
    }

    function setPage(pageIndex) {
        pageIndex = Math.max(0, Math.min(totalPages - 1, pageIndex));
        if (pageIndex === targetPage) return;
        targetPage = pageIndex;
        if (!stepTimer) stepToward();
    }

    function updateIndicator() {
        if (indicator) {
            if (currentPage === 0) {
                indicator.textContent = 'scroll to flip';
            } else {
                indicator.textContent = (currentPage + 1) + ' / ' + totalPages;
            }
        }
    }

    function updateArrows() {
        if (prevBtn) {
            if (currentPage === 0) {
                prevBtn.classList.add('disabled');
            } else {
                prevBtn.classList.remove('disabled');
            }
        }
        if (nextBtn) {
            if (currentPage === totalPages - 1) {
                nextBtn.classList.add('disabled');
            } else {
                nextBtn.classList.remove('disabled');
            }
        }
    }

    // --- Scroll to a specific page position ---

    function scrollToPage(pageIndex) {
        var sectionDocTop = section.getBoundingClientRect().top + window.scrollY;
        var targetScroll = sectionDocTop + SCROLL_BUFFER + pageIndex * SCROLL_PER_PAGE;
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }

    // --- Arrow navigation ---

    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (targetPage > 0) scrollToPage(targetPage - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (targetPage < totalPages - 1) scrollToPage(targetPage + 1);
        });
    }

    // --- Keyboard navigation ---

    document.addEventListener('keydown', function(e) {
        var rect = section.getBoundingClientRect();
        var inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (!inView) return;

        if (e.key === 'ArrowRight') {
            e.preventDefault();
            if (targetPage < totalPages - 1) scrollToPage(targetPage + 1);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            if (targetPage > 0) scrollToPage(targetPage - 1);
        }
    });

    // --- Scroll-driven page flipping ---

    var ticking = false;

    function onScroll() {
        var scrollIntoSection = -(section.getBoundingClientRect().top);

        if (scrollIntoSection < 0) {
            if (currentPage !== 0) setPage(0);
            ticking = false;
            return;
        }

        if (bookScrollArrow) {
            bookScrollArrow.style.opacity = '0';
        }

        var flipScroll = scrollIntoSection - SCROLL_BUFFER;

        if (flipScroll < 0) {
            if (currentPage !== 0) setPage(0);
            ticking = false;
            return;
        }

        var maxScroll = (totalPages - 1) * SCROLL_PER_PAGE;
        if (flipScroll > maxScroll) {
            if (currentPage !== totalPages - 1) setPage(totalPages - 1);
            ticking = false;
            return;
        }

        var desiredPage = Math.round(flipScroll / SCROLL_PER_PAGE);
        setPage(desiredPage);

        if (scrollHint) {
            scrollHint.style.opacity = scrollIntoSection > 30 ? '0' : '';
        }

        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });

    // --- Touch swipe on book ---

    var touchStartX = 0;
    var touchStartY = 0;

    book.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    book.addEventListener('touchend', function(e) {
        var dx = e.changedTouches[0].clientX - touchStartX;
        var dy = e.changedTouches[0].clientY - touchStartY;

        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
            if (dx < 0 && targetPage < totalPages - 1) {
                scrollToPage(targetPage + 1);
            } else if (dx > 0 && targetPage > 0) {
                scrollToPage(targetPage - 1);
            }
        }
    }, { passive: true });

    // --- Click on book to flip forward ---

    book.addEventListener('click', function() {
        if (targetPage < totalPages - 1) {
            scrollToPage(targetPage + 1);
        }
    });

    // --- Preload images ---

    window.addEventListener('load', function() {
        var images = book.querySelectorAll('.book-leaf-front img, .book-leaf-back img');
        images.forEach(function(img) {
            if (!img.complete) {
                var preload = new Image();
                preload.src = img.src;
            }
        });
    });

    // --- Peek hint: partial flip on load to show interactivity ---

    function peekHint() {
        var firstLeaf = leaves[0];
        if (!firstLeaf) return;

        firstLeaf.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        firstLeaf.style.transform = 'rotateY(-25deg)';

        setTimeout(function() {
            firstLeaf.style.transition = 'transform 0.8s cubic-bezier(0.2, 0, 0.4, 1)';
            firstLeaf.style.transform = 'rotateY(0deg)';

            setTimeout(function() {
                firstLeaf.style.transition = '';
                firstLeaf.style.transform = '';
            }, 850);
        }, 700);
    }

    setTimeout(peekHint, 800);

    // --- Hide scroll arrow on any scroll ---

    if (bookScrollArrow) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                bookScrollArrow.style.opacity = '0';
            }
        }, { passive: true });
    }

    // --- Initialize ---

    updateIndicator();
    updateArrows();
    requestAnimationFrame(onScroll);
});
