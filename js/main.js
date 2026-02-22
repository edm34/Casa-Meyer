/* ============================================
   CASA MEYER — Main JavaScript
   Scroll-driven parallax, interactions, booking
   ============================================ */

(function () {
  'use strict';

  // ============================================
  // Preloader
  // ============================================

  const preloader = document.getElementById('preloader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('is-hidden');
    }, 1200);
  });

  if (document.readyState === 'complete') {
    setTimeout(() => {
      preloader.classList.add('is-hidden');
    }, 1200);
  }

  // ============================================
  // Navigation
  // ============================================

  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  let lastScroll = 0;

  function handleNavScroll() {
    const currentScroll = window.scrollY;
    if (currentScroll > 80) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
    lastScroll = currentScroll;
  }

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

  // ============================================
  // Scroll Reveal (Intersection Observer)
  // ============================================

  function createRevealObserver() {
    const revealElements = document.querySelectorAll(
      '.reveal, .reveal-up, .reveal-left, .reveal-right'
    );

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // ============================================
  // PARALLAX ENGINE — Scroll-driven transforms
  // ============================================

  // Cache DOM refs
  const hero = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero-content');
  const heroBlocks = document.querySelectorAll('.hero-block');
  const heroLattice = document.querySelector('.hero-lattice');

  const friendshipSection = document.querySelector('.friendship');
  const friendshipBg = document.querySelector('.friendship-portrait-bg');
  const friendshipCard = document.querySelector('.friendship-text-card');

  const storyImageInner = document.querySelector('.story-image-inner');
  const facadeCards = document.querySelectorAll('.facade-card');

  const closingSection = document.querySelector('.closing');
  const closingQuote = document.querySelector('.closing-quote');

  const colorDividerBlocks = document.querySelectorAll('.color-divider-block');

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function lerp(start, end, t) {
    return start + (end - start) * t;
  }

  // Get how far through the viewport an element is (0 = just entering bottom, 1 = just leaving top)
  function getScrollProgress(el) {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    return clamp((vh - rect.top) / (vh + rect.height), 0, 1);
  }

  function handleParallax() {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;

    // ---- HERO: Content fades out + zooms, color blocks drift ----
    if (hero) {
      const heroProgress = clamp(scrollY / vh, 0, 1.5);

      // Hero content fades and drifts up as you scroll
      if (heroContent) {
        const opacity = clamp(1 - heroProgress * 1.8, 0, 1);
        const translateY = heroProgress * -80;
        const scale = 1 + heroProgress * 0.05;
        heroContent.style.transform = `translateY(${translateY}px) scale(${scale})`;
        heroContent.style.opacity = opacity;
      }

      // Color blocks drift at different rates
      heroBlocks.forEach((block, i) => {
        const speed = (i + 1) * 0.3;
        block.style.transform = `translateY(${scrollY * speed}px)`;
      });

      if (heroLattice) {
        heroLattice.style.transform = `translateY(${scrollY * 0.15}px)`;
        heroLattice.style.opacity = clamp(0.08 - heroProgress * 0.08, 0, 0.08);
      }
    }

    // ---- FRIENDSHIP: Background image parallax + card slides in ----
    if (friendshipSection) {
      const rect = friendshipSection.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) {
        const progress = getScrollProgress(friendshipSection);

        // Background image moves slower than scroll (parallax)
        if (friendshipBg) {
          const offset = (progress - 0.5) * -150;
          friendshipBg.style.transform = `translateY(${offset}px) scale(1.1)`;
        }

        // Card slides in from right as section enters view
        if (friendshipCard) {
          const cardProgress = clamp((progress - 0.15) / 0.5, 0, 1);
          const eased = 1 - Math.pow(1 - cardProgress, 3); // ease-out cubic
          friendshipCard.style.transform = `translateX(${(1 - eased) * 60}px)`;
          friendshipCard.style.opacity = eased;
        }
      }
    }

    // ---- STORY IMAGE: Parallax drift ----
    if (storyImageInner) {
      const parent = storyImageInner.closest('.story-image-parallax');
      if (parent) {
        const rect = parent.getBoundingClientRect();
        if (rect.top < vh && rect.bottom > 0) {
          const progress = getScrollProgress(parent);
          const offset = (progress - 0.5) * -60;
          storyImageInner.style.transform = `translateY(${offset}px)`;
        }
      }
    }

    // ---- FACADE CARDS: Staggered parallax drift ----
    facadeCards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) {
        const progress = getScrollProgress(card);
        const offset = (progress - 0.5) * -30 * (i === 0 ? 1 : 1.5);
        card.style.transform = `translateY(${offset}px)`;
      }
    });

    // ---- COLOR DIVIDER: Blocks slide in from edges on scroll ----
    colorDividerBlocks.forEach((block, i) => {
      const parent = block.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        if (rect.top < vh && rect.bottom > 0) {
          const progress = getScrollProgress(parent);
          const eased = clamp((progress - 0.2) / 0.4, 0, 1);
          const direction = i % 2 === 0 ? -1 : 1;
          block.style.transform = `translateX(${(1 - eased) * direction * 100}%)`;
          block.style.opacity = eased;
        }
      }
    });

    // ---- CLOSING: Quote fades in and scales ----
    if (closingSection && closingQuote) {
      const rect = closingSection.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) {
        const progress = getScrollProgress(closingSection);
        const quoteProgress = clamp((progress - 0.1) / 0.5, 0, 1);
        const eased = 1 - Math.pow(1 - quoteProgress, 3);
        closingQuote.style.transform = `translateY(${(1 - eased) * 40}px) scale(${lerp(0.95, 1, eased)})`;
        closingQuote.style.opacity = eased;
      }
    }

    // ---- VISIT SECTION: Background blocks drift ----
    const visitBlocks = document.querySelectorAll('.visit-bg-block');
    visitBlocks.forEach((block, i) => {
      const rect = block.parentElement.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) {
        const speed = (i + 1) * 0.05;
        block.style.transform = `translateY(${rect.top * speed}px)`;
      }
    });
  }

  // ============================================
  // Scroll-driven section color transitions
  // ============================================

  function handleSectionTransitions() {
    // When friendship section is in view, darken the nav
    if (friendshipSection) {
      const rect = friendshipSection.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top < vh * 0.3 && rect.bottom > vh * 0.3) {
        nav.classList.add('is-dark');
      } else {
        nav.classList.remove('is-dark');
      }
    }
  }

  // ============================================
  // Interactive Lattice Grid
  // ============================================

  function initLatticeGrid() {
    const grid = document.getElementById('latticeGrid');
    if (!grid) return;

    const totalCells = 64;

    for (let i = 0; i < totalCells; i++) {
      const cell = document.createElement('div');
      cell.className = 'lattice-cell';
      cell.dataset.index = i;
      grid.appendChild(cell);
    }

    const cells = grid.querySelectorAll('.lattice-cell');

    grid.addEventListener('mousemove', (e) => {
      const rect = grid.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const cellSize = rect.width / 8;

      cells.forEach((cell, index) => {
        const col = index % 8;
        const row = Math.floor(index / 8);
        const cellCenterX = (col + 0.5) * cellSize;
        const cellCenterY = (row + 0.5) * cellSize;

        const dist = Math.sqrt(
          Math.pow(mouseX - cellCenterX, 2) +
          Math.pow(mouseY - cellCenterY, 2)
        );

        const maxDist = cellSize * 3;
        const intensity = Math.max(0, 1 - dist / maxDist);

        cell.style.opacity = 0.15 + intensity * 0.85;
        cell.style.transform = `scale(${1 + intensity * 0.08})`;
      });
    });

    grid.addEventListener('mouseleave', () => {
      cells.forEach(cell => {
        cell.style.opacity = '';
        cell.style.transform = '';
      });
    });

    let latticeAnimationFrame;

    function animateLatticeWave() {
      const time = Date.now() * 0.001;
      cells.forEach((cell, index) => {
        const col = index % 8;
        const row = Math.floor(index / 8);
        const wave = Math.sin(time * 1.5 + col * 0.4 + row * 0.3) * 0.5 + 0.5;
        cell.style.opacity = 0.12 + wave * 0.35;
      });
      latticeAnimationFrame = requestAnimationFrame(animateLatticeWave);
    }

    const latticeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateLatticeWave();
        } else {
          cancelAnimationFrame(latticeAnimationFrame);
          cells.forEach(cell => { cell.style.opacity = ''; });
        }
      });
    }, { threshold: 0.2 });

    latticeObserver.observe(grid);

    grid.addEventListener('mouseenter', () => {
      cancelAnimationFrame(latticeAnimationFrame);
    });

    grid.addEventListener('mouseleave', () => {
      animateLatticeWave();
    });
  }

  // ============================================
  // Smooth anchor scrolling
  // ============================================

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = nav.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });

  // ============================================
  // Active nav link on scroll
  // ============================================

  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

    let currentSection = '';
    const navHeight = nav.offsetHeight;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - navHeight - 100;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navAnchors.forEach(link => {
      link.classList.remove('is-active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('is-active');
      }
    });
  }

  // ============================================
  // Booking Form
  // ============================================

  function initBookingForm() {
    const form = document.getElementById('bookingForm');
    const modal = document.getElementById('bookingModal');
    const modalClose = document.getElementById('modalClose');

    if (!form || !modal) return;

    const tourDateInput = document.getElementById('tourDate');
    if (tourDateInput) {
      const today = new Date().toISOString().split('T')[0];
      tourDateInput.setAttribute('min', today);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      console.log('Booking submission:', data);
      modal.classList.add('is-visible');
      document.body.style.overflow = 'hidden';
      form.reset();
    });

    if (modalClose) {
      modalClose.addEventListener('click', () => {
        modal.classList.remove('is-visible');
        document.body.style.overflow = '';
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('is-visible');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-visible')) {
        modal.classList.remove('is-visible');
        document.body.style.overflow = '';
      }
    });
  }

  // ============================================
  // Gallery image reveal on scroll
  // ============================================

  function initGalleryReveal() {
    const items = document.querySelectorAll('.gallery-item');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const item = entry.target;
          const fill = item.querySelector('.gallery-color-fill:not(.gallery-color-fill--fallback)');
          if (fill) {
            fill.style.transition = 'clip-path 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
            fill.style.clipPath = 'inset(0 0 0 0)';
          }
          observer.unobserve(item);
        }
      });
    }, { threshold: 0.2 });

    items.forEach(item => {
      const fill = item.querySelector('.gallery-color-fill:not(.gallery-color-fill--fallback)');
      if (fill) {
        fill.style.clipPath = 'inset(0 100% 0 0)';
      }
      observer.observe(item);
    });
  }

  // ============================================
  // Palette swatch interaction
  // ============================================

  function initPaletteInteraction() {
    const swatches = document.querySelectorAll('.palette-swatch');
    swatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        swatch.style.transform = 'scaleY(1.1)';
        setTimeout(() => { swatch.style.transform = ''; }, 200);
      });
    });
  }

  // ============================================
  // Scroll performance (throttled via rAF)
  // ============================================

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleNavScroll();
        handleParallax();
        handleSectionTransitions();
        updateActiveNavLink();
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
    initLatticeGrid();
    initBookingForm();
    initGalleryReveal();
    initPaletteInteraction();

    window.addEventListener('scroll', onScroll, { passive: true });

    // Set initial state
    handleNavScroll();
    handleParallax();
    updateActiveNavLink();

    // Trigger hero animations after preloader
    setTimeout(() => {
      document.querySelectorAll('.hero .reveal').forEach(el => {
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
