document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Menu Toggle ---
  const header = document.querySelector('header');
  const menuBtn = document.querySelector('.menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const logoLink = document.getElementById('logo-link');
  const line1 = document.getElementById('line1');
  const line2 = document.getElementById('line2');
  const line3 = document.getElementById('line3');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  let isMenuOpen = false;

  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
    mobileMenu.classList.toggle('open', isMenuOpen);
    if (header) header.classList.toggle('menu-open', isMenuOpen);
    
    if (isMenuOpen) {
      // Animate hamburger to X
      line1.setAttribute('x1', '4');
      line1.setAttribute('y1', '4');
      line1.setAttribute('x2', '20');
      line1.setAttribute('y2', '20');
      
      line2.setAttribute('opacity', '0');
      
      line3.setAttribute('x1', '4');
      line3.setAttribute('y1', '20');
      line3.setAttribute('x2', '20');
      line3.setAttribute('y2', '4');
      
      document.body.style.overflow = 'hidden'; // Disable page scrolling
    } else {
      // Revert to hamburger
      line1.setAttribute('x1', '4');
      line1.setAttribute('y1', '6');
      line1.setAttribute('x2', '20');
      line1.setAttribute('y2', '6');
      
      line2.setAttribute('opacity', '1');
      
      line3.setAttribute('x1', '4');
      line3.setAttribute('y1', '18');
      line3.setAttribute('x2', '20');
      line3.setAttribute('y2', '18');
      
      document.body.style.overflow = ''; // Enable page scrolling
    }
  };

  if (menuBtn) menuBtn.addEventListener('click', toggleMenu);

  // Close mobile menu when links are clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (isMenuOpen) toggleMenu();
    });
  });

  // Close mobile menu when logo is clicked
  if (logoLink) {
    logoLink.addEventListener('click', () => {
      if (isMenuOpen) toggleMenu();
    });
  }


  // --- Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Reveal once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });


  // --- Active Nav Link Highlighting ---
  const sections = document.querySelectorAll('section, main');
  const navLinks = document.querySelectorAll('header nav a');

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.5,
    rootMargin: '-50px 0px -50px 0px'
  });

  sections.forEach(section => {
    activeObserver.observe(section);
  });


  // --- Contact Form Submission Simulation ---
  const contactForm = document.getElementById('portfolio-contact-form');
  const formMsg = document.getElementById('form-msg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';

      // Simulate API submit delay
      setTimeout(() => {
        const nameVal = document.getElementById('name').value;
        
        // Clear form
        contactForm.reset();
        
        // Show success status
        formMsg.style.display = 'block';
        formMsg.style.borderColor = '#10b981'; // Green accent
        formMsg.style.color = '#065f46';
        formMsg.style.backgroundColor = '#ecfdf5';
        formMsg.textContent = `Thanks, ${nameVal}! Your message has been sent to ajibolae123@gmail.com successfully.`;
        
        // Reset submit button
        submitButton.disabled = false;
        submitButton.textContent = originalBtnText;

        // Auto hide message after 6 seconds
        setTimeout(() => {
          formMsg.style.display = 'none';
        }, 6000);
      }, 1500);
    });
  }

  // --- Dynamic Marquee Loop Speed adjustment (optional/fun) ---
  const marquee = document.querySelector('.marquee-container');
  if (marquee) {
    // Add subtle speed up/slow down on mouse enter
    marquee.addEventListener('mouseenter', () => {
      const contents = marquee.querySelectorAll('.marquee-content');
      contents.forEach(content => {
        content.style.animationDuration = '45s'; // Slow down to inspect
      });
    });
    marquee.addEventListener('mouseleave', () => {
      const contents = marquee.querySelectorAll('.marquee-content');
      contents.forEach(content => {
        content.style.animationDuration = '30s'; // Resume normal speed
      });
    });
  }

  // --- Scrolled Header Transition ---
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Check on init



  // --- Dark Mode Theme Toggle ---
  const themeToggleBtn = document.querySelector('.theme-toggle-btn');
  const moonIcon = themeToggleBtn.querySelector('.moon-icon');
  const sunIcon = themeToggleBtn.querySelector('.sun-icon');

  // Check saved user preference
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark') {
    document.documentElement.classList.add('dark-theme');
    moonIcon.style.display = 'none';
    sunIcon.style.display = 'block';
  }

  themeToggleBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark-theme');
    const isDark = document.documentElement.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    if (isDark) {
      moonIcon.style.display = 'none';
      sunIcon.style.display = 'block';
    } else {
      moonIcon.style.display = 'block';
      sunIcon.style.display = 'none';
    }
  });

});
