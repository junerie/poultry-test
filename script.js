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

let apiQuotes = [];

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
// toggle nav
function toggleNav(){
    // toggle menubars open/close
    menuBars.classList.toggle('change');
    // Toggle menu active
    overlay.classList.toggle('overlay-active');
    if (overlay.classList.contains('overlay-active')) {
      // animate in - overlay
        overlay.classList.remove('overlay-slide-left');
        overlay.classList.add('overlay-slide-right');
        // animate In - nav item
        nav1.classList.remove('slide-out-1');
        nav1.classList.add('slide-in-1');
        nav2.classList.remove('slide-out-2');
        nav2.classList.add('slide-in-2');
        nav3.classList.remove('slide-out-3');
        nav3.classList.add('slide-in-3');
        nav4.classList.remove('slide-out-4');
        nav4.classList.add('slide-in-4');
        nav5.classList.remove('slide-out-5');
        nav5.classList.add('slide-in-5');
    } else {
        // animate out -overlay
        overlay.classList.remove('overlay-slide-right');
        overlay.classList.add('overlay-slide-left');
        // animate out - nav item
        nav1.classList.remove('slide-in-1');
        nav1.classList.add('slide-out-1');
        nav2.classList.remove('slide-in-2');
        nav2.classList.add('slide-out-2');
        nav3.classList.remove('slide-in-3');
        nav3.classList.add('slide-out-3');
        nav4.classList.remove('slide-in-4');
        nav4.classList.add('slide-out-4');
        nav5.classList.remove('slide-in-5');
        nav5.classList.add('slide-out-5');
    }
}
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

// Event Listener
newquoteBtn.addEventListener('click', newQuotes);
twitterBtn.addEventListener('click', tweetQuotes);
menuBars.addEventListener('click', toggleNav);
nav1.addEventListener('click', toggleNav);
nav2.addEventListener('click', toggleNav);
nav3.addEventListener('click', toggleNav);
nav4.addEventListener('click', toggleNav);
nav5.addEventListener('click', toggleNav); 




// On load
getQuotes();
