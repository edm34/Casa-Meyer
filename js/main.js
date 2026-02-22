/* ============================================
   CASA MEYER — Main JavaScript
   Parallax scrolling, interactions, booking
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

  // Fallback in case load event already fired
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

  // Scroll behavior for nav
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

  // Mobile nav toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('is-active');
    navLinks.classList.toggle('is-open');
    document.body.style.overflow = navLinks.classList.contains('is-open') ? 'hidden' : '';
  });

  // Close mobile nav on link click
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

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
  }

  // ============================================
  // Parallax System
  // ============================================

  const heroBlocks = document.querySelectorAll('.hero-block');
  const heroLattice = document.querySelector('.hero-lattice');
  const friendshipBg = document.querySelector('.friendship-bg');
  const storyParallaxImages = document.querySelectorAll('[data-parallax-speed]');

  function handleParallax() {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;

    // Hero parallax - color blocks and lattice move at different speeds
    const heroHeight = viewportHeight;
    if (scrollY < heroHeight * 1.5) {
      heroBlocks.forEach((block, i) => {
        const speed = (i + 1) * 0.15;
        const y = scrollY * speed;
        block.style.transform = `translateY(${y}px)`;
      });

      if (heroLattice) {
        heroLattice.style.transform = `translateY(${scrollY * 0.08}px)`;
      }
    }

    // Friendship section - portrait background parallax
    if (friendshipBg) {
      const friendshipSection = friendshipBg.closest('.friendship');
      if (friendshipSection) {
        const rect = friendshipSection.getBoundingClientRect();
        if (rect.top < viewportHeight && rect.bottom > 0) {
          const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
          const offset = (progress - 0.5) * 100;
          friendshipBg.style.transform = `translateY(${offset}px)`;
        }
      }
    }

    // Generic parallax elements (story image, etc.)
    storyParallaxImages.forEach(el => {
      const rect = el.parentElement.getBoundingClientRect();
      if (rect.top < viewportHeight && rect.bottom > 0) {
        const speed = parseFloat(el.dataset.parallaxSpeed) || 0.1;
        const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
        const offset = (progress - 0.5) * 80 * speed;
        el.style.transform = `translateY(${offset}px)`;
      }
    });

    // Visit section background blocks
    const visitBlocks = document.querySelectorAll('.visit-bg-block');
    visitBlocks.forEach((block, i) => {
      const rect = block.parentElement.getBoundingClientRect();
      if (rect.top < viewportHeight && rect.bottom > 0) {
        const speed = (i + 1) * 0.03;
        const offset = rect.top * speed;
        block.style.transform = `translateY(${offset}px)`;
      }
    });
  }

  // ============================================
  // Interactive Lattice Grid
  // ============================================

  function initLatticeGrid() {
    const grid = document.getElementById('latticeGrid');
    if (!grid) return;

    const totalCells = 64; // 8x8 grid

    for (let i = 0; i < totalCells; i++) {
      const cell = document.createElement('div');
      cell.className = 'lattice-cell';
      cell.dataset.index = i;
      grid.appendChild(cell);
    }

    // Animate cells on hover proximity
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

    // Auto-animate lattice when in view
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
          cells.forEach(cell => {
            cell.style.opacity = '';
          });
        }
      });
    }, { threshold: 0.2 });

    latticeObserver.observe(grid);

    // Override wave animation on mouse interaction
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

    // Set minimum date to today
    const tourDateInput = document.getElementById('tourDate');
    if (tourDateInput) {
      const today = new Date().toISOString().split('T')[0];
      tourDateInput.setAttribute('min', today);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Collect form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      // In a real application, this would send to a backend
      console.log('Booking submission:', data);

      // Show confirmation modal
      modal.classList.add('is-visible');
      document.body.style.overflow = 'hidden';

      // Reset form
      form.reset();
    });

    // Close modal
    if (modalClose) {
      modalClose.addEventListener('click', () => {
        modal.classList.remove('is-visible');
        document.body.style.overflow = '';
      });
    }

    // Close modal on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('is-visible');
        document.body.style.overflow = '';
      }
    });

    // Close modal on Escape key
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
            // Animate the color fill with a clip-path reveal
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
        // Brief flash effect
        swatch.style.transform = 'scaleY(1.1)';
        setTimeout(() => {
          swatch.style.transform = '';
        }, 200);
      });
    });
  }

  // ============================================
  // Scroll performance (throttled)
  // ============================================

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleNavScroll();
        handleParallax();
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

    // Trigger initial state
    handleNavScroll();
    updateActiveNavLink();

    // Trigger hero animations on load
    setTimeout(() => {
      document.querySelectorAll('.hero .reveal').forEach(el => {
        el.classList.add('is-visible');
      });
    }, 1400); // After preloader
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
