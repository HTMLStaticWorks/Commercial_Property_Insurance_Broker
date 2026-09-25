/**
 * FastFund - Main JavaScript
 * Handles Navigation, Theme, RTL, and global UI logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRTL();
  initNavigation();
  initReveal();
  initPasswordToggles();
  initForms();
});

/* ==========================================================================
   Password visibility toggles
   ========================================================================== */
function initPasswordToggles() {
  document.querySelectorAll('.pw-toggle').forEach(btn => {
    const input = btn.parentNode.querySelector('input');
    if (!input) return;
    btn.addEventListener('click', () => {
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.innerHTML = show ? '<i class="ph ph-eye-slash"></i>' : '<i class="ph ph-eye"></i>';
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    });
  });
}

/* ==========================================================================
   Theme Management (Dark / Light)
   ========================================================================== */
function initTheme() {
  const html = document.documentElement;
  const themeToggles = document.querySelectorAll('.theme-toggle');
  
  // Check local storage or system preference
  const savedTheme = localStorage.getItem('fastfund-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  let currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
      themeToggles.forEach(btn => btn.innerHTML = '<i class="ph ph-sun"></i>');
    } else {
      html.removeAttribute('data-theme');
      themeToggles.forEach(btn => btn.innerHTML = '<i class="ph ph-moon"></i>');
    }
    localStorage.setItem('fastfund-theme', theme);
  };

  applyTheme(currentTheme);

  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      currentTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(currentTheme);
    });
  });
}

/* ==========================================================================
   RTL Management
   ========================================================================== */
function initRTL() {
  const html = document.documentElement;
  const rtlToggles = document.querySelectorAll('.rtl-toggle');
  
  const savedRTL = localStorage.getItem('fastfund-rtl') === 'true';
  let isRTL = savedRTL;
  
  const applyRTL = (rtl) => {
    if (rtl) {
      html.setAttribute('dir', 'rtl');
    } else {
      html.removeAttribute('dir');
    }
    localStorage.setItem('fastfund-rtl', rtl);
  };

  applyRTL(isRTL);

  rtlToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      isRTL = !isRTL;
      applyRTL(isRTL);
    });
  });
}

/* ==========================================================================
   Navigation & Hamburger
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const hamburger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.nav-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const closeBtn = document.querySelector('.drawer-close');

  // Condense the floating header once the page scrolls
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Pages without a drawer (dashboard) handle their own hamburger
  if (!drawer) return;

  // Drawer Toggle
  const toggleDrawer = () => {
    const open = drawer.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  if (hamburger) hamburger.addEventListener('click', toggleDrawer);
  if (closeBtn) closeBtn.addEventListener('click', toggleDrawer);
  if (overlay) overlay.addEventListener('click', toggleDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) toggleDrawer();
  });
}

/* ==========================================================================
   Scroll Reveal
   ========================================================================== */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
}

/* ==========================================================================
   Form Validation
   ========================================================================== */
function initForms() {
  const forms = document.querySelectorAll('form.needs-validation');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const inputs = form.querySelectorAll('.form-control');
      
      inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
          isValid = false;
          showError(input, 'This field is required');
        } else if (input.type === 'email' && input.value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.value)) {
            isValid = false;
            showError(input, 'Please enter a valid email address');
          } else {
            clearError(input);
          }
        } else if (input.type === 'password' && input.value && input.value.length < 8) {
          isValid = false;
          showError(input, 'Password must be at least 8 characters');
        } else if (input.id === 'confirmPassword') {
          const pwd = form.querySelector('#password');
          if (pwd && pwd.value !== input.value) {
            isValid = false;
            showError(input, 'Passwords do not match');
          } else {
            clearError(input);
          }
        } else {
          if (input.value.trim()) {
            clearError(input);
          }
        }
      });
      
      const checkbox = form.querySelector('input[type="checkbox"][required]');
      if (checkbox && !checkbox.checked) {
        isValid = false;
        // Basic alert for checkbox for now
        alert('You must accept the terms and conditions.');
      }

      if (isValid) {
        // Show success, reset form
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="ph ph-check-circle"></i> Success';
        btn.classList.add('btn-success');
        
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove('btn-success');
          form.reset();
          inputs.forEach(inp => {
            inp.classList.remove('is-valid');
          });
        }, 3000);
      }
    });
    
    // Clear error on input
    const inputs = form.querySelectorAll('.form-control');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('is-invalid');
        const errorMsg = input.parentNode.querySelector('.invalid-feedback');
        if (errorMsg) errorMsg.style.display = 'none';
      });
    });
  });
}

function showError(input, message) {
  input.classList.add('is-invalid');
  input.classList.remove('is-valid');
  let errorDiv = input.parentNode.querySelector('.invalid-feedback');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    input.parentNode.appendChild(errorDiv);
  }
  errorDiv.textContent = message;
  errorDiv.style.display = 'flex';
}

function clearError(input) {
  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
  const errorDiv = input.parentNode.querySelector('.invalid-feedback');
  if (errorDiv) {
    errorDiv.style.display = 'none';
  }
}
