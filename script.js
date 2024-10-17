document.addEventListener("DOMContentLoaded", () => {
    const openWeatherApiKey = '75491fbd2d99da35a5aed98142354714';  // Replace with your OpenWeather API key
    const lat = 40.4357;
    const lon = -85.01;

    const weatherInfoDiv = document.getElementById('weather-info');
    const forecastDiv = document.getElementById('five-day-forecast');
    const chartDiv = document.getElementById('temperature-chart');
    const alertsListDiv = document.getElementById('alerts-list');
    
    // Fetch current weather and 5-day forecast from OpenWeather
    fetchCurrentWeather(lat, lon, openWeatherApiKey);
    fetchFiveDayForecast(lat, lon, openWeatherApiKey);
    
    // Fetch weather alerts from NWS
    fetchWeatherAlerts();

    // Fetch current weather from OpenWeather
    function fetchCurrentWeather(lat, lon, apiKey) {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayCurrentWeather(data);
            })
            .catch(error => {
                console.error('Error fetching current weather:', error);
            });
    }

    // Display current weather information
    function displayCurrentWeather(data) {
        const temp = data.main.temp;
        const description = data.weather[0].description;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const iconCode = data.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

        weatherInfoDiv.innerHTML = `
            <div class="current-temp">
                <img src="${iconUrl}" alt="weather-icon">
                <span>${temp}°F</span>
            </div>
            <p>${description.charAt(0).toUpperCase() + description.slice(1)}</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind: ${windSpeed} mph</p>
        `;
    }

    // Fetch 5-day forecast from OpenWeather
    function fetchFiveDayForecast(lat, lon, apiKey) {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayFiveDayForecast(data);
                displayTemperatureChart(data);  // Display temperature trend
            })
            .catch(error => {
                console.error('Error fetching 5-day forecast:', error);
            });
    }

    // Display 5-day forecast information
    function displayFiveDayForecast(data) {
        forecastDiv.innerHTML = '<h5>5-Day Forecast</h5>';
        
        const days = data.list.filter((reading) => reading.dt_txt.includes("12:00:00"));  // Noon data for each day
        
        days.forEach((day) => {
            const date = new Date(day.dt * 1000).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
            const temp = day.main.temp;
            const iconCode = day.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

            forecastDiv.innerHTML += `
                <div class="forecast-day">
                    <p>${date}</p>
                    <img src="${iconUrl}" alt="weather-icon">
                    <p>${temp}°F</p>
                </div>
            `;
        });
    }

    // Display temperature trend for next 24 hours using Chart.js
    function displayTemperatureChart(data) {
        const hours = data.list.slice(0, 8).map(item => {
            const date = new Date(item.dt * 1000);
            return `${date.getHours()}:00`;
        });

        const temps = data.list.slice(0, 8).map(item => item.main.temp);

        // Create chart using Chart.js
        const ctx = document.createElement('canvas');
        chartDiv.appendChild(ctx);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: hours,
                datasets: [{
                    label: 'Temperature (°F)',
                    data: temps,
                    borderColor: 'rgba(255, 206, 86, 1)',
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(255, 206, 86, 1)'
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }

    // Fetch weather alerts from NWS
    function fetchWeatherAlerts() {
        const alertsUrl = `https://api.weather.gov/alerts/active?point=40.4357,-85.01`;  // NWS Alerts URL for your location

        fetch(alertsUrl)
            .then(response => response.json())
            .then(data => {
                displayWeatherAlerts(data);
            })
            .catch(error => {
                console.error('Error fetching NWS alerts:', error);
            });
    }

    // Display weather alerts from NWS
    function displayWeatherAlerts(data) {
        if (data.features.length === 0) {
            alertsListDiv.innerHTML = '<p>No alerts available.</p>';
            return;
        }

        data.features.forEach(alert => {
            const { headline, description, severity, event, effective, expires } = alert.properties;

            alertsListDiv.innerHTML += `
                <div class="alert-item">
                    <p><strong>Severity:</strong> ${severity}</p>
                    <p>${headline} (${event})</p>
                    <p><strong>Effective:</strong> ${new Date(effective).toLocaleString()}</p>
                    <p><strong>Expires:</strong> ${new Date(expires).toLocaleString()}</p>
                    <p>${description}</p>
                </div>
            `;
        });
    }
});
