// ============================================
// HISTORY PAGE - MODERN BOOKING MANAGEMENT
// ============================================

// 1. Ambil semua bookings dari localStorage
function getBookings() {
    return JSON.parse(localStorage.getItem('allBookings')) || [];
}

// 2. Simpan semula ke localStorage
function saveBookings(bookings) {
    localStorage.setItem('allBookings', JSON.stringify(bookings));
}

// 3. Check sama ada tarikh booking sudah lepas
function isPastBooking(dateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(dateStr);
    return bookingDate < today;
}

// 4. Format date to readable string
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-MY', options);
}

// 5. Generate booking reference
function generateRef(index) {
    return 'HB-' + String(index + 1).padStart(4, '0');
}

// 6. Get hall image by name (same as homepage)
function getHallImage(hallName) {
    const hallImages = {
        'KL Convention Centre': 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Kuala_Lumpur_Convention_Centre_%28northeastern_exterior%29%2C_Kuala_Lumpur.jpg',
        'Sunway Pyramid Convention': 'https://upload.wikimedia.org/wikipedia/commons/6/64/Sunway_pyramid_mall_malaysia_photos_%2821%29.JPG',
        'Setia City Convention Centre': 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Setia_City_Convention_Centre_%28250521-1833%29.jpg',
        'MATRADE Exhibition Centre': 'https://upload.wikimedia.org/wikipedia/commons/c/ce/MATRADE_Exhibition_and_Convention_Centre_and_Menara_MITI_in_April_2020.jpg',
        'Persada Johor Convention Centre': 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Persada_Johor_International_Convention_Centre%2C_Johor_Bahru.jpg',
        'SPICE Arena Penang': 'https://upload.wikimedia.org/wikipedia/commons/2/2c/SPICE_Arena_2023.jpg',
        'Hang Tuah Stadium Melaka': 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Hang_Tuah_Stadium.JPG'
    };
    return hallImages[hallName] || 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Kuala_Lumpur_Convention_Centre_%28northeastern_exterior%29%2C_Kuala_Lumpur.jpg';
}

// 7. Get hall price by name (same as homepage)
function getHallPrice(hallName) {
    const hallPrices = {
        'KL Convention Centre': 1500,
        'Sunway Pyramid Convention': 900,
        'Setia City Convention Centre': 2100,
        'MATRADE Exhibition Centre': 1800,
        'Persada Johor Convention Centre': 1200,
        'SPICE Arena Penang': 1100,
        'Hang Tuah Stadium Melaka': 800
    };
    return hallPrices[hallName] || 1000;
}

// 8. Update stats with animated circles
function updateStats() {
    const bookings = getBookings();
    const total = bookings.length;
    const upcoming = bookings.filter(b => !isPastBooking(b.date)).length;
    const completed = bookings.filter(b => isPastBooking(b.date)).length;

    // Animate numbers
    animateNumber('totalBookings', total);
    animateNumber('upcomingBookings', upcoming);
    animateNumber('completedBookings', completed);

    // Update circle progress
    if (total > 0) {
        setCircleProgress('totalCircle', 100);
        setCircleProgress('upcomingCircle', (upcoming / total) * 100);
        setCircleProgress('completedCircle', (completed / total) * 100);
    } else {
        setCircleProgress('totalCircle', 0);
        setCircleProgress('upcomingCircle', 0);
        setCircleProgress('completedCircle', 0);
    }

    // Update booking count label
    const countLabel = document.getElementById('bookingCount');
    if (countLabel) {
        countLabel.innerText = `${total} booking${total !== 1 ? 's' : ''}`;
    }
}

// 9. Animate number counting
function animateNumber(elementId, target) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const duration = 800;
    const start = parseInt(element.innerText) || 0;
    const increment = target - start;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = Math.round(start + increment * easeProgress);
        element.innerText = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// 10. Set SVG circle progress
function setCircleProgress(elementId, percentage) {
    const circle = document.getElementById(elementId);
    if (!circle) return;
    const value = Math.max(0, Math.min(100, percentage));
    circle.setAttribute('stroke-dasharray', `${value}, 100`);
}

// 11. Delete/Cancel booking
function cancelBooking(index) {
    const bookings = getBookings();
    const hallName = bookings[index].hallName;
    const date = bookings[index].date;

    if (confirm(`Are you sure you want to cancel the booking for ${hallName} on ${formatDate(date)}?`)) {
        bookings.splice(index, 1);
        saveBookings(bookings);

        // Update userBooking jika yang latest dah padam
        const latest = JSON.parse(localStorage.getItem('userBooking'));
        if (latest && latest.hallName === hallName && latest.date === date) {
            const newLatest = bookings[bookings.length - 1] || null;
            if (newLatest) {
                localStorage.setItem('userBooking', JSON.stringify(newLatest));
            } else {
                localStorage.removeItem('userBooking');
            }
        }

        renderBookings();
    }
}

// 12. Render bookings with filter
let currentFilter = 'all';

function renderBookings() {
    const container = document.getElementById('bookings-list');
    const bookings = getBookings();

    // Update stats
    updateStats();

    // Filter bookings
    let filteredBookings = bookings;
    if (currentFilter === 'upcoming') {
        filteredBookings = bookings.filter(b => !isPastBooking(b.date));
    } else if (currentFilter === 'past') {
        filteredBookings = bookings.filter(b => isPastBooking(b.date));
    }

    if (filteredBookings.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <i class="fas fa-calendar-times"></i>
                </div>
                <h2>No Bookings Found</h2>
                <p>${currentFilter === 'all' 
                    ? 'You have not made any hall reservations yet. Start exploring our amazing venues!' 
                    : `No ${currentFilter} bookings found.`}</p>
href="index.html" class="explore-btn"
                    <i class="fas fa-search"></i> Explore Halls
                </a>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredBookings.map((b, index) => {
        const past = isPastBooking(b.date);
        const statusText = past ? 'Completed' : 'Upcoming';
        const statusClass = past ? 'past' : 'upcoming';
        const ref = generateRef(index);
        const price = getHallPrice(b.hallName);
        const totalPrice = b.decoration ? price + 200 : price;

        const decorationDisplay = b.decoration
            ? `<span class="decoration-yes"><i class="fas fa-check-circle"></i> Yes (${b.theme || 'No theme'})</span>`
            : `<span class="decoration-no"><i class="fas fa-times-circle"></i> No</span>`;

        // Find original index for cancel function
        const originalIndex = bookings.findIndex(booking => 
            booking.hallName === b.hallName && 
            booking.date === b.date && 
            booking.ic === b.ic
        );

        return `
            <div class="booking-card">
                <div class="card-image-section">
                    <img src="${getHallImage(b.hallName)}" alt="${b.hallName}" loading="lazy">
                    <div class="card-image-overlay">
                        <div class="card-price">RM ${totalPrice.toLocaleString()}<span>/day</span></div>
                    </div>
                </div>
                <div class="card-content">
                    <div class="card-header">
                        <div class="card-title-section">
                            <h3>${b.hallName}</h3>
                            <div class="card-location">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${b.hallName.includes('Kuala Lumpur') ? 'Kuala Lumpur' : 
                                       b.hallName.includes('Petaling') ? 'Petaling Jaya' : 
                                       b.hallName.includes('Shah Alam') ? 'Shah Alam' : 'Malaysia'}</span>
                            </div>
                        </div>
                        <div class="status-badge ${statusClass}">
                            <span class="status-dot"></span>
                            ${statusText}
                        </div>
                    </div>
                    <div class="card-details">
                        <div class="detail-item">
                            <label><i class="fas fa-user"></i> Customer</label>
                            <span>${b.customerName}</span>
                        </div>
                        <div class="detail-item">
                            <label><i class="fas fa-id-card"></i> IC Number</label>
                            <span>${b.ic}</span>
                        </div>
                        <div class="detail-item">
                            <label><i class="fas fa-calendar-day"></i> Date</label>
                            <span>${formatDate(b.date)}</span>
                        </div>
                        <div class="detail-item">
                            <label><i class="fas fa-credit-card"></i> Payment</label>
${bbFormatPayment(b.payment)}
                        </div>
                        <div class="detail-item">
                            <label><i class="fas fa-paint-brush"></i> Decoration</label>
                            ${decorationDisplay}
                        </div>
                        <div class="detail-item">
                            <label><i class="fas fa-receipt"></i> Amount</label>
                            <span>RM ${totalPrice.toLocaleString()}</span>
                        </div>
                    </div>
                    <div class="card-footer">
                        <div class="booking-ref">
                            <i class="fas fa-hashtag"></i>
                            Ref: ${ref}
                        </div>
                        <div class="card-actions">
                            ${!past ? `
                                <button class="btn btn-danger" onclick="cancelBooking(${originalIndex})">
                                    <i class="fas fa-trash-alt"></i> Cancel
                                </button>
                            ` : ''}
window.location.href='index.html'
                                <i class="fas fa-redo"></i> Book Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 13. Format payment method untuk display yang lebih cantik
// Payment formatting moved to shared_utils.js (bbFormatPayment)


// 14. Tab filter functionality
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');
            // Update filter
            currentFilter = btn.dataset.filter;
            // Re-render
            renderBookings();
        });
    });
}

// 15. Load on page ready
window.onload = () => {
    renderBookings();
    setupTabs();
};

