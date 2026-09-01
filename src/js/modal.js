/**
 * MEMORY CAPSULE MODAL & POSTER ZOOM VIEWER MODULE
 * Lightbox, Google Maps direct route, and HD Zoom Viewer
 */

import { eventsArchive } from './data.js';

let activeZoomLevel = 1;
let isPanning = false;
let startX = 0;
let startY = 0;
let translateX = 0;
let translateY = 0;

export function initModal() {
  const backdrop = document.getElementById('memory-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!backdrop) return;

  // Close on click outside
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  });

  // Close on button click
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Close on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const zoomLightbox = document.getElementById('poster-zoom-lightbox');
      if (zoomLightbox && zoomLightbox.classList.contains('active')) {
        closeZoomLightbox();
      } else if (backdrop.classList.contains('active')) {
        closeModal();
      }
    }
  });

  // Bind click on polaroid cards
  const polaroidCards = document.querySelectorAll('.polaroid-interactive');
  polaroidCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const eventId = card.getAttribute('data-event-id');
      const eventData = eventsArchive.find(ev => ev.id === eventId);
      if (eventData) {
        openModal(eventData);
      }
    });
  });

  // Initialize Zoom Lightbox controls
  initZoomControls();
}

export function openModal(eventData) {
  const backdrop = document.getElementById('memory-modal');
  const modalContent = document.getElementById('modal-dynamic-content');
  if (!backdrop || !modalContent) return;

  const activitiesHtml = eventData.details.activities
    .map(act => `<li style="margin-bottom: 4px;">• ${act}</li>`)
    .join('');

  const freebiesHtml = eventData.details.freebies
    .map(f => `<span class="badge-pill badge-live" style="margin: 2px;">🎁 ${f}</span>`)
    .join('');

  const sponsorsHtml = eventData.details.sponsors
    .map(sp => `<span class="badge-pill badge-mark" style="margin: 2px;">${sp}</span>`)
    .join('');

  const mediaPartnersHtml = eventData.details.mediaPartners
    .map(mp => `<span class="badge-pill badge-dream" style="margin: 2px;">${mp}</span>`)
    .join('');

  modalContent.innerHTML = `
    <div style="margin-bottom: 1rem;">
      <span class="badge-pill ${eventData.badgeClass}">${eventData.tagText}</span>
      <h2 style="font-family: var(--font-display); font-size: clamp(1.4rem, 3vw, 1.85rem); font-weight: 900; color: var(--color-ink); margin-top: 0.5rem; line-height: 1.2;">
        ${eventData.title}
      </h2>
      <p style="font-family: var(--font-handwritten); font-size: 1.35rem; font-weight: 700; color: var(--color-ink-muted);">
        ${eventData.subtitle} — ${eventData.handwrittenNote}
      </p>
    </div>

    <!-- Click to Zoom Poster Container -->
    <div class="modal-gallery-preview" role="button" tabindex="0" title="Klik / Tap untuk Zoom HD & Fullscreen" id="modal-poster-preview">
      <img id="modal-active-img" src="${eventData.coverImage}" alt="${eventData.title}">
      <div class="poster-zoom-hint">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="11" y1="8" x2="11" y2="14"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
        <span>Ketuk untuk Zoom Poster HD 🔍</span>
      </div>
    </div>

    <!-- Thumbnail Picker if multiple photos -->
    ${eventData.gallery && eventData.gallery.length > 1 ? `
      <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 1rem;">
        ${eventData.gallery.map((g, idx) => `
          <img src="${g.src}" alt="${g.caption}" class="modal-thumb ${idx === 0 ? 'active' : ''}" 
               style="width: 64px; height: 64px; object-fit: cover; border-radius: 8px; border: 2px solid var(--color-ink); cursor: pointer; flex-shrink: 0;"
               onclick="document.getElementById('modal-active-img').src='${g.src}'">
        `).join('')}
      </div>
    ` : ''}

    <div class="modal-info-grid">
      <div class="modal-info-item" style="grid-column: 1 / -1;">
        <div class="modal-info-label">📍 Lokasi Venue</div>
        <div class="modal-info-val" style="display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap;">
          <span>${eventData.details.location}</span>
          <a href="${eventData.details.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn-maps-direct">
            <span>Buka Google Maps ↗</span>
          </a>
        </div>
      </div>
      <div class="modal-info-item">
        <div class="modal-info-label">📅 Periode</div>
        <div class="modal-info-val">${eventData.dateFormatted}</div>
      </div>
      <div class="modal-info-item">
        <div class="modal-info-label">👗 Dresscode</div>
        <div class="modal-info-val">${eventData.details.dresscode}</div>
      </div>
    </div>

    <div style="margin-top: 1.25rem;">
      <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--color-ink); margin-bottom: 0.4rem;">✨ Highlight Aktivitas</h4>
      <ul style="list-style: none; padding-left: 0; font-size: 0.9rem; color: var(--color-ink-muted);">
        ${activitiesHtml}
      </ul>
    </div>

    <div style="margin-top: 1.25rem;">
      <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--color-ink); margin-bottom: 0.4rem;">🎁 Starter Kit & Freebies</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 4px;">
        ${freebiesHtml}
      </div>
    </div>

    <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 2px dashed rgba(22, 40, 30, 0.15);">
      <h4 style="font-size: 0.85rem; font-weight: 800; text-transform: uppercase; color: var(--color-ink-light); margin-bottom: 0.4rem;">🤝 Sponsor & Media Partner</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 4px;">
        ${sponsorsHtml}
        ${mediaPartnersHtml}
      </div>
    </div>
  `;

  // Bind click to open Zoom Lightbox
  const posterPreview = document.getElementById('modal-poster-preview');
  if (posterPreview) {
    posterPreview.addEventListener('click', () => {
      const currentImgSrc = document.getElementById('modal-active-img').src;
      openZoomLightbox(currentImgSrc, eventData.title);
    });
  }

  backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

export function closeModal() {
  const backdrop = document.getElementById('memory-modal');
  if (!backdrop) return;
  backdrop.classList.remove('active');
  document.body.style.overflow = '';
}

/* ==========================================================================
   HD PINCH-TO-ZOOM & FULLSCREEN LIGHTBOX
   ========================================================================== */

function initZoomControls() {
  const zoomInBtn = document.getElementById('zoom-in-btn');
  const zoomOutBtn = document.getElementById('zoom-out-btn');
  const zoomResetBtn = document.getElementById('zoom-reset-btn');
  const zoomCloseBtn = document.getElementById('zoom-close-btn');
  const zoomImg = document.getElementById('zoom-fullscreen-img');
  const zoomLightbox = document.getElementById('poster-zoom-lightbox');

  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      setZoomLevel(activeZoomLevel + 0.5);
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      setZoomLevel(activeZoomLevel - 0.5);
    });
  }

  if (zoomResetBtn) {
    zoomResetBtn.addEventListener('click', () => {
      resetZoom();
    });
  }

  if (zoomCloseBtn) {
    zoomCloseBtn.addEventListener('click', () => {
      closeZoomLightbox();
    });
  }

  if (zoomLightbox) {
    zoomLightbox.addEventListener('click', (e) => {
      if (e.target === zoomLightbox) {
        closeZoomLightbox();
      }
    });
  }

  // Double tap / click to toggle zoom
  if (zoomImg) {
    zoomImg.addEventListener('dblclick', () => {
      if (activeZoomLevel > 1) {
        resetZoom();
      } else {
        setZoomLevel(2.2);
      }
    });

    // Drag to pan when zoomed in
    zoomImg.addEventListener('pointerdown', (e) => {
      if (activeZoomLevel <= 1) return;
      isPanning = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
      zoomImg.style.cursor = 'grabbing';
      zoomImg.setPointerCapture(e.pointerId);
    });

    zoomImg.addEventListener('pointermove', (e) => {
      if (!isPanning) return;
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;
      applyTransform();
    });

    const stopPan = () => {
      isPanning = false;
      if (zoomImg) zoomImg.style.cursor = activeZoomLevel > 1 ? 'grab' : 'zoom-in';
    };

    zoomImg.addEventListener('pointerup', stopPan);
    zoomImg.addEventListener('pointercancel', stopPan);
  }
}

function openZoomLightbox(src, title) {
  const zoomLightbox = document.getElementById('poster-zoom-lightbox');
  const zoomImg = document.getElementById('zoom-fullscreen-img');
  const zoomTitle = document.getElementById('zoom-poster-title');

  if (!zoomLightbox || !zoomImg) return;

  zoomImg.src = src;
  zoomImg.alt = title;
  if (zoomTitle) zoomTitle.textContent = title;

  resetZoom();
  zoomLightbox.classList.add('active');
}

function closeZoomLightbox() {
  const zoomLightbox = document.getElementById('poster-zoom-lightbox');
  if (!zoomLightbox) return;
  zoomLightbox.classList.remove('active');
  resetZoom();
}

function setZoomLevel(lvl) {
  activeZoomLevel = Math.max(1, Math.min(4, lvl));
  if (activeZoomLevel === 1) {
    translateX = 0;
    translateY = 0;
  }
  applyTransform();
}

function resetZoom() {
  activeZoomLevel = 1;
  translateX = 0;
  translateY = 0;
  applyTransform();
}

function applyTransform() {
  const zoomImg = document.getElementById('zoom-fullscreen-img');
  const zoomLevelBadge = document.getElementById('zoom-level-badge');
  if (!zoomImg) return;

  zoomImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${activeZoomLevel})`;
  zoomImg.style.cursor = activeZoomLevel > 1 ? (isPanning ? 'grabbing' : 'grab') : 'zoom-in';

  if (zoomLevelBadge) {
    zoomLevelBadge.textContent = `${Math.round(activeZoomLevel * 100)}%`;
  }
}
