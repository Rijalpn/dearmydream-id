/**
 * GUESTBOOK & YOUTH MEMORY WALL MODULE
 * Handles scrapbook fan messages, bias avatar picker, likes, and localStorage persistence
 */

const STORAGE_KEY = 'dearmydream_guestbook_notes';
const LIKES_KEY = 'dearmydream_guestbook_likes';

// Authentic default starter memories
const DEFAULT_NOTES = [
  {
    id: 'note-1',
    author: 'Caca MarkF',
    handle: '@markf_bandung',
    bias: 'mark',
    eventTag: '🐯 Dear Mark 2026',
    message: 'Noraebang party Dear Mark seru banget astaga! Pertama kali ikut gathering K-Pop sendirian tapi pas nyampe langsung dapet temen baru semeja. Freebiesnya lucu-lucu bgt kiyowo 🐯💚',
    handwritten: 'Always with Mark Lee ✨',
    timeAgo: 'Baru saja',
    likes: 24,
    washiClass: 'washi-orange',
    tilt: 'left'
  },
  {
    id: 'note-2',
    author: 'Nabila Dreamzen',
    handle: '@nabiladreamies',
    bias: 'jaemin',
    eventTag: '🌙 Pajama Party',
    message: 'Gasabar banget nunggu Pajama Party 23 Agustus nanti di Cornerstone Paskal! Udah siapin piyama matching sama bestie. Sukses terus buat DearMyDream EO kpop terbaik di Bdg! 🐰✨',
    handwritten: '7Dream Forever Youth 💚',
    timeAgo: '1 jam lalu',
    likes: 19,
    washiClass: '',
    tilt: 'right'
  },
  {
    id: 'note-3',
    author: 'Alya Czennie',
    handle: '@alya.nctzen',
    bias: 'jeno',
    eventTag: '✨ Kesan Komunitas',
    message: 'Event Organizer yang bener-bener ramah dan rapi banget! Dari dekorasi, rundown, sampe photobooth Bobbliss semuanya niat parah. My Dream is My Youth beneran berasa 🐶💚',
    handwritten: 'Bandung Czennie Pride 🌟',
    timeAgo: '3 jam lalu',
    likes: 31,
    washiClass: 'washi-yellow',
    tilt: 'straight'
  },
  {
    id: 'note-4',
    author: 'Dinda',
    handle: '@dinda_haechan',
    bias: 'haechan',
    eventTag: '🐯 Dear Mark 2026',
    message: 'Nonton bareng dokumenter Mark kemarin beneran bikin nangis terharu se-ruangan. Makasih DearMyDream udah nyediain ruang kumpul sehangat ini di Bandung! 🐻✨',
    handwritten: 'Huck & Mark Best Duo 💚',
    timeAgo: '5 jam lalu',
    likes: 15,
    washiClass: 'washi-pink',
    tilt: 'left'
  },
  {
    id: 'note-5',
    author: 'Sasa Injun',
    handle: '@renjun_archives_bdg',
    bias: 'renjun',
    eventTag: '🌙 Pajama Party',
    message: 'Vibe komunitasnya asyik banget, panitianya gercep dan welcome ke peserta baru. Wajib banget dateng pas 10th Dreamversary nanti gaes! 🦊🍵',
    handwritten: 'Huang Renjun Kiyowo 💛',
    timeAgo: 'Kemarin',
    likes: 28,
    washiClass: 'washi-blue',
    tilt: 'right'
  },
  {
    id: 'note-6',
    author: 'Rifki Jisung',
    handle: '@jisung_maknae',
    bias: 'jisung',
    eventTag: '✨ Harapan 7Dream',
    message: 'Keren banget EO spesialis NCT Dream & Mark di Bandung. Semoga makin sering bikin nobar konser dan gathering seru lainnya ya min! 🐹💚',
    handwritten: 'Maknae on Top! 🚀',
    timeAgo: '2 hari lalu',
    likes: 22,
    washiClass: '',
    tilt: 'straight'
  }
];

const BIAS_ICONS = {
  mark: { name: 'Mark', icon: '/chibi/mark.png', emoji: '🐯' },
  renjun: { name: 'Renjun', icon: '/chibi/renjun.png', emoji: '🦊' },
  jeno: { name: 'Jeno', icon: '/chibi/jeno.png', emoji: '🐶' },
  haechan: { name: 'Haechan', icon: '/chibi/haechan.png', emoji: '🐻' },
  jaemin: { name: 'Jaemin', icon: '/chibi/jaemin.png', emoji: '🐰' },
  chenle: { name: 'Chenle', icon: '/chibi/chenle.png', emoji: '🐬' },
  jisung: { name: 'Jisung', icon: '/chibi/jisung.png', emoji: '🐹' },
  dream: { name: '7Dream', icon: '/chibi/mark.png', emoji: '💚' }
};

const WASHI_OPTIONS = ['', 'washi-yellow', 'washi-orange', 'washi-pink', 'washi-blue'];
const TILT_OPTIONS = ['left', 'right', 'straight'];

let selectedBias = 'mark';
let selectedEventTag = '🌙 Pajama Party';

export function initGuestbook() {
  const gridContainer = document.getElementById('guestbook-grid');
  const triggerBtn = document.getElementById('btn-open-guestbook-modal');
  const modalBackdrop = document.getElementById('guestbook-modal');
  const closeModalBtn = document.getElementById('guestbook-modal-close');
  const form = document.getElementById('guestbook-form');

  if (!gridContainer) return;

  // Load and render notes
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
    closeModalBtn.addEventListener('click', closeGuestbookModal);
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

  // Setup Bias Selector Chips
  setupBiasSelector();

  // Setup Event Tag Chips
  setupEventTagSelector();

  // Setup Form Submission
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
}

function getStoredNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_NOTES));
      return DEFAULT_NOTES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_NOTES;
  } catch (e) {
    console.error('Error reading guestbook notes:', e);
    return DEFAULT_NOTES;
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

  const likedMap = getLikedNotes();

  grid.innerHTML = notes.map(note => {
    const biasInfo = BIAS_ICONS[note.bias] || BIAS_ICONS.mark;
    const isLiked = !!likedMap[note.id];
    const avatarSrc = biasInfo.icon;

    return `
      <article class="memo-note-card" data-tilt="${note.tilt || 'straight'}" id="note-card-${note.id}">
        <div class="note-washi ${note.washiClass || ''}" aria-hidden="true"></div>

        <div>
          <div class="note-author-row">
            <div class="note-avatar-wrap" title="Bias: ${biasInfo.name}">
              <img src="${avatarSrc}" alt="${biasInfo.name}" loading="lazy">
            </div>
            <div class="note-author-meta">
              <div class="note-author-name">
                <span>${escapeHtml(note.author)}</span>
                <span style="font-size: 0.8rem;">${biasInfo.emoji}</span>
              </div>
              <div class="note-event-badge">
                <span>${escapeHtml(note.eventTag || '✨ Youth Memory')}</span>
              </div>
            </div>
          </div>

          <p class="note-message-body">"${escapeHtml(note.message)}"</p>
          
          ${note.handwritten ? `
            <span class="note-handwritten-sign">~ ${escapeHtml(note.handwritten)} ✨</span>
          ` : ''}
        </div>

        <div class="note-footer-row">
          <span class="note-time-text">${escapeHtml(note.timeAgo || 'Baru saja')}</span>
          
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

    // Trigger subtle sparkle particle if available
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

function setupBiasSelector() {
  const container = document.getElementById('bias-picker-options');
  if (!container) return;

  container.querySelectorAll('.bias-picker-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.bias-picker-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedBias = btn.getAttribute('data-bias') || 'mark';
    });
  });
}

function setupEventTagSelector() {
  const container = document.getElementById('event-tag-options');
  if (!container) return;

  container.querySelectorAll('.event-tag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.event-tag-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedEventTag = btn.getAttribute('data-tag') || '🌙 Pajama Party';
    });
  });
}

function handleFormSubmit(e) {
  e.preventDefault();

  const authorInput = document.getElementById('guestbook-name-input');
  const messageInput = document.getElementById('guestbook-message-input');
  const signInput = document.getElementById('guestbook-sign-input');

  const author = authorInput ? authorInput.value.trim() : '';
  const message = messageInput ? messageInput.value.trim() : '';
  const sign = signInput ? signInput.value.trim() : '';

  if (!author || !message) {
    alert('Silakan masukkan nama/nickname dan isi pesan kesanmu ya! 💚');
    return;
  }

  const randomWashi = WASHI_OPTIONS[Math.floor(Math.random() * WASHI_OPTIONS.length)];
  const randomTilt = TILT_OPTIONS[Math.floor(Math.random() * TILT_OPTIONS.length)];

  const newNote = {
    id: `note-${Date.now()}`,
    author: author,
    bias: selectedBias || 'mark',
    eventTag: selectedEventTag || '🌙 Pajama Party',
    message: message,
    handwritten: sign || 'My Dream is My Youth ✨',
    timeAgo: 'Baru saja',
    likes: 1,
    washiClass: randomWashi,
    tilt: randomTilt
  };

  const notes = getStoredNotes();
  notes.unshift(newNote); // Put at beginning of wall
  saveStoredNotes(notes);

  // Re-render
  renderNotes(notes);
  updateCounter(notes.length);

  // Close modal and reset form
  closeGuestbookModal();
  e.target.reset();

  // Show Sweet Toast
  showToast('Pesan kenanganmu berhasil ditempel di Memory Wall! 💚✨');

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
    counterElem.textContent = `✨ ${count} Cerita Terkumpul`;
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
