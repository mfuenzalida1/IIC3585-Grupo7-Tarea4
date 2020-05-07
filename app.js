const apiKey = '678473fb64b44950ada26c4d7a0b3614';
const defaultSource = '"bitcoin" cryptocurrency';
const sourceSelector = document.querySelector('#sources');
const newsArticles = document.querySelector('main');

// Basado en ejemplo https://www.youtube.com/watch?v=gcx-3qi7t7c

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () =>
        navigator.serviceWorker.register('sw.js')
        .then(registration => console.log('Service Worker registered'))
        .catch(err => 'SW registration failed'));
}

window.addEventListener('load', e => {
    sourceSelector.addEventListener('change', evt => updateNews(evt.target.value));
    updateNewsSources();
    sourceSelector.value = defaultSource;
    updateNews();
});

window.addEventListener('online', () => updateNews(sourceSelector.value));

function updateNewsSources() {
    sourceSelector.innerHTML = `
		<option value='"bitcoin" cryptocurrency'>Bitcoin</option>
		<option value='"ethereum" cryptocurrency'>Ethereum</option>
		<option value='"ripple" cryptocurrency'>Ripple</option>
		<option value='"litecoin" cryptocurrency'>Litecoin</option>
		<option value='"tether" cryptocurrency'>Tether</option>
		<option value='"libra" cryptocurrency'>Libra</option>
		<option value='"monero" cryptocurrency'>Monero</option>`;
}

async function updateNews(source = defaultSource) {
    newsArticles.innerHTML = '';
    const d = new Date();
    const currentDate = d.getFullYear().toString() + "-" + d.getMonth().toString() + "-" + d.getDate().toString();
    const response = await fetch(`https://newsapi.org/v2/everything?q=${source}&from=${currentDate}&sortBy=top&apiKey=${apiKey}`);
    const json = await response.json();
    newsArticles.innerHTML =
        json.articles.map(createArticle).join('\n');
}

function createArticle(article) {
    return `
    <div class="article">
		<a href="${article.url}">
			<h2>${article.title}</h2>
			<img src="${article.urlToImage}" alt="${article.title}">
			<p>${article.description}</p>
		</a>
    </div>
	`;
}