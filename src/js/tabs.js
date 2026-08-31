/**
 * TAB FILTERING MODULE
 * Filters the polaroid grid seamlessly without full page reloads
 */

export function initTabs(onFilterChange) {
  const tabButtons = document.querySelectorAll('.tab-btn');
  if (!tabButtons.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetCategory = btn.getAttribute('data-category');

      // Update active state
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Callback
      if (typeof onFilterChange === 'function') {
        onFilterChange(targetCategory);
      }
    });
  });
}

export function filterPolaroids(category) {
  const cards = document.querySelectorAll('.polaroid-item');
  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    if (category === 'all' || cardCat === category || cardCat === 'teaser') {
      card.style.display = 'flex';
      card.style.opacity = '1';
      card.style.transform = '';
    } else {
      card.style.display = 'none';
      card.style.opacity = '0';
    }
  });
}
