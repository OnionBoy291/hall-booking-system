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

// Hall data with additional info
const hallData = {
    'KL Convention Centre': {
        capacity: 'Up to 3,000 guests',
        description: 'The Kuala Lumpur Convention Centre is a world-class venue located in the heart of KLCC. Featuring state-of-the-art facilities, multiple halls, and stunning views of the Petronas Twin Towers. Perfect for international conferences, exhibitions, and grand celebrations.',
        reviewScore: '9.2',
        reviewCount: '2,847',
        location: 'Kuala Lumpur City Centre'
    },
    'Sunway Pyramid Convention': {
        capacity: 'Up to 1,500 guests',
        description: 'Located within the iconic Sunway Pyramid shopping mall, this convention centre offers versatile event spaces with easy access to entertainment, dining, and accommodation options. Ideal for corporate events and product launches.',
        reviewScore: '8.7',
        reviewCount: '1,523',
        location: 'Petaling Jaya, Selangor'
    },
    'Setia City Convention Centre': {
        capacity: 'Up to 2,000 guests',
        description: 'Setia City Convention Centre is a modern multi-purpose venue in Setia Alam. With its contemporary design and flexible spaces, it caters to exhibitions, conferences, weddings, and large-scale events.',
        reviewScore: '9.0',
        reviewCount: '1,124',
        location: 'Shah Alam, Selangor'
    },
    'MATRADE Exhibition Centre': {
        capacity: 'Up to 2,500 guests',
        description: 'MATRADE Exhibition and Convention Centre is Malaysia premier trade and exhibition venue. Featuring expansive halls and meeting rooms, it hosts major international trade shows and business events.',
        reviewScore: '8.8',
        reviewCount: '1,891',
        location: 'Kuala Lumpur'
    },
    'Persada Johor Convention Centre': {
        capacity: 'Up to 4,000 guests',
        description: 'Persada Johor International Convention Centre is the largest convention centre in southern Malaysia. Its striking architecture and waterfront location make it a landmark venue for major events.',
        reviewScore: '9.1',
        reviewCount: '987',
        location: 'Johor Bahru, Johor'
    },
    'SPICE Arena Penang': {
        capacity: 'Up to 10,000 guests',
        description: 'SPICE Arena is Penang premier indoor arena and convention centre. With its massive capacity and modern facilities, it hosts concerts, sports events, exhibitions, and large conferences.',
        reviewScore: '8.9',
        reviewCount: '2,156',
        location: 'Bayan Lepas, Penang'
    },
    'Hang Tuah Stadium Melaka': {
        capacity: 'Up to 1,000 guests',
        description: 'Hang Tuah Stadium offers a unique venue for events in historic Melaka. With both indoor and outdoor facilities, it is perfect for sports events, community gatherings, and cultural celebrations.',
        reviewScore: '8.5',
        reviewCount: '742',
        location: 'Melaka City, Melaka'
    }
};

// 3. Populate page with hall data
if (selectedHall && selectedHall.name === hallName) {
    const extraData = hallData[hallName] || {};
    
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
    hallLocationText.innerText = extraData.location || 'Malaysia';
    sidebarLocationEl.innerText = extraData.location || 'Malaysia';
    
    // Description and capacity
    if (extraData.description) {
        hallDescriptionEl.innerText = extraData.description;
    }
    if (extraData.capacity) {
        hallCapacityEl.innerText = extraData.capacity;
    }
    
    // Review score
    if (extraData.reviewScore) {
        reviewScoreEl.innerText = extraData.reviewScore;
        miniScoreEl.innerText = extraData.reviewScore;
        sidebarScoreEl.innerText = 'Excellent';
    }
    
    // Update review count text
    const reviewCountEl = document.getElementById('review-count');
    if (reviewCountEl && extraData.reviewCount) {
        reviewCountEl.innerText = `${extraData.reviewCount} reviews`;
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

    // Get existing bookings
    let allBookings = JSON.parse(localStorage.getItem('allBookings')) || [];

    // Check if hall is already booked on this date
    const isBooked = allBookings.some(b => b.hallName === hallName && b.date === date);

    if (isBooked) {
        alert("Sorry, this date is already taken for " + hallName + ". Please choose another date.");
    } else {
        // Save new booking
        const newBooking = {
            hallName: hallName,
            customerName: fullName,
            ic: ic,
            date: date,
            payment: payment,
            decoration: decoration,
            theme: theme
        };

        allBookings.push(newBooking);
        localStorage.setItem('allBookings', JSON.stringify(allBookings));

        // Save as 'userBooking' for homepage reminder
        localStorage.setItem('userBooking', JSON.stringify(newBooking));

        alert("Payment Successful! Your booking is confirmed.");
        window.location.href = 'homepage.html';
    }
});

// 6. Gallery modal function
function openGallery() {
    alert('Photo gallery would open here with all venue images.');
}

