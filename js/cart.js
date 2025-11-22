export function updateCartSummary() {
    const savedCereals = JSON.parse(localStorage.getItem("savedCereals")) || []
    
    let summaryEl = document.getElementById("cartSummary") 
    if (!summaryEl) {
        summaryEl = document.createElement("div")
        summaryEl.id = "cartSummary"
        document.getElementById("menu1").appendChild(summaryEl)
    }

    if (savedCereals.length === 0) {
        summaryEl.textContent = "Your cart is empty"
        return
    }

    const counts = {}
    savedCereals.forEach(c => { counts[c.name] = (counts[c.name] || 0) + 1; })

    let msg = `There are ${savedCereals.length} cereal box${savedCereals.length > 1 ? "es" : ""} in your cart:\n`
    Object.entries(counts).forEach(([name, qty]) => { msg += `- ${name} \n`; })
    summaryEl.innerText = msg
}