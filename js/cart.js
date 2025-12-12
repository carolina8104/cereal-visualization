let hoverSetupDone = false;

export function updateCartSummary() {
    const savedCereals = JSON.parse(localStorage.getItem("savedCereals")) || []
    
    let summaryEl = document.getElementById("cartSummary") 
    if (!summaryEl) {
        summaryEl = document.createElement("div")
        summaryEl.id = "cartSummary"
        document.body.appendChild(summaryEl)
    }

    if (savedCereals.length === 0) {
        summaryEl.textContent = "Your cart is empty"
        summaryEl.style.display = "none"; // Hide when empty
    } else {
        const counts = {}
        savedCereals.forEach(c => { counts[c.name] = (counts[c.name] || 0) + 1; })

        let msg = `There are ${savedCereals.length} cereal box${savedCereals.length > 1 ? "es" : ""} in your cart:\n`
        Object.entries(counts).forEach(([name, qty]) => { msg += `- ${name} \n`; })
        summaryEl.innerText = msg
    }

    // Setup hover functionality only once
    if (!hoverSetupDone) {
        setupCartHover(summaryEl);
        hoverSetupDone = true;
    }
}

function setupCartHover(summaryEl) {
    const cartIcon = document.getElementById("carrinho");
    if (!cartIcon) {
        console.warn("Cart icon not found!");
        return;
    }

    cartIcon.addEventListener("mouseenter", () => {
        summaryEl.style.display = "block";
    });

    cartIcon.addEventListener("mouseleave", () => {
        summaryEl.style.display = "none";
    });

    cartIcon.addEventListener("mousemove", (e) => {
        const summaryRect = summaryEl.getBoundingClientRect();
        
        let left = e.pageX + 15;             
        let top = e.pageY - summaryRect.height - 15;

        summaryEl.style.left = left + "px";
        summaryEl.style.top = top + "px";
    });
}