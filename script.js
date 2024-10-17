document.addEventListener("DOMContentLoaded", () => {
    console.log("JavaScript Loaded Successfully");

    const customAlertSection = document.getElementById('custom-alert-section');
    const customAlertTitle = document.getElementById('custom-alert-title');
    const customAlertMessage = document.getElementById('custom-alert-message');
    const customAlert = document.getElementById('custom-alert');
    
    const postAlertSection = document.getElementById('post-alert');
    const pinSection = document.getElementById('pin-section');
    const pinForm = document.getElementById('pin-form');
    const pinInput = document.getElementById('pin-input');
    const pinError = document.getElementById('pin-error');

    const customAlertForm = document.getElementById('custom-alert-form');
    
    // Sample PIN for the protected section (change this for real use)
    const correctPIN = '1234';

    // Fetch and display weather alerts and data
    fetchWeatherAlerts();
    fetchWeatherData();

    // Load stored custom alert from localStorage (if any)
    loadStoredCustomAlert();

    // Handle PIN submission
    pinForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const enteredPIN = pinInput.value;

        if (enteredPIN === correctPIN) {
            // Show the post alert section if the PIN is correct
            postAlertSection.style.display = 'block';
            pinSection.style.display = 'none';
        } else {
            // Show error if PIN is incorrect
            pinError.style.display = 'block';
        }
    });

    // Handle custom alert form submission
    customAlertForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const message = document.getElementById('alert-message').value;
        const severity = document.getElementById('alert-severity').value;

        // Display the custom alert with severity styling
        displayCustomAlert(message, severity);

        // Store custom alert in localStorage
        localStorage.setItem('customAlertMessage', message);
        localStorage.setItem('customAlertSeverity', severity);
    });
});

// Function to display custom alert
function displayCustomAlert(message, severity) {
    const customAlertSection = document.getElementById('custom-alert-section');
    const customAlertTitle = document.getElementById('custom-alert-title');
    const customAlertMessage = document.getElementById('custom-alert-message');
    const customAlert = document.getElementById('custom-alert');

    customAlertSection.style.display = 'block';
    customAlertTitle.textContent = `Severity: ${severity.charAt(0).toUpperCase() + severity.slice(1)}`;
    customAlertMessage.textContent = message;

    // Apply styles based on severity
    customAlert.classList.remove('warning', 'watch', 'advisory');
    customAlert.classList.add(severity);
}

// Function to load stored custom alert from localStorage
function loadStoredCustomAlert() {
    const storedMessage = localStorage.getItem('customAlertMessage');
    const storedSeverity = localStorage.getItem('customAlertSeverity');

    if (storedMessage && storedSeverity) {
        displayCustomAlert(storedMessage, storedSeverity);
    }
}

// Function to fetch weather alerts from NWS
function fetchWeatherAlerts() {
    const url = 'https://api.weather.gov/alerts/active?point=40.4357,-85.01';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const alertsList = document.getElementById("alerts-list");
            alertsList.innerHTML = ''; // Clear current list

            const features = data.features;
            if (features.length === 0) {
                alertsList.innerHTML = '<p>No active weather alerts.</p>';
                return;
            }

            features.forEach(alert => {
                const title = alert.properties.headline;
                const description = alert.properties.description;
                const severity = alert.properties.severity;
                const alertUpdated = alert.properties.sent;

                // Create alert element
                const alertElement = document.createElement('div');
                alertElement.classList.add('alert-item', severity.toLowerCase());

                const alertTitle = document.createElement('h3');
                alertTitle.textContent = title;
                alertElement.appendChild(alertTitle);

                const alertUpdateTime = document.createElement('div');
                alertUpdateTime.classList.add('alert-updated');
                alertUpdateTime.textContent = `Updated: ${new Date(alertUpdated).toLocaleString()}`;
                alertElement.appendChild(alertUpdateTime);

                const alertSummary = document.createElement('div');
                alertSummary.classList.add('alert-summary');
                alertSummary.textContent = description;
                alertElement.appendChild(alertSummary);

                alertsList.appendChild(alertElement);
            });
        })
        .catch(error => {
            console.error("Error fetching weather alerts:", error);
            document.getElementById('alerts-list').innerHTML = '<p>Unable to load weather alerts.</p>';
        });
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
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            document.getElementById('weather-info').innerHTML = 'Unable to load local weather data. Please try again later.';
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
