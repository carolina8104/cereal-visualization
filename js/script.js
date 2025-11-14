document.getElementById("doneButton").addEventListener("click", function() {
  window.location.href = "bowl.html";
})

const DATA_PATH = "../data/data.json"
let data = []
let heightScale, widthScale, sugarColorScale, proteinScale

let selected = new Set();

const filters = {
  kcalMax: 600,
  sugarMax: 20,
  proteinMax: 20,
  carbsMax: 100,
  fatMax: 20,
  fibreMax: 10,
  brand: "all",
  order: "none"
};

const shelf = {
  1: d3.select("#shelf-1"),
  2: d3.select("#shelf-2"),
  3: d3.select("#shelf-3")
}

const brandColors = { 
"A": {r:150, g:250, b:100},  
"G": {r:70, g:100, b:194}, 
"K": {r:218, g:53, b:53},  
"N": {r:214, g:110, b:19},  
"P": {r:153, g:110, b:254}, 
"Q": {r:240, g:203, b:16},  
"R": {r:196, g:129, b:222},  
};

const brandColors_bar = {
"A": {r:245, g:209, b:209},
"G": {r:245, g:209, b:209},
"K": {r:245, g:209, b:209},
"N": {r:12, g:33, b:171},
"P": {r:245, g:209, b:209},
"Q": {r:69, g:44, b:10},
"R": {r:245, g:209, b:209},
};

const calValueEl = d3.select("#cal-value")
const sugarValueEl = d3.select("#sugar-value")
const proteinValueEl = d3.select("#protein-value")
const carbsValueEl = d3.select("#carbs-value")
const fatValueEl = d3.select("#fat-value")
const fibreValueEl = d3.select("#fibre-value")

d3.json(DATA_PATH).then(arr => {
  data = arr

  const kcalMax = d3.max(data, d => d.calories) || 500
  filters.kcalMax = Math.round(kcalMax)
  filters.sugarMax = d3.max(data, d => d.sugars);
filters.proteinMax = d3.max(data, d => d.protein);

  initScales()
  applyFiltersAndRender()
})

function initScales(){
  const kcalExtent = d3.extent(data, d => d.calories)
  const fatExtent = d3.extent(data, d => d.fat)
  const sugarExtent = d3.extent(data, d => d.sugars)
  const proteinExtent = d3.extent(data, d => d.protein)

  heightScale = d3.scaleLinear()
    .domain(kcalExtent)
    .range([55, 200]) 
    .clamp(true)

  widthScale = d3.scaleLinear()
    .domain(fatExtent)
    .range([20, 55])
    .clamp(true)

  sugarColorScale = d3.scaleLinear()
    .domain(sugarExtent)
    .range([70, 30]) 
    .clamp(true);

  proteinScale = d3.scaleLinear()
    .domain(proteinExtent)
    .range([3, 14]) 
    .clamp(true)
}
function applyFiltersAndRender(){

  let filtered = data.filter(d => {
    if (d.calories > filters.kcalMax) return false
    if (d.sugars > filters.sugarMax) return false
    if (d.protein > filters.proteinMax) return false
    if (d.carbs > filters.carbsMax) return false
    if (d.fat > filters.fatMax) return false
    if (d.fibre > filters.fibreMax) return false
    if (filters.brand !== "all" && d.brand !== filters.brand) return false
    return true
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

  [1,2,3].forEach(shelfNum => {

    const shelfData = filtered.filter(d => d.shelf === shelfNum);

    const sel = shelf[shelfNum] 
      .selectAll(".cereal")
      .data(shelfData, d => d.id);

    sel.exit().remove();

    const enter = sel.enter()
      .append("div")
      .attr("class", "cereal")
      .style("opacity", 0);

    enter.append("div").attr("class", "protein-bar");
    enter.append("div").attr("class", "name-vertical").text(d => d.name);

    const merged = enter.merge(sel);

    merged.transition()
      .duration(450)
      .style("opacity", 1)
      .style("height", d => heightScale(d.calories) + "px") 
      .style("width", d => widthScale(d.fat) + "px")
      .style("background", d => {
          const c = brandColors[d.mfr];

          // alpha entre 0.7 (pouco açúcar) e 1 (muito açúcar)
          const minAlpha = 0.6;
          const maxAlpha = 1;

          // normaliza sugars entre 0 e 1 usando o máximo da escala
          const normalized = d.sugars / sugarColorScale.domain()[1];

          const alpha = minAlpha + (maxAlpha - minAlpha) * normalized;

          return `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
      })

      merged.select(".protein-bar")
      .transition().duration(300)
      .style("height", d => proteinScale(d.protein) + "px")
      .style("background", d => {
      const c = brandColors_bar[d.mfr]; 
      return `rgba(${c.r}, ${c.g}, ${c.b}, 1)`; 
      });

      merged.select(".name-vertical")
      .style("color", d => {
      const c = brandColors_bar[d.mfr]; 
      return `rgba(${c.r}, ${c.g}, ${c.b}, 1)`; 
      });
    
      merged.on("click", (event, d) => {
        openModal(d);
      });

  })
}

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("cerealModal");
  const modalClose = document.getElementById("modalClose");
  const modalCloseButton = document.getElementById("modalCloseButton");
  const modalName = document.getElementById("modalName");
  const modalNutrition = document.getElementById("modalNutrition");

  if (!modal || !modalNutrition || !modalName) {
    console.error("Modal elements not found. Verifica os IDs: cerealModal, modalNutrition, modalName.");
    return;
  }

  function safeNum(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  function format(v) {
    // mostra inteiro quando >=1, uma casa decimal quando <1
    return (Math.abs(v) >= 1) ? Math.round(v) : Math.round(v * 10) / 10;
  }

  function nutritionRow(name, per100g, perDose) {
    return `
      <div class="row">
        <span class="label">${name}</span>
        <span class="value">${per100g}</span>
        <span class="value">${perDose}</span>
      </div>`;
  }

  function openModal(cerealData) {
    // defensivas
    cerealData = cerealData || {};
    modalName.textContent = cerealData.name || "Cereal";

    // Dados por dose (os valores do dataset)
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
    };

    // Determina gramos por dose:
    // dataset de cereais costuma usar "weight" em ounces por serving.
    let servingGrams = 0;
    if (cerealData.weight) {
      servingGrams = safeNum(cerealData.weight) * 28.3495; // oz -> g
    } else if (cerealData.cups) {
      // fallback: tenta inferir (assume 1 cup ~ 240 g) — APENAS fallback
      servingGrams = parseFloat(cerealData.cups) * 240;
      console.warn("weight ausente: inferido servingGrams a partir de cups (fallback).");
    } else {
      // default: 30g
      servingGrams = 30;
      console.warn("weight e cups ausentes: usado fallback 30g por serving.");
    }

    // factor para converter valores por dose -> por 100g
    const factor = 100 / servingGrams;

    // calcula per100g com formatação
    const per100g = {};
    for (let k in dose) {
      per100g[k] = format(dose[k] * factor) + (k === "sodium" || k === "potass" ? (dose[k] ? " mg" : "") : "");
    }

    // prepara strings por dose (com unidades)
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
    };

    // monta HTML (duas colunas: Per 100g | Per Dose)
    modalNutrition.innerHTML = `
      <div class="nutrition-facts">
        <h2>Nutrition Facts</h2>
        <p class="serving">Serving Size: ${cerealData.cups} cups (${Math.round(cerealData.weight * 28.35)} g)</p>
        <div class="line thick"></div>

        <div class="row header">
          <span class="label"></span>
          <span class="value">Per 100g</span>
          <span class="value">Per Dose</span>
        </div>

        ${nutritionRow("Calories", per100g.calories ? per100g.calories + " kcal" : "0 kcal", doseStrings.calories)}
        ${nutritionRow("Total Fat", per100g.fat ? per100g.fat : "0 g", doseStrings.fat)}
        ${nutritionRow("Carbohydrates", per100g.carbs ? per100g.carbs : "0 g", doseStrings.carbs)}
        ${nutritionRow("Sugars", per100g.sugars ? per100g.sugars : "0 g", doseStrings.sugars)}
        ${nutritionRow("Fiber", per100g.fiber ? per100g.fiber : "0 g", doseStrings.fiber)}
        ${nutritionRow("Protein", per100g.protein ? per100g.protein : "0 g", doseStrings.protein)}
        ${nutritionRow("Sodium", per100g.sodium ? per100g.sodium : "0 mg", doseStrings.sodium)}
        ${nutritionRow("Potassium", per100g.potass ? per100g.potass : "0 mg", doseStrings.potass)}
        ${nutritionRow("Vitamins", per100g.vitamins ? per100g.vitamins : "0", doseStrings.vitamins)}

        <div class="line thick"></div>
        <p class="note">
          *Percent Daily Values are based on a 2,000 calorie diet.
        </p>
      </div>
    `;

    // mostra modal (assegura que existe estilo para display flex)
    modal.style.display = "flex";
  }

  // expos para uso externo (ex: chamar no console)
  window.openModal = openModal;

  // handlers de fechar (seguro: só atribui se os elementos existem)
  if (modalClose) modalClose.onclick = () => modal.style.display = "none";
  if (modalCloseButton) modalCloseButton.onclick = () => modal.style.display = "none";

  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
});
