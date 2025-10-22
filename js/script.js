document.addEventListener("DOMContentLoaded", function() {

  // ======================================
  // IntersectionObserver / Card Animation
  // ======================================
  const cardsObserver = document.querySelectorAll('.card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('show');
        observer.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.1 });

  cardsObserver.forEach(card => observer.observe(card));

  document.querySelectorAll('.card button').forEach(button => {
    button.addEventListener('click', () => {
      alert('This would redirect to detailed gadget review page!');
    });
  });

  // ======================
  // Active Menu Highlight
  // ======================
  const menuLinks = document.querySelectorAll("nav ul li a");
  menuLinks.forEach(link => {
    if (link.getAttribute('href') === window.location.pathname.split('/').pop()) {
      link.classList.add('active'); 
    }
    link.addEventListener('click', function() {
      menuLinks.forEach(l => l.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // ======================
  // Filter Tabs
  // ======================
  if (window.location.pathname.split('/').pop() === 'reviews.html') {
    const filterBtns = Array.from(document.querySelectorAll('.category-btn'));
    const gadgetCards = Array.from(document.querySelectorAll('.gadget-card'));

    function setUrlParam(key, value) {
      const u = new URL(window.location);
      if (!value) u.searchParams.delete(key);
      else u.searchParams.set(key, value);
      history.replaceState(null, '', u.toString());
    }

    function getQueryParam(name) {
      return new URLSearchParams(window.location.search).get(name);
    }

    function applyFilter(filter) {
      const f = filter || 'all';
      filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === f));
      gadgetCards.forEach(card => {
        card.style.display = (f === 'all' || card.dataset.category === f) ? 'block' : 'none';
      });
      setUrlParam('filter', f === 'all' ? null : f);
    }

    const initialFilter = getQueryParam('filter') || 'all';
    applyFilter(initialFilter);

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        applyFilter(btn.dataset.filter);
      });
    });

    // Automatically append ?from & ?filter to "See Full Review" links
    gadgetCards.forEach(card => {
      const link = card.querySelector('a.btn');
      if (!link) return;
      if (link.href.indexOf('?') === -1) {
        const cat = card.dataset.category || 'all';
        link.href = `${link.href}?from=reviews.html&filter=${encodeURIComponent(cat)}`;
      }
    });
  }

  // =============
  // Back Button
  // =============
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', function(e) {
      e.preventDefault();

      const params = new URLSearchParams(window.location.search);
      const from = params.get('from'); 
      const filter = params.get('filter');

      if (from) {
        const target = filter ? `${from}?filter=${encodeURIComponent(filter)}` : from;
        if (window.history.length > 1) {
          const current = window.location.pathname.split('/').pop();
          window.history.back();
          setTimeout(() => {
            const now = window.location.pathname.split('/').pop();
            if (now === current) window.location.href = target;
          }, 300);
        } else {
          window.location.href = target;
        }
        return;
      }

      if (filter) window.location.href = `reviews.html?filter=${encodeURIComponent(filter)}`;
      else window.location.href = 'reviews.html';
    });
  }

// ========================
// Gadget Category Filter
// ========================
const buttons = document.querySelectorAll('.category-btn');
const cards = document.querySelectorAll('.gadget-card');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    // alisin active sa lahat
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.getAttribute('data-filter');

    cards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

  // =============
  // Contact Form
  // =============
  const form = document.getElementById('contact-form');
  const messageDiv = document.getElementById('form-message');

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = new FormData(form);
      const action = form.getAttribute('action');

      fetch(action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(response => {
        if (response.ok) {
          if (messageDiv) {
            messageDiv.innerText = 'Message Sent!';
            messageDiv.style.color = 'green';
          }
          form.reset();
        } else {
          if (messageDiv) {
            messageDiv.innerText = 'Ooops! Something went wrong.';
            messageDiv.style.color = 'red';
          }
        }
      })
      .catch(() => {
        if (messageDiv) {
          messageDiv.innerText = 'Ooops! Something went wrong.';
          messageDiv.style.color = 'red';
        }
      });
    });
  }
});

// ========================
// Scroll To Top Button
// ========================
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    scrollToTopBtn.classList.add("show");
  } else {
    scrollToTopBtn.classList.remove("show");
  }
});

scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

