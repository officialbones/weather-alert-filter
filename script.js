// Fetch and display weather information
function fetchWeather() {
    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = 'Loading local weather...';
  
    fetch('https://api.openweathermap.org/data/2.5/weather?lat=40.4357&lon=-85.01&units=imperial&appid=75491fbd2d99da35a5aed98142354714')
      .then(response => response.json())
      .then(data => {
        weatherInfo.innerHTML = `
          <div class="weather-box">
            <p>Temperature: ${data.main.temp}°F (High: ${data.main.temp_max}°F, Low: ${data.main.temp_min}°F)</p>
            <p>Condition: ${data.weather[0].description}</p>
            <p>Wind Speed: ${data.wind.speed} mph</p>
          </div>
        `;
      })
      .catch(error => {
        weatherInfo.innerHTML = 'Unable to load local weather data.';
        console.error('Weather data fetch error:', error);
      });
  }
  
  // Fetch weather alerts data
  let alerts = [];
  function fetchAlerts() {
    fetch('https://api.weatherapi.com/v1/alerts.json?key=YOUR_API_KEY&lat=40.4357&lon=-85.01')
      .then(response => response.json())
      .then(data => {
        alerts = data.alerts;
        console.log('Alerts fetched:', alerts);
        displayAlerts(alerts);
      })
      .catch(error => {
        console.error('Error fetching alerts:', error);
      });
  }
  
  // Filter alerts by type
  function filterAlerts(alertType) {
    console.log(`Filtering alerts for type: ${alertType}`);
    if (!alerts || alerts.length === 0) {
      console.error("No alerts data found");
      return;
    }
    const filteredAlerts = alertType === 'All' ? alerts : alerts.filter(alert => alert.type === alertType);
    displayAlerts(filteredAlerts);
  }
  
  // Display alerts
  function displayAlerts(alertsToDisplay) {
    const alertsList = document.getElementById('alerts-list');
    alertsList.innerHTML = '';
  
    alertsToDisplay.forEach(alert => {
      const alertElement = document.createElement('li');
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
    });
  }
  
  // Initial load
  window.addEventListener('load', () => {
    fetchWeather();
    fetchAlerts();
  });