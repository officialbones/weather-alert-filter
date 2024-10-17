document.addEventListener("DOMContentLoaded", () => {
    console.log("JavaScript Loaded Successfully");

    // Show loading spinner
    document.getElementById('loading-spinner').style.display = 'block';
    
    // Fetch and display weather alerts and data
    fetchWeatherAlerts();
    fetchWeatherData();
});

// Function to fetch weather alerts from NWS
function fetchWeatherAlerts() {
    const url = 'https://api.weather.gov/alerts/active.atom?point=40.4357%2C-85.01';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text(); // Return the XML as text
        })
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "application/xml");
            
            const entries = xmlDoc.getElementsByTagName("entry");
            const alertsList = document.getElementById("alerts-list");
            alertsList.innerHTML = ''; // Clear current list

            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];
                const title = entry.getElementsByTagName("title")[0].textContent;
                const summary = entry.getElementsByTagName("summary")[0].textContent;
                const updated = entry.getElementsByTagName("updated")[0].textContent;

                // Create alert element
                const alertElement = document.createElement('div');
                alertElement.classList.add('alert-item');

                const severityBox = document.createElement('div');
                severityBox.classList.add('severity-box');
                severityBox.textContent = 'Alert';
                alertElement.appendChild(severityBox);

                const alertTitle = document.createElement('h3');
                alertTitle.textContent = title;
                alertElement.appendChild(alertTitle);

                const alertUpdated = document.createElement('div');
                alertUpdated.classList.add('alert-updated');
                alertUpdated.textContent = `Updated: ${updated}`;
                alertElement.appendChild(alertUpdated);

                const alertSummary = document.createElement('div');
                alertSummary.classList.add('alert-summary');
                alertSummary.textContent = summary;
                alertElement.appendChild(alertSummary);

                alertsList.appendChild(alertElement);
            }

            if (entries.length === 0) {
                console.log("No alerts available.");
                alertsList.innerHTML = '<p>No active weather alerts.</p>';
            }

            // Hide loading spinner
            document.getElementById('loading-spinner').style.display = 'none';
        })
        .catch(error => {
            console.error("Error fetching weather alerts:", error);
            document.getElementById('alerts-list').innerHTML = '<p>Unable to load weather alerts.</p>';
            document.getElementById('loading-spinner').style.display = 'none'; // Hide spinner on error
        });
}

// Function to fetch local weather data
function fetchWeatherData() {
    console.log("Fetching weather data...");
    const apiKey = '75491fbd2d99da35a5aed98142354714'; // Your OpenWeather API key
    const lat = '40.4357'; // Your latitude
    const lon = '-85.01'; // Your longitude
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
