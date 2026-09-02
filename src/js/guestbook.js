/**
 * GUESTBOOK / KESAN & PESAN MODULE
 * Lightweight, clean, responsive interactive message board with localStorage & likes
 */

const STORAGE_KEY = 'dearmydream_guestbook_notes_v2';
const LIKES_KEY = 'dearmydream_guestbook_likes_v2';

const WASHI_OPTIONS = ['', 'washi-yellow', 'washi-orange', 'washi-pink', 'washi-blue'];
const TILT_OPTIONS = ['left', 'right', 'straight'];

export function initGuestbook() {
  const gridContainer = document.getElementById('guestbook-grid');
  const triggerBtn = document.getElementById('btn-open-guestbook-modal');
  const modalBackdrop = document.getElementById('guestbook-modal');
  const closeModalBtn = document.getElementById('guestbook-modal-close');
  const form = document.getElementById('guestbook-form');

  if (!gridContainer) return;

  // Render stored notes (starts empty if none)
  const notes = getStoredNotes();
  renderNotes(notes);
  updateCounter(notes.length);

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
      if (e.target === modalBackdrop) {
        closeGuestbookModal();
      }
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

function getStoredNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error reading guestbook notes:', e);
    return [];
  }
}

function saveStoredNotes(notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {
    console.error('Error saving guestbook notes:', e);
  }
}

function getLikedNotes() {
  try {
    const raw = localStorage.getItem(LIKES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveLikedNotes(likedMap) {
  try {
    localStorage.setItem(LIKES_KEY, JSON.stringify(likedMap));
  } catch (e) {
    console.error('Error saving liked notes:', e);
  }
}

function renderNotes(notes) {
  const grid = document.getElementById('guestbook-grid');
  if (!grid) return;

  if (notes.length === 0) {
    grid.innerHTML = `
      <div class="empty-guestbook-box">
        <div class="empty-guestbook-icon">💌</div>
        <div class="empty-guestbook-title">Belum ada kesan & pesan yang ditulis</div>
        <div class="empty-guestbook-sub">Jadilah yang pertama menuliskan cerita manismu di sini! ✨</div>
      </div>
    `;
    return;
  }

  const likedMap = getLikedNotes();

  grid.innerHTML = notes.map(note => {
    const isLiked = !!likedMap[note.id];

    return `
      <article class="memo-note-card" data-tilt="${note.tilt || 'straight'}" id="note-card-${note.id}">
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
          <span class="note-stamp-tag">💚 Pesan Teman</span>
          
          <button type="button" class="btn-note-like ${isLiked ? 'liked' : ''}" 
                  data-note-id="${note.id}" 
                  aria-label="Sukai pesan dari ${escapeHtml(note.author)}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="${isLiked ? '#BE123C' : 'none'}" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span class="like-count">${note.likes || 0}</span>
          </button>
        </div>
      </article>
    `;
  }).join('');

  // Attach like button click listeners
  grid.querySelectorAll('.btn-note-like').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const noteId = btn.getAttribute('data-note-id');
      handleLikeClick(noteId, btn);
    });
  });
}

function handleLikeClick(noteId, btnElement) {
  const notes = getStoredNotes();
  const likedMap = getLikedNotes();
  const targetNote = notes.find(n => n.id === noteId);

  if (!targetNote) return;

  if (likedMap[noteId]) {
    // Unlike
    delete likedMap[noteId];
    targetNote.likes = Math.max(0, (targetNote.likes || 1) - 1);
    btnElement.classList.remove('liked');
  } else {
    // Like
    likedMap[noteId] = true;
    targetNote.likes = (targetNote.likes || 0) + 1;
    btnElement.classList.add('liked');

    createHeartSparkle(btnElement);
  }

  saveLikedNotes(likedMap);
  saveStoredNotes(notes);

  const countSpan = btnElement.querySelector('.like-count');
  if (countSpan) {
    countSpan.textContent = targetNote.likes;
  }
}

function createHeartSparkle(element) {
  const rect = element.getBoundingClientRect();
  const heart = document.createElement('div');
  heart.textContent = '💚';
  heart.style.position = 'fixed';
  heart.style.left = `${rect.left + rect.width / 2}px`;
  heart.style.top = `${rect.top}px`;
  heart.style.fontSize = '18px';
  heart.style.pointerEvents = 'none';
  heart.style.zIndex = '9999';
  heart.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
  heart.style.transform = 'translate(-50%, 0) scale(1)';
  heart.style.opacity = '1';

  document.body.appendChild(heart);

  requestAnimationFrame(() => {
    heart.style.transform = 'translate(-50%, -45px) scale(1.4)';
    heart.style.opacity = '0';
  });

  setTimeout(() => heart.remove(), 600);
}

function handleFormSubmit(e) {
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
  const randomTilt = TILT_OPTIONS[Math.floor(Math.random() * TILT_OPTIONS.length)];

  const newNote = {
    id: `note-${Date.now()}`,
    author: author,
    message: message,
    timeAgo: 'Baru saja',
    likes: 1,
    washiClass: randomWashi,
    tilt: randomTilt
  };

  const notes = getStoredNotes();
  notes.unshift(newNote);
  saveStoredNotes(notes);

  // Re-render
  renderNotes(notes);
  updateCounter(notes.length);

  // Close modal and reset form
  closeGuestbookModal();
  e.target.reset();

  // Show Toast
  showToast('Pesan & kesanmu berhasil dikirim! 💚✨');

  // Scroll to new note
  setTimeout(() => {
    const newCard = document.getElementById(`note-card-${newNote.id}`);
    if (newCard) {
      newCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 350);
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
    counterElem.textContent = count > 0 ? `✨ ${count} Pesan Terkumpul` : '✨ Ruang Pesan & Kesan';
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
