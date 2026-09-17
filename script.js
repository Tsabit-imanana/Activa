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

});
