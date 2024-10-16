document.addEventListener("DOMContentLoaded", () => {
    console.log("JavaScript Loaded Successfully");

    // Show loading spinner
    document.getElementById('loading-spinner').style.display = 'block';
    
    // Fetch and display weather alerts and data
    fetchWeatherAlerts();
    fetchWeatherData();
});

// Function to fetch weather alerts
function fetchWeatherAlerts() {
    console.log("Fetching weather alerts...");
    const alerts = [
        {
            type: 'Warnings',
            title: 'Freeze Warning issued October 15 at 3:10PM EDT until October 16 at 9:00AM EDT by NWS Northern Indiana',
            updated: '2024-10-15T15:10:00-04:00',
            description: '* WHAT...Sub-freezing temperatures as low as 30 expected. * WHERE...Portions of northern Indiana, southwest Michigan, and northwest Ohio. * WHEN...From 2 AM to 9 AM EDT Wednesday. * IMPACTS...Frost and freeze conditions could kill crops, other sensitive vegetation and possibly damage unprotected outdoor plumbing.'
        }
    ];
    filterAlerts('All', alerts);
    // Hide loading spinner after data is loaded
    document.getElementById('loading-spinner').style.display = 'none';
}

// Function to filter alerts by type
function filterAlerts(alertType, alerts) {
    if (!alerts || alerts.length === 0) {
        console.log("No alerts available to filter.");
        document.getElementById("alerts-list").innerHTML = '<p>No weather alerts to display.</p>';
        return;
    }

    console.log(`Filtering alerts for type: ${alertType}`);
    const alertsList = document.getElementById("alerts-list");
    alertsList.innerHTML = ''; // Clear the current list

    alerts.forEach(alert => {
        if (alertType === 'All' || alert.type === alertType) {
            const alertElement = document.createElement('div');
            alertElement.classList.add('alert-item');

            const severityBox = document.createElement('div');
            severityBox.classList.add('severity-box', alert.type.toLowerCase());
            severityBox.textContent = `Severity: ${alert.type}`;
            alertElement.appendChild(severityBox);

            const alertTitle = document.createElement('h3');
            alertTitle.textContent = alert.title;
            alertElement.appendChild(alertTitle);

            const alertUpdated = document.createElement('div');
            alertUpdated.classList.add('alert-updated');
            alertUpdated.textContent = `Updated: ${alert.updated}`;
            alertElement.appendChild(alertUpdated);

            const alertSummary = document.createElement('div');
            alertSummary.classList.add('alert-summary');
            alertSummary.textContent = alert.description;
            alertElement.appendChild(alertSummary);

            alertsList.appendChild(alertElement);
        }
    });
}


// Function to fetch local weather data
function fetchWeatherData() {
    console.log("Fetching weather data...");
    const apiKey = '75491fbd2d99da35a5aed98142354714';
    const lat = '40.4357';
    const lon = '-85.01';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayWeatherData(data);
            document.getElementById('loading-spinner').style.display = 'none';  // Hide spinner once data is loaded
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            document.getElementById('weather-info').innerHTML = 'Unable to load local weather data. Please try again later.';
            document.getElementById('loading-spinner').style.display = 'none';  // Hide spinner on error
        });
}

// Function to display fetched weather data
function displayWeatherData(data) {
    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = `
        <p>Temperature: ${data.main.temp}°F (High: ${data.main.temp_max}°F, Low: ${data.main.temp_min}°F)</p>
        <p>Condition: ${data.weather[0].description}</p>
        <p>Wind Speed: ${data.wind.speed} mph</p>
    `;
}
