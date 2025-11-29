import { updateCartSummary } from "./cart.js"
import { brandColors, brandColors_bar } from "./brandColors.js"
import { heightScale, widthScale, sugarColorScale, proteinScale } from "./scales.js"

export function openModal(cerealData) {
    const modal = document.getElementById("cerealModal")
    const modalName = document.getElementById("modalName")
    const modalNutrition = document.getElementById("modalNutrition")
    const modalRating = document.getElementById("modalRating")

    if (!modal || !modalNutrition || !modalName || !modalRating) {
        console.error("Modal elements not found!")
        return
    }

     //------------------------------------------------------------------------iNICIO DA CAIXA 



     
    //------------------------------------------------------------------------FIM DA CAIXA 

    cerealData = cerealData || {}
    modalName.textContent = cerealData.name || "Cereal"

    // Funções utilitárias
    function safeNum(v) { return Number.isFinite(Number(v)) ? Number(v) : 0 }
    function format(v) { return Math.abs(v) >= 1 ? Math.round(v) : Math.round(v * 10) / 10 }
    function nutritionRow(name, per100g, perDose) {
        return `<div class="row">
            <span class="label">${name}</span>
            <span class="value">${per100g}</span>
            <span class="value">${perDose}</span>
        </div>`
    }

    // Calcula rating em estrelas
    const starsTotal = 10
    const ratingPercent = safeNum(cerealData.rating);
    const starFraction = (ratingPercent / 100) * starsTotal

    modalRating.innerHTML = ""
    for (let i = 0; i < starsTotal; i++) {
        const span = document.createElement("span")
        const fill = Math.min(Math.max(starFraction - i, 0), 1)
        span.style.setProperty("--fill", fill)
        span.style.setProperty("width", "1em")
        span.style.setProperty("position", "relative")
        span.innerHTML = `<span style="width:${fill*100}%; overflow:hidden; display:inline-block; position:absolute; color:black;">★</span>★`
        modalRating.appendChild(span)
    }

    const dose = {
        calories: safeNum(cerealData.calories),
        protein: safeNum(cerealData.protein),
        fat: safeNum(cerealData.fat),
        sodium: safeNum(cerealData.sodium),
        fiber: safeNum(cerealData.fiber),
        carbs: safeNum(cerealData.carbo),
        sugars: safeNum(cerealData.sugars),
        potass: safeNum(cerealData.potass),
        vitamins: safeNum(cerealData.vitamins)
    }

    let servingGrams = 0
    if (cerealData.weight) {
        servingGrams = safeNum(cerealData.weight) * 28.3495 // oz -> g
    } else if (cerealData.cups) {
        servingGrams = parseFloat(cerealData.cups) * 240 // fallback 1 cup ~ 240g
        console.warn("Weight ausente: inferido servingGrams a partir de cups (fallback).")
    } else {
        servingGrams = 30; // fallback padrão
        console.warn("Weight e cups ausentes: usado fallback 30g por serving.")
    }

    const factor = 100 / servingGrams

    // Calcula per100g
    const per100g = {}
    for (let k in dose) {
        per100g[k] = format(dose[k] * factor) + (k === "sodium" || k === "potass" ? (dose[k] ? " mg" : "") : "")
    }

    const doseStrings = {
        calories: format(dose.calories) + " kcal",
        fat: format(dose.fat) + " g",
        carbs: format(dose.carbs) + " g",
        sugars: format(dose.sugars) + " g",
        fiber: format(dose.fiber) + " g",
        protein: format(dose.protein) + " g",
        sodium: format(dose.sodium) + " mg",
        potass: format(dose.potass) + " mg",
        vitamins: format(dose.vitamins)
    }

    // Monta HTML da tabela nutricional
    modalNutrition.innerHTML = `
    <div class="nutrition-facts">
        <h2>Nutrition Facts</h2>
        <p class="serving">Serving Size: ${cerealData.cups || 0} cups (${Math.round(servingGrams)} g)</p>
        <div class="line thick"></div>

        <div class="row header">
            <span class="label"></span>
            <span class="value">Per 100g</span>
            <span class="value">Per Dose</span>
        </div>

        ${nutritionRow("Calories", per100g.calories || "0 kcal", doseStrings.calories)}
        ${nutritionRow("Total Fat", per100g.fat || "0 g", doseStrings.fat)}
        ${nutritionRow("Carbohydrates", per100g.carbs || "0 g", doseStrings.carbs)}
        ${nutritionRow("Sugars", per100g.sugars || "0 g", doseStrings.sugars)}
        ${nutritionRow("Fiber", per100g.fiber || "0 g", doseStrings.fiber)}
        ${nutritionRow("Protein", per100g.protein || "0 g", doseStrings.protein)}
        ${nutritionRow("Sodium", per100g.sodium || "0 mg", doseStrings.sodium)}
        ${nutritionRow("Potassium", per100g.potass || "0 mg", doseStrings.potass)}
        ${nutritionRow("Vitamins", per100g.vitamins || "0", doseStrings.vitamins)}

        <div class="line thick"></div>
        <p class="note">*Percent Daily Values are based on a 2,000 calorie diet.</p>
    </div>`

    // Mostra modal
    modal.style.display = "flex"

    // Botão "Yes" para adicionar ao carrinho
    const yesButton = modal.querySelector(".yes")
    if (yesButton) yesButton.onclick = () => {
        let savedCereals = JSON.parse(localStorage.getItem("savedCereals")) || [];

        // Limite máximo 5 cereais
        if (savedCereals.length >= 5) {
            let maxMessage = document.getElementById("maxCerealMessage");
            if (!maxMessage) {
                maxMessage = document.createElement("p")
                maxMessage.id = "maxCerealMessage"
                document.getElementById("popup").appendChild(maxMessage)
            }
            maxMessage.textContent = "You can only add up to 5 cereals!"
            return
        } else {
            const maxMessage = document.getElementById("maxCerealMessage")
            if (maxMessage) maxMessage.style.display = "none"
        }

        if (!savedCereals.some(c => c.name === cerealData.name)) {
            savedCereals.unshift(cerealData)
        }

        localStorage.setItem("savedCereals", JSON.stringify(savedCereals))

        createFlyingBoxAnimation(cerealData)

        modal.style.display = "none"
        updateCartSummary()
    }

    // Fechar modal
    const modalCloseButton = modal.querySelector(".no")
    if (modalCloseButton) modalCloseButton.onclick = () => modal.style.display = "none"

    window.addEventListener("click", e => {
        if (e.target === modal) modal.style.display = "none"
    })
}


let availableLefts = [70, 75, 80, 82, 90];

export function createFlyingBoxAnimation(cerealData) {
    const box = document.createElement("div");
    box.classList.add("flying-box");

    box.style.width = widthScale(cerealData.fat) + "px";
    box.style.height = heightScale(cerealData.calories) + "px";

    box.style.bottom = "70vh";

    if (availableLefts.length === 0) availableLefts = [70, 75, 80, 85, 90];
    const index = Math.floor(Math.random() * availableLefts.length);
    const leftValue = availableLefts.splice(index, 1)[0];
    box.style.left = leftValue + "vw";

    box.dataset.cerealId = cerealData.id;

    const colorObj = brandColors && brandColors[cerealData.mfr] ? brandColors[cerealData.mfr] : null;
    const colorStr = colorObj ? `rgb(${colorObj.r}, ${colorObj.g}, ${colorObj.b})` : "gray";
    box.style.backgroundColor = colorStr;

    document.body.appendChild(box);

    setTimeout(() => {
        box.style.bottom = "17vh";
    }, 50);

    let flyingBoxes = JSON.parse(localStorage.getItem("flyingBoxes")) || [];
    flyingBoxes.push({
        id: cerealData.id,
        width: box.style.width,
        height: box.style.height,
        left: box.style.left,
        bottom: box.style.bottom,
        color: colorObj 
    });
    localStorage.setItem("flyingBoxes", JSON.stringify(flyingBoxes));
}


export function renderFlyingBoxesFromStorage() {
    const flyingBoxes = JSON.parse(localStorage.getItem("flyingBoxes")) || [];
    flyingBoxes.forEach(b => {
        const box = document.createElement("div");
        box.classList.add("flying-box");
        box.style.width = b.width;
        box.style.height = b.height;
        box.style.left = b.left;
        box.style.bottom = "15vh"; 
        box.dataset.cerealId = b.id;

        if (b.color) {
            box.style.backgroundColor = `rgb(${b.color.r}, ${b.color.g}, ${b.color.b})`;
        } else {
            box.style.backgroundColor = "gray";
        }

        document.body.appendChild(box);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderFlyingBoxesFromStorage();
    updateCartSummary();
});
