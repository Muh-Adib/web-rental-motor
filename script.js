/**
 * MotoRent – script.js
 * Handles: bike data, rendering, filtering/search,
 *          form validation, price summary, WhatsApp integration,
 *          localStorage persistence, UI interactions.
 */

'use strict';

/* ============================================================
   1. BIKE DATA
   Change or add bikes here. "type" is used for filtering.
   availability: 'available' | 'limited' | 'unavailable'
============================================================ */
const BIKES = [
  {
    id: 'honda-beat',
    name: 'Honda Beat Street',
    type: 'matic',
    price: 75000,       // IDR per day
    description: 'Motor matic paling populer. Ringan, irit bahan bakar, cocok untuk dalam kota.',
    image: 'assets/bike-matic.png',
    specs: { engine: '110cc', fuel: 'Injeksi', transmission: 'Matic' },
    availability: 'available',
  },
  {
    id: 'yamaha-r15',
    name: 'Yamaha R15 V4',
    type: 'sport',
    price: 175000,
    description: 'Sport fairing 155cc berteknologi tinggi. Sensasi balap di jalanan kota untuk jiwa muda.',
    image: 'assets/bike-sport.png',
    specs: { engine: '155cc', fuel: 'Injeksi VVA', transmission: 'Manual 6 Percepatan' },
    availability: 'limited',
  },
  {
    id: 'honda-crf150l',
    name: 'Honda CRF 150L',
    type: 'trail',
    price: 145000,
    description: 'Trail adventure siap jalan aspal maupun off-road. Suspensi tinggi, mesin tangguh.',
    image: 'assets/bike-trail.png',
    specs: { engine: '150cc', fuel: 'Injeksi', transmission: 'Manual 5 Percepatan' },
    availability: 'available',
  },
  {
    id: 'honda-vario-160',
    name: 'Honda Vario 160',
    type: 'matic',
    price: 90000,
    description: 'Matic premium dengan fitur keyless & ABS. Nyaman, stylish, dan performa lebih kencang.',
    image: 'assets/bike-matic.png',
    specs: { engine: '160cc', fuel: 'Injeksi eSP+', transmission: 'Matic CVT' },
    availability: 'available',
  },
  {
    id: 'yamaha-mt15',
    name: 'Yamaha MT-15',
    type: 'sport',
    price: 200000,
    description: 'Naked sport agresif dengan mesin VVA 155cc. Tampil garang, handling lincah di segala jalan.',
    image: 'assets/bike-sport.png',
    specs: { engine: '155cc VVA', fuel: 'Injeksi', transmission: 'Manual 6 Percepatan' },
    availability: 'unavailable',
  },
  {
    id: 'honda-supra-gtr',
    name: 'Honda Supra GTR 150',
    type: 'sport',
    price: 120000,
    description: 'Bebek sport bertenaga dengan desain sporty. Irit BBM dan gesit melewati macet perkotaan.',
    image: 'assets/bike-sport.png',
    specs: { engine: '150cc', fuel: 'Injeksi PGM-FI', transmission: 'Manual 6 Percepatan' },
    availability: 'limited',
  },
];

/* ============================================================
   2. RENTAL BUSINESS CONFIG
   Change the WhatsApp number here (international format, no +).
============================================================ */
const CONFIG = {
  whatsappNumber: '6281234567890', // ganti dengan nomor asli Anda
  currency: 'IDR',
  locale: 'id-ID',
};

/* ============================================================
   3. UTILITIES
============================================================ */

/**
 * Format a number as Indonesian Rupiah.
 * @param {number} amount
 * @returns {string}
 */
function formatRupiah(amount) {
  return new Intl.NumberFormat(CONFIG.locale, {
    style: 'currency',
    currency: CONFIG.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate number of days between two Date objects.
 * @param {Date} start
 * @param {Date} end
 * @returns {number}
 */
function calcDays(start, end) {
  const ms = end.getTime() - start.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

/**
 * Format a date string (YYYY-MM-DD) to localized display.
 * @param {string} dateStr
 * @returns {string}
 */
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString(CONFIG.locale, { day: 'numeric', month: 'long', year: 'numeric' });
}

/* ============================================================
   4. TOAST NOTIFICATION
============================================================ */
let toastTimer = null;

/**
 * Show a toast notification.
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 */
function showToast(message, type = 'success') {
  const toast    = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  const toastIcon = document.getElementById('toast-icon');

  if (!toast || !toastMsg) return;

  const icons = { success: 'check-circle', error: 'x-circle', info: 'info' };
  const colors = { success: 'text-green-400', error: 'text-red-400', info: 'text-blue-400' };

  toastMsg.textContent = message;
  toastIcon.setAttribute('data-lucide', icons[type] || 'info');
  toastIcon.className = `w-4 h-4 flex-shrink-0 ${colors[type] || colors.info}`;
  lucide.createIcons({ icons: { [icons[type]]: lucide.icons[icons[type]] } });

  toast.classList.remove('hide');
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add('hide');
    toast.classList.remove('show');
  }, 3000);
}

/* ============================================================
   5. NAVBAR – scroll effect + mobile toggle
============================================================ */
function initNavbar() {
  const navbar     = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Scroll class
  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Hamburger toggle
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden', isOpen);
      const icon = menuToggle.querySelector('[data-lucide]');
      if (icon) {
        icon.setAttribute('data-lucide', isOpen ? 'menu' : 'x');
        lucide.createIcons();
      }
    });

    // Close on link click
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        const icon = menuToggle.querySelector('[data-lucide]');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();
        }
      });
    });
  }
}

/* ============================================================
   6. SCROLL REVEAL
============================================================ */
function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ============================================================
   7. BACK TO TOP BUTTON
============================================================ */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('hidden', window.scrollY < 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   8. FOOTER YEAR
============================================================ */
function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ============================================================
   9. BIKE CARDS – rendering & filtering
============================================================ */
let currentFilter = 'all';
let searchQuery   = '';
let selectedBikeId = null;

/**
 * Build a single bike card HTML string.
 * @param {object} bike
 * @returns {string}
 */
function buildBikeCard(bike) {
  const availClass = {
    available:   'badge-available',
    limited:     'badge-limited',
    unavailable: 'badge-unavailable',
  }[bike.availability] || 'badge-available';

  const availLabel = {
    available:   'Tersedia',
    limited:     'Terbatas',
    unavailable: 'Tidak Tersedia',
  }[bike.availability] || 'Tersedia';

  const isUnavailable = bike.availability === 'unavailable';

  const btnClass = isUnavailable
    ? 'btn-select-bike'
    : (selectedBikeId === bike.id ? 'btn-select-bike selected' : 'btn-select-bike');

  const btnLabel = isUnavailable
    ? 'Tidak Tersedia'
    : (selectedBikeId === bike.id ? '✓ Dipilih' : 'Pilih Motor Ini');

  const specsHtml = Object.entries(bike.specs)
    .map(([, v]) => `<span class="text-xs text-gray-500 bg-gray-800/60 px-2 py-0.5 rounded-full">${v}</span>`)
    .join('');

  return `
    <article class="bike-card" data-id="${bike.id}" data-type="${bike.type}">
      <div class="bike-card-img-wrap">
        <img
          src="${bike.image}"
          alt="Foto ${bike.name} - motor sewa harga ${formatRupiah(bike.price)} per hari"
          loading="lazy"
          onerror="this.src='https://placehold.co/400x220/1f2937/4b5563?text=Motor'"
        />
        <!-- availability badge -->
        <div class="absolute top-3 left-3 inline-flex items-center gap-1.5 ${availClass} text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
          <span class="pulse-dot"></span>
          ${availLabel}
        </div>
        <!-- type badge -->
        <div class="absolute top-3 right-3 text-xs font-semibold text-gray-300 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full capitalize">
          ${bike.type}
        </div>
      </div>

      <div class="p-5 flex flex-col gap-3">
        <!-- Name & Price -->
        <div class="flex items-start justify-between gap-2">
          <h3 class="font-bold text-white text-base leading-snug">${bike.name}</h3>
          <div class="text-right flex-shrink-0">
            <p class="text-brand-400 font-extrabold text-base">${formatRupiah(bike.price)}</p>
            <p class="text-gray-600 text-xs">/hari</p>
          </div>
        </div>

        <!-- Description -->
        <p class="text-gray-400 text-sm leading-relaxed line-clamp-2">${bike.description}</p>

        <!-- Specs pills -->
        <div class="flex flex-wrap gap-1.5">${specsHtml}</div>

        <!-- Select Button -->
        <button
          class="${btnClass}"
          data-bike-id="${bike.id}"
          ${isUnavailable ? 'disabled aria-disabled="true"' : ''}
          aria-label="Pilih ${bike.name} untuk booking"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            ${isUnavailable
              ? '<circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>'
              : (selectedBikeId === bike.id
                  ? '<polyline points="20 6 9 17 4 12"/>'
                  : '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>'
                )
            }
          </svg>
          ${btnLabel}
        </button>
      </div>
    </article>
  `;
}

/**
 * Filter bikes based on current filter and search query.
 * @returns {object[]}
 */
function getFilteredBikes() {
  return BIKES.filter(bike => {
    const matchType = currentFilter === 'all' || bike.type === currentFilter;
    const matchSearch = bike.name.toLowerCase().includes(searchQuery) ||
                        bike.description.toLowerCase().includes(searchQuery) ||
                        bike.type.toLowerCase().includes(searchQuery);
    return matchType && matchSearch;
  });
}

/**
 * Render all visible bike cards into the grid.
 */
function renderBikes() {
  const grid      = document.getElementById('bike-grid');
  const noResults = document.getElementById('no-results');
  if (!grid) return;

  const filtered = getFilteredBikes();

  if (filtered.length === 0) {
    grid.innerHTML = '';
    noResults?.classList.remove('hidden');
    return;
  }

  noResults?.classList.add('hidden');
  grid.innerHTML = filtered.map(buildBikeCard).join('');

  // Re-init lucide icons for newly created elements
  lucide.createIcons();

  // Attach click handlers to "Pilih Motor" buttons
  grid.querySelectorAll('.btn-select-bike:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => {
      const bikeId = btn.dataset.bikeId;
      selectBike(bikeId);
    });
  });
}

/**
 * Select a bike and update UI accordingly.
 * @param {string} bikeId
 */
function selectBike(bikeId) {
  selectedBikeId = bikeId;

  // Update the bike select dropdown in form
  const bikeSelect = document.getElementById('bike-select');
  if (bikeSelect) {
    bikeSelect.value = bikeId;
    clearFieldError('bike');
    updatePriceSummary();
  }

  // Re-render cards to update button states
  renderBikes();

  // Smooth scroll to booking form
  document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  showToast(`${BIKES.find(b => b.id === bikeId)?.name} dipilih. Lengkapi form booking!`, 'info');
}

/**
 * Initialize filter tabs.
 */
function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter || 'all';
      renderBikes();
    });
  });
}

/**
 * Initialize search input.
 */
function initSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  let debounceTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchQuery = searchInput.value.trim().toLowerCase();
      renderBikes();
    }, 280);
  });
}

/**
 * Populate the bike <select> dropdown in the form.
 */
function populateBikeSelect() {
  const select = document.getElementById('bike-select');
  if (!select) return;

  const availableBikes = BIKES.filter(b => b.availability !== 'unavailable');
  availableBikes.forEach(bike => {
    const opt = document.createElement('option');
    opt.value = bike.id;
    opt.textContent = `${bike.name} – ${formatRupiah(bike.price)}/hari`;
    select.appendChild(opt);
  });
}

/* ============================================================
   10. FORM VALIDATION & PRICE SUMMARY
============================================================ */

// Min date = today
function setMinDates() {
  const today = new Date().toISOString().split('T')[0];
  const startInput = document.getElementById('start-date');
  const endInput   = document.getElementById('end-date');
  if (startInput) startInput.setAttribute('min', today);
  if (endInput)   endInput.setAttribute('min', today);
}

/**
 * Show a field error.
 * @param {string} field - 'name' | 'bike' | 'start' | 'end'
 */
function showFieldError(field) {
  const el = document.getElementById(`error-${field}`);
  const input = document.getElementById(getInputId(field));
  el?.classList.remove('hidden');
  input?.classList.add('error');
}

function clearFieldError(field) {
  const el = document.getElementById(`error-${field}`);
  const input = document.getElementById(getInputId(field));
  el?.classList.add('hidden');
  input?.classList.remove('error');
}

function getInputId(field) {
  const map = { name: 'customer-name', bike: 'bike-select', start: 'start-date', end: 'end-date' };
  return map[field] || field;
}

/**
 * Validate the whole form.
 * @returns {boolean} isValid
 */
function validateForm() {
  const name      = document.getElementById('customer-name')?.value.trim();
  const bikeId    = document.getElementById('bike-select')?.value;
  const startDate = document.getElementById('start-date')?.value;
  const endDate   = document.getElementById('end-date')?.value;

  let valid = true;

  // Name
  if (!name) { showFieldError('name'); valid = false; } else { clearFieldError('name'); }

  // Bike
  if (!bikeId) { showFieldError('bike'); valid = false; } else { clearFieldError('bike'); }

  // Start date
  if (!startDate) { showFieldError('start'); valid = false; } else { clearFieldError('start'); }

  // End date – must exist AND be after startDate
  if (!endDate || (startDate && endDate <= startDate)) {
    showFieldError('end'); valid = false;
  } else { clearFieldError('end'); }

  return valid;
}

/**
 * Update the price summary card based on current form values.
 */
function updatePriceSummary() {
  const bikeId    = document.getElementById('bike-select')?.value;
  const startDate = document.getElementById('start-date')?.value;
  const endDate   = document.getElementById('end-date')?.value;
  const summaryEl = document.getElementById('price-summary');

  if (!bikeId || !startDate || !endDate || endDate <= startDate) {
    summaryEl?.classList.add('hidden');
    return;
  }

  const bike = BIKES.find(b => b.id === bikeId);
  if (!bike) return;

  const days  = calcDays(new Date(startDate), new Date(endDate));
  const total = bike.price * days;

  const summaryBike     = document.getElementById('summary-bike');
  const summaryDuration = document.getElementById('summary-duration');
  const summaryTotal    = document.getElementById('summary-total');

  if (summaryBike)     summaryBike.textContent     = bike.name;
  if (summaryDuration) summaryDuration.textContent = `${days} hari (${formatDate(startDate)} – ${formatDate(endDate)})`;
  if (summaryTotal)    summaryTotal.textContent     = formatRupiah(total);

  summaryEl?.classList.remove('hidden');
}

/* ============================================================
   11. WHATSAPP MESSAGE GENERATION
============================================================ */

/**
 * Build the WhatsApp message string.
 * @param {object} data
 * @returns {string}
 */
function buildWhatsAppMessage({ name, phone, bike, startDate, endDate, days, total, notes }) {
  const lines = [
    '🏍️ *BOOKING MOTOR – MotoRent*',
    '─────────────────────────',
    `👤 *Nama:* ${name}`,
    phone ? `📱 *No. HP:* ${phone}` : null,
    `🏍️ *Motor:* ${bike.name}`,
    `📅 *Mulai Sewa:* ${formatDate(startDate)}`,
    `📅 *Selesai Sewa:* ${formatDate(endDate)}`,
    `⏱️ *Durasi:* ${days} hari`,
    `💰 *Estimasi Biaya:* ${new Intl.NumberFormat(CONFIG.locale).format(total)} (belum termasuk DP)`,
    notes ? `📝 *Catatan:* ${notes}` : null,
    '─────────────────────────',
    'Mohon konfirmasi ketersediaan motor dan detail pembayaran. Terima kasih! 🙏',
  ];

  return lines.filter(Boolean).join('\n');
}

/* ============================================================
   12. LOCAL STORAGE – bookmark bookings
============================================================ */
const LS_KEY = 'motorent_bookings';

/**
 * Save a booking to localStorage.
 * @param {object} booking
 */
function saveBooking(booking) {
  const existing = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  // Keep last 5 bookings
  existing.unshift(booking);
  const trimmed = existing.slice(0, 5);
  localStorage.setItem(LS_KEY, JSON.stringify(trimmed));
  renderSavedBookings();
}

/**
 * Retrieve and render saved bookings from localStorage.
 */
function renderSavedBookings() {
  const panel = document.getElementById('saved-bookings-panel');
  const list  = document.getElementById('saved-bookings-list');
  if (!panel || !list) return;

  const bookings = JSON.parse(localStorage.getItem(LS_KEY) || '[]');

  if (bookings.length === 0) {
    panel.classList.add('hidden');
    return;
  }

  panel.classList.remove('hidden');
  list.innerHTML = bookings.map((b, i) => `
    <li class="flex items-start gap-2 py-1.5 ${i < bookings.length - 1 ? 'border-b border-gray-700/50' : ''}">
      <span class="text-brand-400 mt-0.5">•</span>
      <div>
        <span class="font-medium text-gray-300">${b.name}</span>
        <span class="text-gray-600"> — </span>
        <span>${b.bikeName}</span>
        <span class="text-gray-600"> (${formatDate(b.startDate)} – ${formatDate(b.endDate)})</span>
      </div>
    </li>
  `).join('');
}

/**
 * Clear all saved bookings.
 */
function clearBookings() {
  localStorage.removeItem(LS_KEY);
  renderSavedBookings();
  showToast('Riwayat booking dihapus.', 'info');
}

/* ============================================================
   13. FORM SUBMIT HANDLER
============================================================ */
function initForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  // Live price summary on field change
  ['bike-select', 'start-date', 'end-date'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', updatePriceSummary);
  });

  // Clear errors on input
  ['customer-name'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => clearFieldError('name'));
  });

  // Ensure end-date min = start-date + 1
  document.getElementById('start-date')?.addEventListener('change', (e) => {
    const endInput = document.getElementById('end-date');
    if (endInput) {
      endInput.setAttribute('min', e.target.value);
      if (endInput.value && endInput.value <= e.target.value) {
        endInput.value = '';
      }
    }
    updatePriceSummary();
  });

  // Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Lengkapi semua field yang wajib diisi.', 'error');
      // Scroll to first error
      const firstError = form.querySelector('.form-input.error');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const name      = document.getElementById('customer-name').value.trim();
    const phone     = document.getElementById('customer-phone')?.value.trim() || '';
    const bikeId    = document.getElementById('bike-select').value;
    const startDate = document.getElementById('start-date').value;
    const endDate   = document.getElementById('end-date').value;
    const notes     = document.getElementById('notes')?.value.trim() || '';

    const bike  = BIKES.find(b => b.id === bikeId);
    const days  = calcDays(new Date(startDate), new Date(endDate));
    const total = bike.price * days;

    // Build WhatsApp URL
    const message    = buildWhatsAppMessage({ name, phone, bike, startDate, endDate, days, total, notes });
    const encodedMsg = encodeURIComponent(message);
    const waUrl      = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMsg}`;

    // Save booking to localStorage
    saveBooking({
      id: Date.now(),
      name,
      bikeName: bike.name,
      startDate,
      endDate,
      total,
    });

    // Open WhatsApp
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    showToast('Booking dikirim via WhatsApp! 🎉', 'success');

    // Optionally reset form (comment out if you prefer to keep data)
    // form.reset();
    // document.getElementById('price-summary')?.classList.add('hidden');
  });

  // Clear bookings button
  document.getElementById('clear-bookings')?.addEventListener('click', clearBookings);
}

/* ============================================================
   14. FAQ ACCORDION
============================================================ */
function initFAQ() {
  document.querySelectorAll('.faq-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item   = trigger.closest('.faq-item');
      const answer = item?.querySelector('.faq-answer');
      const icon   = trigger.querySelector('.faq-icon');

      if (!answer) return;

      const isOpen = answer.classList.contains('open');

      // Close all others
      document.querySelectorAll('.faq-answer.open').forEach(a => {
        a.classList.remove('open');
        a.previousElementSibling?.querySelector('.faq-icon')?.classList.remove('open');
        a.previousElementSibling?.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        answer.classList.add('open');
        icon?.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ============================================================
   15. INIT – run everything on DOMContentLoaded
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Init Lucide icons
  lucide.createIcons();

  // Core UI
  initNavbar();
  initReveal();
  initBackToTop();
  initFooterYear();

  // Fleet
  populateBikeSelect();
  renderBikes();
  initFilterTabs();
  initSearch();

  // Form
  setMinDates();
  initForm();
  renderSavedBookings();

  // FAQ
  initFAQ();

  console.log('%c🏍️ MotoRent loaded successfully!', 'color:#f97316;font-weight:bold;font-size:14px;');
});
