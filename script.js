document.addEventListener("DOMContentLoaded", () => {
    console.log("JavaScript Loaded Successfully");

    const customAlertSection = document.getElementById('custom-alert-section');
    const customAlertTitle = document.getElementById('custom-alert-title');
    const customAlertMessage = document.getElementById('custom-alert-message');
    const customAlert = document.getElementById('custom-alert');
    
    const postAlertSection = document.getElementById('post-alert');
    const pinSection = document.getElementById('pin-section');
    const pinForm = document.getElementById('pin-form');
    const pinInput = document.getElementById('pin-input');
    const pinError = document.getElementById('pin-error');

    const customAlertForm = document.getElementById('custom-alert-form');
    
    // Sample PIN for the protected section (change this for real use)
    const correctPIN = '1234';

    // Handle PIN submission
    pinForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const enteredPIN = pinInput.value;

        if (enteredPIN === correctPIN) {
            // Show the post alert section if the PIN is correct
            postAlertSection.style.display = 'block';
            pinSection.style.display = 'none';
        } else {
            // Show error if PIN is incorrect
            pinError.style.display = 'block';
        }
    });

    // Handle custom alert form submission
    customAlertForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const message = document.getElementById('alert-message').value;
        const severity = document.getElementById('alert-severity').value;

        // Display the custom alert with severity styling
        customAlertSection.style.display = 'block';
        customAlertTitle.textContent = `Severity: ${severity.charAt(0).toUpperCase() + severity.slice(1)}`;
        customAlertMessage.textContent = message;

        // Apply styles based on severity
        customAlert.classList.remove('warning', 'watch', 'advisory');
        customAlert.classList.add(severity);
    });
});
