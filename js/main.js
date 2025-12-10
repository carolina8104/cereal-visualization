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

    // 5. Inicializar listeners de filtros
    initFilterListeners(render)

    // 6. Inicializar tips
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











