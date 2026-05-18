let allHalls = [];
async function loadHalls() {
    try {
        const response = await fetch('halls.json');
        allHalls = await response.json();

        renderHalls(allHalls);
        applyLocationFromQuery();

    } catch (error) {
        console.error('Error loading halls:', error);
    }
}

const locationNames = {
    "kl": "Kuala Lumpur",
    "pj": "Petaling Jaya",
    "sa": "Shah Alam",
    "johor": "Johor Bahru",
    "penang": "Penang",
    "melaka": "Melaka"
};

function getScoreLabel(score) {
    if (score >= 9) return "Wonderful";
    if (score >= 8.5) return "Excellent";
    if (score >= 8) return "Very Good";
    if (score >= 7) return "Good";
    return "Pleasant";
}

function checkReminder() {
    const reminderSection = document.getElementById('booking-reminder');
    const data = JSON.parse(localStorage.getItem('userBooking'));

    if (data) {
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
                        ${bbFormatPayment(data.payment)}

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

function formatPayment(method) {
    const map = {
        'online': 'Online Banking (FPX)',
        'card': 'Credit/Debit Card',
        'ewallet': 'E-Wallet (TNG/Grab)'
    };
    return map[method] || method;
}

let isSearchActive = false;

function updateVenuesCount(count) {
    const el = document.getElementById('venuesCount');
    if (!el) return;
    el.innerText = `${count} venue${count === 1 ? '' : 's'} available for your next event`;
}

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

    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const priceFilter = document.getElementById('priceFilter').value;
    const locFilter = document.getElementById('locationFilter').value;
    const rateFilter = document.getElementById('ratingFilter').value;

    isSearchActive = searchValue !== '' || priceFilter !== 'all' || locFilter !== 'all' || rateFilter !== 'all';

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
            wrapper.innerHTML += createListCard(hall, locationName, scoreLabel, formattedPrice, index);
        } else {
            wrapper.innerHTML += createGridCard(hall, locationName, scoreLabel, formattedPrice, index);
        }
    });
}

function createGridCard(hall, locationName, scoreLabel, formattedPrice, index) {
    const amenitiesHtml = hall.amenities.slice(0, 3).map(a => `<span class="amenity-tag"><i class="fas fa-check"></i> ${a}</span>`).join('');
    const highlightsHtml = hall.highlights.map(h => `<span class="highlight-tag">${h}</span>`).join('');

    return `
        <div class="hall-card" onclick="redirectToBooking('${hall.name}')" style="animation-delay: ${index * 0.05}s">
            <div class="hall-image-wrapper">
                <img src="${hall.img}" alt="${hall.name}" loading="lazy">
                <div class="rating-badge">${hall.rating} <i class="fas fa-star"></i></div>
                ${hall.highlights.includes('Best seller') ? '<div class="bestseller-badge">Best Seller</div>' : ''}
                <button class="heart-btn" data-hall-name="${hall.name}" onclick="event.stopPropagation(); toggleHeart(this)">
                    <i class="${isHallSaved(hall.name) ? 'fas' : 'far'} fa-heart"></i>
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
                <button class="heart-btn" data-hall-name="${hall.name}" onclick="event.stopPropagation(); toggleHeart(this)">
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
                            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hall.address)}"
                            target="_blank"
                            class="show-map"
                            onclick="event.stopPropagation()">
                            Show on map
                            </a>
                        </div>
                    </div>
                    <div class="list-amenities">
                        ${amenitiesHtml}
                    </div>
                    <div class="list-description">
                        <p>${hall.description}</p>
                    </div>
                    <div class="list-capacity">
Capacity: Up to ${Number(hall.capacity).toLocaleString()} guests</div>


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

function isHallSaved(hallName) {
    const saved = getSavedHalls();
    return saved.includes(hallName);
}

function toggleHeart(btn) {
    const hallName = btn.getAttribute('data-hall-name') || (btn.closest('.hall-card, .hall-list-card')?.querySelector('h3, .hall-title, .list-title')?.textContent || '').trim();
    if (!hallName) return;

    const icon = btn.querySelector('i');
    const saved = getSavedHalls();

    const currentlySaved = saved.includes(hallName);
    if (currentlySaved) {
        const next = saved.filter(n => n !== hallName);
        setSavedHalls(next);
        icon.classList.remove('fas');
        icon.classList.add('far');
        btn.style.color = '';
    } else {
        setSavedHalls([...saved, hallName]);
        icon.classList.remove('far');
        icon.classList.add('fas');
        btn.style.color = '#000000';
    }
}

function applyFilters() {
    const searchInput = document.getElementById('searchInput');
    const search = (searchInput?.value || '').toLowerCase();
    const price = document.getElementById('priceFilter').value;
    const loc = document.getElementById('locationFilter').value;
    const rate = document.getElementById('ratingFilter').value;
    const capacity = document.getElementById('capacityFilter')?.value || 'all';

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

        let matchesCapacity = true;
        if (capacity !== 'all') {
            const minCap = Number(capacity);
            matchesCapacity = Number(hall.capacity) >= minCap;
        }

        return matchesSearch && matchesPrice && matchesLoc && matchesRate && matchesCapacity;
    });

    renderHalls(filtered);
    updateVenuesCount(filtered.length);
}



function filterByLocation(location) {

    document.getElementById('locationFilter').value = location;
    applyFilters();

    document.getElementById('hall-list').scrollIntoView({
        behavior: 'smooth'
    });
}

function applyLocationFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const location = params.get('location');
    if (!location) return;
    const valid = ['kl', 'pj', 'sa', 'johor', 'penang', 'melaka'];
    if (!valid.includes(location)) return;

    const locationFilter = document.getElementById('locationFilter');
    if (!locationFilter) return;

    locationFilter.value = location;
    applyFilters();

    setTimeout(() => {
        document.getElementById('hall-list').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

function redirectToBooking(name) {
    const selectedHall = allHalls.find(h => h.name === name);
    if (selectedHall) {
        localStorage.setItem('selectedHall', JSON.stringify(selectedHall));
    }
    window.location.href = `booking.html?hall=${encodeURIComponent(name)}`;
}

window.onload = () => {
    checkReminder();
    loadHalls();
    applyLocationFromQuery();

    document.getElementById('searchInput').addEventListener('input', applyFilters);
    document.getElementById('priceFilter').addEventListener('change', applyFilters);
    document.getElementById('locationFilter').addEventListener('change', applyFilters);
    document.getElementById('ratingFilter').addEventListener('change', applyFilters);

    const capacityFilterEl = document.getElementById('capacityFilter');
    if (capacityFilterEl) capacityFilterEl.addEventListener('change', applyFilters);

    document.getElementById('searchBtn').addEventListener('click', applyFilters);
};


