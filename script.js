(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var header = document.getElementById('siteHeader');
  var menuBtn = document.getElementById('menuBtn');
  var navLinks = document.getElementById('navLinks');
  var modal = document.getElementById('paymentModal');
  var closeBtn = document.getElementById('modalClose');
  var payImg = document.getElementById('payImg');
  var payMissing = document.getElementById('payMissing');
  var openers = document.querySelectorAll('[data-open-payment]');
  var lastFocus = null;

  /* ---- Header background on scroll ---- */
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  function setMenu(open) {
    navLinks.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  menuBtn.addEventListener('click', function () {
    setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
  });
  navLinks.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('click', function (e) {
    if (!header.contains(e.target)) setMenu(false);
  });

  /* ---- Scroll reveal ---- */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Payment image fallback ---- */
  payImg.addEventListener('error', function () {
    payImg.hidden = true;
    payMissing.hidden = false;
  });
  payImg.addEventListener('load', function () {
    payImg.hidden = false;
    payMissing.hidden = true;
  });

  /* ---- Payment modal ---- */
  function openModal() {
    lastFocus = document.activeElement;
    setMenu(false);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    closeBtn.focus();
  }
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  openers.forEach(function (btn) { btn.addEventListener('click', openModal); });
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (!modal.classList.contains('open')) {
      if (e.key === 'Escape') setMenu(false);
      return;
    }
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key === 'Tab') { /* keep focus inside the modal */
      e.preventDefault();
      closeBtn.focus();
    }
  });
})();