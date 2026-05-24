/* ─────────────────────────────────────
   PORTFOLIO JAVASCRIPT
   1. Navbar background on scroll
   2. Active nav link on scroll
   3. Smooth scroll
   4. Fade-in on scroll
   5. Form feedback
───────────────────────────────────────*/

/* ── 1. NAVBAR BACKGROUND ON SCROLL ── */
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.style.background = 'rgba(0, 0, 0, 0.92)';
    nav.style.backdropFilter = 'blur(20px)';
    nav.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
    nav.classList.add('nav-scrolled');
  } else {
    nav.style.background = 'transparent';
    nav.style.backdropFilter = 'none';
    nav.style.borderBottom = 'none';
  }
});


/* ── 2. ACTIVE NAV LINK ON SCROLL ── */
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const observerOptions = {
  root: null,
  rootMargin: '-40% 0px -55% 0px', /* triggers when section is in the middle of the screen */
  threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('nav-active');
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.classList.add('nav-active');
        }
      });
    }
  });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));


/* ── 3. SMOOTH SCROLL ── */
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* smooth scroll for any other anchor links on the page */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ── 4. FADE-IN ON SCROLL ── */
const fadeElements = document.querySelectorAll(
  'section > div, .project-card, .service-card, .blog-card'
);

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      /* stagger each element slightly so they don't all appear at once */
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 80);
      fadeObserver.unobserve(entry.target); /* stop watching once visible */
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

fadeElements.forEach(el => {
  el.classList.add('fade-in');
  fadeObserver.observe(el);
});


/* ── 5. CONTACT FORM FEEDBACK ── */
const form = document.querySelector('.contact-form');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('.form-submit');
    const originalText = btn.innerHTML;

    /* loading state */
    btn.innerHTML = 'Sending...';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        /* success */
        btn.innerHTML = '✓ Message sent!';
        btn.style.opacity = '1';
        btn.style.background = '#00e87a';
        form.reset();

        /* reset button after 4 seconds */
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
          btn.style.background = '';
        }, 4000);

      } else {
        throw new Error('Failed');
      }

    } catch {
      /* error */
      btn.innerHTML = 'Something went wrong — try emailing directly';
      btn.style.background = 'rgba(255,80,80,0.15)';
      btn.style.color = '#ff5050';
      btn.style.opacity = '1';
      btn.disabled = false;

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.style.color = '';
      }, 5000);
    }
  });
}