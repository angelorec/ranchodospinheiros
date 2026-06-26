/* ============================================================
   AGROPECUÁRIA RANCHO DOS PINHEIROS — Interactive Script
   Navbar, Parallax, Particles, Scroll Animations, Lightbox
   ============================================================ */

(function () {
  'use strict';

  // ---------- DOM References ----------
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const heroImg = document.getElementById('hero-bg-img');
  const particlesCanvas = document.getElementById('heroParticles');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  // ---------- Navbar: Scroll Effect ----------
  let lastScrollY = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ---------- Navbar: Mobile Toggle ----------
  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ---------- Navbar: Active Link Highlight ----------
  const sections = document.querySelectorAll('section[id]');

  function highlightActiveLink() {
    const scrollY = window.scrollY + 150;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const navLink = navLinks.querySelector('a[href="#' + sectionId + '"]');

      if (navLink) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  }

  window.addEventListener('scroll', highlightActiveLink, { passive: true });

  // ---------- Hero: Parallax ----------
  function handleParallax() {
    if (!heroImg || window.innerWidth < 768) return;
    const scrollY = window.scrollY;
    const speed = 0.3;
    heroImg.style.transform = 'scale(1.1) translateY(' + (scrollY * speed) + 'px)';
  }

  window.addEventListener('scroll', handleParallax, { passive: true });

  // ---------- Hero: Golden Particles (Canvas) ----------
  function initParticles() {
    if (!particlesCanvas) return;

    const ctx = particlesCanvas.getContext('2d');
    let width, height;
    const particles = [];
    const PARTICLE_COUNT = 40;

    function resize() {
      width = particlesCanvas.parentElement.offsetWidth;
      height = particlesCanvas.parentElement.offsetHeight;
      particlesCanvas.width = width;
      particlesCanvas.height = height;
    }

    resize();
    window.addEventListener('resize', resize);

    function Particle() {
      this.reset();
    }

    Particle.prototype.reset = function () {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 100;
      this.size = Math.random() * 3 + 1;
      this.speedY = -(Math.random() * 0.8 + 0.2);
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.fadeSpeed = Math.random() * 0.003 + 0.001;
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
    };

    Particle.prototype.update = function () {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life++;

      // Fade in/out
      if (this.life < 50) {
        this.opacity = (this.life / 50) * (Math.random() * 0.5 + 0.3);
      } else if (this.life > this.maxLife - 50) {
        this.opacity *= 0.97;
      }

      if (this.life > this.maxLife || this.y < -20 || this.opacity < 0.01) {
        this.reset();
      }
    };

    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(245, 197, 24, ' + this.opacity + ')';
      ctx.fill();

      // Glow effect
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(212, 160, 23, ' + (this.opacity * 0.15) + ')';
      ctx.fill();
    };

    // Initialize particles
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      var p = new Particle();
      p.y = Math.random() * height; // Start scattered
      p.life = Math.random() * 200;
      particles.push(p);
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(function (p) {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  initParticles();

  // ---------- Scroll Reveal Animations ----------
  function initScrollReveal() {
    var revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    if (!('IntersectionObserver' in window)) {
      // Fallback: show all
      revealElements.forEach(function (el) { el.classList.add('revealed'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  initScrollReveal();

  // ---------- Lightbox (Gallery) ----------
  var galeriaItems = document.querySelectorAll('.galeria-item[data-img]');

  galeriaItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var imgSrc = this.getAttribute('data-img');
      lightboxImg.src = imgSrc;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(function () { lightboxImg.src = ''; }, 300);
  }

  // ---------- Smooth Scroll for anchor links ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---------- Counter Animation (Stats) ----------
  function animateCounters() {
    var statNumbers = document.querySelectorAll('.stat-number');

    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var finalText = el.textContent.trim();
          var numericPart = parseFloat(finalText.replace(/[^\d.,]/g, '').replace(',', '.'));
          var suffix = finalText.replace(/[\d.,]/g, '');
          var isDecimal = finalText.indexOf('.') !== -1 || finalText.indexOf(',') !== -1;
          var hasPlus = finalText.indexOf('+') !== -1;
          suffix = suffix.replace('+', '');

          if (isNaN(numericPart)) {
            observer.unobserve(el);
            return;
          }

          var duration = 1500;
          var startTime = null;

          function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            var current = numericPart * eased;

            if (numericPart === 100) {
              el.textContent = Math.floor(current) + '%';
            } else if (isDecimal) {
              el.textContent = current.toFixed(1).replace('.', ',') + (hasPlus ? '+' : '') + suffix;
            } else {
              el.textContent = Math.floor(current).toLocaleString('pt-BR') + (hasPlus ? '+' : '') + suffix;
            }

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              el.textContent = finalText;
            }
          }

          el.textContent = isDecimal ? '0,0' : '0';
          requestAnimationFrame(step);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(function (el) {
      observer.observe(el);
    });
  }

  animateCounters();

  // ---------- Init: run scroll handlers once ----------
  handleNavScroll();
  highlightActiveLink();

})();
