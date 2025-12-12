import { loadData } from "./dataLoader.js"
import { initScales } from "./scales.js"
import { updateFilter, applyFilters, setBrand, setOrder, initFilterListeners, resetFilters, initTips } from "./filters.js"
import { renderShelves } from "./shelves.js"
import { openModal } from "./modal.js"
import { updateCartSummary } from "./cart.js"
import { initCartDropZone } from "./shelves.js"
import { initRotatingCereal } from "./rotating_cereal.js"
import { initInfoBox, initResetFilters, initRestartButton, initDoneButton } from "./ui_handlers.js"

let globalData = [] // dados carregados para todo o main.js

// Função render que atualiza visualização
function render() {
    const filteredData = applyFilters(globalData)
    renderShelves(filteredData)

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
    
    // 4. Initialize cart summary and hover
    updateCartSummary();

    // 6. Initialize cart drop zone
    initCartDropZone();

    // 7. Inicializar listeners de filtros
    initFilterListeners(render)

    // 8. Inicializar tips
    initTips()

    // 9. Inicializar rotating cereal
    initRotatingCereal()

    // 10. Inicializar info box
    initInfoBox()

    // 11. Inicializar reset filters
    initResetFilters(render)

    // 12. Inicializar restart button
    initRestartButton(updateCartSummary, render)

    // 13. Inicializar done button
    initDoneButton(updateCartSummary)    
}

// 10. Inicia tudo quando DOM estiver carregado
document.addEventListener("DOMContentLoaded", main)

// 11. Expondo openModal globalmente para uso por render.js
window.openModal = openModal











