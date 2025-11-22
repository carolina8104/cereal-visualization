import { loadData } from "./dataLoader.js"
import { initScales } from "./scales.js"
import { filters } from "./filters.js"
import { renderShelves } from "./shelves.js"
import { openModal } from "./modal.js"
import { updateCartSummary } from "./cart.js"

async function main() {
    // 1. Carrega os dados
    const data = await loadData()

    // 2. Atualiza filtros com valores máximos do dataset
    filters.kcalMax = Math.round(d3.max(data, d => d.calories) || 500)
    filters.sugarMax = d3.max(data, d => d.sugars)
    filters.proteinMax = d3.max(data, d => d.protein)

    // 3. Inicializa escalas D3
    initScales()

    // 4. Renderiza prateleiras
    renderShelves()

    // 5. Atualiza resumo do carrinho
    updateCartSummary()

    // 6. Configura botão Restart
    const restartButton = document.querySelector("#menu1 .button-container button")
    if (restartButton) restartButton.onclick = () => {
        const maxMessage = document.getElementById("maxCerealMessage")
        if (maxMessage) maxMessage.remove()
        localStorage.setItem("savedCereals", JSON.stringify([]))
        console.log("Cereais reiniciados: []")
        updateCartSummary()
    };

    // 7. Configura botão Done
    const doneButton = document.getElementById("doneButton")
    if (doneButton) {
        doneButton.addEventListener("click", () => {
            const savedCereals = JSON.parse(localStorage.getItem("savedCereals")) || []

            let messageEl = document.getElementById("doneMessage")
            if (!messageEl) {
                messageEl = document.createElement("p")
                messageEl.id = "doneMessage"
                document.getElementById("menu1").appendChild(messageEl)
            }

            if (savedCereals.length === 0) {
                messageEl.textContent = "First add some cereals to cart"
                messageEl.style.display = "block"
            } else {
                messageEl.style.display = "none"

                const carrinho = document.getElementById("carrinho")
                carrinho.style.position = "fixed"
                carrinho.style.left = "0vh"
                carrinho.style.transition = "all 2s ease"
                carrinho.getBoundingClientRect()
                carrinho.style.right = "90%"

                setTimeout(() => {
                    window.location.href = "bowl.html"
                }, 1000)
            }
        })
    }
}

// 8. Inicia tudo quando DOM estiver carregado
document.addEventListener("DOMContentLoaded", main)

// 9. Expondo openModal globalmente para uso por render.js
window.openModal = openModal