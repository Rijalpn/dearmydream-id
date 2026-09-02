/**
 * ADMIN AUTHENTICATION & MODERATION MODULE
 * Clean Dedicated Admin Panel for Managing Dream Notes
 * Supports /admin route, #admin hash, and footer lock button
 */

import { db, doc, deleteDoc } from './firebase-config.js';

const ADMIN_PIN = '020899'; // Mark Lee's Birthday (02-08-1999)
const SESSION_KEY = 'dearmydream_admin_auth';

let isAdminLoggedIn = false;
let currentNotesGetter = null;
let onNotesChangedCallback = null;

export function initAdmin(getNotesFn, onNotesChanged) {
  currentNotesGetter = getNotesFn;
  onNotesChangedCallback = onNotesChanged;

  // Check existing session
  isAdminLoggedIn = sessionStorage.getItem(SESSION_KEY) === 'true';

  // Check URL routes for /admin, #admin, or ?admin=1
  checkAdminRoute();
  window.addEventListener('hashchange', checkAdminRoute);
  window.addEventListener('popstate', checkAdminRoute);

  // Setup Modals
  setupAuthModal();
  setupPanelModal();
}

export function isAdmin() {
  return isAdminLoggedIn;
}

function checkAdminRoute() {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const params = new URLSearchParams(window.location.search);

  if (path.includes('/admin') || hash === '#admin' || params.has('admin')) {
    if (isAdminLoggedIn) {
      setTimeout(() => openAdminPanel(), 300);
    } else {
      setTimeout(() => openAuthModal(), 300);
    }
  }
}

function setupAuthModal() {
  const authModal = document.getElementById('admin-modal');
  const closeBtn = document.getElementById('admin-modal-close');
  const form = document.getElementById('admin-login-form');

  if (closeBtn && authModal) {
    closeBtn.addEventListener('click', closeAuthModal);
  }

  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) closeAuthModal();
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const pinInput = document.getElementById('admin-pin-input');
      const pin = pinInput ? pinInput.value.trim() : '';

      if (pin === ADMIN_PIN) {
        isAdminLoggedIn = true;
        sessionStorage.setItem(SESSION_KEY, 'true');
        closeAuthModal();
        if (pinInput) pinInput.value = '';
        openAdminPanel();
      } else {
        alert('PIN Admin salah! Silakan coba lagi.');
        if (pinInput) {
          pinInput.value = '';
          pinInput.focus();
        }
      }
    });
  }
}

function setupPanelModal() {
  const panelModal = document.getElementById('admin-panel-modal');
  const closePanelBtn = document.getElementById('admin-panel-close');
  const logoutBtn = document.getElementById('admin-panel-logout');

  if (closePanelBtn) {
    closePanelBtn.addEventListener('click', closeAdminPanel);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      isAdminLoggedIn = false;
      sessionStorage.removeItem(SESSION_KEY);
      closeAdminPanel();
      showToast('Berhasil logout dari mode Admin.');
    });
  }

  if (panelModal) {
    panelModal.addEventListener('click', (e) => {
      if (e.target === panelModal) closeAdminPanel();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAuthModal();
        closeAdminPanel();
      }
    });
  }
}

export function openAuthModal() {
  const authModal = document.getElementById('admin-modal');
  if (authModal) {
    authModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    const pinInput = document.getElementById('admin-pin-input');
    if (pinInput) setTimeout(() => pinInput.focus(), 150);
  }
}

export function closeAuthModal() {
  const authModal = document.getElementById('admin-modal');
  if (authModal) {
    authModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

export function openAdminPanel() {
  const panelModal = document.getElementById('admin-panel-modal');
  if (panelModal) {
    renderAdminPanelList();
    panelModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

export function closeAdminPanel() {
  const panelModal = document.getElementById('admin-panel-modal');
  if (panelModal) {
    panelModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

export function renderAdminPanelList() {
  const listContainer = document.getElementById('admin-notes-list');
  const countBadge = document.getElementById('admin-notes-count');
  if (!listContainer) return;

  const notes = currentNotesGetter ? currentNotesGetter() : [];

  if (countBadge) {
    countBadge.textContent = `${notes.length} Pesan`;
  }

  if (notes.length === 0) {
    listContainer.innerHTML = `
      <div class="admin-empty-state">
        <span>📭</span>
        <p>Belum ada pesan Dream Note yang masuk.</p>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = notes.map(note => {
    return `
      <div class="admin-note-item" id="admin-row-${note.id}">
        <div class="admin-note-content">
          <div class="admin-note-header">
            <strong class="admin-note-author">✍️ ${escapeHtml(note.author)}</strong>
            <span class="admin-note-time">${escapeHtml(note.timeAgo || 'Baru saja')}</span>
            <span class="admin-note-likes">💚 ${note.likes || 0}</span>
          </div>
          <p class="admin-note-text">"${escapeHtml(note.message)}"</p>
        </div>
        <button type="button" class="btn-admin-delete-row" data-note-id="${note.id}" data-author="${escapeHtml(note.author)}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          <span>Hapus</span>
        </button>
      </div>
    `;
  }).join('');

  // Attach delete handlers
  listContainer.querySelectorAll('.btn-admin-delete-row').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const noteId = btn.getAttribute('data-note-id');
      const author = btn.getAttribute('data-author');
      await handleAdminDelete(noteId, author);
    });
  });
}

async function handleAdminDelete(noteId, author) {
  const confirmed = confirm(`Hapus pesan dari "${author}" secara permanen?`);
  if (!confirmed) return;

  // 1. Instant local removal (0ms UI feedback)
  if (onNotesChangedCallback) {
    onNotesChangedCallback(noteId);
  }
  renderAdminPanelList();
  showToast('Pesan berhasil dihapus! 🗑️✨');

  // 2. Sync deletion to cloud Firestore
  try {
    await deleteDoc(doc(db, 'guestbook', noteId));
  } catch (e) {
    console.warn('Firestore cloud sync delete notice:', e.message);
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
  toast.innerHTML = `<span>👑</span> <span>${escapeHtml(msg)}</span>`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
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
