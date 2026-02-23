/* ============================================
   CASA MEYER — Complete Rewrite
   Watercolor hero parallax, facade interactions
   ============================================ */

(function () {
  'use strict';

  // ============================================
  // Preloader
  // ============================================

  const preloader = document.getElementById('preloader');

  function hidePreloader() {
    setTimeout(() => { preloader.classList.add('is-hidden'); }, 1200);
  }

  window.addEventListener('load', hidePreloader);
  if (document.readyState === 'complete') hidePreloader();

  // ============================================
  // DOM cache
  // ============================================

  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  const heroBg = document.querySelector('.hero-bg');
  const heroContent = document.getElementById('heroContent');

  const friendshipSection = document.querySelector('.friendship');
  const friendshipBg = document.querySelector('.friendship-bg');
  const friendshipCard = document.getElementById('friendshipCard');

  // storyImage removed (illustration deleted)
  const facadeCards = document.querySelectorAll('.facade-card');
  const colorDividerBlocks = document.querySelectorAll('.color-divider-block');

  const closingSection = document.getElementById('closing');
  const closingQuote = document.getElementById('closingQuote');

  // ============================================
  // Navigation
  // ============================================

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('is-active');
    navLinks.classList.toggle('is-open');
    document.body.style.overflow = navLinks.classList.contains('is-open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('is-active');
      navLinks.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });

  // Smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = nav.offsetHeight;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - navHeight,
        behavior: 'smooth'
      });
    });
  });

  // ============================================
  // Scroll Reveal (Intersection Observer)
  // ============================================

  function createRevealObserver() {
    const els = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

    els.forEach(el => observer.observe(el));
  }

  // ============================================
  // Utilities
  // ============================================

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // 0 = just entering bottom of viewport, 1 = just leaving top
  function getScrollProgress(el) {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    return clamp((vh - rect.top) / (vh + rect.height), 0, 1);
  }

  // ============================================
  // PARALLAX ENGINE
  // ============================================

  function handleScroll() {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;

    // ── Nav: transparent → solid ──
    if (scrollY > 80) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }

    // ── Nav: dark over friendship section ──
    if (friendshipSection) {
      const rect = friendshipSection.getBoundingClientRect();
      if (rect.top < vh * 0.3 && rect.bottom > vh * 0.3) {
        nav.classList.add('is-dark');
      } else {
        nav.classList.remove('is-dark');
      }
    }

    // ── HERO IMAGE PARALLAX ──
    // The hero background moves at 35% of scroll speed.
    // This is the core parallax effect — visible, obvious depth.
    if (heroBg && scrollY < vh * 1.5) {
      heroBg.style.transform = 'translateY(' + (scrollY * 0.35) + 'px)';
    }

    // ── HERO CONTENT: fades out + drifts up on scroll ──
    if (heroContent && scrollY < vh) {
      const progress = scrollY / vh;
      heroContent.style.opacity = clamp(1 - progress * 1.8, 0, 1);
      heroContent.style.transform = 'translateY(' + (progress * -70) + 'px)';
    }

    // ── FRIENDSHIP: Background parallax + card slide-in ──
    if (friendshipSection) {
      const rect = friendshipSection.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) {
        const progress = getScrollProgress(friendshipSection);

        if (friendshipBg) {
          var offset = (progress - 0.5) * -120;
          friendshipBg.style.transform = 'translateY(' + offset + 'px)';
        }

        if (friendshipCard) {
          var cardProgress = clamp((progress - 0.15) / 0.45, 0, 1);
          var eased = easeOutCubic(cardProgress);
          friendshipCard.style.transform = 'translateX(' + ((1 - eased) * 60) + 'px)';
          friendshipCard.style.opacity = eased;
        }
      }
    }

    // ── FACADE CARDS: staggered drift ──
    facadeCards.forEach(function(card, i) {
      var rect = card.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) {
        var progress = getScrollProgress(card);
        var drift = (progress - 0.5) * -25 * (i === 0 ? 1 : 1.4);
        card.style.transform = 'translateY(' + drift + 'px)';
      }
    });

    // ── COLOR DIVIDER: blocks slide in from edges ──
    colorDividerBlocks.forEach(function(block, i) {
      var parent = block.parentElement;
      if (parent) {
        var rect = parent.getBoundingClientRect();
        if (rect.top < vh && rect.bottom > 0) {
          var progress = getScrollProgress(parent);
          var eased = clamp((progress - 0.2) / 0.35, 0, 1);
          var direction = i % 2 === 0 ? -1 : 1;
          block.style.transform = 'translateX(' + ((1 - eased) * direction * 100) + '%)';
          block.style.opacity = eased;
        }
      }
    });

    // ── CLOSING QUOTE: scale + fade in ──
    if (closingSection && closingQuote) {
      var rect = closingSection.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) {
        var progress = getScrollProgress(closingSection);
        var qp = clamp((progress - 0.1) / 0.45, 0, 1);
        var eased = easeOutCubic(qp);
        var scale = 0.95 + eased * 0.05;
        closingQuote.style.transform = 'translateY(' + ((1 - eased) * 40) + 'px) scale(' + scale + ')';
        closingQuote.style.opacity = eased;
      }
    }

    // ── Active nav link ──
    updateActiveNavLink();
  }

  // ============================================
  // Active nav link
  // ============================================

  function updateActiveNavLink() {
    var sections = document.querySelectorAll('section[id]');
    var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
    var currentSection = '';
    var navHeight = nav.offsetHeight;

    sections.forEach(function(section) {
      if (window.scrollY >= section.offsetTop - navHeight - 100) {
        currentSection = section.getAttribute('id');
      }
    });

    navAnchors.forEach(function(link) {
      link.classList.remove('is-active');
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('is-active');
      }
    });
  }

  // ============================================
  // Interactive Facade Blocks
  // Hover → turns pink. Click → toggles pink.
  // ============================================

  function initFacadeInteraction() {
    var blocks = document.querySelectorAll('.facade-block');
    var originalFills = new Map();

    blocks.forEach(function(block) {
      originalFills.set(block, block.getAttribute('fill'));

      block.addEventListener('mouseenter', function() {
        if (!block.classList.contains('is-toggled')) {
          block.setAttribute('fill', '#E84C8A');
          block.style.opacity = '0.9';
        }
      });

      block.addEventListener('mouseleave', function() {
        if (!block.classList.contains('is-toggled')) {
          block.setAttribute('fill', originalFills.get(block));
          block.style.opacity = '';
        }
      });

      block.addEventListener('click', function() {
        block.classList.toggle('is-toggled');
        if (block.classList.contains('is-toggled')) {
          block.setAttribute('fill', '#E84C8A');
          block.style.opacity = '1';
        } else {
          block.setAttribute('fill', originalFills.get(block));
          block.style.opacity = '';
        }
      });
    });

    // Scroll-driven stagger: blocks slide into view
    var facadeSVGs = document.querySelectorAll('.facade-svg');
    var facadeObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var svgBlocks = entry.target.querySelectorAll('.facade-block');
          svgBlocks.forEach(function(block, i) {
            block.style.transition = 'opacity 0.6s ease ' + (i * 0.08) + 's, transform 0.6s ease ' + (i * 0.08) + 's';
            block.style.opacity = block.style.opacity || '';
            block.classList.add('facade-block--visible');
          });
          facadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    facadeSVGs.forEach(function(svg) {
      facadeObserver.observe(svg);
    });
  }

  // ============================================
  // Interactive Lattice Grid
  // ============================================

  function initLatticeGrid() {
    var grid = document.getElementById('latticeGrid');
    if (!grid) return;

    for (var i = 0; i < 64; i++) {
      var cell = document.createElement('div');
      cell.className = 'lattice-cell';
      grid.appendChild(cell);
    }

    var cells = grid.querySelectorAll('.lattice-cell');

    grid.addEventListener('mousemove', function(e) {
      var rect = grid.getBoundingClientRect();
      var mouseX = e.clientX - rect.left;
      var mouseY = e.clientY - rect.top;
      var cellSize = rect.width / 8;

      cells.forEach(function(cell, index) {
        var col = index % 8;
        var row = Math.floor(index / 8);
        var cx = (col + 0.5) * cellSize;
        var cy = (row + 0.5) * cellSize;
        var dist = Math.sqrt(Math.pow(mouseX - cx, 2) + Math.pow(mouseY - cy, 2));
        var maxDist = cellSize * 3;
        var intensity = Math.max(0, 1 - dist / maxDist);

        cell.style.opacity = 0.15 + intensity * 0.85;
        cell.style.transform = 'scale(' + (1 + intensity * 0.08) + ')';
      });
    });

    grid.addEventListener('mouseleave', function() {
      cells.forEach(function(cell) {
        cell.style.opacity = '';
        cell.style.transform = '';
      });
    });

    var animFrame;

    function animateWave() {
      var time = Date.now() * 0.001;
      cells.forEach(function(cell, index) {
        var col = index % 8;
        var row = Math.floor(index / 8);
        var wave = Math.sin(time * 1.5 + col * 0.4 + row * 0.3) * 0.5 + 0.5;
        cell.style.opacity = 0.12 + wave * 0.35;
      });
      animFrame = requestAnimationFrame(animateWave);
    }

    var latticeObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateWave();
        } else {
          cancelAnimationFrame(animFrame);
          cells.forEach(function(cell) { cell.style.opacity = ''; });
        }
      });
    }, { threshold: 0.2 });

    latticeObserver.observe(grid);

    grid.addEventListener('mouseenter', function() { cancelAnimationFrame(animFrame); });
    grid.addEventListener('mouseleave', function() { animateWave(); });
  }

  // Gallery and palette sections removed

  // ============================================
  // Booking Form
  // ============================================

  function initBookingForm() {
    var form = document.getElementById('bookingForm');
    var modal = document.getElementById('bookingModal');
    var modalClose = document.getElementById('modalClose');

    if (!form || !modal) return;

    var tourDateInput = document.getElementById('tourDate');
    if (tourDateInput) {
      tourDateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
    }

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      modal.classList.add('is-visible');
      document.body.style.overflow = 'hidden';
      form.reset();
    });

    function closeModal() {
      modal.classList.remove('is-visible');
      document.body.style.overflow = '';
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('is-visible')) closeModal();
    });
  }

  // ============================================
  // Scroll performance (rAF throttled)
  // ============================================

  var ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function() {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }

  // ============================================
  // Initialize
  // ============================================

  function init() {
    createRevealObserver();
    initFacadeInteraction();
    initLatticeGrid();
    // gallery and palette removed
    initBookingForm();

    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial state
    handleScroll();

    // Trigger hero animations after preloader fades
    setTimeout(function() {
      document.querySelectorAll('.hero .reveal').forEach(function(el) {
        el.classList.add('is-visible');
      });
    }, 1400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
