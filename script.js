document.addEventListener("DOMContentLoaded", () => {
    const openWeatherApiKey = 'your_openweather_api_key'; // OpenWeather API key
    const lat = 40.4357;
    const lon = -85.01;

    // Firebase Config
    const firebaseConfig = {
        apiKey: "AIzaSyAgrJX3NKXt_jJ3iVmYCuNze3HievOnrqQ",
        authDomain: "jcni-webpage.firebaseapp.com",
        databaseURL: "https://jcni-webpage-default-rtdb.firebaseio.com",
        projectId: "jcni-webpage",
        storageBucket: "jcni-webpage.appspot.com",
        messagingSenderId: "62856501328",
        appId: "1:62856501328:web:86df1e0a0477671e501955",
        measurementId: "G-PSP0FWZQZL"
    };

    // Initialize Firebase
    const app = firebase.initializeApp(firebaseConfig);
    const db = firebase.database();

    const weatherInfoDiv = document.getElementById('weather-info');
    const forecastDiv = document.getElementById('five-day-forecast');
    const alertsListDiv = document.getElementById('alerts-list');
    const customAnnouncementDiv = document.getElementById('custom-announcement');

    // Firebase: Load custom announcement
    db.ref('customAlert').on('value', snapshot => {
        const alertData = snapshot.val();
        if (alertData) {
            customAnnouncementDiv.innerHTML = `
                <div class="alert alert-warning" role="alert" style="background-color: ${alertData.color}">
                    <h4>${alertData.heading}</h4>
                    <p>${alertData.description}</p>
                    <p class="small">Posted: ${new Date(alertData.timestamp).toLocaleString()}</p>
                </div>
            `;
        }
    });

    // Admin Modal logic
    const adminToggle = document.getElementById('admin-toggle');
    const postAnnouncementBtn = document.getElementById('post-announcement');

    adminToggle.addEventListener('click', () => {
        const modal = new mdb.Modal(document.getElementById('admin-modal'));
        modal.show();
    });

    // Post custom alert to Firebase
    postAnnouncementBtn.addEventListener('click', () => {
        const heading = document.getElementById('alert-heading').value;
        const description = document.getElementById('alert-description').value;
        const color = document.getElementById('alert-color').value;

        db.ref('customAlert').set({
            heading: heading,
            description: description,
            color: color,
            timestamp: Date.now()
        });
    });

    // Remove custom announcement
    const removeAnnouncementBtn = document.getElementById('remove-announcement');
    removeAnnouncementBtn.addEventListener('click', () => {
        db.ref('customAlert').remove();
        customAnnouncementDiv.innerHTML = '';
    });

    // Fetch current weather and forecast
    fetchCurrentWeather(lat, lon, openWeatherApiKey);
    fetchFiveDayForecast(lat, lon, openWeatherApiKey);
    fetchWeatherAlerts();

    function fetchCurrentWeather(lat, lon, apiKey) {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayCurrentWeather(data);
            });
    }

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
                <h2>${temp}°F</h2>
                <p>${description.charAt(0).toUpperCase() + description.slice(1)}</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind: ${windSpeed} mph</p>
            </div>
        `;
    }

    function fetchFiveDayForecast(lat, lon, apiKey) {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayFiveDayForecast(data);
            });
    }

    function displayFiveDayForecast(data) {
        forecastDiv.innerHTML = '<h5>5-Day Forecast</h5>';
        const days = data.list.filter((reading) => reading.dt_txt.includes("12:00:00"));
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

    function fetchWeatherAlerts() {
        const alertsUrl = `https://api.weather.gov/alerts/active?point=40.4357,-85.01`;
        fetch(alertsUrl)
            .then(response => response.json())
            .then(data => {
                displayWeatherAlerts(data);
            });
    }

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
