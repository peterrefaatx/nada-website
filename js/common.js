document.addEventListener('DOMContentLoaded', () => {

  /* ─── Elegant Particle System ─── */
  const container = document.getElementById('particles-container');
  if (container) {
    // Rose-gold / champagne circles
    const colors = [
      'rgba(232, 135, 155, 0.15)',
      'rgba(242, 165, 181, 0.12)',
      'rgba(212, 169, 106, 0.12)',
      'rgba(240, 223, 192, 0.18)',
      'rgba(201, 168, 76, 0.08)'
    ];

    for (let i = 0; i < 18; i++) {
      const dot = document.createElement('div');
      dot.className = 'particle';
      const size = Math.random() * 12 + 5;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.background = colors[Math.floor(Math.random() * colors.length)];
      dot.style.left = `${Math.random() * 100}vw`;
      dot.style.animationDuration = `${Math.random() * 18 + 14}s`;
      dot.style.animationDelay = `${Math.random() * 12}s`;
      container.appendChild(dot);
    }

    // Sparkle dots
    for (let i = 0; i < 12; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle-dot';
      sparkle.style.left = `${Math.random() * 100}vw`;
      sparkle.style.top = `${Math.random() * 100}vh`;
      sparkle.style.animationDelay = `${Math.random() * 4}s`;
      sparkle.style.animationDuration = `${Math.random() * 2 + 2.5}s`;
      container.appendChild(sparkle);
    }
  }

  /* ─── Header Scroll Effect ─── */
  const header = document.querySelector('header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ─── Scroll-Triggered Fade-In ─── */
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length > 0) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.02,
      rootMargin: '0px 0px -10px 0px'
    });

    fadeEls.forEach(el => fadeObserver.observe(el));
  }

  /* ─── Active Nav Link on Scroll ─── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (sections.length > 0 && navLinks.length > 0) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, {
      rootMargin: '-25% 0px -55% 0px',
      threshold: 0
    });

    sections.forEach(sec => navObserver.observe(sec));
  }
});
