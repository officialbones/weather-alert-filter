// Store alerts data
let alertsData = [];

// Function to fetch and display all weather alerts
async function fetchWeatherAlerts() {
    const rssUrl = 'https://api.weather.gov/alerts/active.atom?point=40.4357%2C-85.01';
    try {
        const response = await fetch(rssUrl);
        const textData = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(textData, 'application/xml');

        const entries = xmlDoc.querySelectorAll('entry');
        alertsData = []; // Clear previous alerts

        entries.forEach(entry => {
            const title = entry.querySelector('title').textContent;
            const summary = entry.querySelector('summary').textContent;
            const updated = entry.querySelector('updated').textContent;

            const category = getCategory(title);

            alertsData.push({
                title: title,
                category: category,
                summary: summary,
                updated: updated
            });
        });

        // Display all alerts by default
        displayAlerts('All');
    } catch (error) {
        console.error('Error fetching the RSS feed:', error);
    }
}

// Function to determine the category based on the alert title
function getCategory(title) {
    if (title.toLowerCase().includes('warning')) {
        return 'Warnings';
    } else if (title.toLowerCase().includes('watch')) {
        return 'Watches';
    } else if (title.toLowerCase().includes('advisory')) {
        return 'Advisories';
    } else {
        return 'Others';
    }
}

// Function to filter and display alerts based on selected category
function filterAlerts(category) {
    displayAlerts(category);
}

// Function to display alerts
function displayAlerts(category) {
    const alertList = document.getElementById('alerts-list');
    alertList.innerHTML = ''; // Clear current alerts

    const filteredAlerts = alertsData.filter(alert => category === 'All' || alert.category === category);

    if (filteredAlerts.length === 0) {
        const listItem = document.createElement('li');
        listItem.textContent = `No alerts found for ${category}`;
        listItem.classList.add('no-alerts');
        alertList.appendChild(listItem);
    } else {
        filteredAlerts.forEach(alert => {
            const listItem = document.createElement('li');
            listItem.classList.add('alert-item');

            const titleElem = document.createElement('h3');
            titleElem.textContent = alert.title;
            titleElem.classList.add('alert-title');

            const updatedElem = document.createElement('p');
            updatedElem.textContent = `Updated: ${new Date(alert.updated).toLocaleString()}`;
            updatedElem.classList.add('alert-updated');

            const summaryElem = document.createElement('p');
            summaryElem.textContent = alert.summary;
            summaryElem.classList.add('alert-summary');

            listItem.appendChild(titleElem);
            listItem.appendChild(updatedElem);
            listItem.appendChild(summaryElem);

            alertList.appendChild(listItem);
        });
    }
}

// Run the function to get alerts when the page loads
window.onload = fetchWeatherAlerts;
