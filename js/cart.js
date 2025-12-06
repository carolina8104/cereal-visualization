export function updateCartSummary() {
    const savedCereals = JSON.parse(localStorage.getItem("savedCereals")) || []
    
    let summaryEl = document.getElementById("cartSummary") 
    if (!summaryEl) {
        summaryEl = document.createElement("div")
        summaryEl.id = "cartSummary"
        document.getElementById("cartSummary").appendChild(summaryEl)
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

    
 const cartIcon = document.getElementById("carrinho")

    // Mostra o resumo quando passar o rato sobre o carrinho
    cartIcon.addEventListener("mouseenter", () => {
        summaryEl.style.display = "block"
    })

    // Esconde quando o rato sai do carrinho
    cartIcon.addEventListener("mouseleave", () => {
        summaryEl.style.display = "none"
    })

cartIcon.addEventListener("mousemove", (e) => {
    const summaryRect = summaryEl.getBoundingClientRect()
    
    // Acima e à direita do cursor
    let left = e.pageX + 5              // 15px de folga para a direita
    let top = e.pageY - summaryRect.height - 5  // 15px de folga acima

    summaryEl.style.left = left + "px"
    summaryEl.style.top = top + "px"
})

}