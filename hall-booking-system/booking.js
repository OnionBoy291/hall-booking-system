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
    
    // Location text
    hallLocationText.innerText = selectedHall.location || 'Malaysia';
    sidebarLocationEl.innerText = selectedHall.location || 'Malaysia';
    
    // Description and capacity
    if (selectedHall.description) {
        hallDescriptionEl.innerText = selectedHall.description;
    }
    if (selectedHall.capacity) {
        hallCapacityEl.innerText = selectedHall.capacity;
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

// 5. Form Submission
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


// 6. Gallery modal function
function openGallery() {
    alert('Photo gallery would open here with all venue images.');
}

