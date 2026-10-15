/**
 * VEDANT NAWGHARE — PREMIUM 3D DEVELOPER PORTFOLIO
 * Vanilla JavaScript (ES6+) — Zero External Dependencies
 * Modules: 3D Tilt, Spatial Canvas, Waveform, ECG, Terminal, Filtering, Modal
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------------------------------------------------------------
     1. DYNAMIC IST CLOCK & RUNTIME
     -------------------------------------------------------------------------- */
  function updateISTClock() {
    const navClock = document.getElementById('ist-time-nav');
    const heroClock = document.getElementById('hero-clock');
    const yearElem = document.getElementById('current-year');

    const now = new Date();
    // Format to Indian Standard Time (Asia/Kolkata)
    const options = {
      timeZone: 'Asia/Kolkata',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };

    const istString = now.toLocaleTimeString('en-US', options) + ' IST';

    if (navClock) navClock.textContent = istString;
    if (heroClock) heroClock.textContent = istString;
    if (yearElem) yearElem.textContent = now.getFullYear();
  }

  updateISTClock();
  setInterval(updateISTClock, 1000);

  /* --------------------------------------------------------------------------
     2. STICKY HEADER & ACTIVE SECTION HIGHLIGHT
     -------------------------------------------------------------------------- */
  const header = document.getElementById('site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll Spy for nav links
    let currentSection = '';
    const scrollPos = window.scrollY + 160;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  /* --------------------------------------------------------------------------
     3. MOBILE NAVIGATION DRAWER
     -------------------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isOpen);
      mobileToggle.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      mobileMenu.setAttribute('aria-hidden', isOpen);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });
  }

  /* --------------------------------------------------------------------------
     4. CUSTOM CURSOR & GLOW FOLLOWER (DESKTOP)
     -------------------------------------------------------------------------- */
  const cursorGlow = document.getElementById('cursor-glow');
  const cursorDot = document.getElementById('cursor-dot');

  if (cursorGlow && cursorDot && window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion) {
    let mouseX = -100;
    let mouseY = -100;
    let glowX = -100;
    let glowY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }, { passive: true });

    function renderCursor() {
      // Smooth lerp for glow halo
      glowX += (mouseX - glowX) * 0.12;
      glowY += (mouseY - glowY) * 0.12;
      cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);
  }

  /* --------------------------------------------------------------------------
     5. AMBIENT SPATIAL CANVAS (HTML5 CANVAS 2D)
     -------------------------------------------------------------------------- */
  const ambientCanvas = document.getElementById('ambient-canvas');
  if (ambientCanvas && !prefersReducedMotion) {
    const ctx = ambientCanvas.getContext('2d');
    let width = (ambientCanvas.width = window.innerWidth);
    let height = (ambientCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = ambientCanvas.width = window.innerWidth;
      height = ambientCanvas.height = window.innerHeight;
    }, { passive: true });

    const particles = [];
    const count = Math.min(Math.floor(window.innerWidth / 24), 50);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 0.8,
        color: Math.random() > 0.4 ? 'rgba(187, 244, 74, 0.4)' : 'rgba(34, 211, 238, 0.4)'
      });
    }

    let animId;
    function animateParticles() {
      if (document.hidden) {
        animId = requestAnimationFrame(animateParticles);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Draw faint connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0) p1.x = width;
        if (p1.x > width) p1.x = 0;
        if (p1.y < 0) p1.y = height;
        if (p1.y > height) p1.y = 0;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(187, 244, 74, ${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* --------------------------------------------------------------------------
     6. HERO 3D NEURAL CORE POINTER PARALLAX
     -------------------------------------------------------------------------- */
  const heroVisual = document.querySelector('.hero-visual');
  const coreRig = document.getElementById('core-rig');

  if (heroVisual && coreRig && !prefersReducedMotion && window.matchMedia('(min-width: 1024px)').matches) {
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let isHovering = false;

    heroVisual.addEventListener('mousemove', (e) => {
      isHovering = true;
      const rect = heroVisual.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      targetRotY = (x / (rect.width / 2)) * 18; // Max 18 deg
      targetRotX = -(y / (rect.height / 2)) * 18;
    }, { passive: true });

    heroVisual.addEventListener('mouseleave', () => {
      isHovering = false;
      targetRotX = 0;
      targetRotY = 0;
    });

    function updateCoreTilt() {
      currentRotX += (targetRotX - currentRotX) * 0.08;
      currentRotY += (targetRotY - currentRotY) * 0.08;

      coreRig.style.transform = `rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
      requestAnimationFrame(updateCoreTilt);
    }
    updateCoreTilt();
  }

  /* --------------------------------------------------------------------------
     7. CARD 3D TILT EFFECT (VANILLA JAVASCRIPT)
     -------------------------------------------------------------------------- */
  const tiltCards = document.querySelectorAll('[data-tilt]');

  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6; // subtle tilt
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

  /* --------------------------------------------------------------------------
     8. AUDIO SPECTROGRAM & WAVEFORM SIMULATOR CANVAS
     -------------------------------------------------------------------------- */
  const waveCanvas = document.getElementById('waveform-canvas');
  if (waveCanvas && !prefersReducedMotion) {
    const wCtx = waveCanvas.getContext('2d');
    let wWidth = (waveCanvas.width = waveCanvas.offsetWidth || 300);
    let wHeight = (waveCanvas.height = waveCanvas.offsetHeight || 100);

    let offset = 0;
    function drawWave() {
      if (document.hidden) {
        requestAnimationFrame(drawWave);
        return;
      }

      wCtx.clearRect(0, 0, wWidth, wHeight);

      // Draw background frequency grid
      wCtx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      wCtx.lineWidth = 1;
      for (let y = 15; y < wHeight; y += 20) {
        wCtx.beginPath();
        wCtx.moveTo(0, y);
        wCtx.lineTo(wWidth, y);
        wCtx.stroke();
      }

      // Draw synthetic waveform bars
      const bars = 45;
      const barWidth = wWidth / bars;

      for (let i = 0; i < bars; i++) {
        const sine = Math.sin(i * 0.25 + offset) * 0.5 + 0.5;
        const noise = Math.sin(i * 1.2 + offset * 1.5) * 0.3;
        const heightMultiplier = Math.max(0.1, Math.min(0.95, sine + noise));
        const barH = heightMultiplier * (wHeight * 0.7);

        const x = i * barWidth;
        const y = (wHeight - barH) / 2;

        // Gradient coloring: red for deepfake anomalies, lime for authentic ranges
        wCtx.fillStyle = (i > 24 && i < 35) ? 'rgba(239, 68, 68, 0.85)' : 'rgba(187, 244, 74, 0.75)';
        wCtx.fillRect(x + 1, y, barWidth - 2, barH);
      }

      offset += 0.04;
      requestAnimationFrame(drawWave);
    }
    drawWave();
  }

  /* --------------------------------------------------------------------------
     9. ECG HEARTBEAT MONITOR SIMULATOR CANVAS
     -------------------------------------------------------------------------- */
  const ecgCanvas = document.getElementById('ecg-canvas');
  if (ecgCanvas && !prefersReducedMotion) {
    const eCtx = ecgCanvas.getContext('2d');
    let eWidth = (ecgCanvas.width = ecgCanvas.offsetWidth || 300);
    let eHeight = (ecgCanvas.height = ecgCanvas.offsetHeight || 85);

    let step = 0;
    const points = [];

    function generateECGPoint(t) {
      const cycle = t % 120;
      const mid = eHeight / 2;

      // P wave
      if (cycle >= 20 && cycle < 32) {
        return mid - Math.sin((cycle - 20) / 12 * Math.PI) * 7;
      }
      // QRS Complex
      if (cycle >= 42 && cycle < 46) {
        return mid + 6; // Q
      }
      if (cycle >= 46 && cycle < 52) {
        return mid - Math.sin((cycle - 46) / 6 * Math.PI) * 32; // R peak
      }
      if (cycle >= 52 && cycle < 56) {
        return mid + 10; // S
      }
      // T wave
      if (cycle >= 68 && cycle < 85) {
        return mid - Math.sin((cycle - 68) / 17 * Math.PI) * 11;
      }
      // Baseline with tiny analog noise
      return mid + (Math.sin(t * 0.8) * 0.7);
    }

    function drawECG() {
      if (document.hidden) {
        requestAnimationFrame(drawECG);
        return;
      }

      points.push(generateECGPoint(step));
      if (points.length > eWidth) {
        points.shift();
      }

      eCtx.clearRect(0, 0, eWidth, eHeight);

      // Faint ECG grid
      eCtx.strokeStyle = 'rgba(34, 211, 238, 0.06)';
      eCtx.lineWidth = 1;
      for (let x = 0; x < eWidth; x += 20) {
        eCtx.beginPath();
        eCtx.moveTo(x, 0);
        eCtx.lineTo(x, eHeight);
        eCtx.stroke();
      }

      // Draw Trace
      eCtx.beginPath();
      eCtx.strokeStyle = '#22d3ee';
      eCtx.lineWidth = 1.8;
      eCtx.shadowColor = '#22d3ee';
      eCtx.shadowBlur = 8;

      for (let i = 0; i < points.length; i++) {
        if (i === 0) eCtx.moveTo(i, points[i]);
        else eCtx.lineTo(i, points[i]);
      }
      eCtx.stroke();
      eCtx.shadowBlur = 0;

      step += 1.4;
      requestAnimationFrame(drawECG);
    }
    drawECG();
  }

  /* --------------------------------------------------------------------------
     10. INTERACTIVE TERMINAL WIDGET
     -------------------------------------------------------------------------- */
  const terminalOutput = document.getElementById('terminal-output');
  const termButtons = document.querySelectorAll('.term-btn');

  const commandResponses = {
    whoami: 'Vedant Nawghare [AI/ML Engineer & Researcher, B.Tech CSE-DS, SIT Nagpur]',
    skills: '{\n  "core": ["Data Structures", "Ensemble Models", "Distributed Systems"],\n  "stack": ["Python", "FastAPI", "WebSockets", "Redis", "Docker", "Pytest"]\n}',
    patents: 'Indian Patent App No. 202521130742 A (Voice Deepfake)\nIndian Patent App No. 202621048319 A (Stacking Crop Price)',
    clear: ''
  };

  if (terminalOutput && termButtons.length > 0) {
    termButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');

        if (cmd === 'clear') {
          terminalOutput.innerHTML = `
            <div class="t-line"><span class="t-prompt">$</span> <span class="t-cmd">clear</span></div>
            <div class="t-line"><span class="t-prompt">$</span> <span class="t-cursor">_</span></div>
          `;
          return;
        }

        const res = commandResponses[cmd] || 'Command not found';
        const formattedRes = res.replace(/\n/g, '<br>');

        const cmdBlock = `
          <div class="t-line"><span class="t-prompt">$</span> <span class="t-cmd">${cmd}</span></div>
          <div class="t-res text-lime">${formattedRes}</div>
        `;

        // Insert before cursor line
        const cursorLine = terminalOutput.querySelector('.t-cursor')?.parentElement;
        if (cursorLine) {
          cursorLine.insertAdjacentHTML('beforebegin', cmdBlock);
        } else {
          terminalOutput.insertAdjacentHTML('beforeend', cmdBlock);
        }

        terminalOutput.scrollTop = terminalOutput.scrollHeight;
      });
    });
  }

  /* --------------------------------------------------------------------------
     11. PROJECT FILTERING SYSTEM
     -------------------------------------------------------------------------- */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filterVal = tab.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cats = card.getAttribute('data-category') || '';
        if (filterVal === 'all' || cats.includes(filterVal)) {
          card.style.display = 'block';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     12. REAL-TIME SKILLS SEARCH FILTER
     -------------------------------------------------------------------------- */
  const skillSearch = document.getElementById('skill-search');
  const skillTags = document.querySelectorAll('.skill-tag');
  const skillClusters = document.querySelectorAll('.skill-cluster-card');

  if (skillSearch) {
    skillSearch.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();

      skillTags.forEach(tag => {
        const name = tag.getAttribute('data-name') || tag.textContent.toLowerCase();
        if (name.includes(q)) {
          tag.style.opacity = '1';
          tag.style.background = q ? 'rgba(187, 244, 74, 0.25)' : '';
          tag.style.borderColor = q ? 'var(--accent-lime)' : '';
        } else {
          tag.style.opacity = '0.2';
          tag.style.background = '';
          tag.style.borderColor = '';
        }
      });

      // Hide clusters with zero matched skills
      skillClusters.forEach(cluster => {
        const visibleTags = cluster.querySelectorAll('.skill-tag[style*="opacity: 1"]');
        if (q && visibleTags.length === 0) {
          cluster.style.opacity = '0.35';
        } else {
          cluster.style.opacity = '1';
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     13. CLIPBOARD COPY & TOAST NOTIFICATION
     -------------------------------------------------------------------------- */
  const copyBtn = document.getElementById('copy-email-btn');
  const copyText = document.getElementById('copy-text');
  const toast = document.getElementById('toast');

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 3200);
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = 'vedant.nawghare35@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        if (copyText) copyText.textContent = 'Copied!';
        showToast('✔ Email address copied to clipboard');
        setTimeout(() => {
          if (copyText) copyText.textContent = 'Copy';
        }, 2500);
      } catch (err) {
        showToast('Direct: vedant.nawghare35@gmail.com');
      }
    });
  }

  /* --------------------------------------------------------------------------
     14. DIRECT MAIL DISPATCH FORM (PURE CLIENT-SIDE)
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const subjectInput = document.getElementById('form-subject');
      const messageInput = document.getElementById('form-message');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const subject = subjectInput.value.trim();
      const message = messageInput.value.trim();

      if (!name || !email || !subject || !message) {
        if (formFeedback) {
          formFeedback.textContent = 'Please fill out all required fields.';
          formFeedback.className = 'form-feedback text-red';
        }
        return;
      }

      // Encode mailto link
      const mailtoUrl = `mailto:vedant.nawghare35@gmail.com?subject=${encodeURIComponent(`[Portfolio Inquiry] ${subject}`)}&body=${encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`)}`;

      if (formFeedback) {
        formFeedback.textContent = 'Opening your email client to dispatch note...';
        formFeedback.className = 'form-feedback text-lime';
      }

      showToast('Opening default email client...');
      window.location.href = mailtoUrl;

      setTimeout(() => {
        contactForm.reset();
        if (formFeedback) formFeedback.textContent = 'Email dispatch client activated.';
      }, 1500);
    });
  }

  /* --------------------------------------------------------------------------
     15. LIGHTBOX & CERTIFICATE MODAL
     -------------------------------------------------------------------------- */
  const mediaModal = document.getElementById('media-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close-btn');
  const modalBackdrop = document.querySelector('.modal-backdrop');

  function openModal(title, contentHtml) {
    if (!mediaModal || !modalBody) return;
    modalTitle.textContent = title;
    modalBody.innerHTML = contentHtml;
    mediaModal.classList.add('open');
    mediaModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!mediaModal) return;
    mediaModal.classList.remove('open');
    mediaModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (modalBody) modalBody.innerHTML = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mediaModal?.classList.contains('open')) {
      closeModal();
    }
  });

  // Certificate Modal Buttons
  const certModalButtons = document.querySelectorAll('.cert-modal-btn');
  certModalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      const src = btn.getAttribute('data-src');
      const title = btn.getAttribute('data-title') || 'Certificate Verification';

      if (type === 'pdf') {
        openModal(title, `<iframe src="${src}#toolbar=0" title="${title}"></iframe>`);
      } else {
        openModal(title, `<img src="${src}" alt="${title}">`);
      }
    });
  });

  // Gallery Tiles Lightbox
  const galleryTiles = document.querySelectorAll('.gallery-tile');
  galleryTiles.forEach(tile => {
    tile.addEventListener('click', () => {
      const src = tile.getAttribute('data-lightbox');
      const caption = tile.getAttribute('data-caption') || 'Visual Capture';
      openModal(caption, `<img src="${src}" alt="${caption}">`);
    });
  });

  /* --------------------------------------------------------------------------
     16. INTERSECTION OBSERVER SCROLL REVEALS
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-item');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  console.log('Vedant Nawghare Portfolio initialised: Pure HTML5, CSS3, & Vanilla JS.');
});
