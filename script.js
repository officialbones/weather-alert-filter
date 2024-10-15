// Function to fetch and filter the weather alerts
async function fetchWeatherAlerts() {
    const rssUrl = 'https://api.weather.gov/alerts/active.atom?point=40.4357%2C-85.01';
    try {
        const response = await fetch(rssUrl);
        const textData = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(textData, 'application/xml');
        
        const entries = xmlDoc.querySelectorAll('entry');
        const alertList = document.getElementById('alerts-list');
        
        entries.forEach(entry => {
            const title = entry.querySelector('title').textContent;
            // Filter for Tornado Warning or Wind Advisory
            if (title.includes('Tornado Warning') || title.includes('Wind Advisory')) {
                const listItem = document.createElement('li');
                listItem.textContent = title;
                alertList.appendChild(listItem);
            }
        });
    } catch (error) {
        console.error('Error fetching the RSS feed:', error);
    }
}

// Run the function to get alerts when the page loads
window.onload = fetchWeatherAlerts;
