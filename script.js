// Firebase Configuration and Initialization
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
firebase.initializeApp(firebaseConfig);

// Fetch Current Weather from OpenWeather API
function fetchCurrentWeather() {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=40.4357&lon=-85.01&appid=75491fbd2d99da35a5aed98142354714&units=imperial`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('currentTemp').textContent = `${data.main.temp}°F`;
      document.getElementById('currentDescription').textContent = data.weather[0].description;
      document.getElementById('currentHumidity').textContent = data.main.humidity + "%";
      document.getElementById('currentWind').textContent = data.wind.speed + " mph";
    })
    .catch(error => console.error('Error fetching weather:', error));
}

// Fetch 5-Day Weather Forecast from OpenWeather API
function fetchFiveDayForecast() {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=40.4357&lon=-85.01&appid=75491fbd2d99da35a5aed98142354714&units=imperial`)
    .then(response => response.json())
    .then(data => {
      const forecastRow = document.getElementById('forecast');
      forecastRow.innerHTML = '';
      for (let i = 0; i < data.list.length; i += 8) { // Skip to next day
        const day = data.list[i];
        const forecastDay = document.createElement('div');
        forecastDay.classList.add('forecast-day');
        forecastDay.innerHTML = `
          <p>${new Date(day.dt * 1000).toLocaleDateString()}</p>
          <p>${day.main.temp}°F</p>
          <p>${day.weather[0].description}</p>
        `;
        forecastRow.appendChild(forecastDay);
      }
    })
    .catch(error => console.error('Error fetching forecast:', error));
}

// Fetch NWS Weather Alerts
function fetchWeatherAlerts() {
  fetch(`https://api.weather.gov/alerts/active?point=40.4357,-85.01`)
    .then(response => response.json())
    .then(data => {
      const alerts = data.features;
      const alertsContainer = document.getElementById('alerts');
      alertsContainer.innerHTML = '';
      if (alerts.length > 0) {
        alerts.forEach(alert => {
          const alertDiv = document.createElement('div');
          alertDiv.classList.add('alert-box');
          alertDiv.innerHTML = `
            <h3>${alert.properties.event}</h3>
            <p>${alert.properties.headline}</p>
          `;
          alertsContainer.appendChild(alertDiv);
        });
      } else {
        alertsContainer.innerHTML = 'No alerts available.';
      }
    })
    .catch(error => console.error('Error fetching alerts:', error));
}

// Load weather data on page load
document.addEventListener('DOMContentLoaded', () => {
  fetchCurrentWeather();
  fetchFiveDayForecast();
  fetchWeatherAlerts();
});
