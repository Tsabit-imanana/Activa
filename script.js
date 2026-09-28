/* ==========================================================================
   ACTIVA CONSULTING - INTERACTIVE CLIENT SCRIPT
   Scroll-Driven Animations, Sticky Progress Tracker, Smooth Navigation & Utilities
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. Reading / Page Scroll Progress Bar (Top Indicator)
  // ==========================================================================
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  
  function updateScrollProgress() {
    if (!scrollProgressBar) return;
    const winScroll = window.pageYOffset || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (height > 0) {
      const scrolled = (winScroll / height) * 100;
      scrollProgressBar.style.width = `${Math.min(100, Math.max(0, scrolled))}%`;
    }
  }
  
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // ==========================================================================
  // 2. Sticky Header Styling on Scroll
  // ==========================================================================
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('shadow-sm');
    } else {
      header?.classList.remove('shadow-sm');
    }
  }, { passive: true });

  // ==========================================================================
  // 3. Mobile Navigation Drawer Toggle
  // ==========================================================================
  const mobileToggle = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // ==========================================================================
  // 4. Scroll-Driven Animation & Sticky Tracker for Consultants (#advisors)
  // ==========================================================================
  const advisorCards = document.querySelectorAll('.advisor-feature-card');
  const trackItems = document.querySelectorAll('.advisor-track-item');

  if (advisorCards.length > 0 && trackItems.length > 0) {
    
    // IntersectionObserver to detect which consultant is currently in the reading zone
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -40% 0px',
      threshold: [0.1, 0.3, 0.6]
    };

    const advisorObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Trigger in-view class for fade-in / scale animation
          entry.target.classList.add('in-view');

          const cardId = entry.target.id; // e.g. 'advisor-1'
          
          // Update active state in sticky rail
          trackItems.forEach(item => {
            if (item.getAttribute('href') === `#${cardId}`) {
              item.classList.add('active');
              item.classList.remove('border-brand-border');
              item.classList.add('border-brand-primary');
              
              const numSpan = item.querySelector('.track-num');
              if (numSpan) {
                numSpan.classList.add('text-brand-primary', 'font-bold');
                numSpan.classList.remove('text-brand-muted', 'font-medium');
              }

              const nameSpan = item.querySelector('.track-name');
              if (nameSpan) {
                nameSpan.classList.add('text-brand-dark', 'font-bold');
                nameSpan.classList.remove('text-brand-lead');
              }
            } else {
              item.classList.remove('active');
              item.classList.remove('border-brand-primary');
              item.classList.add('border-brand-border');

              const numSpan = item.querySelector('.track-num');
              if (numSpan) {
                numSpan.classList.remove('text-brand-primary', 'font-bold');
                numSpan.classList.add('text-brand-muted', 'font-medium');
              }

              const nameSpan = item.querySelector('.track-name');
              if (nameSpan) {
                nameSpan.classList.remove('text-brand-dark', 'font-bold');
                nameSpan.classList.add('text-brand-lead');
              }
            }
          });
        }
      });
    }, observerOptions);

    advisorCards.forEach(card => advisorObserver.observe(card));

    // Smooth Scroll when clicking any tracker item
    trackItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const targetId = item.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            const yOffset = -120; // Offset for sticky header
            const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }
      });
    });
  }

  // ==========================================================================
  // 5. General Scroll-Reveal for All Marked Elements
  // ==========================================================================
  const generalRevealElements = document.querySelectorAll('.scroll-reveal-card:not(.advisor-feature-card)');
  if (generalRevealElements.length > 0) {
    const generalObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.15 });

    generalRevealElements.forEach(el => generalObserver.observe(el));
  }

  // ==========================================================================
  // 6. Practical Copy-to-Clipboard Utility for Contact Actions
  // ==========================================================================
  window.copyContactInfo = function(text, type) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Tersalin: ${type} (${text})`);
      }).catch(() => {
        showToast(`Kontak: ${text}`);
      });
    } else {
      showToast(`Kontak: ${text}`);
    }
  };

  function showToast(message) {
    let toast = document.querySelector('.toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'fixed bottom-6 right-6 z-50 px-4 py-3 bg-brand-dark text-white text-xs font-mono border fine-border shadow-lg transition-all duration-300 transform translate-y-4 opacity-0 pointer-events-none flex items-center space-x-2.5';
      document.body.appendChild(toast);
    }
    
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0088cc" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      <span>${message}</span>
    `;
    
    toast.classList.remove('translate-y-4', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-4', 'opacity-0');
    }, 3200);
  }

  // ==========================================================================
  // 7. Interactive Proposal PDF Horizontal Reader & Slide Animation
  // ==========================================================================
  const proposalTrack = document.getElementById('proposalSliderTrack');
  const proposalCards = document.querySelectorAll('.proposal-page-card');
  const prevBtn = document.getElementById('proposalPrevBtn');
  const nextBtn = document.getElementById('proposalNextBtn');
  const floatPrevBtn = document.getElementById('floatingPrevBtn');
  const floatNextBtn = document.getElementById('floatingNextBtn');
  const currentPageDisplay = document.getElementById('currentPageNum');
  const pageTitleDisplay = document.getElementById('pageTitlePreview');
  const progressBar = document.getElementById('proposalProgressBar');
  const pillsContainer = document.getElementById('proposalPagePills');
  const fullscreenBtn = document.getElementById('proposalFullscreenBtn');
  const readerContainer = document.getElementById('proposalReaderContainer');

  if (proposalTrack && proposalCards.length > 0) {
    const totalPages = proposalCards.length;
    let activePageIndex = 0;
    let isUserScrolling = false;
    let scrollTimeout = null;

    const pageTitles = [
      "Sampul Depan • Proposal Kemitraan 2026",
      "Daftar Isi & Struktur Dokumen Proposal",
      "Ringkasan Eksekutif & Identitas ACTIVA ITS",
      "Latar Belakang & Visi-Misi Kemitraan",
      "Empat Bidang Layanan Konsultasi Utama",
      "Layanan 01: Konsultasi Keuangan & Solvabilitas",
      "Layanan 02: Analisis Data Kuantitatif & Visualisasi",
      "Layanan 03: Konsultasi Investasi & Portofolio",
      "Layanan 04: Manajemen Risiko Terintegrasi",
      "Mekanisme & Metodologi Kerja Enam Tahap",
      "Estimasi Timeline & Durasi Pelaksanaan Proyek",
      "Tata Kelola, Kerahasiaan (NDA) & Etika",
      "Profil Konsultan & Rekam Jejak Penugasan",
      "Penutup, Pengesahan & Saluran Resmi"
    ];

    // Generate Page Pills
    if (pillsContainer) {
      pillsContainer.innerHTML = '';
      for (let i = 0; i < totalPages; i++) {
        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = `proposal-pill text-[11px] font-mono px-2.5 py-1 border transition-all ${
          i === 0 
            ? 'active bg-brand-primary text-white border-brand-sky font-bold' 
            : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white'
        }`;
        pill.textContent = (i + 1 < 10 ? '0' : '') + (i + 1);
        pill.title = pageTitles[i] || `Halaman ${i + 1}`;
        pill.onclick = () => scrollToPage(i);
        pillsContainer.appendChild(pill);
      }
    }

    function updateReaderUI(index) {
      activePageIndex = Math.max(0, Math.min(totalPages - 1, index));

      // Update text indicators
      if (currentPageDisplay) {
        currentPageDisplay.textContent = activePageIndex + 1;
      }
      if (pageTitleDisplay) {
        pageTitleDisplay.textContent = pageTitles[activePageIndex] || `Halaman ${activePageIndex + 1}`;
      }

      // Update progress bar
      if (progressBar) {
        const progressPercent = ((activePageIndex + 1) / totalPages) * 100;
        progressBar.style.width = `${progressPercent}%`;
      }

      // Update Button states
      const isFirst = activePageIndex === 0;
      const isLast = activePageIndex === totalPages - 1;

      if (prevBtn) prevBtn.disabled = isFirst;
      if (nextBtn) nextBtn.disabled = isLast;
      if (floatPrevBtn) floatPrevBtn.disabled = isFirst;
      if (floatNextBtn) floatNextBtn.disabled = isLast;

      // Update active card styling
      proposalCards.forEach((card, idx) => {
        if (idx === activePageIndex) {
          card.classList.add('is-active');
        } else {
          card.classList.remove('is-active');
        }
      });

      // Update pills
      if (pillsContainer) {
        const pills = pillsContainer.querySelectorAll('.proposal-pill');
        pills.forEach((p, idx) => {
          if (idx === activePageIndex) {
            p.classList.add('active', 'bg-brand-primary', 'text-white', 'border-brand-sky', 'font-bold');
            p.classList.remove('bg-slate-800/80', 'text-slate-300', 'border-slate-700');
          } else {
            p.classList.remove('active', 'bg-brand-primary', 'text-white', 'border-brand-sky', 'font-bold');
            p.classList.add('bg-slate-800/80', 'text-slate-300', 'border-slate-700');
          }
        });
      }
    }

    function scrollToPage(index) {
      if (index < 0 || index >= totalPages) return;
      const targetCard = proposalCards[index];
      if (!targetCard) return;

      isUserScrolling = true;
      const scrollOffset = targetCard.offsetLeft - proposalTrack.offsetLeft - (proposalTrack.clientWidth - targetCard.clientWidth) / 2;

      proposalTrack.scrollTo({
        left: scrollOffset,
        behavior: 'smooth'
      });

      updateReaderUI(index);

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isUserScrolling = false;
      }, 500);
    }

    // Prev / Next button clicks
    function goPrev() {
      if (activePageIndex > 0) {
        scrollToPage(activePageIndex - 1);
      }
    }
    function goNext() {
      if (activePageIndex < totalPages - 1) {
        scrollToPage(activePageIndex + 1);
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', goPrev);
    if (nextBtn) nextBtn.addEventListener('click', goNext);
    if (floatPrevBtn) floatPrevBtn.addEventListener('click', goPrev);
    if (floatNextBtn) floatNextBtn.addEventListener('click', goNext);

    // Track scroll event to detect current page in center
    proposalTrack.addEventListener('scroll', () => {
      if (isUserScrolling) return;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const trackCenter = proposalTrack.scrollLeft + proposalTrack.clientWidth / 2;
        let closestIndex = 0;
        let minDiff = Infinity;

        proposalCards.forEach((card, idx) => {
          const cardCenter = card.offsetLeft - proposalTrack.offsetLeft + card.clientWidth / 2;
          const diff = Math.abs(trackCenter - cardCenter);
          if (diff < minDiff) {
            minDiff = diff;
            closestIndex = idx;
          }
        });

        if (closestIndex !== activePageIndex) {
          updateReaderUI(closestIndex);
        }
      }, 60);
    }, { passive: true });

    // Wheel event to scroll horizontally when over the reader
    proposalTrack.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        proposalTrack.scrollLeft += e.deltaY * 1.5;
      }
    }, { passive: false });

    // Keyboard navigation (Arrow keys)
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      const rect = proposalTrack.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;

      if (inView) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          goNext();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goPrev();
        }
      }
    });

    // Fullscreen toggle
    if (fullscreenBtn && readerContainer) {
      fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          if (readerContainer.requestFullscreen) {
            readerContainer.requestFullscreen();
          } else if (readerContainer.webkitRequestFullscreen) {
            readerContainer.webkitRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      });

      document.addEventListener('fullscreenchange', () => {
        const isFull = !!document.fullscreenElement;
        const iconSpan = fullscreenBtn.querySelector('span');
        if (iconSpan) {
          iconSpan.textContent = isFull ? 'Tutup Penuh' : 'Layar Penuh';
        }
      });
    }

    // Initialize UI on load
    updateReaderUI(0);
  }

});

