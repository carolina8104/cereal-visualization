export const filters = {
    kcalMax: null,
    sugarMax: null,
    proteinMax: null,
    carboMax: null,
    fatMax: null,
    fiberMax: null,
    mfr: [],
    order: "none",
    potassiumMax: null, 
    sodiumMax: null,     
}

// função para atualizar filtros quando o user muda inputs
export function updateFilter(key, value) {
    if (value === "" || value === null) {
        filters[key] = null
    } else {
        filters[key] = Number(value)
    }
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


export function applyFilters(data) {
    let filtered = data.filter(d => {

        if (filters.kcalMax !== null && d.calories > filters.kcalMax) return false
        if (filters.sugarMax !== null && d.sugars > filters.sugarMax) return false
        if (filters.proteinMax !== null && d.protein > filters.proteinMax) return false
        if (filters.carboMax !== null && d.carbo > filters.carboMax) return false
        if (filters.fatMax !== null && d.fat > filters.fatMax) return false
        if (filters.fiberMax !== null && d.fiber > filters.fiberMax) return false

        if (filters.potassiumMax !== null && d.potass > filters.potassiumMax) return false
        if (filters.sodiumMax !== null && d.sodium > filters.sodiumMax) return false


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
        filtered.sort((a, b) => b.calories - a.calories)
    } else if (filters.order === "fat-asc") {
        filtered.sort((a, b) => a.calories - b.calories)
    } else if (filters.order === "sugar-desc") {
        filtered.sort((a, b) => b.calories - a.calories)
    } else if (filters.order === "sugar-asc") {
        filtered.sort((a, b) => a.calories - b.calories)
    }

    return filtered
}




const filterButton = document.querySelector(".hideFilter");
const filters_box = document.querySelector("#filters");

filterButton.addEventListener("click", () => {
  filters_box.classList.toggle("hidden");
});
