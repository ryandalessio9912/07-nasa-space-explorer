
 // NASA Space Explorer

// Find date inputs
const startInput = document.getElementById("startDate");
const endInput = document.getElementById("endDate");

// Set up date inputs using the starter file
setupDateInputs(startInput, endInput);

// Find button and gallery
const getImagesButton = document.getElementById("getImagesBtn");
const gallery = document.getElementById("gallery");

// NASA APOD API
const API_URL =
    "https://science.nasa.gov/wp-json/wp/v2/apod-basic";

// Random Space Facts - Extra Credit
const spaceFacts = [
    "One day on Venus is longer than one year on Venus!",
    "Jupiter is the largest planet in our solar system.",
    "The Sun contains about 99.8% of the solar system's mass.",
    "Neptune has some of the fastest winds in our solar system.",
    "A day on Mars lasts about 24 hours and 37 minutes.",
    "Saturn's rings are made mostly of ice particles.",
    "Light from the Sun takes about 8 minutes to reach Earth.",
    "The Milky Way contains billions of stars.",
    "The Moon is slowly moving away from Earth.",
    "Olympus Mons on Mars is the largest known volcano in our solar system."
];

// Display a random space fact
const factSection = document.createElement("div");
factSection.className = "space-fact";

const randomFact =
    spaceFacts[Math.floor(Math.random() * spaceFacts.length)];

factSection.textContent = "🚀 Did You Know? " + randomFact;

gallery.before(factSection);

// Create modal window
const modal = document.createElement("div");
modal.className = "modal";
modal.setAttribute("role", "dialog");
modal.setAttribute("aria-modal", "true");
modal.setAttribute("aria-label", "NASA photo details");

modal.innerHTML = `
    <div class="modal-content">
        <button class="close-modal"
                aria-label="Close modal">×</button>
        <div id="modalDetails"></div>
    </div>
`;

document.body.appendChild(modal);

const modalDetails = document.getElementById("modalDetails");
const closeButton = modal.querySelector(".close-modal");

let previousFocus = null;

// Close modal
function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "";

    if (previousFocus) {
        previousFocus.focus();
    }
}

closeButton.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

document.addEventListener("keydown", (event) => {
    if (modal.style.display !== "flex") return;

    if (event.key === "Escape") {
        closeModal();
    }

    if (event.key === "Tab") {
        const focusable = modal.querySelectorAll(
            'button, a[href]'
        );

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey &&
            document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey &&
                   document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }
});

// Clean NASA explanation text
function cleanExplanation(explanation) {
    const temp = document.createElement("div");
    temp.innerHTML = explanation || "";

    return temp.textContent ||
        "No explanation available.";
}

// Get NASA image URL
function getImageURL(photo) {
    if (photo.media_type !== "image") {
        return null;
    }

    return photo.hdurl || null;
}

// Get NASA's original page
function getNASApage(photo) {
    const link = photo.permalink || photo.url;

    if (!link) return null;

    try {
        const parsed = new URL(link);

        if (parsed.protocol === "https:" ||
            parsed.protocol === "http:") {
            return parsed.href;
        }
    } catch (error) {
        console.warn("Invalid NASA link:", link);
    }

    return null;
}

// Open modal with NASA details
function openModal(photo) {
    previousFocus = document.activeElement;
    modalDetails.innerHTML = "";

    const imageURL = getImageURL(photo);
    const nasaPage = getNASApage(photo);

    // Handle video entries
    if (photo.media_type === "video" ||
        photo.media_type === "iframe") {

        const videoContainer = document.createElement("div");
        videoContainer.className = "video-preview";

        if (nasaPage) {
            const videoLink = document.createElement("a");

            videoLink.href = nasaPage;
            videoLink.target = "_blank";
            videoLink.rel = "noopener noreferrer";
            videoLink.textContent = "▶ Watch This Video on NASA";

            videoLink.style.color = "#ffffff";
            videoLink.style.fontSize = "22px";
            videoLink.style.textDecoration = "underline";

            videoContainer.appendChild(videoLink);
        } else {
            videoContainer.textContent =
                "Video link unavailable";
        }

        modalDetails.appendChild(videoContainer);

    } else if (imageURL) {

        // Display larger image
        const image = document.createElement("img");
        image.src = imageURL;
        image.alt = photo.title || "NASA space image";

        modalDetails.appendChild(image);
    }

    // Title
    const title = document.createElement("h2");
    title.textContent = photo.title || "NASA Astronomy";

    // Date
    const date = document.createElement("p");
    date.textContent = photo.date || "";

    // Explanation
    const explanation = document.createElement("p");
    explanation.textContent =
        cleanExplanation(photo.explanation);

    modalDetails.appendChild(title);
    modalDetails.appendChild(date);
    modalDetails.appendChild(explanation);

    // Link to NASA's original page
    if (nasaPage) {
        const link = document.createElement("a");

        link.href = nasaPage;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "View Original on NASA";
        link.style.color = "#80bfff";

        modalDetails.appendChild(link);
    }

    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    closeButton.focus();
}

// Create a gallery card
function createGalleryCard(photo) {
    const card = document.createElement("div");
    card.className = "gallery-item";
    card.tabIndex = 0;
    card.setAttribute("role", "button");

    const imageURL = getImageURL(photo);

    // Display image
    if (imageURL) {
        const image = document.createElement("img");
        image.src = imageURL;
        image.alt = photo.title || "NASA image";
        image.loading = "lazy";

        image.onerror = () => {
            image.style.display = "none";

            const message = document.createElement("p");
            message.textContent = "Image unavailable";

            card.prepend(message);
        };

        card.appendChild(image);

    } else if (
        photo.media_type === "video" ||
        photo.media_type === "iframe"
    ) {

        // Video preview card
        const videoLabel = document.createElement("div");
        videoLabel.className = "video-preview";
        videoLabel.textContent = "▶ Watch NASA Video";

        card.appendChild(videoLabel);

    } else {
        return null;
    }

    // Title
    const title = document.createElement("h3");
    title.textContent = photo.title || "NASA Astronomy";

    // Date
    const date = document.createElement("p");
    date.textContent = photo.date || "";

    card.appendChild(title);
    card.appendChild(date);

    // Click to open modal
    card.addEventListener("click", () => {
        openModal(photo);
    });

    // Keyboard accessibility
    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openModal(photo);
        }
    });

    return card;
}

// Convert YYYY-MM-DD to YYMMDD
function formatNASAdate(date) {
    return date.replaceAll("-", "").slice(2);
}

// Fetch NASA images
async function fetchSpaceImages() {
    const startDate = startInput.value;
    const endDate = endInput.value;

    // Validate dates
    if (!startDate || !endDate || startDate > endDate) {
        gallery.textContent =
            "Please select a valid date range.";
        return;
    }

    // Show loading message
    gallery.innerHTML =
        "<p>🔄 Loading space photos...</p>";

    getImagesButton.disabled = true;

    // Build NASA API request
    const url = new URL(API_URL);

    url.searchParams.set(
        "date_from",
        formatNASAdate(startDate)
    );

    url.searchParams.set(
        "date_to",
        formatNASAdate(endDate)
    );

    // Calculate days in selected range
    const days =
        Math.round(
            (new Date(endDate + "T00:00:00Z") -
             new Date(startDate + "T00:00:00Z")) /
            86400000
        ) + 1;

    url.searchParams.set(
        "per_page",
        Math.min(days, 100)
    );

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                "NASA API returned error " + response.status
            );
        }

        const data = await response.json();

        console.log("NASA API Data:", data);

        if (!Array.isArray(data)) {
            throw new Error("Unexpected NASA API response");
        }

        // Filter results to selected dates
        const filteredData = data.filter(photo => {
            return (
                photo.date >= startDate &&
                photo.date <= endDate
            );
        });

        console.log("Filtered NASA Images:", filteredData);

        // Clear gallery
        gallery.innerHTML = "";

        // Display NASA entries
        filteredData.forEach((photo) => {
            const card = createGalleryCard(photo);

            if (card) {
                gallery.appendChild(card);
            }
        });

        // No matching images
        if (gallery.children.length === 0) {
            gallery.textContent =
                "No NASA images found for this date range.";
        }

    } catch (error) {
        console.error("NASA API Error:", error);

        gallery.textContent =
            "Unable to load NASA images: " + error.message;

    } finally {
        getImagesButton.disabled = false;
    }
}

// Run when button is clicked
getImagesButton.addEventListener(
    "click",
    fetchSpaceImages
);
