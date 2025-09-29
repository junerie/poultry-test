const loader = document.getElementById('loader');
const menuBars = document.getElementById('menu-bars');
const overlay = document.getElementById('overlay');
const navItems = document.querySelectorAll('nav li');
const navLinks = document.querySelectorAll('nav a');

// Show loader
function loading()  {
    if (loader) loader.style.display = 'block';
}

// Hide Loading
function complete() {
    if (loader) loader.style.display = 'none';
}

// Control navigation Animation
// toggle nav overlay
function toggleNav(){
    if (!menuBars || !overlay) return;
    
    // toggle menubars open/close
    menuBars.classList.toggle('change');
    const isOpen = menuBars.classList.contains('change');
    menuBars.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    
    // Add/remove active class for overlay
    if (isOpen) {
        overlay.classList.add('active');
        
        // Add slide-in animations
        navItems.forEach((item, index) => {
            item.classList.remove(`slide-out-${index + 1}`);
            item.classList.add(`slide-in-${index + 1}`);
        });
    } else {
        overlay.classList.remove('active');
        
        // Add slide-out animations
        navItems.forEach((item, index) => {
            item.classList.remove(`slide-in-${index + 1}`);
            item.classList.add(`slide-out-${index + 1}`);
        });
    }
}

if (menuBars) menuBars.addEventListener('click', toggleNav);

// close overlay when nav link clicked and smooth-scroll to section
navLinks.forEach(a => {
    a.addEventListener('click', function(e){
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
        // close overlay if open
        if (menuBars && menuBars.classList.contains('change')) toggleNav();
    });
});

// Slide Show Container
document.addEventListener('DOMContentLoaded', function() {
    const sliderContainer = document.querySelector('.slider');
    if (sliderContainer) initSlider(sliderContainer, 5000);
    
    // Initialize any other functionality after DOM is loaded
    complete(); // Hide loader when page is ready
});

function initSlider(container, slideDuration) {
    const slides = container.querySelectorAll('img');
    const dots = document.querySelectorAll('.dot');
    if (!slides || slides.length === 0) return;
    
    let currentIndex = 0;
    let intervalId;
    
    // Show first slide
    slides.forEach(s => s.style.display = 'none');
    slides[0].style.display = 'block';
    if (dots && dots.length) {
        dots.forEach(d => d.classList.remove('active'));
        dots[0].classList.add('active');
    }

    function showNextSlide() {
        slides[currentIndex].style.display = 'none';
        currentIndex = (currentIndex + 1) % slides.length;
        slides[currentIndex].style.display = 'block';
        updateDots();
    }

    function updateDots() {
        if (!dots) return;
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[currentIndex]) dots[currentIndex].classList.add('active');
    }

    function changeSlide(index) {
        if (index < 0 || index >= slides.length) return;
        slides[currentIndex].style.display = 'none';
        currentIndex = index;
        slides[currentIndex].style.display = 'block';
        updateDots();
    }

    // Add click event to dots
    if (dots && dots.length) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => changeSlide(index));
        });
    }

    // Start the slider
    function startSlider() {
        return setInterval(showNextSlide, slideDuration);
    }

    // Pause on hover
    intervalId = startSlider();
    container.addEventListener('mouseenter', () => clearInterval(intervalId));
    container.addEventListener('mouseleave', () => intervalId = startSlider());
}