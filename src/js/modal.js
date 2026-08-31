/**
 * MEMORY CAPSULE MODAL MODULE
 * Lightbox & detail drawer for past events
 */

import { eventsArchive } from './data.js';

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
    if (e.key === 'Escape' && backdrop.classList.contains('active')) {
      closeModal();
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

    <div class="modal-gallery-preview">
      <img id="modal-active-img" src="${eventData.coverImage}" alt="${eventData.title}">
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
      <div class="modal-info-item">
        <div class="modal-info-label">📍 Lokasi</div>
        <div class="modal-info-val">${eventData.details.location}</div>
      </div>
      <div class="modal-info-item">
        <div class="modal-info-label">📅 Periode</div>
        <div class="modal-info-val">${eventData.dateFormatted}</div>
      </div>
      <div class="modal-info-item" style="grid-column: 1 / -1;">
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

  backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

export function closeModal() {
  const backdrop = document.getElementById('memory-modal');
  if (!backdrop) return;
  backdrop.classList.remove('active');
  document.body.style.overflow = '';
}
