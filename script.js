import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging.js";

const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "jcni-webpage.firebaseapp.com",
    projectId: "jcni-webpage",
    storageBucket: "jcni-webpage.appspot.com",
    messagingSenderId: "62856501328",
    appId: "1:62856501328:web:86df1e0a0477671e501955",
    measurementId: "G-PSP0FWZQZL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Fetching local weather
const weatherApiKey = "YOUR_OPENWEATHER_API_KEY";
async function fetchWeather() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=40.4357&lon=-85.01&units=imperial&appid=${weatherApiKey}`);
        const weatherData = await response.json();
        document.getElementById("weather-info").innerHTML = `
            <p>Temperature: ${weatherData.main.temp}°F (High: ${weatherData.main.temp_max}°F, Low: ${weatherData.main.temp_min}°F)</p>
            <p>Condition: ${weatherData.weather[0].description}</p>
            <p>Wind Speed: ${weatherData.wind.speed} mph</p>
        `;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        document.getElementById("weather-info").innerHTML = "Unable to load local weather data.";
    }
}
fetchWeather();

// Fetching weather alerts
const alertsApiKey = "YOUR_OPENWEATHER_API_KEY";
async function fetchAlerts() {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/alerts.json?key=${alertsApiKey}&q=40.4357,-85.01`);
        const alertData = await response.json();
        console.log("Alerts fetched:", alertData);
        filterAlerts('All', alertData.alert);
    } catch (error) {
        console.error("Error fetching alerts:", error);
    }
}
fetchAlerts();

function filterAlerts(alertType, alerts = []) {
    console.log(`Filtering alerts for type: ${alertType}`);
    const alertsList = document.getElementById("alerts-list");
    alertsList.innerHTML = "";

    if (!alerts.length) {
        alertsList.innerHTML = "No active alerts.";
        return;
    }

    alerts.forEach(alert => {
        if (alertType === "All" || alert.event === alertType) {
            const alertItem = document.createElement("div");
            alertItem.classList.add("alert-item");
            alertItem.innerHTML = `
                <div class="severity-box ${alertType.toLowerCase()}">Severity: ${alert.event}</div>
                <h3>${alert.event} issued ${alert.start}</h3>
                <p>${alert.desc}</p>
            `;
            alertsList.appendChild(alertItem);
        }
    });
}
