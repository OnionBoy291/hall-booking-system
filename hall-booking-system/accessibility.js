(function () {
  const STORAGE_KEY = 'accessibilityTextScale';
  const DEFAULT_SCALE = 100; 
  const MIN_SCALE = 70; 
  const MAX_SCALE = 130; 
  const STEP = 10; 


  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function getScale() {
    const raw = localStorage.getItem(STORAGE_KEY);
    const n = raw ? Number(raw) : DEFAULT_SCALE;
    if (!Number.isFinite(n)) return DEFAULT_SCALE;
    return clamp(n, MIN_SCALE, MAX_SCALE);
  }

  function setScale(scale) {
    const s = clamp(scale, MIN_SCALE, MAX_SCALE);
    localStorage.setItem(STORAGE_KEY, String(s));
    document.documentElement.style.setProperty('--font-scale', String(s));

  }

  function injectStyles() {
    if (document.getElementById('bb-accessibility-styles')) return;

    const style = document.createElement('style');
    style.id = 'bb-accessibility-styles';
    style.textContent = `
      :root { --font-scale: 1; }
      /* Scale entire website (typography + components built from rem) */
      html { font-size: calc(16px * (var(--font-scale) / 100)); }
      body { font-size: 1rem; }



      /* Floating accessibility button */
      .bb-a11y-btn {
        position: fixed;
        right: 18px;
        bottom: 18px;
        width: 60px;
        height: 60px;
        border-radius: 999px;
        z-index: 2147483647;
        border: 1px solid rgba(255,255,255,0.25);
        background: rgba(44,44,84,0.92);
        color: #fff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 25px rgba(0,0,0,0.25);
        transition: transform 0.12s ease, background 0.2s ease;
        user-select: none;
      }
      .bb-a11y-btn:hover { transform: scale(1.03); background: rgba(44,44,84,1); }
      .bb-a11y-btn:active { transform: scale(0.98); }
      .bb-a11y-btn:focus { outline: 2px solid rgba(255,217,0,0.9); outline-offset: 2px; }


      .bb-a11y-btn i {
    font-size: 2.0rem;
      }
      .bb-a11y-panel {
        position: fixed;
        right: 18px;
        bottom: 72px;
        z-index: 2147483647;
        width: 220px;
        background: rgba(22,22,38,0.98);
        color: #fff;
        border: 1px solid rgba(255,255,255,0.18);
        border-radius: 12px;
        box-shadow: 0 14px 35px rgba(0,0,0,0.35);
        padding: 12px;
        display: none;
      }
      .bb-a11y-panel.bb-open { display: block; }

      .bb-a11y-title {
        font-weight: 800;
        font-size: 0.95rem;
        margin: 2px 0 10px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .bb-a11y-row {
        display: flex;
        gap: 10px;
        margin-bottom: 10px;
      }

      .bb-a11y-btnsmall {
        flex: 1;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.18);
        background: rgba(255,255,255,0.06);
        color: #fff;
        cursor: pointer;
        padding: 10px 10px;
        font-weight: 700;
        transition: background 0.2s ease, transform 0.12s ease;
      }
      .bb-a11y-btnsmall:hover { background: rgba(255,255,255,0.12); }
      .bb-a11y-btnsmall:active { transform: scale(0.99); }
      .bb-a11y-btnsmall:focus { outline: 2px solid rgba(255,217,0,0.9); outline-offset: 2px; }

      .bb-a11y-scale {
        font-size: 0.85rem;
        color: rgba(255,255,255,0.85);
        margin-bottom: 10px;
      }

      .bb-a11y-footer {
        display: flex;
        justify-content: space-between;
        gap: 10px;
      }

      .bb-a11y-reset {
        width: 100%;
        border-radius: 10px;
        border: 1px solid rgba(255,217,0,0.35);
        background: rgba(255,217,0,0.16);
        color: #FFD900;
        cursor: pointer;
        padding: 10px 10px;
        font-weight: 800;
      }
      .bb-a11y-reset:hover { background: rgba(255,217,0,0.25); }
      .bb-a11y-reset:focus { outline: 2px solid rgba(255,255,255,0.6); outline-offset: 2px; }
    `;

    document.head.appendChild(style);
  }

  function ensureWidget() {
    injectStyles();

    if (document.getElementById('bb-a11y-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'bb-a11y-btn';
    btn.className = 'bb-a11y-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Accessibility: adjust text size');
    btn.innerHTML = '<i class="fas fa-universal-access"></i>';

    const panel = document.createElement('div');
    panel.id = 'bb-a11y-panel';
    panel.className = 'bb-a11y-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Text size settings');

    panel.innerHTML = `
      <div class="bb-a11y-title">
        <span aria-hidden="true">♿</span>
        <span>Text size</span>
      </div>
      <div class="bb-a11y-row">
        <button type="button" class="bb-a11y-btnsmall" data-action="dec" aria-label="Make text smaller">A-</button>
        <button type="button" class="bb-a11y-btnsmall" data-action="inc" aria-label="Make text bigger">A+</button>
      </div>
      <div class="bb-a11y-scale" id="bb-a11y-scale">Scale: 100%</div>
      <div class="bb-a11y-footer">
        <button type="button" class="bb-a11y-reset" data-action="reset">Reset</button>
      </div>
    `;

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    return { btn, panel };
  }

  function updateScaleLabel() {
    const label = document.getElementById('bb-a11y-scale');
    if (!label) return;
    const scale = getScale();
     label.textContent = `Scale: ${scale}%`;
  }

  function togglePanel(open) {
    const panel = document.getElementById('bb-a11y-panel');
    if (!panel) return;
    const isOpen = panel.classList.contains('bb-open');
    const next = typeof open === 'boolean' ? open : !isOpen;
    panel.classList.toggle('bb-open', next);
  }

  function bindEvents(widget) {
    const btn = widget.btn;
    const panel = widget.panel;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      togglePanel();
    });

    document.addEventListener('click', function (e) {
      const panelEl = document.getElementById('bb-a11y-panel');
      const btnEl = document.getElementById('bb-a11y-btn');
      if (!panelEl || !btnEl) return;
      const clickedInside = panelEl.contains(e.target) || btnEl.contains(e.target);
      if (!clickedInside) togglePanel(false);
    });

    panel.addEventListener('click', function (e) {
      const actionBtn = e.target && e.target.closest('[data-action]');
      if (!actionBtn) return;
      const action = actionBtn.getAttribute('data-action');

      let scale = getScale();
      if (action === 'inc') scale += STEP;
      else if (action === 'dec') scale -= STEP;
      else if (action === 'reset') scale = DEFAULT_SCALE;

      setScale(scale);
      updateScaleLabel();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') togglePanel(false);
    });
  }

  function init() {
    const widget = ensureWidget();
    if (!widget) return;

    setScale(getScale());
    updateScaleLabel();

    bindEvents(widget);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
