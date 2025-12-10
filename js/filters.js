export const filters = {
    kcal: { value: null, op: "<=" },
    sugar: { value: null, op: "<=" },
    protein: { value: null, op: "<=" },
    carbo: { value: null, op: "<=" },
    fat: { value: null, op: "<=" },
    fiber: { value: null, op: "<=" },
    potassium: { value: null, op: "<=" },
    sodium: { value: null, op: "<=" },
    mfr: [],
    order: "none"
}

// função para atualizar filtros quando o user muda inputs
export function updateFilter(key, value, op) {
    filters[key].value = value === "" || value === null ? null : Number(value)
    filters[key].op = op || "<="
}


const brandMap = {
    "All": "all",
    "American Home Food Products":"A",
    "General Mills": "G",
    "Kelloggs": "K",
    "Nabisco": "N",
    "Post": "P",
    "Quaker Oats": "Q",
    "Ralston": "R",    
}

export function setBrand(selectedBrands) {     // selectedBrands é um array de valores do select/checkbox
    if (!selectedBrands || selectedBrands.length === 0) {
        filters.mfr = [] 
    } else {
        filters.mfr = selectedBrands.map(v => brandMap[v] || "all")
        // filtra 'all' se estiver presente
        filters.mfr = filters.mfr.filter(v => v !== "all")
    }
    console.log("Marcas selecionadas:", filters.mfr)
}


export function setOrder(value) {
    filters.order = value || "none"
}

// Função de comparação genérica
function compare(val, filter) {
    if (filter.value === null) return true
    if (filter.op === "<=") return val <= filter.value
    if (filter.op === ">=") return val >= filter.value
    if (filter.op === "=") return val === filter.value
    return true
}


export function applyFilters(data) {
    let filtered = data.filter(d => {
        if (!compare(d.calories, filters.kcal)) return false
        if (!compare(d.sugars, filters.sugar)) return false
        if (!compare(d.protein, filters.protein)) return false
        if (!compare(d.carbo, filters.carbo)) return false
        if (!compare(d.fat, filters.fat)) return false
        if (!compare(d.fiber, filters.fiber)) return false
        if (!compare(d.potass, filters.potassium)) return false
        if (!compare(d.sodium, filters.sodium)) return false
        if (filters.mfr.length > 0 && !filters.mfr.includes(d.mfr)) return false
        return true
    })

    // ordenação
    if (filters.order === "protein-asc") {
        filtered.sort((a, b) => a.protein - b.protein)
    } else if (filters.order === "protein-desc") {
        filtered.sort((a, b) => b.protein - a.protein)
    } else if (filters.order === "kcal-desc") {
        filtered.sort((a, b) => b.calories - a.calories)
    } else if (filters.order === "kcal-asc") {
        filtered.sort((a, b) => a.calories - b.calories)
    } else if (filters.order === "fat-desc") {
        filtered.sort((a, b) => b.fat - a.fat)
    } else if (filters.order === "fat-asc") {
        filtered.sort((a, b) => a.fat - b.fat)
    } else if (filters.order === "sugar-desc") {
        filtered.sort((a, b) => b.sugars - a.sugars)
    } else if (filters.order === "sugar-asc") {
        filtered.sort((a, b) => a.sugars - b.sugars)
    }

    return filtered
}




const filterButton = document.querySelector(".hideFilter");
const filters_box = document.querySelector("#filters");

filterButton.addEventListener("click", () => {
  filters_box.classList.toggle("hidden");
});

// Função para inicializar listeners de filtros
export function initFilterListeners(render) {
    // 7. Inputs numéricos de filtros
    document.getElementById("proteinInput")?.addEventListener("input", e => {
        updateFilter("protein", e.target.value, document.getElementById("proteinOp").value)
        render()
    })

    document.getElementById("kcalInput")?.addEventListener("input", e => {
        updateFilter("kcal", e.target.value, document.getElementById("kcalOp").value)
        render()
    })

    document.getElementById("sugarInput")?.addEventListener("input", e => {
        updateFilter("sugar", e.target.value, document.getElementById("sugarOp").value)
        render()
    })

    document.getElementById("carboInput")?.addEventListener("input", e => {
        updateFilter("carbo", e.target.value, document.getElementById("carboOp").value)
        render()
    })

    document.getElementById("fiberInput")?.addEventListener("input", e => {
        updateFilter("fiber", e.target.value, document.getElementById("fiberOp").value)
        render()
    })

    document.getElementById("fatInput")?.addEventListener("input", e => {
        updateFilter("fat", e.target.value, document.getElementById("fatOp").value)
        render()
    })

    document.getElementById("potassInput")?.addEventListener("input", e => {
        updateFilter("potassium", e.target.value, document.getElementById("potassOp").value)
        render()
    })    
    
    document.getElementById("sodiumInput")?.addEventListener("input", e => {
        updateFilter("sodium", e.target.value, document.getElementById("sodiumOp").value)
        render()
    })

    // Event listeners para os selects de operadores
    document.getElementById("proteinOp")?.addEventListener("change", e => {
        updateFilter("protein", document.getElementById("proteinInput").value, e.target.value)
        render()
    })
    document.getElementById("kcalOp")?.addEventListener("change", e => {
        updateFilter("kcal", document.getElementById("kcalInput").value, e.target.value)
        render()
    })
    document.getElementById("sugarOp")?.addEventListener("change", e => {
        updateFilter("sugar", document.getElementById("sugarInput").value, e.target.value)
        render()
    })
    document.getElementById("carboOp")?.addEventListener("change", e => {
        updateFilter("carbo", document.getElementById("carboInput").value, e.target.value)
        render()
    })
    document.getElementById("fiberOp")?.addEventListener("change", e => {
        updateFilter("fiber", document.getElementById("fiberInput").value, e.target.value)
        render()
    })
    document.getElementById("fatOp")?.addEventListener("change", e => {
        updateFilter("fat", document.getElementById("fatInput").value, e.target.value)
        render()
    })
    document.getElementById("potassOp")?.addEventListener("change", e => {
        updateFilter("potassium", document.getElementById("potassInput").value, e.target.value)
        render()
    })
    document.getElementById("sodiumOp")?.addEventListener("change", e => {
        updateFilter("sodium", document.getElementById("sodiumInput").value, e.target.value)
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

// Função para resetar filtros
export function resetFilters(render) {
    // 1. Limpar inputs numéricos
    const numericInputs = document.querySelectorAll("#filters input[type=number]");
    numericInputs.forEach(input => {
        input.value = "";
    });

    // Resetar selects de operadores para "<="
    const opSelects = document.querySelectorAll("#filters select");
    opSelects.forEach(select => {
        select.value = "<=";
    });

    // 0 nos filtros internos
    updateFilter("protein", null);
    updateFilter("kcal", null);
    updateFilter("sugar", null);
    updateFilter("carbo", null);
    updateFilter("fiber", null);
    updateFilter("fat", null);
    updateFilter("potassium", null);
    updateFilter("sodium", null);

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
}

// Função createTip
window.createTip = function(inputId, filterKey, shelfSelector, min, max, texts, arrow = "←", opExpected = null) {
    const updateTip = () => {
        const op = document.getElementById(inputId.replace("Input", "Op")).value;
        const inputEl = document.getElementById(inputId);
        const value = parseFloat(inputEl.value) || 0;
        
        const secondP = document.querySelector(shelfSelector + " p:nth-child(2)");  
        const firstP = document.querySelector(shelfSelector + " p:nth-child(1)");
        
        console.log(`Input ${inputId}: value=${value}, min=${min}, max=${max}, op=${op}, opExpected=${opExpected}, secondP.innerHTML="${secondP.innerHTML}"`);
        
        const shouldShow = inputEl.value && value >= min && value <= max && secondP.innerHTML === "" && (opExpected === null || op === opExpected);
        
        if (shouldShow) {
            const randomText = texts[Math.floor(Math.random() * texts.length)];
            secondP.innerHTML = randomText;
            firstP.innerHTML = arrow;
            firstP.classList.remove("hide-arrow");
        } else if (!inputEl.value || value < min || value > max || (opExpected !== null && op !== opExpected)) {
            if (secondP.innerHTML && texts.includes(secondP.innerHTML)) {
                secondP.innerHTML = "";
                firstP.innerHTML = "";
                firstP.classList.add("hide-arrow");
            }
        }
        render();
    };

    document.getElementById(inputId)?.addEventListener("input", updateTip);
    document.getElementById(inputId.replace("Input", "Op"))?.addEventListener("change", updateTip);
}

// Inicializar tips
export function initTips() {
    const proteinTexts1 = [
        "Looking for a protein-rich breakfast? Cereals might not be the best place to start.",
        "Most cereals are great for carbs, but when it comes to protein… they fall short.",
        "If protein is your priority, you may want to look beyond the cereal bowl.",
        "Cereals are typically low in protein. Consider adding a side of eggs or yogurt to your breakfast.",
    ];
    createTip("proteinInput", "protein", "#tip-shelf-2", 5, 10, proteinTexts1, "", "<=");

    const proteinTexts2 = [
        "Did you notice how the middle shelf groups the lowest-protein cereals?",
        "You might spot a pattern: protein levels are lowest on the middle shelf.",
        "Take a closer look: cereals in the middle shelf contain very little protein.",
        "Looking for more protein? You may want to skip the middle shelf.",
    ];
    createTip("proteinInput", "protein", "#tip-shelf-2", 1,2, proteinTexts2, "←", "<=");

    const sugarTexts1 = [
        "At 8g of sugar or less, the middle shelf is nearly empty.",
        "With less sugar allowed, the middle shelf empties quickly.",
        "The middle shelf is dominated by higher-sugar cereals.",
        "Turns out, low sugar isn’t a middle-shelf thing.",
    ];
    createTip("sugarInput", "sugar", "#tip-shelf-2", 1,6, sugarTexts1, "←", "<=");

    const sugarTexts2 = [
    "7g of sugar is a sweet spot: the average for these cereals",
    "On average, a serving of these cereals has 7g of sugar and that’s about 30% of the daily recommended limit for adults.",
    "A typical portion of these cereals contributes roughly 1.5 teaspoons of sugar."
    ];
    createTip("sugarInput", "sugar", "#tip-shelf-2", 7,7, sugarTexts2, "", "=");
    

    const carboTexts1 = [
    "Low-carb cereals(mostly on shelf 3): these servings are likely higher in fiber or protein.",
    "Few cereals on shelf 3 have such low carbohydrate content per serving.",
    "Low-carb options are ideal if you’re looking for a lighter breakfast.",
    "Low-carb cereals are mostly on the bottom shelf and are a healthy choice often overlooked."
    ];
    createTip("carboInput", "carbo", "#tip-shelf-3", 4,10, carboTexts1, "←", "<=");
    
    const carboTexts2 = [
    "Most cereals fall into this moderate range of 11-17 g per serving.",
    "Typical breakfast cereals provide a moderate amount of carbohydrates.",
    "This range represents the most common carb content in cereals."
    ];
    createTip("carboInput", "carbo", "#tip-shelf-2", 12,17, carboTexts2, "");
    

    const carboTexts3 = [
    "There are high-carb cereals: these servings may give a quick energy boost.",
    "Some cereals exceed 17 g carbs per serving and are sweeter or more energy-dense options.",
    "Some cereals are high-carb and provide more energy, but also more sugar."
    ];
    createTip("carboInput", "carbo", "#tip-shelf-2", 17,30, carboTexts3, "");
}
