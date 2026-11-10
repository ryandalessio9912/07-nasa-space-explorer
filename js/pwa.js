
// NASA Space Explorer PWA Features

// Find connection status element
const connectionStatus =
    document.getElementById("connectionStatus");

// Update online/offline indicator
function updateConnectionStatus() {
    if (navigator.onLine) {
        connectionStatus.textContent = "🟢 Online";
        connectionStatus.className =
            "connection-status online";
    } else {
        connectionStatus.textContent =
            "🔴 Offline Mode";
        connectionStatus.className =
            "connection-status offline";
    }
}

// Check connection when app loads
updateConnectionStatus();

// Detect connection changes
window.addEventListener(
    "online",
    updateConnectionStatus
);

window.addEventListener(
    "offline",
    updateConnectionStatus
);


// Custom PWA Install Prompt
let deferredInstallPrompt = null;

const installBtn = document.getElementById("installBtn");

// Capture the browser's installation event
window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();

    deferredInstallPrompt = event;
    installBtn.hidden = false;
});

// Show installation prompt when button is clicked
installBtn.addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;

    deferredInstallPrompt.prompt();

    await deferredInstallPrompt.userChoice;

    deferredInstallPrompt = null;
    installBtn.hidden = true;
});

// Hide install button after installation
window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    installBtn.hidden = true;

    console.log("NASA Space Explorer installed!");
});


// NASA Notification Permission

const notificationBtn =
    document.getElementById("notificationBtn");

const notificationStatus =
    document.getElementById("notificationStatus");

// Check notification support and permission
function updateNotificationStatus() {
    if (!("Notification" in window)) {
        notificationStatus.textContent =
            "Notifications are not supported in this browser.";
        notificationBtn.disabled = true;
        return;
    }

    if (Notification.permission === "granted") {
        notificationStatus.textContent =
            "✅ Notifications are enabled!";
        notificationBtn.disabled = true;
    } else if (Notification.permission === "denied") {
        notificationStatus.textContent =
            "Notifications are blocked in browser settings.";
        notificationBtn.disabled = true;
    } else {
        notificationStatus.textContent = "";
    }
}

// Request permission when clicked
notificationBtn.addEventListener("click", async () => {
    if (!("Notification" in window)) {
        updateNotificationStatus();
        return;
    }

    try {
        const permission =
            await Notification.requestPermission();

        updateNotificationStatus();

        if (permission === "granted") {
            console.log("NASA notifications enabled!");
        }
    } catch (error) {
        console.error("Notification error:", error);
        notificationStatus.textContent =
            "Unable to request notification permission.";
    }
});

// Check status when app loads
updateNotificationStatus();

