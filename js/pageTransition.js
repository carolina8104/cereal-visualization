// Initialize body opacity
document.body.style.opacity = '0';

// Messages for bowl transition
const bowlMessages = [
    "Now let's explore!",
];

// Create transition overlay
function createTransitionOverlay(message) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #DAEFFA;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        opacity: 0;
        transition: opacity 0.6s ease-in-out;
        font-family: 'Inter', sans-serif;
    `;
    
    const text = document.createElement('h2');
    text.style.cssText = `
        color: #000;
        font-size: 2.5rem;
        font-weight: 600;
        text-align: center;
        margin: 0;
        letter-spacing: -0.5px;
    `;
    text.textContent = message;
    
    overlay.appendChild(text);
    document.body.appendChild(overlay);
    
    // Fade in overlay
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 50);
    
    return overlay;
}

// Navigate to bowl with special transition
window.navigateToBowl = function() {
    // Create overlay immediately
    const message = bowlMessages[Math.floor(Math.random() * bowlMessages.length)];
    const overlay = createTransitionOverlay(message);
    
    // Navigate after showing overlay
    setTimeout(() => {
        window.location.href = "bowl.html";
    }, 1000);
}

// Fade in on page load
window.addEventListener('load', () => {
    document.body.style.transition = 'opacity 0.6s ease-in';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 50);
});

// Fade out and navigate function
function navigateWithFade(url) {
    const body = document.body;
    body.style.transition = 'opacity 0.6s ease-out';
    body.style.opacity = '0';
    
    setTimeout(() => {
        window.location.href = url;
    }, 50);
}

// Add fade effect to all navigation links
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        // Skip hash links and external links
        if (!link.href.includes('#') && link.hostname === window.location.hostname) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navigateWithFade(link.href);
            });
        }
    });
});
