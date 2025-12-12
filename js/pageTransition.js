// Initialize body opacity
document.body.style.opacity = '0';

// Messages for bowl transition
const bowlMessages = [
    {
        main: "Now let's explore!",
        sub: "It’s time to mix your cereals and explore how they come together in your bowl!"
    }
];

// Create transition overlay
function createTransitionOverlay(messages) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #DAEFFA;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        opacity: 0;
        transition: opacity 1s ease-in-out;
        font-family: 'Inter', sans-serif;
    `;
    
    const mainText = document.createElement('h2');
    mainText.style.cssText = `
        color: #000;
        font-size: 2.3rem;
        font-weight: 600;
        text-align: center;
        margin: 0 0 1rem 0;
        letter-spacing: -0.5px;
    `;
    mainText.textContent = messages.main;
    
    const subText = document.createElement('p');
    subText.style.cssText = `
        color: #333;
        font-size: 1.3rem;
        font-weight: 400;
        text-align: center;
        margin: 0;
        max-width: 600px;
        line-height: 1.4;
    `;
    subText.textContent = messages.sub;
    
    overlay.appendChild(mainText);
    overlay.appendChild(subText);
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
    const messages = bowlMessages[Math.floor(Math.random() * bowlMessages.length)];
    const overlay = createTransitionOverlay(messages);
    
    // Navigate after showing overlay
    setTimeout(() => {
        window.location.href = "bowl.html";
    }, 4000);
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
