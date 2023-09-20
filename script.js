const quoteContainer = document.getElementById('quote-container');
const quotetext = document.getElementById('quote');
const quoteauthor = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newquoteBtn = document.getElementById('new-post');

let apiQuotes = [];
// Show new Quote
function newQuotes() {
  const quote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)];
  if (!quote.author){
    quote.author.textContent = 'unknown';
}   else {
    quoteauthor.textContent = quote.author;
}
//  check quote lenght 
if (quote.text.lenght > 100) {
    quotetext.classList.add('long-quote');
} else {
    quotetext.classList.remove('long-qoute');
}
    quotetext.textContent = quote.text;
} 
// Get Quote From API
async function getQuotes() {
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
    const twitterUrl = `http://twitter.com/intent/tweet?text=${quotetext.textContent} - ${quoteauthor.textContent}`;
    window.open(twitterUrl, '_blank');

    // event listeners
newquoteBtn.addEventListener('click'), newQuotes;
twitterBtn.addEventListener('click'), tweetQuotes;

}


// On load
getQuotes();

