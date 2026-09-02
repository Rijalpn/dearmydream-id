/**
 * GUESTBOOK / DREAM NOTES MODULE WITH FIREBASE FIRESTORE REALTIME SYNC
 * Project: dearmydream-id-2026
 * Supports live multi-device sync, likes, and Admin PIN deletion (/admin)
 */

import { 
  db, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  deleteDoc, 
  doc, 
  updateDoc, 
  increment,
  serverTimestamp 
} from './firebase-config.js';

import { isAdmin } from './admin.js';

const LOCAL_STORAGE_KEY = 'dearmydream_guestbook_local_cache';
const LIKES_KEY = 'dearmydream_guestbook_liked_ids';
const PAGE_SIZE = 3;

const WASHI_OPTIONS = ['', 'washi-yellow', 'washi-orange', 'washi-pink', 'washi-blue'];

let currentNotes = [];
let currentPage = 1;
let unsubscribeFirestore = null;

export function initGuestbook() {
  const feedContainer = document.getElementById('guestbook-feed');
  const triggerBtn = document.getElementById('btn-open-guestbook-modal');
  const modalBackdrop = document.getElementById('guestbook-modal');
  const closeModalBtn = document.getElementById('guestbook-modal-close');
  const form = document.getElementById('guestbook-form');

  if (!feedContainer) return;

  // Load initial local cache while waiting for Firestore
  currentNotes = getLocalCache();
  renderNotes(currentNotes);
  updateCounter(currentNotes.length);

  // Connect to Firestore Realtime
  connectFirestore();

  // Setup modal open
  if (triggerBtn && modalBackdrop) {
    triggerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openGuestbookModal();
    });
  }

  // Setup modal close
  if (closeModalBtn && modalBackdrop) {
    closeModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeGuestbookModal();
    });
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeGuestbookModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
        closeGuestbookModal();
      }
    });
  }

  // Setup Form Submission
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
}

export function refreshGuestbookView() {
  renderNotes(currentNotes);
}

function connectFirestore() {
  try {
    const notesRef = collection(db, 'guestbook');
    const q = query(notesRef, orderBy('createdAt', 'desc'));

    unsubscribeFirestore = onSnapshot(q, (snapshot) => {
      const fetchedNotes = [];
      snapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        fetchedNotes.push({
          id: docSnapshot.id,
          author: data.author || 'Anonim',
          message: data.message || '',
          likes: typeof data.likes === 'number' ? data.likes : 0,
          washiClass: data.washiClass || '',
          timeAgo: formatTimestamp(data.createdAt),
          createdAtMs: data.createdAt ? data.createdAt.toMillis() : Date.now()
        });
      });

      currentNotes = fetchedNotes;
      saveLocalCache(currentNotes);
      renderNotes(currentNotes);
      updateCounter(currentNotes.length);
    }, (error) => {
      console.warn('Firestore realtime notice (using local cache mode):', error.message);
      // Seamlessly keep running on local cache
      currentNotes = getLocalCache();
      renderNotes(currentNotes);
      updateCounter(currentNotes.length);
    });
  } catch (err) {
    console.warn('Firestore init fallback to local cache:', err);
  }
}

function getLocalCache() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalCache(notes) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {}
}

function getLikedMap() {
  try {
    const raw = localStorage.getItem(LIKES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveLikedMap(likedMap) {
  try {
    localStorage.setItem(LIKES_KEY, JSON.stringify(likedMap));
  } catch (e) {}
}

function renderNotes(notes) {
  const feed = document.getElementById('guestbook-feed');
  if (!feed) return;

  if (notes.length === 0) {
    feed.innerHTML = `
      <div class="empty-guestbook-box">
        <div class="empty-guestbook-icon">💌</div>
        <div class="empty-guestbook-title">Belum ada Dream Note yang ditulis</div>
        <div class="empty-guestbook-sub">Jadilah yang pertama menuliskan cerita manismu di sini! ✨</div>
      </div>
    `;
    return;
  }

  const totalPages = Math.ceil(notes.length / PAGE_SIZE) || 1;
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleNotes = notes.slice(startIndex, startIndex + PAGE_SIZE);
  const likedMap = getLikedMap();
  const adminActive = isAdmin();

  const cardsHtml = visibleNotes.map(note => {
    const isLiked = !!likedMap[note.id];

    return `
      <article class="memo-note-card" id="note-card-${note.id}">
        <div class="note-washi ${note.washiClass || ''}" aria-hidden="true"></div>

        <div>
          <div class="note-author-row">
            <div class="note-avatar-circle">
              <span>✍️</span>
            </div>
            <div class="note-author-meta">
              <div class="note-author-name">${escapeHtml(note.author)}</div>
              <div class="note-time-text">${escapeHtml(note.timeAgo || 'Baru saja')}</div>
            </div>
          </div>

          <p class="note-message-body">"${escapeHtml(note.message)}"</p>
        </div>

        <div class="note-footer-row">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span class="note-stamp-tag">💌 Dream Note</span>
            ${adminActive ? `
              <button type="button" class="btn-note-delete" data-note-id="${note.id}" data-author="${escapeHtml(note.author)}" title="Hapus pesan ini (Admin)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                <span>Hapus</span>
              </button>
            ` : ''}
          </div>
          
          <button type="button" class="btn-note-like ${isLiked ? 'liked' : ''}" 
                  data-note-id="${note.id}" 
                  aria-label="Sukai pesan dari ${escapeHtml(note.author)}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="${isLiked ? '#BE123C' : 'none'}" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span class="like-count">${note.likes || 0}</span>
          </button>
        </div>
      </article>
    `;
  }).join('');

  const paginationHtml = totalPages > 1 ? `
    <div class="guestbook-pagination">
      <button type="button" id="gb-prev-page" class="btn-page-nav" ${currentPage === 1 ? 'disabled' : ''} aria-label="Halaman sebelumnya">
        <span>‹</span> <span>Sebelumnya</span>
      </button>
      <span class="pagination-page-indicator">${currentPage} / ${totalPages}</span>
      <button type="button" id="gb-next-page" class="btn-page-nav" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Halaman selanjutnya">
        <span>Selanjutnya</span> <span>›</span>
      </button>
    </div>
  ` : '';

  feed.innerHTML = `
    <div class="guestbook-vertical-list">
      ${cardsHtml}
    </div>
    ${paginationHtml}
  `;

  // Attach like button click listeners
  feed.querySelectorAll('.btn-note-like').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const noteId = btn.getAttribute('data-note-id');
      handleLikeClick(noteId, btn);
    });
  });

  // Attach Admin delete listeners
  feed.querySelectorAll('.btn-note-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const noteId = btn.getAttribute('data-note-id');
      const author = btn.getAttribute('data-author');
      handleDeleteClick(noteId, author);
    });
  });

  // Attach pagination listeners
  const prevPageBtn = document.getElementById('gb-prev-page');
  const nextPageBtn = document.getElementById('gb-next-page');

  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderNotes(currentNotes);
      }
    });
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderNotes(currentNotes);
      }
    });
  }
}

async function handleLikeClick(noteId, btnElement) {
  const likedMap = getLikedMap();
  const isAlreadyLiked = !!likedMap[noteId];

  if (isAlreadyLiked) {
    // Unlike locally
    delete likedMap[noteId];
    saveLikedMap(likedMap);
    btnElement.classList.remove('liked');
    
    // Decrement in Firestore
    try {
      const noteRef = doc(db, 'guestbook', noteId);
      await updateDoc(noteRef, { likes: increment(-1) });
    } catch (e) {
      // Local fallback
      const target = currentNotes.find(n => n.id === noteId);
      if (target) {
        target.likes = Math.max(0, (target.likes || 1) - 1);
        saveLocalCache(currentNotes);
        renderNotes(currentNotes);
      }
    }
  } else {
    // Like
    likedMap[noteId] = true;
    saveLikedMap(likedMap);
    btnElement.classList.add('liked');
    createHeartSparkle(btnElement);

    // Increment in Firestore
    try {
      const noteRef = doc(db, 'guestbook', noteId);
      await updateDoc(noteRef, { likes: increment(1) });
    } catch (e) {
      // Local fallback
      const target = currentNotes.find(n => n.id === noteId);
      if (target) {
        target.likes = (target.likes || 0) + 1;
        saveLocalCache(currentNotes);
        renderNotes(currentNotes);
      }
    }
  }
}

async function handleDeleteClick(noteId, author) {
  const confirmed = confirm(`Hapus pesan dari "${author}" secara permanen?`);
  if (!confirmed) return;

  try {
    // Delete from Firestore
    await deleteDoc(doc(db, 'guestbook', noteId));
    showToast('Pesan berhasil dihapus dari cloud! 🗑️✨');
  } catch (e) {
    console.warn('Firestore delete error, removing from local cache:', e);
    currentNotes = currentNotes.filter(n => n.id !== noteId);
    saveLocalCache(currentNotes);
    renderNotes(currentNotes);
    updateCounter(currentNotes.length);
    showToast('Pesan berhasil dihapus! 🗑️');
  }
}

function createHeartSparkle(element) {
  const rect = element.getBoundingClientRect();
  const heart = document.createElement('div');
  heart.textContent = '💚';
  heart.style.position = 'fixed';
  heart.style.left = `${rect.left + rect.width / 2}px`;
  heart.style.top = `${rect.top}px`;
  heart.style.fontSize = '16px';
  heart.style.pointerEvents = 'none';
  heart.style.zIndex = '9999';
  heart.style.transition = 'all 0.55s cubic-bezier(0.16, 1, 0.3, 1)';
  heart.style.transform = 'translate(-50%, 0) scale(1)';
  heart.style.opacity = '1';

  document.body.appendChild(heart);

  requestAnimationFrame(() => {
    heart.style.transform = 'translate(-50%, -40px) scale(1.35)';
    heart.style.opacity = '0';
  });

  setTimeout(() => heart.remove(), 550);
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const authorInput = document.getElementById('guestbook-name-input');
  const messageInput = document.getElementById('guestbook-message-input');

  const author = authorInput ? authorInput.value.trim() : '';
  const message = messageInput ? messageInput.value.trim() : '';

  if (!author || !message) {
    alert('Silakan masukkan nama/username dan isi pesanmu ya! 💚');
    return;
  }

  const randomWashi = WASHI_OPTIONS[Math.floor(Math.random() * WASHI_OPTIONS.length)];

  const newDoc = {
    author: author,
    message: message,
    likes: 1,
    washiClass: randomWashi,
    createdAt: serverTimestamp()
  };

  closeGuestbookModal();
  e.target.reset();

  try {
    // Send to Firestore
    await addDoc(collection(db, 'guestbook'), newDoc);
    showToast('Dream Note berhasil terkirim ke publik! 💚✨');
  } catch (err) {
    console.warn('Firestore addDoc error, saving locally:', err);
    // Local fallback
    const localNote = {
      id: `local-${Date.now()}`,
      author: author,
      message: message,
      likes: 1,
      washiClass: randomWashi,
      timeAgo: 'Baru saja',
      createdAtMs: Date.now()
    };
    currentNotes.unshift(localNote);
    saveLocalCache(currentNotes);
    currentPage = 1;
    renderNotes(currentNotes);
    updateCounter(currentNotes.length);
    showToast('Dream Note berhasil ditempel! 💚✨');
  }
}

function openGuestbookModal() {
  const modal = document.getElementById('guestbook-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    const firstInput = document.getElementById('guestbook-name-input');
    if (firstInput) setTimeout(() => firstInput.focus(), 150);
  }
}

function closeGuestbookModal() {
  const modal = document.getElementById('guestbook-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function updateCounter(count) {
  const counterElem = document.getElementById('guestbook-total-counter');
  if (counterElem) {
    counterElem.textContent = count > 0 ? `✨ ${count} Dream Note Terkumpul` : '✨ Ruang Dream Note';
  }
}

function formatTimestamp(timestamp) {
  if (!timestamp) return 'Baru saja';
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 60) return 'Baru saja';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} menit lalu`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} jam lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  } catch (e) {
    return 'Baru saja';
  }
}

function showToast(msg) {
  let toast = document.getElementById('guestbook-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'guestbook-toast';
    toast.className = 'guestbook-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>💚</span> <span>${escapeHtml(msg)}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
