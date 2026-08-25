/* ═══════════════════════════════════════════════════════
   EMERO — Interactive Functionality
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHamburger();
  initScrollToTop();
  initScrollAnimations();
  initAppShowcase();
  initTimeline();
  initScenarioPlayer();
  initSmoothScrollLinks();
});

/* ── Navigation scroll effect ── */
function initNavigation() {
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  const onScroll = () => {
    const y = window.scrollY;
    if (y > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = y;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Hamburger menu ── */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ── Scroll to top ── */
function initScrollToTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Scroll animations (Intersection Observer) ── */
function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* ── App Showcase: Screen Switcher ── */
function initAppShowcase() {
  const tabs = document.querySelectorAll('.app-tab');
  const screens = document.querySelectorAll('.app-screen');

  if (!tabs.length || !screens.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const screenId = tab.getAttribute('data-screen');

      // Update tabs
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Update screens
      screens.forEach(s => s.classList.remove('active'));
      const targetScreen = document.getElementById(`panel-${screenId}`);
      if (targetScreen) {
        targetScreen.classList.add('active');
      }
    });

    // Keyboard navigation
    tab.addEventListener('keydown', (e) => {
      const tabArray = Array.from(tabs);
      const index = tabArray.indexOf(tab);
      let newIndex;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        newIndex = (index + 1) % tabArray.length;
        tabArray[newIndex].focus();
        tabArray[newIndex].click();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        newIndex = (index - 1 + tabArray.length) % tabArray.length;
        tabArray[newIndex].focus();
        tabArray[newIndex].click();
      }
    });
  });
}

/* ── Timeline Animation ── */
function initTimeline() {
  const items = document.querySelectorAll('.timeline__item');
  if (!items.length) return;

  // Auto-animate timeline when it scrolls into view
  const timelineSection = document.getElementById('timeline');
  if (!timelineSection) return;

  let timelineAnimated = false;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !timelineAnimated) {
            timelineAnimated = true;
            animateTimeline();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(timelineSection);
  }

  function animateTimeline() {
    const times = [0, 300, 800, 1500, 2500, 4500, 7000];

    items.forEach((item, i) => {
      setTimeout(() => {
        // Remove active from all
        items.forEach(it => it.classList.remove('active'));

        // Mark previous as past
        for (let j = 0; j < i; j++) {
          items[j].classList.add('past');
          items[j].classList.remove('active');
        }

        // Mark current as active
        item.classList.add('active');
        item.classList.remove('past');

        // Scroll into view smoothly
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, times[i]);
    });
  }

  // Allow clicking on timeline items
  items.forEach((item, index) => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      items.forEach(it => {
        it.classList.remove('active', 'past');
      });

      // Mark items before as past
      for (let j = 0; j < index; j++) {
        items[j].classList.add('past');
      }

      item.classList.add('active');
    });
  });
}

/* ── Scenario Map Player ── */
function initScenarioPlayer() {
  const playBtn = document.getElementById('playScenario');
  const ambulanceMarker = document.getElementById('ambulanceMarker');
  const timelineItems = document.querySelectorAll('.timeline__item');

  if (!playBtn || !ambulanceMarker) return;

  let isPlaying = false;

  playBtn.addEventListener('click', () => {
    if (isPlaying) return;
    isPlaying = true;
    playBtn.disabled = true;
    playBtn.innerHTML = `
      <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clip-rule="evenodd"/></svg>
      Playing...
    `;

    // Animate ambulance along route
    const routePoints = [
      { x: 412, y: 420 }, // Start - incident
      { x: 412, y: 400 },
      { x: 412, y: 300 },
      { x: 412, y: 200 },
      { x: 400, y: 200 },
      { x: 300, y: 200 },
      { x: 300, y: 150 },
      { x: 300, y: 112 },
      { x: 300, y: 100 },
      { x: 312, y: 100 },
      { x: 312, y: 50 },  // Hospital
    ];

    // Actually the ambulance goes FROM hospital TO incident
    // Reverse the route for the ambulance
    const ambulanceRoute = [...routePoints].reverse();

    const totalDuration = 7000; // 7 seconds total
    const stepDuration = totalDuration / (ambulanceRoute.length - 1);
    let currentStep = 0;

    // Reset timeline
    timelineItems.forEach(it => {
      it.classList.remove('active', 'past');
    });

    function moveAmbulance() {
      if (currentStep >= ambulanceRoute.length - 1) {
        isPlaying = false;
        playBtn.disabled = false;
        playBtn.innerHTML = `
          <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/></svg>
          Play Again
        `;
        return;
      }

      currentStep++;
      const point = ambulanceRoute[currentStep];
      ambulanceMarker.setAttribute('transform', `translate(${point.x}, ${point.y})`);

      // Update timeline based on ambulance position
      const progress = currentStep / (ambulanceRoute.length - 1);
      let activeIndex = 0;
      if (progress > 0.85) activeIndex = 6;
      else if (progress > 0.7) activeIndex = 5;
      else if (progress > 0.5) activeIndex = 4;
      else if (progress > 0.35) activeIndex = 3;
      else if (progress > 0.2) activeIndex = 2;
      else if (progress > 0.05) activeIndex = 1;
      else activeIndex = 0;

      timelineItems.forEach((it, i) => {
        it.classList.remove('active', 'past');
        if (i < activeIndex) it.classList.add('past');
        if (i === activeIndex) it.classList.add('active');
      });

      setTimeout(moveAmbulance, stepDuration);
    }

    moveAmbulance();
  });
}

/* ── Smooth scroll for anchor links ── */
function initSmoothScrollLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = document.getElementById('nav')?.offsetHeight || 72;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });
}
