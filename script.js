// Store alerts data
let alertsData = [];

// Initialize the map and set its view to the user's location
let map = L.map('map').setView([40.4357, -85.01], 7); // Center on your location

// Set up the OSM layer for the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to request notification permission
function requestNotificationPermission() {
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("Notification permission granted.");
            } else {
                console.log("Notification permission denied.");
            }
        });
    }
}

// Function to send a notification for critical alerts
function sendAlertNotification(alert) {
    if (Notification.permission === "granted") {
        new Notification(alert.title, {
            body: alert.summary,
            icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Warning_icon.svg/1200px-Warning_icon.svg.png" // Example icon URL, replace with your own if needed
        });
    }
}

// Function to fetch and display all weather alerts
async function fetchWeatherAlerts() {
    const rssUrl = 'https://api.weather.gov/alerts/active.atom?point=40.4357%2C-85.01';
    try {
        const response = await fetch(rssUrl);
        if (!response.ok) throw new Error(`Failed to fetch alerts: ${response.status}`);
        
        const textData = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(textData, 'application/xml');

        const entries = xmlDoc.querySelectorAll('entry');
        alertsData = []; // Clear previous alerts

        entries.forEach(entry => {
            const title = entry.querySelector('title').textContent;
            const summary = entry.querySelector('summary').textContent;
            const updated = entry.querySelector('updated').textContent;
            const polygonCoordinates = entry.querySelector('geocode > polygon')?.textContent;

            const category = getCategory(title);

            // Store alert data along with coordinates
            const alert = {
                title: title,
                category: category,
                summary: summary,
                updated: updated,
                polygonCoordinates: polygonCoordinates
            };
            alertsData.push(alert);

            // Send notification for warnings or tornado alerts
            if (category === 'Warnings' && title.toLowerCase().includes('tornado')) {
                sendAlertNotification(alert);
            }

            // Plot polygon if coordinates are available
            if (polygonCoordinates) {
                plotAlertOnMap(polygonCoordinates, title, summary);
            }
        });

        // Display all alerts by default
        displayAlerts('All');
    } catch (error) {
        console.error('Error fetching the RSS feed:', error);
    }
}

// Function to plot an alert on the map
function plotAlertOnMap(polygonCoordinates, title, summary) {
    const coordsArray = polygonCoordinates.split(' ').map(coord => {
        const [lat, lon] = coord.split(',');
        return [parseFloat(lat), parseFloat(lon)];
    });

    const polygon = L.polygon(coordsArray, { color: 'red' }).addTo(map);
    polygon.bindPopup(`<b>${title}</b><br>${summary}`);
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

            // Create severity box
            const severityBox = document.createElement('div');
            severityBox.classList.add('severity-box', alert.category.toLowerCase());
            severityBox.textContent = `Severity: ${alert.category}`;

            const titleElem = document.createElement('h3');
            titleElem.innerHTML = `${getAlertIcon(alert.category)} ${alert.title}`;
            titleElem.classList.add('alert-title');

            const updatedElem = document.createElement('p');
            updatedElem.textContent = `Updated: ${new Date(alert.updated).toLocaleString()}`;
            updatedElem.classList.add('alert-updated');

            const summaryElem = document.createElement('p');
            summaryElem.textContent = alert.summary;
            summaryElem.classList.add('alert-summary');

            listItem.appendChild(severityBox);
            listItem.appendChild(titleElem);
            listItem.appendChild(updatedElem);
            listItem.appendChild(summaryElem);

            alertList.appendChild(listItem);
        });
    }
}

// Function to get an icon based on the alert category
function getAlertIcon(category) {
    switch (category) {
        case 'Warnings':
            return '⚠️'; // Warning sign
        case 'Watches':
            return '👀'; // Binoculars for Watch
        case 'Advisories':
            return '🌡️'; // Temperature icon
        default:
            return 'ℹ️'; // Info icon for others
    }
}

// Function to fetch the local weather forecast
async function fetchLocalWeather() {
    const apiKey = '75491fbd2d99da35a5aed98142354714'; // Your OpenWeatherMap API key
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=40.4357&lon=-85.01&units=imperial&appid=${apiKey}`;

    try {
        const response = await fetch(weatherUrl);
        if (!response.ok) throw new Error(`Failed to fetch weather data: ${response.status}`);
        
        const weatherData = await response.json();

        const weatherInfoDiv = document.getElementById('weather-info');
        weatherInfoDiv.innerHTML = `
            <p>Temperature: ${weatherData.main.temp}°F (High: ${weatherData.main.temp_max}°F, Low: ${weatherData.main.temp_min}°F)</p>
            <p>Condition: ${weatherData.weather[0].description}</p>
            <p>Wind Speed: ${weatherData.wind.speed} mph</p>
        `;
    } catch (error) {
        console.error('Error fetching the local weather:', error);
        document.getElementById('weather-info').innerHTML = '<p>Unable to load local weather data. Please check your API key and internet connection.</p>';
    }
}

// Request notification permission and fetch alerts and weather when the page loads
window.onload = () => {
    requestNotificationPermission();
    fetchWeatherAlerts();
    fetchLocalWeather();
};
