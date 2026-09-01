/**
 * SPARKLE & CONFETTI REACTION MODULE
 * Spawns neon lime, mint stars and hearts on tap/click
 */

const SPARKLE_ICONS = ['✦', '✧', '💚', '✨', '★'];
const SPARKLE_COLORS = ['#D1F737', '#AEF29C', '#6ECC65', '#FFFBEB', '#FFE066'];

export function initSparkles() {
  document.addEventListener('pointerdown', (e) => {
    // Only spawn on interactive elements or cards
    const target = e.target.closest('button, .btn, .polaroid-interactive, .brand-badge, .memo-archive-btn, .chibi-interactive, .modal-close-btn');
    if (!target) return;

    createSparkleBurst(e.clientX, e.clientY);
  }, { passive: true });
}

export function createSparkleBurst(x, y, count = 7) {
  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement('span');
    sparkle.className = 'sparkle-particle';
    sparkle.textContent = SPARKLE_ICONS[Math.floor(Math.random() * SPARKLE_ICONS.length)];
    sparkle.style.color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];

    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const velocity = 35 + Math.random() * 45;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity - 20; // slight upward bias
    const rot = (Math.random() - 0.5) * 90;
    const size = 12 + Math.random() * 12;

    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    sparkle.style.fontSize = `${size}px`;
    sparkle.style.setProperty('--tx', `${tx}px`);
    sparkle.style.setProperty('--ty', `${ty}px`);
    sparkle.style.setProperty('--rot', `${rot}deg`);

    document.body.appendChild(sparkle);

    setTimeout(() => {
      sparkle.remove();
    }, 650);
  }
}
