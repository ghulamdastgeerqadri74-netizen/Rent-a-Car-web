/* ========================================================
   MEHAR BROTHERS RENT A CAR — script.js
   Covers: JSON Data Layer, HTTP GET/POST/PUT/DELETE,
   Cookies, User-Agent Device Detection & Real-Time Sync
   ======================================================== */

const INITIAL_FLEET = [
  { id: 'car-prado', name: 'Toyota Prado', is_available: true },
  { id: 'car-revo', name: 'Toyota Hilux Revo', is_available: true },
  { id: 'car-haval', name: 'Haval Jolion', is_available: true },
  { id: 'car-civic', name: 'Honda Civic', is_available: true },
  { id: 'car-corolla', name: 'Toyota Corolla', is_available: true },
  { id: 'car-wagon', name: 'Suzuki Wagon R', is_available: true },
  { id: 'car-hiace-ac', name: 'Toyota Hiace (AC)', is_available: true },
  { id: 'car-hiace', name: 'Toyota Hiace (Non-AC)', is_available: true },
  { id: 'car-forland', name: 'Forland Safari', is_available: true },
  { id: 'car-karwan', name: 'Changan Karwan', is_available: true },
  { id: 'car-bolan', name: 'Suzuki Bolan', is_available: true },
  { id: 'car-every', name: 'Suzuki Every', is_available: true },
  { id: 'car-coaster-ac', name: 'Toyota Coaster (AC)', is_available: true },
  { id: 'car-coaster-nonac', name: 'Toyota Coaster (Non-AC)', is_available: true },
  { id: 'car-scania', name: 'Scania Luxury Coach', is_available: true }
];

const INITIAL_REVIEWS = [
  { id: 1, reviewer_name: 'Usman Tariq', city: 'Lahore (Model Town)', rating: 5, vehicle_used: 'Toyota Prado', comment: "Booked Prado for my brother's wedding baraat. Car was spotless, decorated on time, and driver was super cooperative!" },
  { id: 2, reviewer_name: 'Haji Muhammad Akram', city: 'Lahore (Mughalpura)', rating: 5, vehicle_used: 'Toyota Hiace (AC)', comment: 'We rented Grand Cabin Hiace for a family trip to Murree & Naran. AC cooling and comfort were top class. Highly recommended!' },
  { id: 3, reviewer_name: 'Bilal Ahmed', city: 'Lahore (Bata Pur)', rating: 5, vehicle_used: 'Haval Jolion', comment: 'Very reasonable rates near Jallo More compared to other rentals. Mian Arif bhai handled everything professionally.' },
  { id: 4, reviewer_name: 'Dr. Kamran Siddiqui', city: 'Lahore (Cantt)', rating: 5, vehicle_used: 'Scania Luxury Coach', comment: 'Arranged 45-seater Scania Coach for our hospital staff tour. Punctual pickup and super smooth journey.' }
];

const liveChannel = new BroadcastChannel('mehar_brothers_live_sync');

// REST API Simulation Layer (GET, POST, PUT, DELETE with JSON)
const MockServerAPI = {
  get(key, fallback) {
    const data = JSON.parse(localStorage.getItem(key) || 'null');
    if (!data || (Array.isArray(data) && data.length !== fallback.length && key === 'mb_fleet')) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return data;
  },
  post(key, item, fallback = []) {
    const list = this.get(key, fallback);
    list.unshift({ id: Date.now(), ...item });
    localStorage.setItem(key, JSON.stringify(list));
    liveChannel.postMessage({ type: 'UPDATE', key });
    return list;
  },
  put(key, id, updates, fallback = []) {
    const list = this.get(key, fallback).map(item => item.id === id ? { ...item, ...updates } : item);
    localStorage.setItem(key, JSON.stringify(list));
    liveChannel.postMessage({ type: 'UPDATE', key });
    return list;
  },
  delete(key, id, fallback = []) {
    const list = this.get(key, fallback).filter(item => item.id !== id);
    localStorage.setItem(key, JSON.stringify(list));
    liveChannel.postMessage({ type: 'UPDATE', key });
    return list;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  /* 1. NAVBAR & HAMBURGER */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  hamburger?.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
  });

  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* 2. HIACE IMAGE SLIDER */
  const hiaceSlider = document.getElementById('hiaceSlider');
  if (hiaceSlider) {
    const slides = hiaceSlider.querySelectorAll('.hiace-slide');
    const dots = hiaceSlider.querySelectorAll('.slider-dot');
    let current = 0;
    const goTo = (idx) => {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    };
    document.getElementById('hiace-next')?.addEventListener('click', () => goTo(current + 1));
    document.getElementById('hiace-prev')?.addEventListener('click', () => goTo(current - 1));
    setInterval(() => goTo(current + 1), 3500);
  }

  /* 3. USER-AGENT DEVICE DETECTION & COOKIES + SECRET OWNER TOGGLE */
  const trackDeviceUsage = () => {
    const ua = navigator.userAgent;
    let deviceType = 'Desktop';
    if (/Mobi|Android|iPhone/i.test(ua)) deviceType = 'Mobile';
    else if (/Tablet|iPad/i.test(ua)) deviceType = 'Tablet';

    document.getElementById('currentDeviceBadge').textContent = `${deviceType} (${window.innerWidth}px)`;

    const stats = MockServerAPI.get('mb_device_stats', { Mobile: 342, Desktop: 128, Tablet: 24 });
    if (!document.cookie.includes('mb_session_tracked=1')) {
      document.cookie = 'mb_session_tracked=1; max-age=86400; path=/; SameSite=Lax';
      stats[deviceType] = (stats[deviceType] || 0) + 1;
      localStorage.setItem('mb_device_stats', JSON.stringify(stats));
    }

    const total = (stats.Mobile + stats.Desktop + stats.Tablet) || 1;
    const mobPct = Math.round((stats.Mobile / total) * 100);
    const deskPct = Math.round((stats.Desktop / total) * 100);
    document.getElementById('deviceSplitStats').textContent = `Mobile: ${mobPct}% (${stats.Mobile}) | Desktop: ${deskPct}% (${stats.Desktop})`;
  };

  // Secret Owner Access: Double-click Footer Logo OR Press Ctrl+Shift+A OR URL ?admin=1
  const telemetryBar = document.getElementById('ownerTelemetryBar');
  const revealOwnerBar = () => telemetryBar?.classList.add('visible');

  document.getElementById('secretOwnerTrigger')?.addEventListener('dblclick', revealOwnerBar);
  document.getElementById('hideTelemetryBtn')?.addEventListener('click', () => telemetryBar?.classList.remove('visible'));
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) revealOwnerBar();
  });
  if (new URLSearchParams(window.location.search).get('admin') === '1') revealOwnerBar();

  /* 4. HTTP GET — RENDER FLEET STATUS */
  const renderFleet = () => {
    const vehicles = MockServerAPI.get('mb_fleet', INITIAL_FLEET);
    let availableCount = 0;
    vehicles.forEach(v => {
      const badge = document.querySelector(`.avail-badge[data-vehicle-id="${v.id}"]`);
      if (badge) {
        badge.textContent = v.is_available ? 'Available' : 'Booked';
        badge.classList.toggle('booked', !v.is_available);
      }
      if (v.is_available) availableCount++;
    });
    const countEl = document.getElementById('live-avail-count');
    if (countEl) countEl.textContent = availableCount;

    const adminList = document.getElementById('adminFleetList');
    if (adminList) {
      adminList.innerHTML = vehicles.map(v => `
        <div class="admin-booking-row">
          <span><strong>${v.name}</strong> — ${v.is_available ? '🟢 Available' : '🔴 Booked'}</span>
          <button type="button" class="btn-mini" style="background:${v.is_available ? '#ef4444' : '#22c55e'}"
            onclick="toggleVehicleStatus('${v.id}', ${!v.is_available})">
            Mark ${v.is_available ? 'Booked' : 'Available'}
          </button>
        </div>
      `).join('');
    }
  };

  /* 5. HTTP GET & POST — CUSTOMER REVIEWS */
  const renderReviews = () => {
    const reviews = MockServerAPI.get('mb_reviews', INITIAL_REVIEWS);
    const grid = document.getElementById('reviewsGrid');
    if (!grid) return;
    grid.innerHTML = reviews.map(r => {
      const initial = (r.reviewer_name || 'C').charAt(0).toUpperCase();
      return `
        <div class="review-card">
          <div class="review-top">
            <div class="reviewer-profile">
              <div class="reviewer-avatar">${initial}</div>
              <div class="reviewer-meta">
                <strong>${r.reviewer_name}</strong>
                <span>📍 ${r.city || 'Lahore'}</span>
              </div>
            </div>
            <div class="review-stars">${'⭐'.repeat(r.rating || 5)}</div>
          </div>
          <div class="review-badges-row">
            <span class="review-vehicle-tag">🚗 ${r.vehicle_used || 'Car Rental'}</span>
            <span class="verified-trip-tag">✓ Verified Booking</span>
          </div>
          <p class="review-text">"${r.comment}"</p>
        </div>
      `;
    }).join('');
  };

  document.getElementById('reviewForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    MockServerAPI.post('mb_reviews', {
      reviewer_name: document.getElementById('revName').value.trim(),
      city: document.getElementById('revCity').value.trim(),
      vehicle_used: document.getElementById('revVehicle').value,
      rating: parseInt(document.getElementById('revRating').value),
      comment: document.getElementById('revComment').value.trim()
    }, INITIAL_REVIEWS);

    renderReviews();
    e.target.reset();
    alert('Thank you! Your review has been published.');
  });

  /* 6. HTTP POST — ONLINE BOOKING MODAL */
  const bookingModal = document.getElementById('bookingModal');
  const bookVehicleSelect = document.getElementById('bookVehicle');

  document.querySelectorAll('.open-booking-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.car && bookVehicleSelect) bookVehicleSelect.value = btn.dataset.car;
      bookingModal.classList.add('open');
    });
  });

  document.getElementById('closeBookingModal')?.addEventListener('click', () => bookingModal.classList.remove('open'));

  document.getElementById('bookingForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const bookingData = {
      customer_name: document.getElementById('bookName').value.trim(),
      customer_phone: document.getElementById('bookPhone').value.trim(),
      vehicle_name: bookVehicleSelect.value,
      event_type: document.getElementById('bookEvent').value,
      booking_date: document.getElementById('bookDate').value
    };

    MockServerAPI.post('mb_bookings', bookingData, []);
    renderBookings();
    bookingModal.classList.remove('open');
    e.target.reset();

    const waMsg = `Assalam-o-Alaikum Mehar Brothers! I submitted an online booking:%0A• Name: ${bookingData.customer_name}%0A• Vehicle: ${bookingData.vehicle_name}%0A• Event: ${bookingData.event_type}%0A• Date: ${bookingData.booking_date}`;
    if (confirm('Booking saved! Would you also like to send this confirmation directly to Mian Arif on WhatsApp?')) {
      window.open(`https://wa.me/923214830970?text=${waMsg}`, '_blank');
    }
  });

  /* 7. HTTP PUT & DELETE — OWNER ADMIN PANEL */
  const adminModal = document.getElementById('adminModal');
  document.getElementById('openAdminBtn')?.addEventListener('click', () => adminModal.classList.add('open'));
  document.getElementById('closeAdminModal')?.addEventListener('click', () => adminModal.classList.remove('open'));

  document.getElementById('adminLoginBtn')?.addEventListener('click', () => {
    if (document.getElementById('adminPinInput').value !== '1234') {
      alert('Incorrect Owner PIN! (Use 1234)');
      return;
    }
    document.getElementById('adminAuthBox').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    renderFleet();
    renderBookings();
  });

  window.toggleVehicleStatus = (id, newStatus) => {
    MockServerAPI.put('mb_fleet', id, { is_available: newStatus }, INITIAL_FLEET);
    renderFleet();
  };

  const renderBookings = () => {
    const bookings = MockServerAPI.get('mb_bookings', []);
    const list = document.getElementById('adminBookingsList');
    if (!list) return;
    list.innerHTML = bookings.length ? bookings.map(b => `
      <div class="admin-booking-row">
        <div>
          <strong>${b.customer_name}</strong> (${b.customer_phone})<br/>
          <small>🚗 ${b.vehicle_name} | 📅 ${b.booking_date} | 🎉 ${b.event_type}</small>
        </div>
        <button type="button" class="btn-mini" style="background:#dc2626" onclick="deleteBooking(${b.id})">Delete</button>
      </div>
    `).join('') : '<p>No bookings yet.</p>';
  };

  window.deleteBooking = (id) => {
    MockServerAPI.delete('mb_bookings', id, []);
    renderBookings();
  };

  liveChannel.onmessage = () => {
    renderFleet();
    renderReviews();
    renderBookings();
  };

  trackDeviceUsage();
  renderFleet();
  renderReviews();
});