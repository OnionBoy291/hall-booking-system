// Confirm Reservation page logic

function money(n) {
  const num = Number(n) || 0;
  return `RM ${num.toLocaleString()}`;
}

function mapPayment(method) {
  const map = {
    online: 'Online Banking (FPX)',
    card: 'Credit/Debit Card',
    ewallet: 'E-Wallet (TNG/Grab)'
  };
  return map[method] || method || '-';
}

function getSafeText(val, fallback = '-') {
  if (val === undefined || val === null || val === '') return fallback;
  return String(val);
}

const selectedHall = JSON.parse(localStorage.getItem('selectedHall'));
const pending = JSON.parse(localStorage.getItem('pendingReservation'));

// Elements
const imgEl = document.getElementById('confirm-hall-image');
const nameEl = document.getElementById('confirm-hall-name');
const locEl = document.getElementById('confirm-hall-location');

const fullnameEl = document.getElementById('confirm-fullname');
const icEl = document.getElementById('confirm-ic');
const dateEl = document.getElementById('confirm-date');
const paymentEl = document.getElementById('confirm-payment');
const themeEl = document.getElementById('confirm-theme');
const decoEl = document.getElementById('confirm-decoration');

const hallPriceEl = document.getElementById('confirm-hall-price');
const decoRowEl = document.getElementById('confirm-decoration-row');
const totalEl = document.getElementById('confirm-total');

const overlayEl = document.getElementById('modal-overlay');
const yesBtn = document.getElementById('modal-yes');
const noBtn = document.getElementById('modal-no');
const reserveBtn = document.getElementById('confirm-reserve-btn');

function showModal() {
  overlayEl.classList.add('show');
  overlayEl.setAttribute('aria-hidden', 'false');
}

function hideModal() {
  overlayEl.classList.remove('show');
  overlayEl.setAttribute('aria-hidden', 'true');
}

if (!selectedHall || !pending) {
  // Keep page functional even if storage missing
  nameEl.textContent = getSafeText(selectedHall?.name, 'Unknown Hall');
  locEl.textContent = '-';
  if (imgEl) imgEl.src = selectedHall?.img || '';
  fullnameEl.textContent = pending?.customerName || '-';
  icEl.textContent = pending?.ic || '-';
  dateEl.textContent = pending?.date || '-';
  paymentEl.textContent = mapPayment(pending?.payment);
  themeEl.textContent = pending?.theme || 'None';
  decoEl.textContent = pending?.decoration ? 'Yes' : 'No';
  hallPriceEl.textContent = money(selectedHall?.price);
  totalEl.textContent = money(selectedHall?.price);
} else {
  imgEl.src = selectedHall.img;
  nameEl.textContent = selectedHall.name;
  locEl.textContent = selectedHall.location ? selectedHall.location : '-';

  fullnameEl.textContent = pending.customerName;
  icEl.textContent = pending.ic;
  dateEl.textContent = pending.date;
  paymentEl.textContent = mapPayment(pending.payment);
  themeEl.textContent = pending.decoration ? (pending.theme || 'None') : 'None';
  decoEl.textContent = pending.decoration ? 'Yes' : 'No';

  const basePrice = Number(selectedHall.price) || 0;
  const decorationPrice = 200;
  const totalPrice = basePrice + (pending.decoration ? decorationPrice : 0);

  hallPriceEl.textContent = money(basePrice);

  if (pending.decoration) {
    decoRowEl.style.display = 'flex';
    totalEl.textContent = money(totalPrice);
  } else {
    decoRowEl.style.display = 'none';
    totalEl.textContent = money(totalPrice);
  }
}

// Modal wiring
reserveBtn.addEventListener('click', () => {
  showModal();
});

noBtn.addEventListener('click', () => {
  hideModal();
});

yesBtn.addEventListener('click', () => {
  // Save to bookings (same format as booking.js previously)
  if (selectedHall && pending) {
    const hallName = pending.hallName || selectedHall.name;
    const date = pending.date;

    let allBookings = JSON.parse(localStorage.getItem('allBookings')) || [];

    const newBooking = {
      hallName,
      customerName: pending.customerName,
      ic: pending.ic,
      date: date,
      payment: pending.payment,
      decoration: !!pending.decoration,
      theme: pending.decoration ? (pending.theme || '') : ''
    };

    const isBooked = allBookings.some(b => b.hallName === hallName && b.date === date);
    if (isBooked) {
      alert('Sorry, this date is already taken for ' + hallName + '. Please choose another date.');
      hideModal();
      return;
    }

    allBookings.push(newBooking);
    localStorage.setItem('allBookings', JSON.stringify(allBookings));
    localStorage.setItem('userBooking', JSON.stringify(newBooking));
  }

  hideModal();
  alert('Thankyou for you reservation');
  window.location.href = 'homepage.html';
});

// Click outside modal to close
overlayEl.addEventListener('click', (e) => {
  if (e.target === overlayEl) hideModal();
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') hideModal();
});

