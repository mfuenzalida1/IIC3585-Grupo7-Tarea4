const apiKey = "678473fb64b44950ada26c4d7a0b3614";
const defaultSource = "Bitcoin cryptocurrency";
const sourceSelector = document.querySelector('#sources');
const newsArticles = document.querySelector('main');

// Basado en ejemplo https://www.youtube.com/watch?v=gcx-3qi7t7c

function updateNewsSources() {
    sourceSelector.innerHTML = `
            <input type="hidden" name="user">
            <i class="dropdown icon"></i>
            <div class="default text">Select Friend</div>
                <div class="menu">
                    <option class="item" value="Bitcoin cryptocurrency">
                        <img class="ui mini avatar image" src="/images/cs_icon.png">
                        Bitcoin 
                    </option>
                    <option class="item" value="Ethereum cryptocurrency">
                        <img class="ui mini avatar image" src="/images/cs_icon.png">
                        Ethereum
                    </option>
                    <option class="item" value="Ripple cryptocurrency">
                        <img class="ui mini avatar image" src="/images/cs_icon.png">
                        Ripple
                    </option>
                    <option class="item" value="Litecoin cryptocurrency">
                        <img class="ui mini avatar image" src="/images/cs_icon.png">
                        Litecoin
                    </option>
                    <option class="item" value="Tether cryptocurrency">
                        <img class="ui mini avatar image" src="/images/cs_icon.png">
                        Tether
                    </option>
                    <option class="item" value="Libra cryptocurrency">
                        <img class="ui mini avatar image" src="/images/cs_icon.png">
                        Libra
                    </option>
                    <option class="item" value="Monero cryptocurrency">
                        <img class="ui mini avatar image" src="/images/cs_icon.png">
                        Monero
                    </option>
                </div>
            </div>
    `;
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

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

function openWebsite(url) {
    window.open(url);
}

function createArticle(article) {
    return `
    <div class="card card-item" onClick="openWebsite('${article.url}')">
        <div>
            <img class="image" src="${article.urlToImage}">
        </div>
        <div class="content">
            <div class="header">
                ${article.title}
            </div>
            <div class="meta">
                <a>${article.author}</a>
            </div>
            <div class="description">
                ${article.description}
            </div>
        </div>
        <div class="extra content">
            <span class="right floated">
                <i class="heart outline like icon"></i>
                ${parseInt(randomRange(1, 300))} likes
            </span>
            <i class="comment icon"></i>
            ${parseInt(randomRange(0, 30))}
        </div>
    </div> 

	`;
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () =>
        navigator.serviceWorker.register('service-worker.js')
        .then(registration => console.log('Service Worker registered'))
        .catch(err => 'service worker registration failed'));
}

// Cuando carga, se agrega el listener para los cambios en el dropdown
window.addEventListener('load', e => {
    sourceSelector.addEventListener('change', evt => updateNews(evt.target.value));
    updateNewsSources();
    sourceSelector.value = defaultSource;
    updateNews();
});

// Cuando hay conexion, se carga lo que esta seleccionado
window.addEventListener('online', () => updateNews(sourceSelector.value));

let deferredPrompt;
const addAppBtn = document.querySelector('.install-btn');
addAppBtn.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    addAppBtn.style.display = 'block';
    addAppBtn.addEventListener('click', (e) => {
        addAppBtn.style.display = 'none';
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Usuario ha aceptado la instalacion');
            } else {
                console.log('Usuario nego la instalacion');
            }
            deferredPrompt = null;
        });
    });
});