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

  // --- Dynamic Medium Articles Integration ---
  const initMediumArticles = async () => {
    const articlesContainer = document.querySelector('.articles-list');
    if (!articlesContainer) return;

    const rssFeedUrl = 'https://medium.com/feed/@bolammanuel';
    const jsonApiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssFeedUrl)}`;

    try {
      const response = await fetch(jsonApiUrl);
      if (!response.ok) throw new Error('Failed to fetch articles');
      const data = await response.json();
      
      if (data.status !== 'ok' || !data.items || data.items.length === 0) {
        throw new Error('Invalid feed data');
      }

      // Format date helper (e.g. "2026-03-15 10:24:00" -> "Mar 2026")
      const formatDate = (dateStr) => {
        try {
          const date = new Date(dateStr.replace(/-/g, "/"));
          return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        } catch (e) {
          return dateStr;
        }
      };

      // Strip HTML helper and extract clean text snippet
      const getSnippet = (htmlContent) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent || '';
        const figures = tempDiv.querySelectorAll('figure');
        figures.forEach(fig => fig.remove());
        let text = tempDiv.textContent || tempDiv.innerText || '';
        text = text.trim().replace(/\s+/g, ' ');
        if (text.length > 150) {
          return text.substring(0, 150) + '...';
        }
        return text;
      };

      // Determine publication platform helper
      const getPlatform = (link) => {
        if (link.includes('stackademic')) return 'Stackademic';
        return 'Medium';
      };

      const latestArticles = data.items.slice(0, 3);
      
      let htmlContent = '';
      latestArticles.forEach(item => {
        const title = item.title;
        const link = item.link;
        const date = formatDate(item.pubDate);
        const platform = getPlatform(link);
        const snippet = getSnippet(item.description || item.content);

        htmlContent += `
          <a href="${link}" target="_blank" rel="noopener noreferrer" class="article-row">
            <div class="article-meta">
              <span class="article-date">${date}</span>
              <span class="article-platform">${platform}</span>
            </div>
            <div class="article-info">
              <h3>${title}</h3>
              <p>${snippet}</p>
            </div>
            <div class="article-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </a>
        `;
      });

      articlesContainer.innerHTML = htmlContent;

      // Render "Read More" button if total items in feed exceeds 3
      let readMoreBtn = document.querySelector('.writing-actions');
      if (data.items.length > 3) {
        if (!readMoreBtn) {
          readMoreBtn = document.createElement('div');
          readMoreBtn.className = 'writing-actions';
          readMoreBtn.innerHTML = `
            <a href="https://medium.com/@bolammanuel" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
              Read More on Medium
            </a>
          `;
          articlesContainer.after(readMoreBtn);
        } else {
          readMoreBtn.style.display = 'flex';
        }
      } else {
        if (readMoreBtn) {
          readMoreBtn.style.display = 'none';
        }
      }

    } catch (error) {
      console.warn('Medium integration error, falling back to static markup:', error);
    }
  };

  initMediumArticles();

});
