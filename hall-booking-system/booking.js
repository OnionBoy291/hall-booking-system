// ============================================
// BOOKING PAGE - BOOKING.COM STYLE
// ============================================

// 1. Get hall name from URL
const urlParams = new URLSearchParams(window.location.search);
const hallName = urlParams.get('hall');

// 2. Get full hall data from localStorage (set by homepage.js)
const selectedHall = JSON.parse(localStorage.getItem('selectedHall'));

// Element references
const hallImageMain = document.getElementById('hall-image-main');
const hallTitleEl = document.getElementById('hall-title');
const hallStarsEl = document.getElementById('hall-stars');
const hallLocationText = document.getElementById('hall-location-text');
const hallAddressEl = document.getElementById('hall-address');
const hallMapEl = document.getElementById('hall-map');
const hallCapacityEl = document.getElementById('hall-capacity');
const hallDescriptionEl = document.getElementById('hall-description');
const reviewScoreEl = document.getElementById('review-score');
const sidebarPriceEl = document.getElementById('sidebar-price');
const sidebarLocationEl = document.getElementById('sidebar-location');
const sidebarScoreEl = document.getElementById('sidebar-score');
const sidebarImageEl = document.getElementById('sidebar-image');
const sidebarTitleEl = document.getElementById('sidebar-title');
const miniScoreEl = document.getElementById('mini-score');

// Price breakdown elements
const breakdownRentalEl = document.getElementById('breakdown-rental');
const breakdownDecorationRow = document.getElementById('breakdown-decoration-row');
const breakdownTotalEl = document.getElementById('breakdown-total');

let basePrice = 0;
const decorationPrice = 200;

// 3. Populate page with hall data
if (selectedHall && selectedHall.name === hallName) {
    
    // Main image
    hallImageMain.src = selectedHall.img;
    sidebarImageEl.src = selectedHall.img;
    
    // Text content
    hallTitleEl.innerText = selectedHall.name;
    sidebarTitleEl.innerText = selectedHall.name;
    hallAddressEl.innerText = selectedHall.address || '';
    
    // Stars
    let starsHtml = '';
    for (let i = 0; i < (selectedHall.rating || 4); i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }
    hallStarsEl.innerHTML = starsHtml;
    
    // Location text (convert short code to full city name + Malaysia)
    const locationCodes = {
        kl: 'Kuala Lumpur',
        pj: 'Petaling Jaya',
        sa: 'Shah Alam',
        johor: 'Johor Bahru',
        penang: 'Penang',
        melaka: 'Melaka'
    };

    const city = locationCodes[selectedHall.location] || selectedHall.location || 'Malaysia';
    hallLocationText.innerText = `${city}, Malaysia`;
    sidebarLocationEl.innerText = `${city}, Malaysia`;

    
    // Description and capacity
    if (selectedHall.description) {
        hallDescriptionEl.innerText = selectedHall.description;
    }
    if (selectedHall.capacity !== undefined && selectedHall.capacity !== null) {
        // halls.json stores capacity as number; keep the UI wording as "Up to ... guests"
        hallCapacityEl.innerText = `Up to ${Number(selectedHall.capacity).toLocaleString()} guests`;
    }

    
    // Review score
    if (selectedHall.reviewScore) {
        reviewScoreEl.innerText = selectedHall.reviewScore;
        miniScoreEl.innerText = selectedHall.reviewScore;
        sidebarScoreEl.innerText = 'Excellent';
    }
    
    // Update review count text
    const reviewCountEl = document.getElementById('review-count');
    if (reviewCountEl && selectedHall.reviewCount) {
        reviewCountEl.innerText = `${selectedHall.reviewCount} reviews`;
    }
    
    // Price
    basePrice = selectedHall.price;
    sidebarPriceEl.innerText = basePrice.toLocaleString();
    breakdownRentalEl.innerText = `RM ${basePrice.toLocaleString()}`;
    breakdownTotalEl.innerText = `RM ${basePrice.toLocaleString()}`;
    
    // Google Maps
    const mapQuery = encodeURIComponent(selectedHall.address || selectedHall.name);
    hallMapEl.src = `https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    
} else {
    hallTitleEl.innerText = hallName || 'Unknown Hall';
    hallImageMain.alt = 'Image not available';
    sidebarTitleEl.innerText = hallName || 'Unknown Hall';
}

// 4. Decoration Toggle Logic
const decorationCheck = document.getElementById('decorationCheck');
const themeSection = document.getElementById('themeSection');
const themeSelect = document.getElementById('themeSelect');

decorationCheck.addEventListener('change', function() {
    if (this.checked) {
        themeSection.style.display = 'block';
        themeSelect.setAttribute('required', 'required');
        breakdownDecorationRow.style.display = 'flex';
        breakdownTotalEl.innerText = `RM ${(basePrice + decorationPrice).toLocaleString()}`;
    } else {
        themeSection.style.display = 'none';
        themeSelect.removeAttribute('required');
        themeSelect.value = '';
        breakdownDecorationRow.style.display = 'none';
        breakdownTotalEl.innerText = `RM ${basePrice.toLocaleString()}`;
    }
});

// 5. Saved Halls (cross-page favourites)
const saveBtn = document.getElementById('saveBtn');

function getSavedHalls() {
    try {
        return JSON.parse(localStorage.getItem('savedHalls')) || [];
    } catch (e) {
        return [];
    }
}


function setSavedHalls(halls) {
    localStorage.setItem('savedHalls', JSON.stringify(halls));
}

function applySaveButtonState() {
    if (!saveBtn) return;
    if (!hallName) return;

    const saved = getSavedHalls();
    const isSaved = saved.includes(hallName);

    const icon = saveBtn.querySelector('i');
    if (!icon) return;

    if (isSaved) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        saveBtn.style.color = '#000000';
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        saveBtn.style.color = '';
    }
}

function toggleSave() {
    if (!saveBtn) return;
    if (!hallName) return;

    const saved = getSavedHalls();
    const isSaved = saved.includes(hallName);

    const next = isSaved ? saved.filter(n => n !== hallName) : [...saved, hallName];
    setSavedHalls(next);

    // reflect immediately
    applySaveButtonState();
}

if (saveBtn) {
    saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleSave();
    });
}

applySaveButtonState();

// 6. Form Submission
const bookingForm = document.getElementById('bookingForm');

bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const ic = document.getElementById('icNumber').value;
    const date = document.getElementById('bookingDate').value;
    const payment = document.getElementById('paymentMethod').value;
    const decoration = decorationCheck.checked;
    const theme = decoration ? themeSelect.value : '';

    // Validate: ensure required fields are present
    if (!fullName || !ic || !date || !payment) {
        alert('Please fill in all required details.');
        return;
    }

    // Store the form input as a pending reservation
    const pendingReservation = {
        hallName: hallName,
        customerName: fullName,
        ic: ic,
        date: date,
        payment: payment,
        decoration: decoration,
        theme: theme
    };

    localStorage.setItem('pendingReservation', JSON.stringify(pendingReservation));

    // Navigate to confirmation page
    window.location.href = 'confirm_reservation.html';
});

const shareButton = document.getElementById("shareBtn");

if (shareButton) shareButton.addEventListener("click", async () => {

  const shareData = {
    title: hallName ? `${hallName}` : "Hall Booking",
    text: hallName ? `Check out ${hallName} for your event!` : "Check out this hall for your event!",
    url: window.location.href
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  } catch (err) {
    console.log("Share cancelled");
  }
});

// 6. Gallery modal function

function openGallery() {
    alert('Photo gallery would open here with all venue images.');
}

