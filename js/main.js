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
                messageEl.style.opacity = "1"
                setTimeout(() => {
                    messageEl.style.opacity = "0"
                }, 3000)
            } else {
                messageEl.style.opacity = "0"
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
    if (infoBox.style.display === 'block') {
        infoBox.classList.remove('show');
        setTimeout(() => {
            infoBox.style.display = 'none';
        }, 300);
    } else {
        infoBox.style.display = 'block';
        setTimeout(() => {
            infoBox.classList.add('show');
        }, 10);
    }
});

document.addEventListener('click', () => {
    if (infoBox.classList.contains('show')) {
        infoBox.classList.remove('show');
        setTimeout(() => {
            infoBox.style.display = 'none';
        }, 300);
    }
});



document.getElementById("resetFilters")?.addEventListener("click", () => {
    resetFilters(render);
});

// Rotating cereal
const cerealPaths = [
    "M 35.000 5.000 C 54.330 5.000 70.000 20.670 70.000 40.000 C 70.000 59.330 54.330 75.000 35.000 75.000 C 15.670 75.000 0.000 59.330 0.000 40.000 C 0.000 20.670 15.670 5.000 35.000 5.000 Z M 35.000 17.600 C 23.402 17.600 14.000 27.159 14.000 40.000 C 14.000 52.841 23.402 62.400 35.000 62.400 C 46.598 62.400 56.000 52.841 56.000 40.000 C 56.000 27.159 46.598 17.600 35.000 17.600 Z", // donut
    "M 45.640 29.780 L 70.000 28.800 L 55.020 48.050 L 55.860 75.000 L 35.770 53.020 L 16.800 75.000 L 13.790 48.050 L 0.000 29.780 H 22.050 L 33.950 5.000 L 45.640 29.780 Z M 33.250 31.600 C 29.050 31.600 25.550 35.100 25.550 39.300 C 25.550 43.500 29.050 47.000 33.250 47.000 C 37.450 47.000 40.950 43.500 40.950 39.300 C 40.950 35.100 37.450 31.600 33.250 31.600 Z", // star
    "M 70.000 72.760 H 0.000 V 5.000 H 70.000 V 72.760 Z M 5.600 7.870 V 71.430 H 9.520 V 7.870 H 5.600 Z M 15.960 7.870 V 71.430 H 19.950 V 7.870 H 15.960 Z M 26.390 7.870 V 71.430 H 30.311 V 7.870 H 26.390 Z M 36.750 7.870 V 71.430 H 40.740 V 7.870 H 36.750 Z M 44.660 7.870 V 71.430 H 48.650 V 7.870 H 44.660 Z M 55.020 7.870 V 71.430 H 59.010 V 7.870 H 55.020 Z", // box
    "M 16.450 74.510 C -1.610 74.160 -2.170 46.370 2.380 35.240 C 2.380 32.650 7.980 30.130 10.080 18.440 C 12.670 5.210 21.070 5.070 22.540 5.070 C 24.220 5.070 32.130 4.370 36.960 7.660 C 42.210 10.250 50.050 17.810 62.510 24.670 C 78.190 33.280 62.370 29.290 47.950 37.200 C 33.530 45.110 34.720 22.780 28.560 34.120 C 23.590 43.150 32.130 47.700 36.960 48.890 C 37.450 53.300 33.810 81.790 16.450 81.510 Z", // flake
    "M27.344 56.845C9.548 52.888 -7.815 13.376 3.723 11.054C6.427 9.660 24.504 20.759 35.839 16.441C43.713 11.537 62.029 3.595 72.307 11.054C82.584 18.513 59.322 44.689 46.407 56.845C44.335 59.124 38.709 59.372 27.344 56.845Z" // irregular
];

const gradients = ["url(#G-gradient)", "url(#K-gradient)", "url(#N-gradient)", "url(#P-gradient)", "url(#Q-gradient)"];

let currentIndex = 0;
const rotatingCereal = document.getElementById("rotating-cereal");
const pathEl = document.getElementById("cereal-path");

// Auto-cycle through cereal shapes every 3 seconds
setInterval(() => {
    currentIndex = (currentIndex + 1) % cerealPaths.length;
    pathEl.setAttribute("d", cerealPaths[currentIndex]);
    pathEl.setAttribute("fill", gradients[currentIndex]);
    
    // Add spin effect
    rotatingCereal.classList.add("spin-effect");
    setTimeout(() => {
        rotatingCereal.classList.remove("spin-effect");
    }, 500);
}, 3000);











