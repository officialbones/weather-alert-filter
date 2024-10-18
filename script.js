// Firebase initialization (ensure you have your Firebase config setup in the HTML)
const firebaseConfig = {
  apiKey: "75491fbd2d99da35a5aed98142354714",
  authDomain: "jcni-webpage.firebaseapp.com",
  databaseURL: "https://jcni-webpage-default-rtdb.firebaseio.com",
  projectId: "jcni-webpage",
  storageBucket: "jcni-webpage.appspot.com",
  messagingSenderId: "62856501328",
  appId: "1:62856501328:web:86df1e0a0477671e501955",
  measurementId: "G-PSP0FWZQZL"
};

firebase.initializeApp(firebaseConfig);
const dbRef = firebase.database().ref();

// Display Current Weather using OpenWeather API
const weatherApiKey = "75491fbd2d99da35a5aed98142354714";
const lat = "40.4357"; // replace with your coordinates
const lon = "-85.01"; // replace with your coordinates

function displayCurrentWeather() {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("weather-info").innerHTML = `
        <h2>${data.main.temp.toFixed(2)}°F</h2>
        <p>${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind: ${data.wind.speed} mph</p>
      `;
    })
    .catch((error) => console.error("Error fetching weather data:", error));
}

// Display 5-Day Forecast using OpenWeather API
function displayFiveDayForecast() {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`)
    .then((response) => response.json())
    .then((data) => {
      let forecastHtml = "";
      for (let i = 0; i < data.list.length; i += 8) {
        const dayData = data.list[i];
        forecastHtml += `
          <div class="forecast-day">
            <p>${new Date(dayData.dt_txt).toLocaleDateString()}</p>
            <p>${dayData.main.temp.toFixed(2)}°F</p>
            <p>${dayData.weather[0].description}</p>
          </div>`;
      }
      document.getElementById("five-day-forecast").innerHTML = forecastHtml;
    })
    .catch((error) => console.error("Error fetching 5-day forecast:", error));
}

// Fetch and display weather alerts from the NWS API
function displayWeatherAlerts() {
  fetch(`https://api.weather.gov/alerts/active?point=${lat},${lon}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.features.length > 0) {
        let alertsHtml = data.features.map((alert) => `
          <div class="alert alert-danger">
            <strong>Severity: ${alert.properties.severity}</strong>
            <p>${alert.properties.headline}</p>
            <p>${alert.properties.description}</p>
          </div>`).join("");
        document.getElementById("alerts-list").innerHTML = alertsHtml;
      } else {
        document.getElementById("alerts-list").innerHTML = "No alerts available.";
      }
    })
    .catch((error) => console.error("Error fetching alerts:", error));
}

// Function to post custom announcements to Firebase
function postCustomAnnouncement() {
  const heading = document.getElementById("alert-heading").value;
  const description = document.getElementById("alert-description").value;
  const boxColor = document.getElementById("alert-color").value;
  const timestamp = new Date().toLocaleString();

  dbRef.child("announcements").set({
    heading: heading,
    description: description,
    boxColor: boxColor,
    timestamp: timestamp
  });
}

// Fetch and display custom announcement from Firebase
function displayCustomAnnouncement() {
  dbRef.child("announcements").on("value", (snapshot) => {
    if (snapshot.exists()) {
      const { heading, description, boxColor, timestamp } = snapshot.val();
      document.getElementById("custom-announcement").innerHTML = `
        <div class="alert" style="background-color:${boxColor}; color:white;">
          <strong>${heading}</strong>
          <p>${description}</p>
          <p><small>Posted: ${timestamp}</small></p>
        </div>`;
      document.getElementById("custom-announcement").style.display = "block";
    } else {
      document.getElementById("custom-announcement").style.display = "none";
    }
  });
}

// Remove custom announcement
document.getElementById("remove-announcement").addEventListener("click", () => {
  dbRef.child("announcements").remove();
  document.getElementById("custom-announcement").style.display = "none";
});

// Admin modal toggling
document.getElementById("admin-toggle").addEventListener("click", () => {
  const adminModal = new mdb.Modal(document.getElementById("admin-modal"));
  adminModal.show();
});

// Post custom announcement from modal
document.getElementById("post-announcement").addEventListener("click", () => {
  postCustomAnnouncement();
  const adminModal = mdb.Modal.getInstance(document.getElementById("admin-modal"));
  adminModal.hide();
});

// Initialize weather and alerts display on page load
document.addEventListener("DOMContentLoaded", () => {
  displayCurrentWeather();
  displayFiveDayForecast();
  displayWeatherAlerts();
  displayCustomAnnouncement();
});
