/* expatevents.org — main.js */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Active nav ── */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  /* ── Knowledge base tab switcher ── */
  const kbTabs = document.querySelectorAll('.kb-tab');
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
  const submitOverlay  = document.getElementById('submit-overlay');
  const submitForm     = document.getElementById('submit-form');
  const submitSuccess  = document.getElementById('submit-success');

  document.querySelectorAll('[data-modal="submit"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const topic = btn.dataset.topic || '';
      const topicSel = document.getElementById('post-topic');
      if (topicSel && topic) topicSel.value = topic;
      if (submitOverlay) {
        submitOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
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
  document.querySelectorAll('.modal .close').forEach(btn => {
    btn.addEventListener('click', closeAll);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

  /* ── Submit post form ── */
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
  const rsvpForm = document.getElementById('rsvp-form');
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

  /* ── Newsletter form ── */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button');
      if (btn) { btn.textContent = 'Subscribed ✓'; btn.style.background = 'var(--green-text)'; btn.disabled = true; }
    });
  });

  /* ── Event filter tabs ── */
  const filterBtns = document.querySelectorAll('[data-filter]');
  const eventCards = document.querySelectorAll('[data-category]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      eventCards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? '' : 'none';
      });
    });
  });

});
