// Fetch weather alerts and update the page
async function fetchWeatherAlerts() {
    const rssUrl = 'https://api.weather.gov/alerts/active.atom?point=40.4357%2C-85.01';
    try {
        const response = await fetch(rssUrl);
        const textData = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(textData, 'application/xml');

        const entries = xmlDoc.querySelectorAll('entry');
        const alertList = document.getElementById('alerts-list');
        alertList.innerHTML = '';

        entries.forEach(entry => {
            const title = entry.querySelector('title').textContent;
            const summary = entry.querySelector('summary').textContent;

            const alertCard = document.createElement('div');
            alertCard.className = 'alert-card';
            alertCard.onclick = () => openModal(summary);
            alertCard.innerHTML = `
                <div class="severity">Severity: ${getSeverity(title)}</div>
                <h3>${title}</h3>
            `;
            alertList.appendChild(alertCard);
        });
    } catch (error) {
        console.error('Error fetching the RSS feed:', error);
    }
}

// Get severity based on title keywords
function getSeverity(title) {
    if (title.includes('Warning')) return 'Warning';
    if (title.includes('Watch')) return 'Watch';
    if (title.includes('Advisory')) return 'Advisory';
    return 'Notice';
}

// Open modal with alert details
function openModal(details) {
    const modal = document.getElementById('alert-modal');
    const modalDetails = document.getElementById('modal-details');
    modalDetails.innerText = details;
    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('alert-modal');
    modal.style.display = 'none';
}

window.onload = fetchWeatherAlerts;
