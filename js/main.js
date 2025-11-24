import { loadData } from "./dataLoader.js"
import { initScales } from "./scales.js"
import { updateFilter, applyFilters, setBrand, setOrder } from "./filters.js"
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
            localStorage.setItem("savedCereals", JSON.stringify([]))
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

    // 7. Inputs numéricos de filtros
    document.getElementById("proteinInput")?.addEventListener("input", e => {
        updateFilter("proteinMax", e.target.value)
        render()
    })

    document.getElementById("kcalInput")?.addEventListener("input", e => {
        updateFilter("kcalMax", e.target.value)
        render()
    })

    document.getElementById("sugarInput")?.addEventListener("input", e => {
        updateFilter("sugarMax", e.target.value)
        render()
    })

    document.getElementById("carboInput")?.addEventListener("input", e => {
        updateFilter("carboMax", e.target.value)
        render()
    })

    document.getElementById("fiberInput")?.addEventListener("input", e => {
        updateFilter("fiberMax", e.target.value)
        render()
    })

    document.getElementById("fatInput")?.addEventListener("input", e => {
        updateFilter("fatMax", e.target.value)
        render()
    })

    document.getElementById("potassInput")?.addEventListener("input", e => {
        updateFilter("potassiumMax", e.target.value)
        render()
    })    
    
    document.getElementById("sodiumInput")?.addEventListener("input", e => {
        updateFilter("sodiumMax", e.target.value)
        render()
    })

    // 8. Select de marcas
const checkboxes = document.querySelectorAll("#brandContainer input[type=checkbox]");
checkboxes.forEach(cb => {
    cb.addEventListener("change", () => {
        const selectedBrands = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        setBrand(selectedBrands);
        render();
    });
});


    // 9. Select de ordenação
    document.getElementById("orderSelect")?.addEventListener("change", e => {
        setOrder(e.target.value)
        render()
    })
    
}

// 10. Inicia tudo quando DOM estiver carregado
document.addEventListener("DOMContentLoaded", main)

// 11. Expondo openModal globalmente para uso por render.js
window.openModal = openModal
