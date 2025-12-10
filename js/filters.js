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


    const proteinTexts3 = [
        "Notice the pattern? More protein is on the bottom shelf.",
        "For a filling breakfast, look to the lower shelf — it’s higher in protein.",
        "Protein-packed cereals are mostly hiding on the bottom shelf.",
        "Looking for protein? Check the bottom shelf.",
    ];
    createTip("proteinInput", "protein", "#tip-shelf-2", 2,3, proteinTexts3, "↓", ">=");


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
    
    const sugarTexts3 = [
    "Cereals are generally sweetened, so sugar-free options are few.",
    "Almost all these cereals have sugar, so truly sugar-free options are rare.",
    "Looking for very low-sugar cereals? Most of these won’t meet that goal."
    ];
    createTip("sugarInput", "sugar", "#tip-shelf-2", 1,3, sugarTexts3, "", ">=");

    const sugarTexts4 = [
    "Notice how the bottom shelf emptied first? These cereals have the least sugar.",
    "Looking for higher sugar cereals? The bottom shelf cleared quickly, since its options are lower in sugar.",
    "Cereals on the lower shelf disappeared first: they’re lower in sugar than the rest."
    ];
    createTip("sugarInput", "sugar", "#tip-shelf-3", 7,9, sugarTexts4, "←", ">=");

    const carboTexts1 = [
    "Low-carb cereals(mostly on shelf 3): these servings are likely higher in fiber or protein.",
    "Few cereals on shelf 3 have such low carbohydrate content per serving.",
    "Low-carb options are ideal if you’re looking for a lighter breakfast.",
    "Low-carb cereals are mostly on the bottom shelf and are a healthy choice often overlooked."
    ];
    createTip("carboInput", "carbo", "#tip-shelf-3", 5, 10, carboTexts1, "←", "<=");
    
    const carboTexts2 = [
    "Most cereals fall into this moderate range of 11-17 g per serving.",
    "Typical breakfast cereals provide a moderate amount of carbohydrates.",
    "This range represents the most common carb content in cereals."
    ];
    createTip("carboInput", "carbo", "#tip-shelf-2", 12,17, carboTexts2, "", "<=");

    const carboTexts3 = [
    "There are high-carb cereals: these servings may give a quick energy boost.",
    "Some cereals exceed 17 g carbs per serving and are sweeter or more energy-dense options.",
    "Some cereals are high-carb and provide more energy, but also more sugar."
    ];
    createTip("carboInput", "carbo", "#tip-shelf-2", 17,24, carboTexts3, "", ">=");

    const carboTexts4 = [
    "Cereals typically contain moderate to high amounts of carbs, making very low-carb choices uncommon.",
    "If you’re aiming for a low-carb breakfast, note that most cereals are naturally carb-rich.",
    "Looking for cereals very low in carbs? Most breakfast cereals are naturally high in carbohydrates."
    ];
    createTip("carboInput", "carbo", "#tip-shelf-2", 5,9, carboTexts4, "", ">=");


    const fiberTexts1 = [
    "Looking for more fiber? Check the cereals on the lower shelf.",
    "Notice? The lower shelf has the cereals packed with fiber.",
    "The bottom shelf is where you’ll find the high-fiber option."
    ];
    createTip("fiberInput", "fiber", "#tip-shelf-3", 3,10, fiberTexts1, "←", ">=");

    const fiberTexts2 = [
    "Most cereals are relatively low in fiber, offering limited digestive benefits.",
    "The upper shelves are dominated by cereals low in fiber.",
    "Fiber-rich foods are usually whole or less processed — these cereals are not.",
    "Notice how most low-fiber cereals appear at eye level or above."
    ];
    createTip("fiberInput", "fiber", "#tip-shelf-2", 0,3, fiberTexts2, "", "<=");


    const fatTexts1 = [
    "The upper shelves are dominated by cereals low in fiber.",
    "Contrary to what we might expect, most cereals are low in fat: cereals are made from grains, which are naturally low in fat",
    "Not much fat?! Most of their calories come from carbohydrates rather than fat.",
    "Despite being processed, cereals remain low in fat."
    ];
    createTip("fatInput", "fat", "#tip-shelf-2", 2, 4, fatTexts1, "", ">=");

    const fatTexts2 = [
    "Did you notice that cereals with less fat also tend to have fewer calories?",
    "Lower fat cereals tend to be lower in calories due to fat’s high energy density.",
    "Yes... cereal can be low in fat while still containing refined grains and added sugars."
    ];
    createTip("fatInput", "fat", "#tip-shelf-2", 1,2, fatTexts2, "", "<=");

    const PotassiumTexts1 = [
    "Potassium helps with muscle function, and these cereals contribute a small part.",
    "Moderate potassium cereals may pair well with milk for extra minerals.",
    ];
    createTip("potassInput", "potassium", "#tip-shelf-2", 100,200, PotassiumTexts1, "", "<=");

    const PotassiumTexts2 = [
    "High-potassium cereals are rare but usually contain whole grains or nuts.",
    "If you’re looking to boost potassium intake, consider fruits, vegetables, or nuts alongside cereal.",
    ];
    createTip("potassInput", "potassium", "#tip-shelf-3", 200,300, PotassiumTexts2, "", ">=");

    const SodiumTexts1 = [
    "Some cereals provide over 10% of your daily sodium limit in one serving.",
    "Sodium is used for flavor and preservation, so it’s higher than you might think.",
    "High-sodium cereals are common; keep an eye on portion size."
    ];
    createTip("sodiumInput", "sodium", "#tip-shelf-2", 200,300, SodiumTexts1, "", "<=");

    const SodiumTexts2 = [
    "These cereals are rare: most cereals have more sodium than this.",
    "Low-sodium cereals are exceptions; most options contain a fair amount of salt.",
    ];
    createTip("sodiumInput", "sodium", "#tip-shelf-2", 0,50, SodiumTexts2, "", "<=");

    const CaloriesTexts1 = [
    "Low-calorie cereals are rare; most options provide more energy per serving.",
    "These cereals are ideal if you want a lighter breakfast, but check sugar and fiber too.",
    ];
    createTip("kcalInput", "calories", "#tip-shelf-3", 0,80, CaloriesTexts1, "", "<=");

    const CaloriesTexts2 = [
    "Most cereals fall in this range, contributing a moderate amount of energy.",
    "A single serving adds to your daily caloric intake, especially with milk or toppings.",
    "Calories can be moderate even if sugar is high—check the nutrition facts",
    ];
    createTip("kcalInput", "calories", "#tip-shelf-2", 90,120, CaloriesTexts2, "", "<=");

    const CaloriesTexts3 = [
    "High-calorie cereals often combine sugar, fat, and carbs for energy-dense servings.",
    "Even small portions can quickly add up, so portion control matters.",
    "Don’t be fooled: bottom-shelf cereals can be calorie-rich, but these calories come from beneficial nutrients like fiber and protein.",
    "Some of the highest-calorie cereals are on the bottom shelf, mainly due to their high fiber and protein content",
    ];
    createTip("kcalInput", "calories", "#tip-shelf-3", 120,150, CaloriesTexts3, "", ">=");

}
