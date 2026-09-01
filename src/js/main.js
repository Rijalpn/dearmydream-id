/**
 * MAIN JAVASCRIPT ENTRYPOINT
 * DearMyDream.id Landing Page
 */

import { initModal } from './modal.js';
import { initPreloader } from './preloader.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('🌿 DearMyDream.id Loaded Successfully!');

  // Initialize 7Dream Youth Capsule Preloader
  initPreloader();

  // Initialize Lightbox Modal
  initModal();
});
