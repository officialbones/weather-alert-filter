document.addEventListener("DOMContentLoaded", () => {
    const customAlertForm = document.getElementById('custom-alert-form');
    const customAlertSection = document.getElementById('custom-alert-section');
    const customAlertTitle = document.getElementById('custom-alert-title');
    const customAlertMessage = document.getElementById('custom-alert-message');
    const customAlert = document.getElementById('custom-alert');

    const alertPopup = document.getElementById('alert-popup');
    const adminButton = document.getElementById('admin-button');
    const closePopupButton = document.getElementById('close-popup');

    // Fetch custom alert from Firebase Realtime Database
    firebase.database().ref('customAlert').on('value', (snapshot) => {
        const alertData = snapshot.val();
        if (alertData) {
            displayCustomAlert(alertData.message, alertData.severity);
        }
    });

    // Show popup on admin button click
    adminButton.addEventListener('click', () => {
        alertPopup.style.display = 'block';
    });

    // Close the popup
    closePopupButton.addEventListener('click', () => {
        alertPopup.style.display = 'none';
    });

    // Handle form submission to store custom alert in Firebase
    customAlertForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const message = document.getElementById('alert-message').value;
        const severity = document.getElementById('alert-severity').value;

        // Save custom alert to Firebase
        firebase.database().ref('customAlert').set({
            message: message,
            severity: severity
        });

        // Close the popup after submission
        alertPopup.style.display = 'none';
    });

    // Function to display custom alert
    function displayCustomAlert(message, severity) {
        customAlertSection.style.display = 'block';
        customAlertTitle.textContent = `Severity: ${severity.charAt(0).toUpperCase() + severity.slice(1)}`;
        customAlertMessage.textContent = message;

        // Apply styles based on severity
        customAlert.classList.remove('warning', 'watch', 'advisory');
        customAlert.classList.add(severity);
    }
});
