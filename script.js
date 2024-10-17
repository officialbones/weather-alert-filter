document.addEventListener("DOMContentLoaded", () => {
    const customAlertForm = document.getElementById('custom-alert-form');
    const customAlertSection = document.getElementById('custom-alert-section');
    const customAlertTitle = document.getElementById('custom-alert-title');
    const customAlertMessage = document.getElementById('custom-alert-message');
    const customAlertDescription = document.getElementById('custom-alert-description');
    const customAlertTimestamp = document.getElementById('custom-alert-timestamp');
    const customAlert = document.getElementById('custom-alert');
    const removeAnnouncementButton = document.getElementById('remove-announcement');

    const alertPopup = document.getElementById('alert-popup');
    const adminButton = document.getElementById('admin-button');
    const closePopupButton = document.getElementById('close-popup');

    // Admin login form
    const adminLoginPopup = document.getElementById('admin-login-popup');
    const adminLoginForm = document.getElementById('admin-login-form');
    const closeLoginPopupButton = document.getElementById('close-login-popup');
    
    const adminPinInput = document.getElementById('admin-pin');
    const correctAdminPin = '1234';  // Set the correct PIN here

    let isAdmin = false;

    // Fetch custom alert from Firebase
    firebase.database().ref('customAlert').on('value', (snapshot) => {
        const alertData = snapshot.val();
        if (alertData) {
            displayCustomAlert(alertData.heading, alertData.description, alertData.color, alertData.timestamp);
        }
    });

    // Handle form submission to store custom alert in Firebase
    customAlertForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const heading = document.getElementById('alert-heading').value;
        const description = document.getElementById('alert-description').value;
        const color = document.getElementById('alert-color').value;
        const timestamp = new Date().toLocaleString();

        // Save custom alert to Firebase
        firebase.database().ref('customAlert').set({
            heading: heading,
            description: description,
            color: color,
            timestamp: timestamp
        });

        // Close the popup
        alertPopup.style.display = 'none';
    });

    // Function to display custom alert
    function displayCustomAlert(heading, description, color, timestamp) {
        customAlertSection.style.display = 'block';
        customAlertTitle.textContent = heading;
        customAlertMessage.textContent = description;
        customAlert.style.backgroundColor = color;
        customAlert.style.borderColor = color;
        customAlertTimestamp.textContent = `Posted on: ${timestamp}`;

        // Only show remove button if logged in as admin
        if (isAdmin) {
            removeAnnouncementButton.style.display = 'block';
        } else {
            removeAnnouncementButton.style.display = 'none';
        }
    }

    // Remove the announcement
    removeAnnouncementButton.addEventListener('click', () => {
        customAlertSection.style.display = 'none';

        // Remove custom alert from Firebase
        firebase.database().ref('customAlert').remove();
    });

    // Show popup on admin button click
    adminButton.addEventListener('click', () => {
        if (isAdmin) {
            alertPopup.style.display = 'block';
        } else {
            adminLoginPopup.style.display = 'block';  // Show login popup if not logged in
        }
    });

    // Admin login form submit
    adminLoginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const enteredPin = adminPinInput.value;

        if (enteredPin === correctAdminPin) {
            isAdmin = true;  // Set admin status to true
            adminLoginPopup.style.display = 'none';  // Close the login popup
            alertPopup.style.display = 'block';  // Show the alert form popup
        } else {
            alert('Incorrect PIN. Try again.');
        }
    });

    // Close the admin login popup
    closeLoginPopupButton.addEventListener('click', () => {
        adminLoginPopup.style.display = 'none';
    });

    // Close the alert form popup
    closePopupButton.addEventListener('click', () => {
        alertPopup.style.display = 'none';
    });
});
