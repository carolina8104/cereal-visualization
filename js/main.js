import { loadData } from "./dataLoader.js"
import { initScales } from "./scales.js"
import { updateFilter, applyFilters, setBrand, setOrder, initFilterListeners, resetFilters, initTips } from "./filters.js"
import { renderShelves } from "./shelves.js"
import { openModal } from "./modal.js"
import { updateCartSummary } from "./cart.js"

let globalData = [] // dados carregados para todo o main.js

// Função render que atualiza visualização
function render() {
    const filteredData = applyFilters(globalData)
    renderShelves(filteredData)

    // contador de resultados
    const resultEl = document.getElementById("resultCount")
    if (resultEl) {
        resultEl.textContent = `Showing ${filteredData.length} cereals`
    }
}

async function main() {
    // 1. Carrega os dados
    globalData = await loadData()

    // 2. Inicializa escalas D3
    initScales()

    // 3. Renderiza prateleiras pela primeira vez
    render()

    // 4. Atualiza resumo do carrinho
    updateCartSummary()

    // 5. Configura botão Restart
    const restartButton = document.querySelector("#menu1 .button-container button")
    if (restartButton) {
        restartButton.onclick = () => {
            const maxMessage = document.getElementById("maxCerealMessage")
            if (maxMessage) maxMessage.remove()

            // limpa cereais
            localStorage.setItem("savedCereals", JSON.stringify([]))

            // remove caixas do carrinho
            document.querySelectorAll(".flying-box").forEach(el => el.remove())
            localStorage.removeItem("flyingBoxes") // limpa do storage

            console.log("Cereais reiniciados: []")
            updateCartSummary()
            render()
        }
    }

    // 6. Configura botão Done
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
                messageEl.textContent = "First add some cereals to cart!"
                messageEl.classList.add("error")
            } else {
                messageEl.style.display = "none"
                const carrinho = document.getElementById("carrinho")
            
                carrinho.style.left = "-200vh"
                carrinho.style.transition = "all 3s ease"
                carrinho.getBoundingClientRect()


            const flyingBoxes = document.querySelectorAll(".flying-box");
            flyingBoxes.forEach(box => {
                box.style.left = "-200vh"
                box.style.transition = "all 3s ease"
            });

                setTimeout(() => {
                    navigateToBowl()
                }, 1000)
            }
        })
    }

    // 7. Inicializar listeners de filtros
    initFilterListeners(render)

    // 8. Inicializar tips
    initTips()    
}

// 10. Inicia tudo quando DOM estiver carregado
document.addEventListener("DOMContentLoaded", main)

// 11. Expondo openModal globalmente para uso por render.js
window.openModal = openModal



//não sabia onde por isto
const infoBox = document.getElementById('info');

document.getElementById('info-circle').addEventListener('click', (event) => {
    event.stopPropagation(); // Impede que o clique no "i" feche imediatamente
    infoBox.style.display =
        infoBox.style.display === 'block' ? 'none' : 'block';
});

document.addEventListener('click', () => {
    infoBox.style.display = 'none';
});



document.getElementById("resetFilters")?.addEventListener("click", () => {
    resetFilters(render);
});











