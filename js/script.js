
// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Set up date inputs using dateRange.js
setupDateInputs(startInput, endInput);

// Find the button and gallery
const getImagesButton = document.getElementById('getImagesBtn');
const gallery = document.getElementById('gallery');

// Fetch NASA space images
async function fetchSpaceImages() {
    const startDate = startInput.value;
    const endDate = endInput.value;

    // Check the selected dates
    if (!startDate || !endDate || startDate > endDate) {
        gallery.textContent = "Please select a valid date range.";
        return;
    }

    // Show loading message
    gallery.innerHTML = "<p>🔄 Loading space photos...</p>";

    // NASA APOD API URL
    const url = `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&start_date=${startDate}&end_date=${endDate}`;

    try {
        // Request NASA data
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch NASA images");
        }

        // Convert response into JavaScript objects
        const data = await response.json();

        // Display results in the console
        console.log(data);

        // Confirm successful loading
        gallery.innerHTML = "<p>NASA images loaded! Check the console.</p>";

    } catch (error) {
        console.error("Error:", error);
        gallery.innerHTML = "<p>Unable to load NASA images. Please try again.</p>";
    }
}

// Run the function when the button is clicked
getImagesButton.addEventListener('click', fetchSpaceImages);
