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
                box.style.left = "0vh"
                box.style.transition = "all 1.5s ease"
            });

                setTimeout(() => {
                    navigateToBowl()
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

    // 1. Limpar inputs numéricos
    const numericInputs = document.querySelectorAll("#filters input[type=number]");
    numericInputs.forEach(input => {
        input.value = "";
    });

    // 0 nos filtros internos
    updateFilter("proteinMax", null);
    updateFilter("kcalMax", null);
    updateFilter("sugarMax", null);
    updateFilter("carboMax", null);
    updateFilter("fiberMax", null);
    updateFilter("fatMax", null);
    updateFilter("potassiumMax", null);
    updateFilter("sodiumMax", null);

    // 2. Desmarcar todas as marcas
    const checkboxes = document.querySelectorAll("#brandContainer input[type=checkbox]");
    checkboxes.forEach(cb => cb.checked = false);
    setBrand([]); // Sem marcas escolhidas

    // 3. Voltar o select de ordenação para "None"
    const orderSelect = document.querySelector("#orderSelect select");
    if (orderSelect) {
        orderSelect.value = "none";
        setOrder("none");
    }
    document.querySelectorAll('.tip p:nth-child(1)').forEach(firstP => {
        firstP.innerHTML = ""; 
        firstP.classList.add("hide-arrow");  
    });
    document.querySelectorAll('.tip p:nth-child(2)').forEach(secondP => {
        secondP.innerHTML = ""; 
    });
    
    // 4. Renderizar outra vez
    render();
});










window.createTip = function(inputId, filterKey, shelfSelector, min, max, texts, arrow = "←") {
    document.getElementById(inputId)?.addEventListener("input", e => {
        updateFilter(filterKey, e.target.value)
        
        const secondP = document.querySelector(shelfSelector + " p:nth-child(2)");  
        const firstP = document.querySelector(shelfSelector + " p:nth-child(1)");  // A seta (primeiro <p>)
        const value = parseFloat(e.target.value) || 0;  // Garante que seja número (0 se vazio)
        
        console.log(`Input ${inputId}: value=${value}, min=${min}, max=${max}, secondP.innerHTML="${secondP.innerHTML}"`);  // Debugging
        
        if (e.target.value && value >= min && value <= max && secondP.innerHTML === "") {
            const randomText = texts[Math.floor(Math.random() * texts.length)];
            secondP.innerHTML = randomText;
            firstP.innerHTML = arrow;
            firstP.classList.remove("hide-arrow");
        } else if (!e.target.value || value < min || value > max) {
            
            // Limpa sempre se sair do intervalo, mas verifica se o texto atual foi definido por este tip
            if (secondP.innerHTML && texts.includes(secondP.innerHTML)) {
                secondP.innerHTML = "";
                firstP.innerHTML = "";
                firstP.classList.add("hide-arrow");
            }
        }
        render()
    })
}

    const proteinTexts1 = [
        "Looking for a protein-rich breakfast? Cereals might not be the best place to start.",
        "Most cereals are great for carbs, but when it comes to protein… they fall short.",
        "If protein is your priority, you may want to look beyond the cereal bowl.",
        "Cereals are typically low in protein. Consider adding a side of eggs or yogurt to your breakfast.",
    ];
    createTip("proteinInput", "proteinMax", "#tip-shelf-2", 5, 10, proteinTexts1, "");

    const proteinTexts2 = [
        "Did you notice how the middle shelf groups the lowest-protein cereals?",
        "You might spot a pattern: protein levels are lowest on the middle shelf.",
        "Take a closer look: cereals in the middle shelf contain very little protein.",
        "Looking for more protein? You may want to skip the middle shelf.",
    ];
    createTip("proteinInput", "proteinMax", "#tip-shelf-2", 1,2, proteinTexts2, "←");

    const sugarTexts1 = [
        "At 8g of sugar or less, the middle shelf is nearly empty.",
        "With less sugar allowed, the middle shelf empties quickly.",
        "The middle shelf is dominated by higher-sugar cereals.",
        "Turns out, low sugar isn’t a middle-shelf thing.",
    ];
    createTip("sugarInput", "sugarMax", "#tip-shelf-2", 1,6, sugarTexts1, "←");


    const sugarTexts2 = [
    "7g of sugar is a sweet spot: the average for these cereals",
    "On average, a serving of these cereals has 7g of sugar and that’s about 30% of the daily recommended limit for adults.",
    "A typical portion of these cereals contributes roughly 1.5 teaspoons of sugar."
    ];
    createTip("sugarInput", "sugarMax", "#tip-shelf-2", 7,7, sugarTexts2, "");
    

    const carboTexts1 = [
    "Low-carb cereals(mostly on shelf 3): these servings are likely higher in fiber or protein.",
    "Few cereals on shelf 3 have such low carbohydrate content per serving.",
    "Low-carb options are ideal if you’re looking for a lighter breakfast.",
    "Low-carb cereals are mostly on the bottom shelf and are a healthy choice often overlooked."
    ];
    createTip("carboInput", "carboMax", "#tip-shelf-3", 4,10, carboTexts1, "←");
    
    const carboTexts2 = [
    "Most cereals fall into this moderate range of 11-17 g per serving.",
    "Typical breakfast cereals provide a moderate amount of carbohydrates.",
    "This range represents the most common carb content in cereals."
    ];
    createTip("carboInput", "carboMax", "#tip-shelf-2", 12,17, carboTexts2, "");
    

    const carboTexts3 = [
    "There are high-carb cereals: these servings may give a quick energy boost.",
    "Some cereals exceed 17 g carbs per serving and are sweeter or more energy-dense options.",
    "Some cereals are high-carb and provide more energy, but also more sugar."
    ];
    createTip("carboInput", "carboMax", "#tip-shelf-2", 17,30, carboTexts3, "");
