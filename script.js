const gate = document.getElementById('gate');
const siteContent = document.getElementById('site-content');
const gateForm = document.getElementById('gate-form');
const gateMessage = document.getElementById('gate-message');
const rsvpForm = document.getElementById('rsvp-form');
const rsvpMessage = document.getElementById('rsvp-message');

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

rsvpForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  rsvpMessage.textContent = 'Sending your RSVP...';

  fetch(rsvpForm.action, {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: new FormData(rsvpForm)
  })
    .then(() => {
      rsvpForm.reset();
      rsvpMessage.textContent = 'Thank you for your response. We have received your RSVP.';
    })
    .catch(() => {
      rsvpMessage.textContent = 'We could not send the RSVP automatically right now. Please try again in a moment.';
    });
});
