// Shared helpers used across hall-booking-system pages
// Exposes globals intentionally (simple vanilla JS project)

(function () {
  const locationCodes = {
    kl: 'Kuala Lumpur',
    pj: 'Petaling Jaya',
    sa: 'Shah Alam',
    johor: 'Johor Bahru',
    penang: 'Penang',
    melaka: 'Melaka'
  };

  const paymentLabels = {
    online: 'Online Banking (FPX)',
    card: 'Credit/Debit Card',
    ewallet: 'E-Wallet (TNG/Grab)'
  };

  window.bbFormatLocation = function bbFormatLocation(val) {
    if (!val) return '-';
    const s = String(val).trim();
    const key = s.toLowerCase();
    return locationCodes[key] ? `${locationCodes[key]}, Malaysia` : `${s}, Malaysia`;
  };

  window.bbFormatPayment = function bbFormatPayment(method) {
    if (method === undefined || method === null || method === '') return '-';
    const key = String(method).trim();
    return paymentLabels[key] || key;
  };

  window.bbMoney = function bbMoney(n) {
    const num = Number(n) || 0;
    return `RM ${num.toLocaleString()}`;
  };
})();

