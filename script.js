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
            const category = getCategory(title);
            const summary = entry.querySelector('summary').textContent;

            alertsData.push({
                title: title,
                category: category,
                summary: summary
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
    if (title.includes('Warning')) {
        return 'Warnings';
    } else if (title.includes('Watch')) {
        return 'Watches';
    } else if (title.includes('Advisory')) {
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
        alertList.innerHTML = `<li>No alerts found for ${category}</li>`;
    } else {
        filteredAlerts.forEach(alert => {
            const listItem = document.createElement('li');
            listItem.textContent = `${alert.title} - ${alert.summary}`;
            alertList.appendChild(listItem);
        });
    }
}

// Run the function to get alerts when the page loads
window.onload = fetchWeatherAlerts;
