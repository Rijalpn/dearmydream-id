/**
 * ADMIN AUTHENTICATION & MODERATION MODULE
 * Supports /admin route, #admin hash, footer lock button, and Firestore deletions
 */

const ADMIN_PIN = '127000'; // Default admin PIN (can be customized)
const SESSION_KEY = 'dearmydream_admin_auth';

let isAdminLoggedIn = false;
let onAdminStateChangeCallback = null;

export function initAdmin(onStateChange) {
  onAdminStateChangeCallback = onStateChange;

  // Check existing session
  isAdminLoggedIn = sessionStorage.getItem(SESSION_KEY) === 'true';

  // Check URL routes for /admin, #admin, or ?admin=1
  checkAdminRoute();

  // Setup Admin Modal Elements
  setupAdminModal();

  // Render Admin Bar if already logged in
  updateAdminUI();
}

export function isAdmin() {
  return isAdminLoggedIn;
}

function checkAdminRoute() {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const params = new URLSearchParams(window.location.search);

  if (path.includes('/admin') || hash === '#admin' || params.has('admin')) {
    if (!isAdminLoggedIn) {
      setTimeout(() => openAdminModal(), 400);
    }
  }
}

function setupAdminModal() {
  const modalBackdrop = document.getElementById('admin-modal');
  const closeBtn = document.getElementById('admin-modal-close');
  const form = document.getElementById('admin-login-form');
  const footerTrigger = document.getElementById('footer-admin-trigger');

  if (footerTrigger) {
    footerTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (isAdminLoggedIn) {
        alert('Mode Admin sudah aktif! Tombol hapus [🗑️ Hapus] tersedia di setiap kartu pesan.');
      } else {
        openAdminModal();
      }
    });
  }

  if (closeBtn && modalBackdrop) {
    closeBtn.addEventListener('click', closeAdminModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeAdminModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
        closeAdminModal();
      }
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
        closeAdminModal();
        if (pinInput) pinInput.value = '';
        updateAdminUI();
        showAdminToast('Selamat datang, Admin DearMyDream! 👑 Mode moderasi aktif.');
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

export function openAdminModal() {
  const modal = document.getElementById('admin-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    const pinInput = document.getElementById('admin-pin-input');
    if (pinInput) setTimeout(() => pinInput.focus(), 150);
  }
}

export function closeAdminModal() {
  const modal = document.getElementById('admin-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function updateAdminUI() {
  let adminBar = document.getElementById('admin-floating-bar');

  if (isAdminLoggedIn) {
    if (!adminBar) {
      adminBar = document.createElement('div');
      adminBar.id = 'admin-floating-bar';
      adminBar.className = 'admin-floating-bar';
      adminBar.innerHTML = `
        <div class="admin-bar-content">
          <span class="admin-pulse-dot"></span>
          <span>👑 <strong>Mode Admin Moderasi Aktif</strong></span>
        </div>
        <button id="btn-admin-logout" class="btn-admin-logout">Keluar</button>
      `;
      document.body.appendChild(adminBar);

      const logoutBtn = adminBar.querySelector('#btn-admin-logout');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          isAdminLoggedIn = false;
          sessionStorage.removeItem(SESSION_KEY);
          adminBar.remove();
          updateAdminUI();
          showAdminToast('Mode Admin telah dinonaktifkan.');
        });
      }
    }
  } else {
    if (adminBar) adminBar.remove();
  }

  // Notify guestbook to re-render delete buttons
  if (onAdminStateChangeCallback) {
    onAdminStateChangeCallback(isAdminLoggedIn);
  }
}

function showAdminToast(msg) {
  let toast = document.getElementById('guestbook-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'guestbook-toast';
    toast.className = 'guestbook-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>👑</span> <span>${msg}</span>`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}
