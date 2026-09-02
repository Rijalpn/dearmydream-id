import { initModal } from './modal.js';
import { initPreloader } from './preloader.js';
import { initSparkles } from './sparkles.js';
import { initAudioPlayer } from './player.js';
import { initGuestbook, getCurrentNotes, removeNoteLocally } from './guestbook.js';
import { initAdmin } from './admin.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('🌿 DearMyDream.id Loaded Successfully!');

  // Initialize 7Dream Youth Capsule Preloader
  initPreloader();

  // Initialize Concert Sparkles & Confetti Reactions
  initSparkles();

  // Initialize Mini Vinyl BGM Player (NCT Dream Chill Medley)
  initAudioPlayer();

  // Initialize Lightbox Modal & Zoom Viewer
  initModal();

  // Initialize Scrapbook Youth Memory Wall (Kesan & Pesan)
  initGuestbook();

  // Initialize Admin Moderation Panel (/admin)
  initAdmin(
    () => getCurrentNotes(),
    (deletedId) => removeNoteLocally(deletedId)
  );
});
