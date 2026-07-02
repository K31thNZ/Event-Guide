/* expatevents.org — main.js */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Active nav ── */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  /* ── Knowledge base tab switcher ── */
  const kbTabs = document.querySelectorAll('.kb-tab[data-tab]');
  const kbPanels = document.querySelectorAll('.kb-panel');
  kbTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      kbTabs.forEach(t => t.classList.toggle('active', t.dataset.tab === target));
      kbPanels.forEach(p => p.classList.toggle('active', p.dataset.panel === target));
    });
  });

  /* ── Upvote buttons ── */
  document.querySelectorAll('.upvote').forEach(btn => {
    btn.addEventListener('click', () => {
      const voted = btn.classList.toggle('voted');
      const countEl = btn.querySelector('.vote-count');
      if (countEl) {
        let n = parseInt(countEl.textContent) || 0;
        countEl.textContent = voted ? n + 1 : n - 1;
      }
    });
  });

  /* ── Submit post modal ── */
  const submitOverlay = document.getElementById('submit-overlay');
  const submitForm    = document.getElementById('submit-form');
  const submitSuccess = document.getElementById('submit-success');

  document.querySelectorAll('[data-modal="submit"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const topic = btn.dataset.topic || '';
      const topicSel = document.getElementById('post-topic');
      if (topicSel && topic) topicSel.value = topic;
      if (submitOverlay) {
        submitOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        // Move focus into modal
        const firstInput = submitOverlay.querySelector('input, select, textarea, button');
        if (firstInput) setTimeout(() => firstInput.focus(), 50);
      }
    });
  });

  /* ── Event RSVP modal ── */
  const rsvpOverlay = document.getElementById('rsvp-overlay');
  document.querySelectorAll('[data-modal="rsvp"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const name = btn.dataset.event || '';
      const evTitle = document.getElementById('rsvp-event-title');
      if (evTitle) evTitle.textContent = name;
      if (rsvpOverlay) {
        rsvpOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        const firstInput = rsvpOverlay.querySelector('input, select, textarea, button:not(.close)');
        if (firstInput) setTimeout(() => firstInput.focus(), 50);
      }
    });
  });

  /* ── Close all modals ── */
  const closeAll = () => {
    document.querySelectorAll('.overlay').forEach(o => o.classList.remove('open'));
    document.body.style.overflow = '';
  };
  document.querySelectorAll('.overlay').forEach(overlay => {
    overlay.addEventListener('click', e => { if (e.target === overlay) closeAll(); });
  });
  document.querySelectorAll('.modal .close, .modal .close-btn').forEach(btn => {
    btn.addEventListener('click', closeAll);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

  /* ── Submit form ── */
  if (submitForm) {
    submitForm.addEventListener('submit', e => {
      e.preventDefault();
      submitForm.style.display = 'none';
      if (submitSuccess) submitSuccess.style.display = 'block';
      setTimeout(() => {
        closeAll();
        submitForm.style.display = 'block';
        if (submitSuccess) submitSuccess.style.display = 'none';
        submitForm.reset();
      }, 3500);
    });
  }

  /* ── RSVP form ── */
  const rsvpForm    = document.getElementById('rsvp-form');
  const rsvpSuccess = document.getElementById('rsvp-success');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', e => {
      e.preventDefault();
      rsvpForm.style.display = 'none';
      if (rsvpSuccess) rsvpSuccess.style.display = 'block';
      setTimeout(() => {
        closeAll();
        rsvpForm.style.display = 'block';
        if (rsvpSuccess) rsvpSuccess.style.display = 'none';
        rsvpForm.reset();
      }, 3000);
    });
  }

  /* ── Newsletter forms ── */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button');
      if (btn) {
        btn.textContent = 'Subscribed ✓';
        btn.style.background = '#166534';
        btn.disabled = true;
      }
    });
  });

  /* ═══════════════════════════════════════════════════════════
     EVENT PAGINATION — loads 50 at a time, works on both
     index.html (homepage preview) and pages/events.html
  ═══════════════════════════════════════════════════════════ */

  const PAGE_SIZE = 50;

  function initPagination(gridId, showMoreId, counterId) {
    const grid     = document.getElementById(gridId);
    const showMore = document.getElementById(showMoreId);
    const counter  = document.getElementById(counterId);
    if (!grid || !showMore) return;

    // All real event cards (exclude the submit-prompt card)
    const allCards = Array.from(
      grid.querySelectorAll('.event-card[data-category]')
    );

    let visibleCount = 0;
    let activeFilter = 'all';

    function getFilteredCards() {
      return activeFilter === 'all'
        ? allCards
        : allCards.filter(c => c.dataset.category === activeFilter);
    }

    function updateCounter(filtered) {
      if (!counter) return;
      const shown = Math.min(visibleCount, filtered.length);
      counter.textContent = `Showing ${shown} of ${filtered.length} event${filtered.length !== 1 ? 's' : ''}`;
    }

    function applyVisibility() {
      const filtered = getFilteredCards();

      allCards.forEach(card => {
        // First hide all
        card.style.display = 'none';
      });

      // Show filtered up to visibleCount
      filtered.forEach((card, i) => {
        card.style.display = i < visibleCount ? '' : 'none';
      });

      // Show/hide the "Show more" button
      const hasMore = filtered.length > visibleCount;
      showMore.style.display = hasMore ? 'flex' : 'none';

      // Update remaining count on button
      const remaining = filtered.length - visibleCount;
      const btnText   = showMore.querySelector('.show-more-text');
      const btnCount  = showMore.querySelector('.show-more-count');
      if (btnText) btnText.textContent = 'Show more events';
      if (btnCount) btnCount.textContent =
        remaining > 0 ? `${Math.min(remaining, PAGE_SIZE)} of ${remaining} remaining` : '';

      updateCounter(filtered);
    }

    function showNextPage() {
      visibleCount += PAGE_SIZE;
      applyVisibility();

      // Smooth scroll to the first newly visible card
      const filtered  = getFilteredCards();
      const newFirst  = filtered[visibleCount - PAGE_SIZE];
      if (newFirst) {
        newFirst.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }

    // Initial load
    visibleCount = PAGE_SIZE;
    applyVisibility();

    // Show more button click
    showMore.addEventListener('click', showNextPage);

    // Wire up filter buttons if present
    const filterBtns = document.querySelectorAll('[data-filter]');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter  = btn.dataset.filter;
        visibleCount  = PAGE_SIZE;   // reset to first page on filter change
        applyVisibility();
      });
    });
  }

  // Initialise on homepage
  initPagination('events-grid', 'events-show-more', 'events-counter');

  // Initialise on events.html (same grid ID works for both pages)

});
