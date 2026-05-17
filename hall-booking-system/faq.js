// FAQ accordion behavior
// Clicking a question button toggles its panel visibility.

(function () {
  function setupFaqAccordions() {
    const accordions = document.querySelectorAll('[data-accordion]');
    if (!accordions.length) return;

    accordions.forEach((accordion) => {
      const items = accordion.querySelectorAll('.accordion-item');
      items.forEach((item) => {
        const button = item.querySelector('.accordion-button');
        const panel = item.querySelector('.accordion-panel');
        if (!button || !panel) return;

        // Ensure initial state matches [data-open]
        const isOpen = item.getAttribute('data-open') === 'true' || item.getAttribute('data-open') === true;
        item.setAttribute('data-open', isOpen ? 'true' : 'false');
        panel.hidden = !isOpen;
        button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

        button.addEventListener('click', () => {
          const openNow = item.getAttribute('data-open') !== 'true';
          item.setAttribute('data-open', openNow ? 'true' : 'false');
          panel.hidden = !openNow;
          button.setAttribute('aria-expanded', openNow ? 'true' : 'false');
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFaqAccordions);
  } else {
    setupFaqAccordions();
  }
})();

