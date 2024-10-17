document.addEventListener("DOMContentLoaded", () => {
    const openWeatherApiKey = '75491fbd2d99da35a5aed98142354714';  // Replace with your actual OpenWeather API key
    const lat = 40.4357;
    const lon = -85.01;

    const weatherInfoDiv = document.getElementById('weather-info');
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
        const feelsLike = data.main.feels_like;
        const description = data.weather[0].description;
        const windSpeed = data.wind.speed;
        const humidity = data.main.humidity;
        const pressure = data.main.pressure;
        const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
        const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

        weatherInfoDiv.innerHTML = `
            <p>Temperature: ${temp}°F (Feels like: ${feelsLike}°F)</p>
            <p>Condition: ${description}</p>
            <p>Wind Speed: ${windSpeed} mph</p>
            <p>Humidity: ${humidity}%</p>
            <p>Pressure: ${pressure} hPa</p>
            <p>Sunrise: ${sunrise}</p>
            <p>Sunset: ${sunset}</p>
        `;
    }

    // Fetch 5-day forecast from OpenWeather
    function fetchFiveDayForecast(lat, lon, apiKey) {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayFiveDayForecast(data);
            })
            .catch(error => {
                console.error('Error fetching 5-day forecast:', error);
            });
    }

    // Display 5-day forecast information
    function displayFiveDayForecast(data) {
        const forecastDiv = document.createElement('div');
        forecastDiv.classList.add('forecast');
        forecastDiv.innerHTML = '<h5>5-Day Forecast</h5>';
        
        const days = data.list.filter((reading) => reading.dt_txt.includes("12:00:00"));  // Filter noon data for each day
        
        days.forEach((day) => {
            const date = new Date(day.dt * 1000).toLocaleDateString();
            const temp = day.main.temp;
            const description = day.weather[0].description;

            forecastDiv.innerHTML += `
                <div class="forecast-day">
                    <p><strong>${date}</strong></p>
                    <p>Temp: ${temp}°F</p>
                    <p>Condition: ${description}</p>
                </div>
            `;
        });
        
        weatherInfoDiv.appendChild(forecastDiv);
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
