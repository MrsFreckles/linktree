const links = [
    {
        label: "Scenepacks",
        url: "https://app.mediafire.com/2thpqntfac3zx",
        image: "images/scenepacks.webp",
    },
    {
        label: "Discord",
        url: "https://discord.gg/motorush",
        image: "images/discord.webp",
        optional_descriptionElement: "<p id='member-count'>... Members Online</p>",
    },
    {
        label: "YouTube",
        url: "https://www.youtube.com/@freckles.mp4?sub_confirmation=1",
        image: "images/youtube.webp",
    },
    {
        label: "TikTok",
        url: "https://www.tiktok.com/@freckles.mp4",
        image: "images/tiktok.webp",
    },
]


const elements = document.querySelector('.elements');
links.forEach(link => {
    const element = document.createElement('a');
    element.href = link.url;
    element.classList.add('element');
    element.style.backgroundImage = `url(${link.image})`;
    element.innerHTML = `
        <h2>${link.label}</h2>
        ${link.optional_descriptionElement || ''}
    `;

    elements.appendChild(element);
});

// --------------------------------------------
// Profilbild abrufen und anzeigen
// --------------------------------------------
async function fetchAndDisplayImage() {
    try {
        const response = await fetch('https://decor.fieryflames.dev/api/users?ids=%5B%22464424249877331969%22%5D');
        const data = await response.json();

        const imageId = data["464424249877331969"];
        const imageUrl = `https://ugc.decor.fieryflames.dev/${imageId}.png`;

        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Fetched Image';
        document.getElementById('profilePicture').appendChild(img);
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
    }
}

fetchAndDisplayImage().then(r => console.log('Profilbild erfolgreich abgerufen.'));

// --------------------------------------------
// Discord-Mitgliederanzahl abrufen und anzeigen
// --------------------------------------------
let count = document.getElementById("member-count");

window.addEventListener('load', () => {
    fetch(`https://discord.com/api/guilds/1129175632379662356/widget.json`).then(data => {
        data.json().then(data => {
            count.innerText = `${data.presence_count - 1} Members Online`;
        });
    });
});

// YouTube-Videos einbetten
const corsProxy = "https://cors-anywhere.herokuapp.com/";
const channelId = "UCBYnkgk7jCY8RbN4EIEX76g";
const rssUrl = `${corsProxy}https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

fetch(rssUrl)
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
        const firstEntry = data.querySelector("entry link");
        if (firstEntry) {
            const latestVideoUrl = firstEntry.getAttribute("href");
            const videoId = new URL(latestVideoUrl).searchParams.get("v");
            const embedUrl = `https://www.youtube.com/embed/${videoId}`;
            document.getElementById('video').innerHTML = `<iframe style="width: 100%; aspect-ratio: 16/9;" src="${embedUrl}" frameborder="0" allow="autoplay; encrypted-media" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
        } else {
            console.error("Kein Video gefunden.");
        }
    })
    .catch(error => console.error("Fehler beim Abrufen des RSS-Feeds:", error));


// --------------------------------------------
// Dark-Mode-Thema umschalten
// --------------------------------------------
let theme = localStorage.getItem('theme');
if (theme) {
    setTheme(theme);
} else {
    setTheme('dark');
}

function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
}

function setTheme(newTheme) {
    document.documentElement.setAttribute('theme', newTheme);
    localStorage.setItem('theme', newTheme);
    theme = newTheme;

    const themeSwitch = document.getElementById('theme-switch');
    themeSwitch.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    themeSwitch.setAttribute('title', `Switch to ${newTheme === 'dark' ? 'light' : 'dark'} mode`);
    themeSwitch.setAttribute('aria-label', `Switch to ${newTheme === 'dark' ? 'light' : 'dark'} mode`);
    themeSwitch.addEventListener('click', toggleTheme);
}