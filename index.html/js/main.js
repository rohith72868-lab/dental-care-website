/**
 * BrightBite Dental Clinic — Premium Interactive Experience
 * Main JavaScript Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNavigation();
  initStatsCounter();
  initComparisonSlider();
  initFaqAccordion();
  initBookingSystem();
  initServiceModals();
  initDoctorProfiles();
  initBlogModals();
  initSmoothScroll();
});

/* ==========================================================================
   1. STICKY HEADER & SCROLL SPY
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   2. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNavigation() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const drawerCloseBtn = document.querySelector('.mobile-drawer-close');
  const drawerLinks = document.querySelectorAll('.mobile-drawer a');

  if (!mobileToggle || !mobileDrawer) return;

  function openDrawer() {
    mobileDrawer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  mobileToggle.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  mobileDrawer.addEventListener('click', (e) => {
    if (e.target === mobileDrawer) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   3. ANIMATED STATISTICS COUNTER
   ========================================================================== */
function initStatsCounter() {
  const statsElements = document.querySelectorAll('.stat-number[data-target]');
  if (!statsElements.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statsElements.forEach(el => animateCount(el));
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    observer.observe(statsSection);
  }

  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1800;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * easeProgress);

      el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
      }
    }

    requestAnimationFrame(update);
  }
}

/* ==========================================================================
   4. INTERACTIVE BEFORE & AFTER SLIDER
   ========================================================================== */
function initComparisonSlider() {
  const sliderWrapper = document.querySelector('.comparison-slider-wrapper');
  if (!sliderWrapper) return;

  const beforeWrapper = sliderWrapper.querySelector('.comparison-image-before-wrapper');
  const handle = sliderWrapper.querySelector('.slider-handle');
  const tagButtons = document.querySelectorAll('.treatment-tag-btn');

  let isDragging = false;

  function updateSliderPosition(x) {
    const rect = sliderWrapper.getBoundingClientRect();
    let position = ((x - rect.left) / rect.width) * 100;
    position = Math.max(0, Math.min(100, position));

    if (beforeWrapper) beforeWrapper.style.width = `${position}%`;
    if (handle) handle.style.left = `${position}%`;
  }

  // Mouse Events
  sliderWrapper.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSliderPosition(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch Events
  sliderWrapper.addEventListener('touchstart', (e) => {
    isDragging = true;
    updateSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    updateSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Transformation Category Switcher
  const casesData = {
    whitening: {
      before: 'images/teeth-before.jpg',
      after: 'images/teeth-after.jpg',
      title: 'Professional In-Office Laser Whitening',
      description: 'Result achieved in a single 60-minute session using Phillips Zoom! with zero dental sensitivity.',
      duration: '1 Session (60 Mins)'
    },
    aligners: {
      before: 'images/teeth-before.jpg',
      after: 'images/teeth-after.jpg',
      title: 'Clear Aligners Orthodontic Alignment',
      description: 'Corrected moderate crowding and bite alignment over 7 months with virtually invisible custom aligners.',
      duration: '7 Months'
    },
    veneers: {
      before: 'images/teeth-before.jpg',
      after: 'images/teeth-after.jpg',
      title: 'Custom Porcelain Veneers',
      description: 'Handcrafted minimal-prep porcelain veneers restored tooth symmetry, length, and natural radiance.',
      duration: '2 Appointments'
    },
    implants: {
      before: 'images/teeth-before.jpg',
      after: 'images/teeth-after.jpg',
      title: '3D Guided Dental Implant & Crown',
      description: 'Full tooth replacement matching adjacent teeth with permanent titanium root and zirconia crown.',
      duration: '3 Months Total'
    }
  };

  tagButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tagButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const caseKey = btn.getAttribute('data-case');
      const data = casesData[caseKey];
      if (!data) return;

      const beforeImg = sliderWrapper.querySelector('.comparison-image-before');
      const afterImg = sliderWrapper.querySelector('.comparison-image-after');
      const caseTitle = document.getElementById('caseTitle');
      const caseDesc = document.getElementById('caseDesc');
      const caseDuration = document.getElementById('caseDuration');

      if (beforeImg) beforeImg.src = data.before;
      if (afterImg) afterImg.src = data.after;
      if (caseTitle) caseTitle.textContent = data.title;
      if (caseDesc) caseDesc.textContent = data.description;
      if (caseDuration) caseDuration.textContent = data.duration;
    });
  });
}

/* ==========================================================================
   5. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('is-active');

      // Close other open items
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('is-active');
      });

      if (!isActive) {
        item.classList.add('is-active');
      } else {
        item.classList.remove('is-active');
      }
    });
  });
}

/* ==========================================================================
   6. APPOINTMENT BOOKING SYSTEM & MODAL
   ========================================================================== */
function initBookingSystem() {
  const bookingModal = document.getElementById('bookingModal');
  const openModalBtns = document.querySelectorAll('[data-open-booking]');
  const closeModalBtns = document.querySelectorAll('.close-booking-modal');
  const forms = document.querySelectorAll('.appointment-form');

  // Open modal from any button with data-open-booking
  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const preselectedTreatment = btn.getAttribute('data-treatment');
      if (bookingModal) {
        if (preselectedTreatment) {
          const select = bookingModal.querySelector('select[name="treatment"]');
          if (select) select.value = preselectedTreatment;
        }
        bookingModal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close Modal
  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (bookingModal) {
        bookingModal.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });
  });

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        bookingModal.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });
  }

  // Handle Form Submissions
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('[name="fullname"]')?.value.trim();
      const phone = form.querySelector('[name="phone"]')?.value.trim();
      const email = form.querySelector('[name="email"]')?.value.trim();
      const treatment = form.querySelector('[name="treatment"]')?.value;
      const date = form.querySelector('[name="date"]')?.value;
      const time = form.querySelector('[name="time"]')?.value;
      const message = form.querySelector('[name="message"]')?.value.trim() || '';

      if (!name || !phone || !treatment || !date) {
        showToast('Please fill in all required fields (Name, Phone, Treatment, Date).');
        return;
      }

      // Generate Reference Code
      const refCode = 'BB-' + Math.floor(1000 + Math.random() * 9000);

      // Save to localStorage
      const bookingData = {
        refCode,
        name,
        phone,
        email,
        treatment,
        date,
        time,
        message,
        timestamp: new Date().toISOString()
      };

      const existing = JSON.parse(localStorage.getItem('brightbite_bookings') || '[]');
      existing.push(bookingData);
      localStorage.setItem('brightbite_bookings', JSON.stringify(existing));

      // Close modal if open
      if (bookingModal) bookingModal.classList.remove('is-open');

      // Display Confirmation Modal
      showConfirmationModal(bookingData);

      // Reset form
      form.reset();
    });
  });
}

function showConfirmationModal(booking) {
  const confirmModal = document.getElementById('confirmationModal');
  if (!confirmModal) {
    showToast(`Appointment requested! Ref: ${booking.refCode}. Our team will call you.`);
    return;
  }

  const refEl = confirmModal.querySelector('.confirm-ref-code');
  const nameEl = confirmModal.querySelector('.confirm-patient-name');
  const detailsEl = confirmModal.querySelector('.confirm-details');

  if (refEl) refEl.textContent = booking.refCode;
  if (nameEl) nameEl.textContent = booking.name;
  if (detailsEl) {
    detailsEl.innerHTML = `
      <strong>Treatment:</strong> ${booking.treatment}<br>
      <strong>Date:</strong> ${booking.date} (${booking.time || 'Flexible Time'})<br>
      <strong>Phone:</strong> ${booking.phone}
    `;
  }

  // Setup WhatsApp confirmation button
  const waBtn = confirmModal.querySelector('.confirm-wa-btn');
  if (waBtn) {
    const text = encodeURIComponent(
      `Hello BrightBite Dental, I just booked an appointment online (Ref: ${booking.refCode}) for ${booking.treatment} on ${booking.date}. My name is ${booking.name}.`
    );
    waBtn.href = `https://wa.me/18004567890?text=${text}`;
  }

  confirmModal.classList.add('is-open');
  document.body.style.overflow = 'hidden';

  const closeBtns = confirmModal.querySelectorAll('.close-confirm-modal');
  closeBtns.forEach(b => {
    b.addEventListener('click', () => {
      confirmModal.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });
}

/* ==========================================================================
   7. SERVICE DETAIL MODALS
   ========================================================================== */
function initServiceModals() {
  const serviceModal = document.getElementById('serviceDetailModal');
  const learnMoreBtns = document.querySelectorAll('.service-learn-more-btn');
  if (!serviceModal || !learnMoreBtns.length) return;

  const servicesDetails = {
    general: {
      title: 'General & Preventative Dentistry',
      badge: 'Family Care',
      desc: 'Our complete family dental care focuses on proactive prevention, thorough cleanings, cavity detection, and gentle treatment to protect your natural teeth for a lifetime.',
      points: [
        'Comprehensive 360° oral examinations & cancer screenings',
        'Ultrasonic scaling & pain-free tartar removal',
        'Fluoride treatments & biocompatible sealants',
        'Pediatric checkups and gentle care for all ages'
      ],
      idealFor: 'Routine checkups, hygiene visits, family dental wellness, and preventative oral health.'
    },
    implants: {
      title: 'Permanent Dental Implants',
      badge: 'Restorative Surgery',
      desc: 'Restore chewing power, facial structure, and smile confidence with biocompatible titanium implants capped with lifelike zirconia porcelain crowns.',
      points: [
        '3D CBCT digital guided placement for pinpoint accuracy',
        'Virtually indistinguishable from natural teeth',
        'Preserves jawbone density and avoids trimming adjacent teeth',
        'Lifetime warranty on titanium implant fixtures'
      ],
      idealFor: 'Patients with single missing teeth, multiple gaps, or seeking permanent alternatives to dentures.'
    },
    whitening: {
      title: 'Teeth Whitening & Brightening',
      badge: 'Cosmetic Aesthetic',
      desc: 'Achieve a radiant, luminous smile up to 8 shades whiter in just 60 minutes with our clinic-exclusive Phillips Zoom! LED laser whitening system.',
      points: [
        'Clinically proven up to 8 shades lighter in one visit',
        'Proprietary desensitizing gel to prevent sensitivity',
        'Includes custom take-home maintenance kit & trays',
        'Safe on enamel, crowns, and dental restorations'
      ],
      idealFor: 'Stains from coffee, tea, red wine, tobacco, or natural aging discoloration.'
    },
    rootcanal: {
      title: 'Gentle Root Canal Treatment',
      badge: 'Endodontics',
      desc: 'Save your natural tooth with painless modern rotary endodontics. We remove infected nerve pulp, sterilize the canal, and seal it to eliminate pain permanently.',
      points: [
        'Painless rotary technology with computer-controlled anesthesia',
        'Completed in 1 to 2 relaxing sessions',
        'Relieves severe toothache and stops infection from spreading',
        'Finished with a durable porcelain crown for lifelong strength'
      ],
      idealFor: 'Deep cavities, infected pulp, severe tooth pain, or swelling.'
    },
    aligners: {
      title: 'Braces & Clear Aligners',
      badge: 'Orthodontics',
      desc: 'Straighten crooked teeth, close gaps, and fix bite issues discreetly without metal brackets using clear, removable Invisalign-grade aligners.',
      points: [
        'Virtually invisible when worn in daily life and work',
        'Removable for normal eating, brushing, and flossing',
        '3D digital preview showing your smile transformation before starting',
        'Gentle, continuous tooth movement with zero food restrictions'
      ],
      idealFor: 'Teens and adults looking for straight teeth without visible metal braces.'
    },
    crowns: {
      title: 'Crowns & Bridges',
      badge: 'Prosthodontics',
      desc: 'Restore broken, severely decayed, or weakened teeth with custom-milled all-ceramic zirconia crowns and dental bridges designed to match your smile.',
      points: [
        'Precision digital scanning — no messy putty impressions',
        '100% metal-free, biocompatible all-ceramic zirconia',
        'Custom shade-matched to your surrounding natural teeth',
        'Restores full chewing power and protects against fractures'
      ],
      idealFor: 'Cracked teeth, large fillings, post-root canal reinforcement, and bridges.'
    },
    pediatric: {
      title: 'Pediatric Dentistry',
      badge: "Children's Dental",
      desc: 'We make dental visits exciting, gentle, and fun for kids. Our friendly pediatric specialists build positive memories and lifelong healthy habits.',
      points: [
        'Child-friendly play area and gentle chairside demeanor',
        'Protective dental sealants and painless fluoride therapy',
        'Early orthodontic assessment and space maintainers',
        'Fun tooth brushing education and prize tokens'
      ],
      idealFor: 'Toddlers, children, and teenagers for positive, anxiety-free dental visits.'
    },
    cosmetic: {
      title: 'Cosmetic Dentistry & Veneers',
      badge: 'Smile Makeover',
      desc: 'Design your dream smile with custom porcelain veneers, composite bonding, and gum contouring tailored to your facial aesthetics.',
      points: [
        'Handcrafted ultra-thin porcelain veneers',
        'Minimally invasive composite bonding for chips and gaps',
        'Laser gum contouring for symmetrical gum lines',
        'Digital Smile Design (DSD) preview simulation'
      ],
      idealFor: 'Chipped teeth, stubborn stains, uneven smile symmetry, and complete smile makeovers.'
    }
  };

  learnMoreBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceId = btn.getAttribute('data-service-id');
      const data = servicesDetails[serviceId];
      if (!data) return;

      const titleEl = serviceModal.querySelector('.service-modal-title');
      const badgeEl = serviceModal.querySelector('.service-modal-badge');
      const descEl = serviceModal.querySelector('.service-modal-desc');
      const listEl = serviceModal.querySelector('.service-modal-points');
      const idealEl = serviceModal.querySelector('.service-modal-ideal');
      const bookBtn = serviceModal.querySelector('.service-modal-book-btn');

      if (titleEl) titleEl.textContent = data.title;
      if (badgeEl) badgeEl.textContent = data.badge;
      if (descEl) descEl.textContent = data.desc;
      if (idealEl) idealEl.textContent = data.idealFor;

      if (listEl) {
        listEl.innerHTML = data.points.map(pt => `
          <li style="display:flex; align-items:center; gap:10px; margin-bottom:10px; font-size:0.92rem; color:var(--text-primary);">
            <span style="width:18px;height:18px;border-radius:50%;background:var(--mint-badge);color:var(--primary-teal);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:bold;flex-shrink:0;">✓</span>
            ${pt}
          </li>
        `).join('');
      }

      if (bookBtn) {
        bookBtn.setAttribute('data-treatment', data.title);
      }

      serviceModal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeBtns = serviceModal.querySelectorAll('.close-service-modal');
  closeBtns.forEach(b => {
    b.addEventListener('click', () => {
      serviceModal.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });

  serviceModal.addEventListener('click', (e) => {
    if (e.target === serviceModal) {
      serviceModal.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });
}

/* ==========================================================================
   8. DOCTOR PROFILES & SWITCHER
   ========================================================================== */
function initDoctorProfiles() {
  const doctorCards = document.querySelectorAll('.team-avatar-item');
  if (!doctorCards.length) return;

  const doctorsData = {
    elena: {
      name: 'Dr. Elena Vance',
      degrees: 'BDS, MDS (Prosthodontics) — Chief Dentist',
      role: 'Chief Dental Officer & Aesthetic Specialist',
      years: '15+',
      cases: '6,200+',
      satisfaction: '99.4%',
      bio: 'Dr. Elena Vance founded BrightBite with a mission to bring compassionate, pain-free dental excellence to families. With over 15 years of clinical practice and postgraduate specialization in prosthodontics and cosmetic dentistry, she has transformed thousands of smiles using advanced micro-dentistry techniques.',
      img: 'images/doctor-elena-vance.jpg'
    },
    marcus: {
      name: 'Dr. Marcus Chen',
      degrees: 'DDS, MS (Orthodontics)',
      role: 'Head of Orthodontics & Clear Aligners',
      years: '12+',
      cases: '3,800+',
      satisfaction: '99.1%',
      bio: 'Dr. Marcus Chen is a certified Platinum Elite Invisalign provider and clinical orthodontist. He specializes in discreet tooth alignment for teens and adults, treating complex malocclusions with gentle force and high-speed digital mapping.',
      img: 'images/doctor-marcus.jpg'
    },
    sarah: {
      name: 'Dr. Sarah Jenkins',
      degrees: 'DMD (Pediatric Dental Specialist)',
      role: 'Director of Pediatric Dentistry',
      years: '9+',
      cases: '4,100+',
      satisfaction: '99.8%',
      bio: 'Beloved by children and trusted by parents, Dr. Sarah creates an uplifting, anxiety-free atmosphere. She holds dual certification in pediatric dentistry and conscious sedation, ensuring gentle, joyful visits for every little patient.',
      img: 'images/doctor-sarah.jpg'
    }
  };

  doctorCards.forEach(card => {
    card.addEventListener('click', () => {
      doctorCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const docKey = card.getAttribute('data-doctor');
      const data = doctorsData[docKey];
      if (!data) return;

      const nameEl = document.getElementById('featuredDocName');
      const degEl = document.getElementById('featuredDocDegrees');
      const roleEl = document.getElementById('featuredDocRole');
      const bioEl = document.getElementById('featuredDocBio');
      const imgEl = document.getElementById('featuredDocImg');
      const yearsEl = document.getElementById('featuredDocYears');
      const casesEl = document.getElementById('featuredDocCases');

      if (nameEl) nameEl.textContent = data.name;
      if (degEl) degEl.textContent = data.degrees;
      if (roleEl) roleEl.textContent = data.role;
      if (bioEl) bioEl.textContent = data.bio;
      if (imgEl) imgEl.src = data.img;
      if (yearsEl) yearsEl.textContent = data.years;
      if (casesEl) casesEl.textContent = data.cases;
    });
  });
}

/* ==========================================================================
   9. BLOG MODAL READER
   ========================================================================== */
function initBlogModals() {
  const blogModal = document.getElementById('blogModal');
  const readMoreBtns = document.querySelectorAll('.blog-read-more-btn');
  if (!blogModal || !readMoreBtns.length) return;

  const articlesData = {
    '1': {
      title: 'How Often Should You Visit the Dentist? A Modern Guide',
      category: 'Preventative Care',
      date: 'September 2026',
      readTime: '4 min read',
      author: 'Dr. Elena Vance, BDS, MDS',
      body: `
        <p>While the standard recommendation has long been "twice a year," modern dental care is personalized to your unique oral microbiome, gum health, and lifestyle.</p>
        <p>For patients with healthy teeth and strong gums, a bi-annual professional ultrasonic scaling and examination is often sufficient. However, if you have a history of gum inflammation (gingivitis), dental implants, or orthodontic aligners, cleanings every 3–4 months prevent plaque buildup from developing into irreversible periodontal disease.</p>
        <h4 style="margin:20px 0 10px; font-weight:700; color:var(--text-primary);">Key Signs You Need an Immediate Visit:</h4>
        <ul style="padding-left:20px; margin-bottom:16px; line-height:1.7;">
          <li>Bleeding or swollen gums when brushing or flossing</li>
          <li>Lingering sensitivity to cold ice water or hot coffee</li>
          <li>Persistent dry mouth or bad breath that mouthwash does not resolve</li>
          <li>Clicking or tenderness in your jaw joint (TMJ) upon waking</li>
        </ul>
        <p>At BrightBite, our preventative checkups utilize ultra-low dose 3D imaging and gentle ultrasonic scalers to keep your visits quick, comfortable, and completely pain-free.</p>
      `
    },
    '2': {
      title: '5 Simple Habits for Healthier Teeth Between Cleanings',
      category: 'Oral Hygiene',
      date: 'September 2026',
      readTime: '5 min read',
      author: 'Dr. Sarah Jenkins, DMD',
      body: `
        <p>Brushing alone cleans only about 60% of tooth surfaces. To protect the remaining 40% between your teeth where cavities and gum disease usually start, these five evidence-based habits deliver massive benefits:</p>
        <ol style="padding-left:20px; margin-bottom:16px; line-height:1.8;">
          <li><strong>Wait 30 Minutes After Acidic Foods:</strong> Acid temporarily softens enamel. Brushing immediately after morning orange juice or coffee can scrub away microscopic mineral layers. Swish water first and brush 30 minutes later.</li>
          <li><strong>Embrace Interdental Cleaning:</strong> Whether using traditional dental floss or a modern water flosser, cleaning interdental spaces once daily is non-negotiable.</li>
          <li><strong>Spit, Don't Rinse:</strong> After brushing with fluoride toothpaste, spit out the excess but do not rinse vigorously with water. Leaving a microscopic film of fluoride allows active remineralization throughout the night.</li>
          <li><strong>Chew Sugar-Free Xylitol Gum:</strong> Xylitol starves harmful bacteria and stimulates saliva flow, which neutralizes cavity-causing acids after meals.</li>
          <li><strong>Stay Hydrated:</strong> Saliva is your mouth's natural defense mechanism. Drinking plenty of water washes away food particles and maintains balanced oral pH.</li>
        </ol>
      `
    },
    '3': {
      title: 'Root Canal Treatment: What You Need to Know (and Why It Does Not Hurt)',
      category: 'Treatment Guide',
      date: 'September 2026',
      readTime: '6 min read',
      author: 'Dr. Elena Vance, BDS, MDS',
      body: `
        <p>Root canal therapy has an outdated reputation as an uncomfortable procedure. Today, with computerized local anesthesia and precision rotary titanium instruments, a root canal feels no different than getting a routine small filling!</p>
        <p>In fact, the root canal procedure does not cause pain — it permanently <em>relieves</em> the intense pain caused by an infected tooth nerve.</p>
        <h4 style="margin:20px 0 10px; font-weight:700; color:var(--text-primary);">How the Procedure Works:</h4>
        <p>During the appointment, Dr. Elena gently accesses the inner chamber of the tooth, meticulously removes inflamed tissue, disinfects the microscopic canals with antimicrobial irrigants, and seals the tooth with a biocompatible rubber compound called gutta-percha. A ceramic zirconia crown is then placed to restore 100% natural chewing strength.</p>
      `
    },
    '4': {
      title: 'Are Clear Aligners Right for You? A Complete Comparison',
      category: 'Orthodontics',
      date: 'September 2026',
      readTime: '5 min read',
      author: 'Dr. Marcus Chen, DDS, MS',
      body: `
        <p>Clear aligners have revolutionized modern orthodontics. If you want straight teeth without the look or discomfort of metal brackets and wires, here is what you need to know.</p>
        <h4 style="margin:20px 0 10px; font-weight:700; color:var(--text-primary);">Advantages of Clear Aligners:</h4>
        <ul style="padding-left:20px; margin-bottom:16px; line-height:1.7;">
          <li><strong>Discreet & Clear:</strong> Virtually undetectable in professional meetings and social photos.</li>
          <li><strong>Removable for Meals:</strong> Enjoy crunchy apples, popcorn, and favorite meals with zero dietary restrictions.</li>
          <li><strong>Easy Flossing:</strong> Take aligners out to brush and floss normally, keeping gums healthy throughout treatment.</li>
          <li><strong>Digital 3D Simulation:</strong> Our intraoral scanners map your entire treatment trajectory before your first tray is molded.</li>
        </ul>
      `
    },
    '5': {
      title: "How to Keep Your Child's Teeth Healthy: A Parent's Playbook",
      category: "Pediatric Dental",
      date: 'September 2026',
      readTime: '4 min read',
      author: 'Dr. Sarah Jenkins, DMD',
      body: `
        <p>Early childhood dental care sets the foundation for a lifetime of healthy adult teeth and high confidence. Here is how parents can make oral hygiene a breeze:</p>
        <p>1. Start early: wipe infant gums with a clean, damp cloth even before teeth erupt. As soon as the first tooth appears, introduce an ultra-soft infant toothbrush with a grain-of-rice sized smear of fluoride toothpaste.</p>
        <p>2. Make brushing interactive: use 2-minute musical timers, fun brushing apps, or brush together as a family so children view dental care as a fun daily ritual rather than a chore.</p>
        <p>3. First dental visit by age one: establishing a "Dental Home" by your child's first birthday prevents early childhood caries and helps children feel completely at home in the clinic.</p>
      `
    }
  };

  readMoreBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const articleId = btn.getAttribute('data-article-id');
      const data = articlesData[articleId];
      if (!data) return;

      const titleEl = blogModal.querySelector('.blog-modal-title');
      const catEl = blogModal.querySelector('.blog-modal-category');
      const metaEl = blogModal.querySelector('.blog-modal-meta');
      const bodyEl = blogModal.querySelector('.blog-modal-body');

      if (titleEl) titleEl.textContent = data.title;
      if (catEl) catEl.textContent = data.category;
      if (metaEl) metaEl.textContent = `${data.date} • ${data.readTime} • By ${data.author}`;
      if (bodyEl) bodyEl.innerHTML = data.body;

      blogModal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeBtns = blogModal.querySelectorAll('.close-blog-modal');
  closeBtns.forEach(b => {
    b.addEventListener('click', () => {
      blogModal.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });

  blogModal.addEventListener('click', (e) => {
    if (e.target === blogModal) {
      blogModal.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });
}

/* ==========================================================================
   10. SMOOTH SCROLLING FOR ANCHORS
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   11. TOAST NOTIFICATIONS
   ========================================================================== */
function showToast(message) {
  let toast = document.querySelector('.toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}
