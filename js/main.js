// Nav scroll shadow
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
});

// Mobile menu toggle
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
toggle.addEventListener('click', () => {
  toggle.classList.toggle('open');
  links.classList.toggle('open');
});

// Close mobile menu on link click
links.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    toggle.classList.remove('open');
    links.classList.remove('open');
  });
});

// Active nav highlight on scroll
const sections = document.querySelectorAll('.section, #hero');
const navAnchors = links.querySelectorAll('a');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => navObserver.observe(s));

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// Parallax hero on scroll
const heroInner = document.querySelector('.hero-inner');
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroInner.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroInner.style.opacity = 1 - scrolled / (window.innerHeight * 0.8);
      }
      ticking = false;
    });
    ticking = true;
  }
});

// Modal
const modal = document.getElementById('modal');
const modalImg = modal.querySelector('.modal-img');
const modalVideo = modal.querySelector('.modal-video');
const modalTitle = modal.querySelector('.modal-title');
const modalDesc = modal.querySelector('.modal-desc');
const modalCounter = modal.querySelector('.modal-counter');
const modalPrev = modal.querySelector('.modal-prev');
const modalNext = modal.querySelector('.modal-next');

let mediaList = [];
let mediaIndex = 0;

function showMedia(index) {
  const item = mediaList[index];
  if (item.type === 'video') {
    modalImg.style.display = 'none';
    modalImg.removeAttribute('src');
    modalVideo.style.display = 'block';
    modalVideo.src = item.src;
    modalVideo.load();
    modalVideo.play().catch(() => {});
  } else {
    modalVideo.style.display = 'none';
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.load();
    modalImg.style.display = '';
    modalImg.src = item.src;
    modalImg.alt = modalTitle.textContent;
  }
  modalCounter.textContent = mediaList.length > 1 ? `${index + 1} / ${mediaList.length}` : '';
  modalPrev.style.display = mediaList.length > 1 ? '' : 'none';
  modalNext.style.display = mediaList.length > 1 ? '' : 'none';
  modalPrev.disabled = index === 0;
  modalNext.disabled = index === mediaList.length - 1;
}

function openModal(card) {
  mediaList = JSON.parse(card.dataset.media || '[]');
  if (mediaList.length === 0) return;
  mediaIndex = 0;
  modalTitle.textContent = card.dataset.title;
  modalDesc.textContent = card.dataset.desc || '';
  showMedia(0);
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  modalVideo.pause();
  modalVideo.removeAttribute('src');
  modalImg.removeAttribute('src');
}

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => openModal(card));
});

modal.querySelector('.modal-close').addEventListener('click', closeModal);

modal.addEventListener('click', e => {
  if (e.target === modal || e.target.classList.contains('modal-viewer')) closeModal();
});

modalPrev.addEventListener('click', e => {
  e.stopPropagation();
  if (mediaIndex > 0) { mediaIndex--; showMedia(mediaIndex); }
});

modalNext.addEventListener('click', e => {
  e.stopPropagation();
  if (mediaIndex < mediaList.length - 1) { mediaIndex++; showMedia(mediaIndex); }
});

document.addEventListener('keydown', e => {
  if (!modal.classList.contains('open')) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowLeft' && mediaIndex > 0) { mediaIndex--; showMedia(mediaIndex); }
  if (e.key === 'ArrowRight' && mediaIndex < mediaList.length - 1) { mediaIndex++; showMedia(mediaIndex); }
});
