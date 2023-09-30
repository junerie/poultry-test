const quoteContainer = document.getElementById('quote-container');
const quotetext = document.getElementById('quote');
const quoteauthor = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newquoteBtn = document.getElementById('new-post');
const loader = document.getElementById('loader');
const menuBars = document.getElementById('menu-bars');
const overlay = document.getElementById('overlay');
const nav1 = document.getElementById('nav-1');
const nav2 = document.getElementById('nav-2');
const nav3 = document.getElementById('nav-3');
const nav4 = document.getElementById('nav-4');
const nav5 = document.getElementById('nav-5');
const Home = document.getElementById('home');
const about = document.getElementById('about');
const skills = document.getElementById('skills');
const projects = document.getElementById('projects');
const contact = document.getElementById('contact');
const navItems = [nav1, nav2, nav3, nav4, nav5];
const sectionItems = [Home, skills, projects, contact];
// show loader
function loading()  {
    loader.hidden = false;
    quoteContainer.hidden = true;
}

// Hide Loading
function complete() {
    quoteContainer.hidden = false;
    loader.hidden = true;
}

// Control navigation Animation
function navAnimation(direction1, direction2) {
    navItems.forEach((nav, i) => {
        nav.classList.replace(`slide-${direction1}-${i + 1}`,`slide-${direction2}-${i + 1}`);
    });
}
// toggle nav
function toggleNav(){
    // toggle menubars open/close
    menuBars.classList.toggle('change');
    // Toggle menu active
    overlay.classList.toggle('overlay-active');
    if (overlay.classList.contains('overlay-active')) {
      // animate in - overlay
        overlay.classList.replace('overlay-slide-left', 'overlay-slide-right');
        // animate In - nav item
        navAnimation('out', 'in')
    } else {
        // animate out -overlay
        overlay.classList.replace('overlay-slide-right', 'overlay-slide-left');
        // animate out - nav item
        navAnimation('in', 'out')
    }
}
menuBars.addEventListener('click', toggleNav);
navItems.forEach((nav) => {
nav.addEventListener('click', toggleNav);
});



let apiQuotes = [];

// Show new Quote 
function newQuotes() {
    loading();
  const quote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)];
  if (!quote.author){
    quote.author.textContent = 'unknown';
}   else {
    quoteauthor.textContent = quote.author;
}
//  check quote lenght determine styling
if (quote.text.lenght > 120) {
    quotetext.classList.add('long-quote');
} else {
    quotetext.classList.remove('long-qoute');
}
    quotetext.textContent = quote.text;
    complete();
} 
// Get Quote From API
async function getQuotes() {
    loading();
    const apiUrl = 'https://type.fit/api/quotes';
    try {
        const response = await fetch(apiUrl);
        apiQuotes = await response.json();
        newQuotes();
    } catch (error) {
        // Catch Error Here
    }
}

// Tweet quote
function tweetQuotes() {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quotetext.textContent} - ${quoteauthor.textContent}`;
    window.open(twitterUrl, '_blank');
}
newquoteBtn.addEventListener('click', newQuotes);
twitterBtn.addEventListener('click', tweetQuotes);
// On load
getQuotes();

// Slide Show Container
const sliderContainer = document.querySelector('.slider');
slider(sliderContainer, 10000);
function slider(container, slideDuration) {
    const slides = container.querySelectorAll('.slider img');
    const dots = container.querySelectorAll('.dot');
    let currentIndex = 0;

    function showNextSlide() {
        slides[currentIndex].style.display = 'none';
        currentIndex = (currentIndex + 1) % slides.length;
        slides[currentIndex].style.display = 'block';
        updateDots();
    }

    function updateDots() {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    }

    function startSlider() {
        setInterval(showNextSlide, slideDuration);
    }

    function changeSlide(index) {
        slides[currentIndex].style.display = 'none';
        currentIndex = index;
        slides[currentIndex].style.display = 'block';
        updateDots();
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => changeSlide(index));
    });

    startSlider();
}
