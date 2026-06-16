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
const mjGallery = document.getElementById('mj-gallery');

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
  document.body.style.overflow = mjGallery.classList.contains('open') ? 'hidden' : '';
  modalVideo.pause();
  modalVideo.removeAttribute('src');
  modalImg.removeAttribute('src');
}

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    if (card.dataset.gallery) return;
    openModal(card);
  });
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
  if (modal.classList.contains('open')) {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft' && mediaIndex > 0) { mediaIndex--; showMedia(mediaIndex); }
    if (e.key === 'ArrowRight' && mediaList.length && mediaIndex < mediaList.length - 1) { mediaIndex++; showMedia(mediaIndex); }
    return;
  }
  if (mjGallery.classList.contains('open')) {
    if (e.key === 'Escape') {
      if (currentCollection) closeCollection();
      else closeMjGallery();
    }
  }
});

// ===== MJ Gallery =====
const mjCollections = mjGallery.querySelector('.mj-collections');
const mjDetail = mjGallery.querySelector('.mj-detail');
const mjDetailBack = mjDetail.querySelector('.mj-detail-back');
const mjDetailTitle = mjDetail.querySelector('.mj-detail-title');
const mjDetailGrid = mjDetail.querySelector('.mj-detail-grid');
const collectionCards = mjGallery.querySelectorAll('.mj-collection-card');

const collections = {
  menghe: {
    title: '梦核宝丽莱',
    images: [
      { type: 'image', src: 'assets/mj/梦核1.png' },
      { type: 'image', src: 'assets/mj/梦核2.png' },
      { type: 'image', src: 'assets/mj/梦核3.png' },
      { type: 'image', src: 'assets/mj/宝丽莱1.png' },
      { type: 'image', src: 'assets/mj/宝丽莱2.png' },
      { type: 'image', src: 'assets/mj/宝丽莱3.png' }
    ]
  },
  shuiguang: {
    title: '水光入夏',
    images: [
      { type: 'image', src: 'assets/mj/水光1.png' },
      { type: 'image', src: 'assets/mj/水光2.png' },
      { type: 'image', src: 'assets/mj/水光3.png' },
      { type: 'image', src: 'assets/mj/水光4.png' },
      { type: 'image', src: 'assets/mj/水光5.png' },
      { type: 'image', src: 'assets/mj/水光6.png' }
    ]
  }
};

let currentCollection = null;

function openMjGallery() {
  mjGallery.classList.add('open');
  mjGallery.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  mjCollections.classList.remove('hidden');
  mjDetail.classList.remove('active');
  currentCollection = null;

  // 触发旋转进入动画
  collectionCards.forEach(card => {
    card.classList.remove('animate-in');
    void card.offsetWidth;
    card.classList.add('animate-in');
  });
}

function closeMjGallery() {
  mjGallery.classList.remove('open');
  mjGallery.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  collectionCards.forEach(card => card.classList.remove('animate-in'));
  currentCollection = null;
}

function openCollection(key) {
  const col = collections[key];
  if (!col) return;
  currentCollection = key;

  // 切换视图：合集 → 详情
  mjCollections.classList.add('hidden');
  mjDetail.classList.add('active');
  mjDetailTitle.textContent = col.title;

  // 生成缩略图
  mjDetailGrid.innerHTML = '';
  col.images.forEach((img, i) => {
    const thumb = document.createElement('div');
    thumb.className = 'mj-thumb';
    const imgEl = document.createElement('img');
    imgEl.src = img.src;
    imgEl.alt = col.title + ' ' + (i + 1);
    imgEl.loading = 'lazy';
    thumb.appendChild(imgEl);

    thumb.addEventListener('click', () => {
      mediaList = col.images;
      mediaIndex = i;
      modalTitle.textContent = col.title;
      modalDesc.textContent = '';
      showMedia(i);
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    });

    mjDetailGrid.appendChild(thumb);
  });
}

function closeCollection() {
  mjDetail.classList.remove('active');
  mjCollections.classList.remove('hidden');
  currentCollection = null;

  // 重新触发旋转进入
  collectionCards.forEach(card => {
    card.classList.remove('animate-in');
    void card.offsetWidth;
    card.classList.add('animate-in');
  });
}

// "其他的部分"卡片点击
document.querySelectorAll('.card[data-gallery="mj"]').forEach(card => {
  card.addEventListener('click', () => openMjGallery());
});

// 合集卡片点击
collectionCards.forEach(card => {
  card.addEventListener('click', () => openCollection(card.dataset.collection));
});

mjDetailBack.addEventListener('click', closeCollection);

mjGallery.querySelector('.mj-gallery-close').addEventListener('click', closeMjGallery);

mjGallery.addEventListener('click', e => {
  if (e.target === mjGallery) closeMjGallery();
});
