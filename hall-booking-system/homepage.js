// ============================================
// DATABASE - Real Malaysian Halls with Full Details
// ============================================
const allHalls = [
    {
        name: "KL Convention Centre",
        price: 1500,
        location: "kl",
        rating: 5,
        reviewScore: 9.2,
        reviewCount: 2847,
        img: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Kuala_Lumpur_Convention_Centre_%28northeastern_exterior%29%2C_Kuala_Lumpur.jpg",
        address: "Kuala Lumpur Convention Centre, Jalan Pinang, 50088 Kuala Lumpur",
        distance: "0.5 km from KLCC",
        amenities: ["Free WiFi", "Parking", "Air conditioning", "Catering"],
        highlights: ["Genius discount", "Free cancellation"],
        capacity: "Up to 3,000 guests",
        description: "World-class venue in the heart of KLCC with stunning Petronas Twin Towers views."
    },
    {
        name: "Sunway Pyramid Convention",
        price: 900,
        location: "pj",
        rating: 4,
        reviewScore: 8.7,
        reviewCount: 1523,
        img: "https://upload.wikimedia.org/wikipedia/commons/6/64/Sunway_pyramid_mall_malaysia_photos_%2821%29.JPG",
        address: "Sunway Pyramid, Jalan PJS 11/15, Bandar Sunway, 47500 Petaling Jaya",
        distance: "15 km from KL city centre",
        amenities: ["Free WiFi", "Parking", "Shopping access", "Hotel nearby"],
        highlights: ["Best seller"],
        capacity: "Up to 1,500 guests",
        description: "Versatile event spaces within the iconic Sunway Pyramid shopping mall."
    },
    {
        name: "Setia City Convention Centre",
        price: 2100,
        location: "sa",
        rating: 5,
        reviewScore: 9.0,
        reviewCount: 1124,
        img: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Setia_City_Convention_Centre_%28250521-1833%29.jpg",
        address: "Setia City Convention Centre, Jalan Setia Dagang AG U13/AG, Setia Alam",
        distance: "25 km from KL city centre",
        amenities: ["Free WiFi", "Parking", "Modern AV", "Spacious halls"],
        highlights: ["Top rated", "Free cancellation"],
        capacity: "Up to 2,000 guests",
        description: "Modern multi-purpose venue with contemporary design in Setia Alam."
    },
    {
        name: "MATRADE Exhibition Centre",
        price: 1800,
        location: "kl",
        rating: 4,
        reviewScore: 8.8,
        reviewCount: 1891,
        img: "https://upload.wikimedia.org/wikipedia/commons/c/ce/MATRADE_Exhibition_and_Convention_Centre_and_Menara_MITI_in_April_2020.jpg",
        address: "MATRADE Exhibition Centre, Jalan Khidmat Usaha, 50480 Kuala Lumpur",
        distance: "5 km from KL city centre",
        amenities: ["Free WiFi", "Parking", "Trade show ready", "Meeting rooms"],
        highlights: ["Genius discount"],
        capacity: "Up to 2,500 guests",
        description: "Malaysia's premier trade and exhibition venue with expansive halls."
    },
    {
        name: "Persada Johor Convention Centre",
        price: 1200,
        location: "johor",
        rating: 5,
        reviewScore: 9.1,
        reviewCount: 987,
        img: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Persada_Johor_International_Convention_Centre%2C_Johor_Bahru.jpg",
        address: "Persada Johor, Jalan Abdullah Ibrahim, 80000 Johor Bahru",
        distance: "1 km from JB city centre",
        amenities: ["Free WiFi", "Parking", "Waterfront view", "VIP rooms"],
        highlights: ["Top location"],
        capacity: "Up to 4,000 guests",
        description: "Largest convention centre in southern Malaysia with waterfront location."
    },
    {
        name: "SPICE Arena Penang",
        price: 1100,
        location: "penang",
        rating: 4,
        reviewScore: 8.9,
        reviewCount: 2156,
        img: "https://upload.wikimedia.org/wikipedia/commons/2/2c/SPICE_Arena_2023.jpg",
        address: "SPICE Arena, Jalan Tun Dr Awang, 11900 Bayan Lepas, Penang",
        distance: "10 km from Georgetown",
        amenities: ["Free WiFi", "Parking", "Massive capacity", "Modern facilities"],
        highlights: ["Best seller", "Free cancellation"],
        capacity: "Up to 10,000 guests",
        description: "Penang's premier indoor arena for concerts, exhibitions, and conferences."
    },
    {
        name: "Hang Tuah Stadium Melaka",
        price: 800,
        location: "melaka",
        rating: 4,
        reviewScore: 8.5,
        reviewCount: 742,
        img: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Hang_Tuah_Stadium.JPG",
        address: "Hang Tuah Stadium, Jalan Hang Tuah, 75300 Melaka",
        distance: "2 km from Melaka city centre",
        amenities: ["Parking", "Outdoor space", "Historic location", "Budget friendly"],
        highlights: ["Great value"],
        capacity: "Up to 1,000 guests",
        description: "Unique venue in historic Melaka with indoor and outdoor facilities."
    },
    {
        name: "MITEC Kuala Lumpur",
        price: 2500,
        location: "kl",
        rating: 5,
        reviewScore: 9.3,
        reviewCount: 1567,
        img: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Malaysia_International_Trade_and_Exhibition_Centre_in_April_2020_01.jpg",
        address: "MITEC, 8 Jalan Dutamas 2, Kompleks Kerajaan, 50480 Kuala Lumpur",
        distance: "8 km from KL city centre",
        amenities: ["Free WiFi", "Parking", "Massive halls", "Modern facilities"],
        highlights: ["Top rated", "Genius discount"],
        capacity: "Up to 5,000 guests",
        description: "Malaysia's largest exhibition centre with state-of-the-art facilities for international events."
    }
];

// Location name mapping
const locationNames = {
    "kl": "Kuala Lumpur",
    "pj": "Petaling Jaya",
    "sa": "Shah Alam",
    "johor": "Johor Bahru",
    "penang": "Penang",
    "melaka": "Melaka"
};

// Score label mapping
function getScoreLabel(score) {
    if (score >= 9) return "Wonderful";
    if (score >= 8.5) return "Excellent";
    if (score >= 8) return "Very Good";
    if (score >= 7) return "Good";
    return "Pleasant";
}

// ============================================
// BOOKING REMINDER - PREMIUM DESIGN
// ============================================
function checkReminder() {
    const reminderSection = document.getElementById('booking-reminder');
    const data = JSON.parse(localStorage.getItem('userBooking'));

    if (data) {
        // Calculate days until booking
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const bookingDate = new Date(data.date);
        const diffTime = bookingDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let countdownHtml = '';
        if (diffDays > 0) {
            countdownHtml = `
                <div class="countdown-timer">
                    <div class="countdown-item">
                        <span class="countdown-value">${diffDays}</span>
                        <div class="countdown-label">Days</div>
                    </div>
                </div>
            `;
        } else if (diffDays === 0) {
            countdownHtml = `
                <div class="countdown-timer">
                    <div class="countdown-item" style="background: rgba(255, 217, 0, 0.3); border-color: rgba(0, 0, 0, 0.2);">
                        <span class="countdown-value" style="color: #000000;">Today</span>
                        <div class="countdown-label">It's here!</div>
                    </div>
                </div>
            `;
        }

        reminderSection.innerHTML = `
            <div class="booking-reminder-card">
                <div class="reminder-content">
                    <div class="reminder-icon-wrapper">
                        <i class="fas fa-calendar-check"></i>
                    </div>
                    <div class="reminder-details">
                        <div class="reminder-badge">
                            <span class="pulse-dot"></span>
                            Upcoming Booking
                        </div>
                        <h3>${data.hallName}</h3>
                        <p>You have a reservation on <strong>${data.date}</strong></p>
                        <div class="reminder-meta">
                            <div class="reminder-meta-item">
                                <i class="fas fa-user"></i>
                                <span>${data.customerName}</span>
                            </div>
                            <div class="reminder-meta-item">
                                <i class="fas fa-clock"></i>
                                <span>${diffDays > 0 ? diffDays + ' days remaining' : (diffDays === 0 ? 'Today' : 'Past booking')}</span>
                            </div>
                            <div class="reminder-meta-item">
                                <i class="fas fa-credit-card"></i>
                                <span>${formatPayment(data.payment)}</span>
                            </div>
                        </div>
                        ${countdownHtml}
                    </div>
                    <div class="reminder-actions">
                        <button class="reminder-btn reminder-btn-primary" onclick="window.location.href='history.html'">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        <button class="reminder-btn reminder-btn-secondary" onclick="window.location.href='booking.html?hall=${encodeURIComponent(data.hallName)}'">
                            <i class="fas fa-plus"></i> Book Again
                        </button>
                    </div>
                </div>
            </div>
        `;
    } else {
        reminderSection.innerHTML = `
            <div class="reminder-empty-card">
                <div class="empty-icon-wrapper">
                    <i class="fas fa-calendar-plus"></i>
                </div>
                <h3>No Bookings Found</h3>
                <p>Start exploring our halls and make your first booking today!</p>
                <a href="#hall-list" class="explore-btn-fancy" onclick="document.getElementById('hall-list').scrollIntoView({behavior: 'smooth'}); return false;">
                    <i class="fas fa-search"></i> Explore Halls
                </a>
            </div>
        `;
    }
}

// Helper function to format payment method
function formatPayment(method) {
    const map = {
        'online': 'Online Banking (FPX)',
        'card': 'Credit/Debit Card',
        'ewallet': 'E-Wallet (TNG/Grab)'
    };
    return map[method] || method;
}

// ============================================
// RENDER HALLS - GRID OR LIST VIEW
// ============================================
let isSearchActive = false;

function renderHalls(hallsToDisplay) {
    const wrapper = document.getElementById('hall-list');
    wrapper.innerHTML = "";

    if (hallsToDisplay.length === 0) {
        wrapper.innerHTML = `<div class="no-results">
            <i class="fas fa-search"></i>
            <h3>No halls found</h3>
            <p>Try adjusting your search or filters</p>
        </div>`;
        return;
    }

    // Determine view mode based on search/filters
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const priceFilter = document.getElementById('priceFilter').value;
    const locFilter = document.getElementById('locationFilter').value;
    const rateFilter = document.getElementById('ratingFilter').value;

    isSearchActive = searchValue !== '' || priceFilter !== 'all' || locFilter !== 'all' || rateFilter !== 'all';

    // Update container class
    if (isSearchActive) {
        wrapper.classList.remove('halls-grid');
        wrapper.classList.add('halls-list');
    } else {
        wrapper.classList.remove('halls-list');
        wrapper.classList.add('halls-grid');
    }

    hallsToDisplay.forEach((hall, index) => {
        const locationName = locationNames[hall.location] || hall.location;
        const scoreLabel = getScoreLabel(hall.reviewScore);
        const formattedPrice = hall.price.toLocaleString();

        if (isSearchActive) {
            // Horizontal list view (Booking.com style)
            wrapper.innerHTML += createListCard(hall, locationName, scoreLabel, formattedPrice, index);
        } else {
            // Grid view (default)
            wrapper.innerHTML += createGridCard(hall, locationName, scoreLabel, formattedPrice, index);
        }
    });
}

// ============================================
// GRID CARD (Default View)
// ============================================
function createGridCard(hall, locationName, scoreLabel, formattedPrice, index) {
    const amenitiesHtml = hall.amenities.slice(0, 3).map(a => `<span class="amenity-tag"><i class="fas fa-check"></i> ${a}</span>`).join('');
    const highlightsHtml = hall.highlights.map(h => `<span class="highlight-tag">${h}</span>`).join('');

    return `
        <div class="hall-card" onclick="redirectToBooking('${hall.name}')" style="animation-delay: ${index * 0.05}s">
            <div class="hall-image-wrapper">
                <img src="${hall.img}" alt="${hall.name}" loading="lazy">
                <div class="rating-badge">${hall.rating} <i class="fas fa-star"></i></div>
                ${hall.highlights.includes('Best seller') ? '<div class="bestseller-badge">Best Seller</div>' : ''}
                <button class="heart-btn" onclick="event.stopPropagation(); toggleHeart(this)">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="hall-info">
                <div class="hall-header">
                    <h3 class="hall-title">${hall.name}</h3>
                    <div class="hall-score-badge">
                        <div class="score-number">${hall.reviewScore}</div>
                        <div class="score-word">${scoreLabel}</div>
                    </div>
                </div>
                <div class="hall-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${locationName}</span>
                    <span class="distance">· ${hall.distance}</span>
                </div>
                <div class="hall-amenities">
                    ${amenitiesHtml}
                </div>
                <div class="hall-highlights">
                    ${highlightsHtml}
                </div>
                <div class="hall-footer">
                    <div class="review-summary">
                        <span class="review-count">${hall.reviewCount.toLocaleString()} reviews</span>
                    </div>
                    <div class="price-section">
                        <div class="price-label">Price for 1 day</div>
                        <div class="price-value">RM ${formattedPrice}</div>
                        <div class="price-note">Includes taxes and charges</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// LIST CARD (Search Results - Horizontal)
// ============================================
function createListCard(hall, locationName, scoreLabel, formattedPrice, index) {
    const amenitiesHtml = hall.amenities.map(a => `<span class="amenity-item"><i class="fas fa-check"></i> ${a}</span>`).join('');
    const highlightsHtml = hall.highlights.map(h => {
        const icon = h.includes('Genius') ? 'fa-gem' : h.includes('cancellation') ? 'fa-check-circle' : 'fa-thumbs-up';
        return `<div class="list-highlight"><i class="fas ${icon}"></i> ${h}</div>`;
    }).join('');

    return `
        <div class="hall-list-card" onclick="redirectToBooking('${hall.name}')" style="animation-delay: ${index * 0.05}s">
            <div class="list-image-section">
                <img src="${hall.img}" alt="${hall.name}" loading="lazy">
                <div class="rating-badge">${hall.rating} <i class="fas fa-star"></i></div>
                ${hall.highlights.includes('Best seller') ? '<div class="bestseller-badge">Best Seller</div>' : ''}
                <button class="heart-btn" onclick="event.stopPropagation(); toggleHeart(this)">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="list-content-section">
                <div class="list-main-info">
                    <div class="list-header">
                        <h3 class="list-title">${hall.name}</h3>
                        <div class="list-location-row">
                            <span class="list-location"><i class="fas fa-map-marker-alt"></i> ${locationName}</span>
                            <span class="list-distance">· ${hall.distance}</span>
                            <a href="#" class="show-map" onclick="event.stopPropagation()">Show on map</a>
                        </div>
                    </div>
                    <div class="list-amenities">
                        ${amenitiesHtml}
                    </div>
                    <div class="list-description">
                        <p>${hall.description}</p>
                    </div>
                    <div class="list-capacity">
                        <i class="fas fa-users"></i> Capacity: ${hall.capacity}
                    </div>
                </div>
                <div class="list-score-section">
                    <div class="score-header">
                        <div class="score-text">
                            <div class="score-word-large">${scoreLabel}</div>
                            <div class="score-reviews">${hall.reviewCount.toLocaleString()} reviews</div>
                        </div>
                        <div class="score-number-large">${hall.reviewScore}</div>
                    </div>
                    <div class="list-highlights">
                        ${highlightsHtml}
                    </div>
                    <div class="list-price-section">
                        <div class="price-label">Price for 1 day</div>
                        <div class="price-value-large">RM ${formattedPrice}</div>
                        <div class="price-note">Includes taxes and charges</div>
                    </div>
                    <button class="availability-btn" onclick="event.stopPropagation(); redirectToBooking('${hall.name}')">
                        See availability <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// HEART BUTTON TOGGLE
// ============================================
function toggleHeart(btn) {
    const icon = btn.querySelector('i');
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        btn.style.color = '#000000';
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        btn.style.color = '';
    }
}

// ============================================
// FILTERS & SEARCH
// ============================================
function applyFilters() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const price = document.getElementById('priceFilter').value;
    const loc = document.getElementById('locationFilter').value;
    const rate = document.getElementById('ratingFilter').value;

    const filtered = allHalls.filter(hall => {
        const matchesSearch = hall.name.toLowerCase().includes(search) ||
                              locationNames[hall.location].toLowerCase().includes(search) ||
                              hall.address.toLowerCase().includes(search);

        let matchesPrice = true;
        if (price === "low") matchesPrice = hall.price < 1000;
        else if (price === "mid") matchesPrice = hall.price >= 1000 && hall.price <= 2000;
        else if (price === "high") matchesPrice = hall.price > 2000;

        const matchesLoc = (loc === "all") || (hall.location === loc);

        let matchesRate = true;
        if (rate === "5") matchesRate = hall.rating === 5;
        else if (rate === "4") matchesRate = hall.rating >= 4;

        return matchesSearch && matchesPrice && matchesLoc && matchesRate;
    });

    renderHalls(filtered);
}

// ============================================
// REDIRECT TO BOOKING
// ============================================
function redirectToBooking(name) {
    const selectedHall = allHalls.find(h => h.name === name);
    if (selectedHall) {
        localStorage.setItem('selectedHall', JSON.stringify(selectedHall));
    }
    window.location.href = `booking.html?hall=${encodeURIComponent(name)}`;
}

// ============================================
// WINDOW LOAD
// ============================================
window.onload = () => {
    checkReminder();
    renderHalls(allHalls);

    // Event listeners
    document.getElementById('searchInput').addEventListener('input', applyFilters);
    document.getElementById('priceFilter').addEventListener('change', applyFilters);
    document.getElementById('locationFilter').addEventListener('change', applyFilters);
    document.getElementById('ratingFilter').addEventListener('change', applyFilters);
    document.getElementById('searchBtn').addEventListener('click', applyFilters);
};

