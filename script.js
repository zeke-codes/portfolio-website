const scrollProgress = document.querySelector('.scroll-progress');
const navLinks = document.querySelectorAll('nav a[href^="#"]');
const sections = document.querySelectorAll('main section[id]');
const fadeElements = document.querySelectorAll('.fade-in');
const root = document.documentElement;

function updatePointerGlow(event) {
  const x = (event.clientX / window.innerWidth) * 100;
  const y = (event.clientY / window.innerHeight) * 100;
  root.style.setProperty('--pointer-x', `${x}%`);
  root.style.setProperty('--pointer-y', `${y}%`);
}

window.addEventListener('pointermove', updatePointerGlow, { passive: true });
window.addEventListener('pointerleave', () => {
  root.style.setProperty('--pointer-x', '50%');
  root.style.setProperty('--pointer-y', '50%');
}, { passive: true });

function updateProgress() {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
  if (scrollProgress) {
    scrollProgress.style.width = `${Math.min(100, Math.max(0, scrolled))}%`;
  }
}

function setActiveLink(id) {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('active', isActive);
  });
}

window.addEventListener('scroll', () => {
  updateProgress();
}, { passive: true });

if (sections.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  }, {
    rootMargin: '-40% 0px -45% 0px',
    threshold: 0
  });

  sections.forEach((section) => observer.observe(section));
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') {
      return;
    }

    const target = document.querySelector(targetId);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

if (fadeElements.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 70);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.16,
    rootMargin: '0px 0px -40px 0px'
  });

  fadeElements.forEach((element) => revealObserver.observe(element));
}

updateProgress();
