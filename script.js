
const navbar  = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const navMenu  = document.getElementById('navMenu');
const navLinks  = document.querySelectorAll('.navbar__link');
const contactForm  = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const footerYear = document.getElementById('footerYear');

/* ======== Año footer ======= */
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

/* ======== Navbar mobile ========== */

function handleNavbarScroll() {
  if (window.scrollY > 30) {
    navbar.classList.add('navbar--scrolled');
  } else {
    navbar.classList.remove('navbar--scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll(); 

/* ========  Menu hamburguesa ======= */

function toggleMenu(forceClose = false) {
  const isOpen = navMenu.classList.contains('navbar__nav--open');

  if (forceClose || isOpen) {
    
    navMenu.classList.remove('navbar__nav--open');
    hamburger.classList.remove('navbar__hamburger--open');
    hamburger.setAttribute('aria-expanded', 'false');
  } else {
    
    navMenu.classList.add('navbar__nav--open');
    hamburger.classList.add('navbar__hamburger--open');
    hamburger.setAttribute('aria-expanded', 'true');
  }
}

if (hamburger) {
  hamburger.addEventListener('click', () => toggleMenu());
}

navLinks.forEach(link => {
  link.addEventListener('click', () => toggleMenu(true));
});

window.addEventListener('resize', () => {
  if (window.innerWidth >= 1024) {
    toggleMenu(true);
  }
}, { passive: true });


/* ======== Enlace activo navbar ======== */
const sections = document.querySelectorAll('section[id], header[id]');

const activeLinkObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');

      navLinks.forEach(link => {
        link.classList.remove('navbar__link--active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('navbar__link--active');
        }
      });
    }
  });
}, {
  rootMargin: `-${parseInt(getComputedStyle(document.documentElement)
    .getPropertyValue('--navbar-height')) || 68}px 0px -55% 0px`,
  threshold: 0,
});

sections.forEach(section => activeLinkObserver.observe(section));

/* ============= Fade-in ======== */
const fadeTargets = [
  ...document.querySelectorAll('.class-card'), 
  ...document.querySelectorAll('.stats__item'),
  ...document.querySelectorAll('.about__value'),
  ...document.querySelectorAll('.contact__info-item'),
  document.querySelector('.about__content'),
  document.querySelector('.about__visual'),
  document.querySelector('.contact__form-wrapper'),
].filter(Boolean); 

fadeTargets.forEach(el => el.classList.add('js-fade-in'));

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('js-fade-in--visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
});

fadeTargets.forEach(el => fadeObserver.observe(el));

/* ============= Validacion Form =========== */

function showError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const errorEl = document.getElementById(errorId);
  if (input) input.classList.add('form-group__input--invalid');
  if (errorEl) errorEl.textContent = message;
}

function clearError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const errorEl = document.getElementById(errorId);
  if (input) input.classList.remove('form-group__input--invalid');
  if (errorEl) errorEl.textContent = '';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const nameInput    = document.getElementById('name');
const emailInput   = document.getElementById('email');
const messageInput = document.getElementById('message');

if (nameInput) {
  nameInput.addEventListener('blur', () => {
    if (nameInput.value.trim().length < 2) {
      showError('name', 'nameError', 'Por favor ingresá tu nombre completo.');
    } else {
      clearError('name', 'nameError');
    }
  });
}

if (emailInput) {
  emailInput.addEventListener('blur', () => {
    if (!isValidEmail(emailInput.value.trim())) {
      showError('email', 'emailError', 'Ingresá un correo electrónico válido.');
    } else {
      clearError('email', 'emailError');
    }
  });
}

if (messageInput) {
  messageInput.addEventListener('blur', () => {
    if (messageInput.value.trim().length < 10) {
      showError('message', 'messageError', 'El mensaje debe tener al menos 10 caracteres.');
    } else {
      clearError('message', 'messageError');
    }
  });
}

/*  Submit */

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    
    if (!nameInput || nameInput.value.trim().length < 2) {
      showError('name', 'nameError', 'Por favor ingresá tu nombre completo.');
      isValid = false;
    } else {
      clearError('name', 'nameError');
    }

    if (!emailInput || !isValidEmail(emailInput.value.trim())) {
      showError('email', 'emailError', 'Ingresá un correo electrónico válido.');
      isValid = false;
    } else {
      clearError('email', 'emailError');
    }

    if (!messageInput || messageInput.value.trim().length < 10) {
      showError('message', 'messageError', 'El mensaje debe tener al menos 10 caracteres.');
      isValid = false;
    } else {
      clearError('message', 'messageError');
    }

    if (isValid) {
      contactForm.submit();
      if (formSuccess) {
        formSuccess.removeAttribute('hidden');
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        setTimeout(() => {
          formSuccess.setAttribute('hidden', '');
        }, 5000);
      }
    } else {
      const firstError = contactForm.querySelector('.form-group__input--invalid');
      if (firstError) firstError.focus();
    }
  });
}
