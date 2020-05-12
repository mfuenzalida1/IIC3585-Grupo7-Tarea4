const apiKey = "678473fb64b44950ada26c4d7a0b3614";
const defaultSource = "Bitcoin cryptocurrency";
const sourceSelector = document.querySelector('#sources');
const newsArticles = document.querySelector('main');
const controlPanel = document.querySelector('#menu');
const notifSection = document.querySelector('#notif-section');
const input = document.querySelector('#inp');
// Basado en ejemplo https://www.youtube.com/watch?v=gcx-3qi7t7c

// Contenido de dropdown
function updateNewsSources() {
    sourceSelector.innerHTML = `   
            <input type="hidden" name="user">
            <i class="dropdown icon"></i>
            <div class="default text">Seleccionar criptomoneda</div>
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

// Funcion que actualiza las noticias del mes segun fecha actual
async function updateNews(source = defaultSource) {
    newsArticles.innerHTML = '';
    const d = new Date();
    const currentDate = d.getFullYear().toString() + "-" + d.getMonth().toString() + "-" + d.getDate().toString();
    const response = await fetch(`https://newsapi.org/v2/everything?q=${source}&from=${currentDate}&sortBy=top&apiKey=${apiKey}`);
    const json = await response.json();
    newsArticles.innerHTML = json.articles.map(createArticle).join(`\n`);
}

// Funcion para valores aleatorios
function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

// Abre link de url en un nuevo tab
function openWebsite(url) {
    window.open(url);
}

// Funcion para mandar una notificacion despues de cierta cantidad de tiempo
function sendNotification() {
    const inputValue = input.value;
    if (inputValue === 'undefined' || inputValue === '') {
        return;
    }
    setTimeout(async function() {
        const token = localStorage.getItem("token");
        if (!token) {
            return;
        }
        const url = "https://fcm.googleapis.com/fcm/send";
        const data = {
            "notification": {
                "title": "Recordatorio CryptoSearch",
                "body": "Nos has pedido notificarte a esta hora!"
            },
            "to": token
        };
        const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "key=AAAA-oo5-UA:APA91bHW97cZqUOdd4EETRyjwUk_yo0IqIxCjHGuN5Xol2odNGuLOJknQRvtI4DgNIf0-O46Lozy0xgmJ62uIhgAcoAxuUOdjxR6nK7QpPnyFjJU7VlKD959fKav9Z4vW8m1GtfCjjmS"
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(data)
        });
    }, inputValue * 1000);
    input.value = "";
}

// Funcion para agregar cada articulo de noticias
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
    notifSection.innerHTML = `
        <button class="ui green button notify-btn" onClick="sendNotification()">Notificar</button>
    `;
    sourceSelector.value = defaultSource;
    updateNews();
});

// Cuando hay conexion, se carga lo que esta seleccionado
window.addEventListener('online', () => updateNews(sourceSelector.value));


// Installacion de App a escritorio:
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