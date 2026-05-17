// ============================================
// FAQ - Accordion + Search Filter
// ============================================

function initAccordion() {
    const accordions = document.querySelectorAll('[data-accordion]');

    accordions.forEach((accordion) => {
        const items = accordion.querySelectorAll('.accordion-item');
        const buttons = accordion.querySelectorAll('.accordion-button');

        function setOpen(item, open) {
            const btn = item.querySelector('.accordion-button');
            const panel = item.querySelector('.accordion-panel');

            if (!btn || !panel) return;

            item.dataset.open = open ? 'true' : 'false';
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
            panel.hidden = !open;

            const icon = btn.querySelector('i');
            if (icon) {
                icon.style.transform = open ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        }

        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                const item = button.closest('.accordion-item');
                if (!item) return;

                const isOpen = item.dataset.open === 'true';

                // simple single-open behavior per accordion
                items.forEach((i) => {
                    if (i === item) return;
                    if (i.dataset.open === 'true') setOpen(i, false);
                });

                setOpen(item, !isOpen);
            });
        });

        // initialize states
        items.forEach((item) => {
            if (!item.dataset.open) item.dataset.open = 'false';
            const btn = item.querySelector('.accordion-button');
            if (btn) btn.setAttribute('aria-expanded', 'false');
            const panel = item.querySelector('.accordion-panel');
            if (panel) panel.hidden = true;
        });
    });
}

function initSearch() {
    const input = document.getElementById('faqSearch');
    if (!input) return;

    const questionButtons = document.querySelectorAll('.accordion-button');

    function normalize(str) {
        return (str || '')
            .toString()
            .toLowerCase()
            .trim();
    }

    input.addEventListener('input', () => {
        const q = normalize(input.value);

        questionButtons.forEach((btn) => {
            const item = btn.closest('.accordion-item');
            if (!item) return;

            const questionText = normalize(btn.innerText);
            const answerText = normalize(item.querySelector('.accordion-panel')?.innerText);

            const matches = !q || questionText.includes(q) || answerText.includes(q);

            item.style.display = matches ? '' : 'none';

            // if it doesn't match, ensure it's closed
            if (!matches && item.dataset.open === 'true') {
                const panel = item.querySelector('.accordion-panel');
                item.dataset.open = 'false';
                if (panel) panel.hidden = true;
                const b = item.querySelector('.accordion-button');
                if (b) b.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

window.onload = () => {
    initAccordion();
    initSearch();
};

