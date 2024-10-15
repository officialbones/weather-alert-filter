async function fetchWeatherAlerts() {
    const rssUrl = 'https://api.weather.gov/alerts/active.atom?point=40.4357%2C-85.01';
    try {
        const response = await fetch(rssUrl);
        const textData = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(textData, 'application/xml');

        console.log("RSS feed fetched successfully:", xmlDoc);  // Debug log

        const entries = xmlDoc.querySelectorAll('entry');
        const alertList = document.getElementById('alerts-list');
        
        entries.forEach(entry => {
            const title = entry.querySelector('title').textContent;
            // Display all alerts without filtering
            const listItem = document.createElement('li');
            listItem.textContent = title;
            alertList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching the RSS feed:', error);  // Debug error log
    }
}

window.onload = fetchWeatherAlerts;

