/* ==========================================================================
   ACTIVA CONSULTING - INTERACTIVE CLIENT SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navigation on Scroll
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      mobileToggle.innerHTML = isOpen 
        ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>'
        : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        if (mobileToggle) {
          mobileToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
        }
      });
    });
  }

  // 3. Highlight Active Navigation Section on Scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetNav = document.querySelector(`.nav-links a[href*="${sectionId}"]`);
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        targetNav?.classList.add('active');
      } else {
        targetNav?.classList.remove('active');
      }
    });
  });

  // 4. Scroll-Driven Highlight Animation for Team Cards
  const teamCards = document.querySelectorAll('.team-card');
  if (teamCards.length > 0) {
    // Function to calculate which card is closest to the middle of the viewport
    const updateTeamHighlight = () => {
      const viewportCenter = window.innerHeight / 2;
      let closestCard = null;
      let minDistance = Infinity;

      teamCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const distance = Math.abs(viewportCenter - cardCenter);

        // Check if the card is reasonably in view
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          if (distance < minDistance) {
            minDistance = distance;
            closestCard = card;
          }
        }
      });

      // Highlight the closest card, remove highlight from others
      teamCards.forEach(card => {
        if (card === closestCard) {
          card.classList.add('scroll-highlight');
        } else {
          card.classList.remove('scroll-highlight');
        }
      });
    };

    // Listen to scroll events with requestAnimationFrame for 60fps smoothness
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateTeamHighlight();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Run initial check
    updateTeamHighlight();
  }

  // 5. Practical Copy-to-Clipboard Utility for Contact Actions
  window.copyContactInfo = function(text, type) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied ${type} (${text}) to clipboard!`);
      }).catch(() => {
        showToast(`Contact: ${text}`);
      });
    } else {
      showToast(`Contact: ${text}`);
    }
  };

  // 6. Toast Notification Utility
  function showToast(message) {
    let toast = document.querySelector('.toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      <span>${message}</span>
    `;
    
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }
});
