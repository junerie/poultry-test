const quoteContainer = document.getElementById('quote-container');
const quotetext = document.getElementById('quote');
const quoteauthor = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newquoteBtn = document.getElementById('new-post');
const loader = document.getElementById('loader');

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


// On load
getQuotes();


