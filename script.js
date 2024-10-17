document.addEventListener("DOMContentLoaded", () => {
    console.log("JavaScript Loaded Successfully");

    // Request notification permission
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    // Show loading spinner
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.style.display = 'block';
    }

    // Fetch and display weather alerts and data
    fetchWeatherAlerts();
    fetchWeatherData();

    // Subscribe to alerts
    document.getElementById('subscribe-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const alertType = document.getElementById('alert-type').value;
        console.log(`Subscribed: ${email} for ${alertType}`);
        alert(`Subscribed successfully to ${alertType} alerts!`);
    });
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

                // Determine alert type based on the title
                let alertIcon = '<i class="fas fa-info-circle"></i>'; // Default
                if (title.includes("Warning")) {
                    alertIcon = '<i class="fas fa-exclamation-triangle"></i>';
                } else if (title.includes("Watch")) {
                    alertIcon = '<i class="fas fa-eye"></i>';
                }

                // Create alert element
                const alertElement = document.createElement('div');
                alertElement.classList.add('alert-item', title.includes("Warning") ? "warning" : title.includes("Watch") ? "watch" : "advisory");

                const severityBox = document.createElement('div');
                severityBox.classList.add('severity-box');
                severityBox.innerHTML = `Severity: ${alertIcon}`;
                alertElement.appendChild(severityBox);

                const alertTitle = document.createElement('h3');
                alertTitle.innerHTML = `${alertIcon} ${title}`;
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
            } else {
                // Send notification for the first alert
                sendNotification(entries[0]);
            }

            // Hide loading spinner
            const spinner = document.getElementById('loading-spinner');
            if (spinner) {
                spinner.style.display = 'none';
            }
        })
        .catch(error => {
            console.error("Error fetching weather alerts:", error);
            document.getElementById('alerts-list').innerHTML = '<p>Unable to load weather alerts.</p>';
            const spinner = document.getElementById('loading-spinner');
            if (spinner) {
                spinner.style.display = 'none';
            }
        });
}

// Function to send notifications for alerts
function sendNotification(alert) {
    if (Notification.permission === "granted") {
        new Notification("New Weather Alert", {
            body: alert.getElementsByTagName("title")[0].textContent,
            icon: "weather-icon.png" // Replace with your icon
        });
    }
}

// Function to fetch local weather data
function fetchWeatherData() {
    const apiKey = '75491fbd2d99da35a5aed98142354714'; // Your OpenWeather API key
    const lat = '40.4357'; // Your latitude
    const lon = '-85.01'; // Your longitude
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayWeatherData(data);
            const spinner = document.getElementById('loading-spinner');
            if (spinner) {
                spinner.style.display = 'none';
            }
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            document.getElementById('weather-info').innerHTML = 'Unable to load local weather data. Please try again later.';
            const spinner = document.getElementById('loading-spinner');
            if (spinner) {
                spinner.style.display = 'none';
            }
        });
}

// Function to display fetched weather data
function displayWeatherData(data) {
    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = `
        <p>Temperature: ${data.main.temp}°F (High: ${data.main.temp_max}°F, Low: ${data.main.temp_min}°F)</p>
        <p>Condition: ${data.weather[0].description}</p>
        <p>Wind Speed: ${data.wind.speed} mph</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Pressure: ${data.main.pressure} hPa</p>
        <p>Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
        <p>Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
    `;
}

// Function to fetch historical weather data
function fetchHistoricalWeather(lat, lon, timestamp) {
    const apiKey = '75491fbd2d99da35a5aed98142354714'; // Your OpenWeather API key
    const url = `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${timestamp}&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayHistoricalWeatherData(data);
        })
        .catch(error => {
            console.error("Error fetching historical weather data:", error);
        });
}

// Display Historical Data
function displayHistoricalWeatherData(data) {
    const historicalWeather = document.getElementById('historical-weather-info');
    historicalWeather.innerHTML = `
        <h3>Historical Weather for ${new Date(data.current.dt * 1000).toLocaleDateString()}</h3>
        <p>Temperature: ${data.current.temp}°F</p>
        <p>Condition: ${data.current.weather[0].description}</p>
        <p>Wind Speed: ${data.current.wind_speed} mph</p>
        <p>Humidity: ${data.current.humidity}%</p>
        <p>Pressure: ${data.current.pressure} hPa</p>
    `;
}
