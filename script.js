document.addEventListener("DOMContentLoaded", function () {
    console.log('JavaScript Loaded Successfully');

    const alertsData = []; // Store fetched alerts here

    async function fetchWeatherAlerts() {
        console.log('Fetching weather alerts...');
        const rssUrl = 'https://api.weather.gov/alerts/active.atom?point=40.4357%2C-85.01';
        try {
            const response = await fetch(rssUrl);
            const textData = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(textData, 'application/xml');

            const entries = xmlDoc.querySelectorAll('entry');
            alertsData.length = 0; // Clear old alerts data

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
            filterAlerts('All'); // Show all alerts initially
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

    function filterAlerts(filterType) {
        console.log('Filtering alerts for type:', filterType);
        const alertsList = document.getElementById('alerts-list');
        alertsList.innerHTML = ''; // Clear current alerts

        alertsData.forEach(alert => {
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
            filterAlerts(filterType);
        }
    });

    // Fetch the weather alerts on page load
    fetchWeatherAlerts();
});
