const gate = document.getElementById('gate');
const siteContent = document.getElementById('site-content');
const gateForm = document.getElementById('gate-form');
const gateMessage = document.getElementById('gate-message');
const rsvpForm = document.getElementById('rsvp-form');
const rsvpMessage = document.getElementById('rsvp-message');
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const primaryNav = document.querySelector('.nav');

const correctPasscode = 'summerlove2027';

function unlockSite() {
  gate.style.display = 'none';
  gate.classList.add('hidden');
  siteContent.classList.remove('hidden');
  siteContent.style.display = 'block';
  sessionStorage.setItem('wedding-access', 'granted');
  gateMessage.textContent = '';
}

if (sessionStorage.getItem('wedding-access') === 'granted') {
  unlockSite();
}

gateForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = document.getElementById('passcode').value.trim();

  if (value === correctPasscode) {
    unlockSite();
  } else {
    gateMessage.textContent = 'That passcode is not correct. Please try again.';
  }
});

rsvpForm?.addEventListener('submit', () => {
  rsvpMessage.textContent = 'Sending your RSVP...';
});

function closeMobileNav() {
  primaryNav?.classList.remove('is-open');
  mobileNavToggle?.setAttribute('aria-expanded', 'false');
}

mobileNavToggle?.addEventListener('click', () => {
  if (!primaryNav) return;
  const isOpen = primaryNav.classList.toggle('is-open');
  mobileNavToggle.setAttribute('aria-expanded', String(isOpen));
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 560) {
    closeMobileNav();
  }
});

primaryNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 560) {
      closeMobileNav();
    }
  });
});
