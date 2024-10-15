document.addEventListener("DOMContentLoaded", function () {
    console.log('JavaScript Loaded Successfully');

    const weatherApiKey = 'YOUR_API_KEY_HERE'; // Replace with your actual OpenWeather API key
    const weatherEndpoint = `https://api.openweathermap.org/data/2.5/weather?lat=40.4357&lon=-85.01&units=imperial&appid=${weatherApiKey}`;
    
    // Fetching weather data
    async function fetchWeather() {
        console.log('Fetching local weather...');
        try {
            const response = await fetch(weatherEndpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const weatherData = await response.json();
            console.log('Weather Data:', weatherData);
            displayWeather(weatherData);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            document.getElementById('weather-info').innerHTML = 'Unable to load local weather data.';
        }
    }

    function displayWeather(data) {
        const weatherInfoDiv = document.getElementById('weather-info');
        const temperature = data.main.temp;
        const tempMin = data.main.temp_min;
        const tempMax = data.main.temp_max;
        const condition = data.weather[0].description;
        const windSpeed = data.wind.speed;

        weatherInfoDiv.innerHTML = `
            <p>Temperature: ${temperature}°F (High: ${tempMax}°F, Low: ${tempMin}°F)</p>
            <p>Condition: ${condition}</p>
            <p>Wind Speed: ${windSpeed} mph</p>
        `;
    }

    // Fetching weather alerts
    async function fetchWeatherAlerts() {
        console.log('Fetching weather alerts...');
        const rssUrl = 'https://api.weather.gov/alerts/active.atom?point=40.4357%2C-85.01';
        try {
            const response = await fetch(rssUrl);
            const textData = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(textData, 'application/xml');

            const entries = xmlDoc.querySelectorAll('entry');
            const alertsData = [];

            entries.forEach(entry => {
                const title = entry.querySelector('title').textContent;
                const summary = entry.querySelector('summary').textContent;
                const updated = entry.querySelector('updated').textContent;

                const alertItem = {
                    title,
                    summary,
                    updated,
                    severity: classifyAlert(title)
                };

                alertsData.push(alertItem);
            });

            console.log('Alerts fetched:', alertsData);
            renderAlerts(alertsData, 'All'); // Show all alerts initially
        } catch (error) {
            console.error('Error fetching the RSS feed:', error);
        }
    }

    function classifyAlert(title) {
        if (title.includes('Warning')) return 'warnings';
        if (title.includes('Watch')) return 'watches';
        if (title.includes('Advisory')) return 'advisories';
        return 'others';
    }

    function renderAlerts(alerts, filterType) {
        console.log('Filtering alerts for type:', filterType);
        const alertsList = document.getElementById('alerts-list');
        alertsList.innerHTML = ''; // Clear current alerts

        alerts.forEach(alert => {
            if (filterType === 'All' || alert.severity === filterType.toLowerCase()) {
                const alertElement = document.createElement('li');
                alertElement.className = 'alert-item';
                alertElement.innerHTML = `
                    <div class="severity-box ${alert.severity}">${capitalizeFirstLetter(alert.severity)}</div>
                    <h3>${alert.title}</h3>
                    <p class="alert-updated">Updated: ${alert.updated}</p>
                    <p class="alert-summary">${alert.summary}</p>
                `;
                alertsList.appendChild(alertElement);
            }
        });

        if (alertsList.children.length === 0) {
            alertsList.innerHTML = `<li class="alert-item">No alerts available for ${filterType}</li>`;
        }
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Add event listeners for filter buttons
    document.getElementById('tabs').addEventListener('click', function (event) {
        if (event.target.tagName === 'BUTTON') {
            const filterType = event.target.textContent.trim();
            renderAlerts(alertsData, filterType);
        }
    });

    // Fetch the weather and alerts on page load
    fetchWeather();
    fetchWeatherAlerts();
});
