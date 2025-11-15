export const filters = {
    kcalMax: 600,
    sugarMax: 20,
    proteinMax: 20,
    carbsMax: 100,
    fatMax: 20,
    fibreMax: 10,
    brand: "all",
    order: "none"
}

export function applyFilters(data) {
    let filtered = data.filter(d => {
        if (d.calories > filters.kcalMax) return false
        if (d.sugars > filters.sugarMax) return false
        if (d.protein > filters.proteinMax) return false
        if (d.carbs > filters.carbsMax) return false
        if (d.fat > filters.fatMax) return false
        if (d.fibre > filters.fibreMax) return false
        if (filters.brand !== "all" && d.brand !== filters.brand) return false
        return true;
    })

    if(filters.order === "protein-asc"){
        filtered.sort((a,b) => a.protein - b.protein)
    } else if(filters.order === "protein-desc"){
        filtered.sort((a,b) => b.protein - a.protein)
    } else if(filters.order === "kcal-desc"){
        filtered.sort((a,b) => b.calories - a.calories)
    } else if(filters.order === "kcal-asc"){
        filtered.sort((a,b) => a.calories - b.calories)
    }

    return filtered
}