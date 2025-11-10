// app.js - usa D3 para escalas + binding
const DATA_PATH = "../data/data.json";

let data = [];
let filtered = [];
let selected = new Set();

// filtro default values (these will be adjusted via arrows)
const filters = {
  kcalMax: 500, // default shown in cal-value
  sugarMax: 30,
  proteinMax: 30,
  carbsMax: 100,
  fatMax: 30,
  fibreMax: 30,
  brand: "all",
  order: "none"
};

// passos para cada nutriente quando clicas arrow
const steps = {
  kcal: 10,
  sugar: 1,
  protein: 1,
  carbs: 5,
  fat: 1,
  fibre: 1
};

// D3 scales - serão criadas após carregamento dos dados
let heightScale, widthScale, sugarColorScale, proteinScale;

// seletores
const shelfSel = {
  1: d3.select("#shelf-1"),
  2: d3.select("#shelf-2"),
  3: d3.select("#shelf-3")
};

const calValueEl = d3.select("#cal-value");
const sugarValueEl = d3.select("#sugar-value");
const proteinValueEl = d3.select("#protein-value");
const carbsValueEl = d3.select("#carbs-value");
const fatValueEl = d3.select("#fat-value");
const fibreValueEl = d3.select("#fibre-value");

const brandSelect = d3.select("#brand-select");
const orderSelect = d3.select("#order-select");
const selectedList = d3.select("#selected-list");

// fetch data and init
d3.json(DATA_PATH).then(arr => {
  data = arr;
  // set initial filters from data extents (nice defaults)
  const kcalMax = d3.max(data, d => d.kcal) || 500;
  filters.kcalMax = Math.round(kcalMax);
  filters.sugarMax = Math.ceil(d3.median(data, d => d.sugar) || 10);
  filters.proteinMax = Math.ceil(d3.median(data, d => d.protein) || 6);

  initScales();
  populateBrandOptions();
  wireControls();
  applyFiltersAndRender();
});

// cria escalas D3 baseadas nos dados
function initScales(){
  const kcalExtent = d3.extent(data, d => d.calories);
  const fatExtent = d3.extent(data, d => d.fat);
  const sugarExtent = d3.extent(data, d => d.sugar);
  const proteinExtent = d3.extent(data, d => d.protein);

  // altura: map kcal para px (min 70 - max 200)
  heightScale = d3.scaleLinear()
    .domain(kcalExtent)
    .range([70, 210]) // px height of box
    .clamp(true);

  // largura: map fat to px (min 36 - max 120)
  widthScale = d3.scaleLinear()
    .domain(fatExtent)
    .range([36, 120])
    .clamp(true);

  // sugar -> color lightness (hue fixed, lightness darker if more sugar)
  // use HSL: h=12 (orange), s=80%, l from 70% (low sugar) to 30% (high sugar)
  sugarColorScale = d3.scaleLinear()
    .domain(sugarExtent)
    .range([70, 30]) // lightness %
    .clamp(true);

  // protein thickness for the white stripe
  proteinScale = d3.scaleLinear()
    .domain(proteinExtent)
    .range([3, 14]) // px
    .clamp(true);
}

// popula brands no dropdown
function populateBrandOptions(){
  const brands = Array.from(new Set(data.map(d=>d.brand))).sort();
  brands.forEach(b => brandSelect.append("option").attr("value", b).text(b));
}

// liga eventos dos botões e selects
function wireControls(){
  // calories arrows
  d3.select("#cal-decr").on("click", ()=>{
    filters.kcalMax = Math.max(0, filters.kcalMax - steps.kcal);
    updateFilterUi();
    applyFiltersAndRender();
  });
  d3.select("#cal-incr").on("click", ()=>{
    filters.kcalMax = filters.kcalMax + steps.kcal;
    updateFilterUi();
    applyFiltersAndRender();
  });

  // nutrient arrows (they use data-nut attribute)
  d3.selectAll(".nut-decr").on("click", function(){
    const nut = d3.select(this).attr("data-nut");
    adjustNut(nut, -1);
  });
  d3.selectAll(".nut-incr").on("click", function(){
    const nut = d3.select(this).attr("data-nut");
    adjustNut(nut, +1);
  });

  brandSelect.on("change", function(){
    filters.brand = this.value;
    applyFiltersAndRender();
  });

  orderSelect.on("change", function(){
    filters.order = this.value;
    applyFiltersAndRender();
  });

  d3.select("#restart-btn").on("click", ()=> {
    // reset filters and selection
    selected.clear();
    filters.kcalMax = Math.round(d3.max(data, d=>d.kcal));
    filters.sugarMax = Math.ceil(d3.median(data, d=>d.sugar));
    filters.proteinMax = Math.ceil(d3.median(data, d=>d.protein));
    filters.carbsMax = 100; filters.fatMax = 30; filters.fibreMax = 30; filters.brand="all"; filters.order="none";
    brandSelect.property("value","all");
    orderSelect.property("value","none");
    updateFilterUi();
    applyFiltersAndRender();
    renderSelectedList();
  });

  d3.select("#done-btn").on("click", ()=> {
    const chosen = Array.from(selected);
    alert("Selected cereals IDs: " + chosen.join(", "));
  });

  updateFilterUi();
}

// ajusta valor de um nutriente
function adjustNut(nut, deltaDir){
  const step = steps[nut] || 1;
  const key = nut + "Max";
  filters[key] = Math.max(0, (filters[key] || 0) + deltaDir * step);
  updateFilterUi();
  applyFiltersAndRender();
}

function updateFilterUi(){
  calValueEl.text(`${filters.kcalMax} kcal`);
  sugarValueEl.text(`◄ ${filters.sugarMax}g ►`.replace("◄", "").replace("►",""));
  // But to match UI text pattern, update explicitly for all
  sugarValueEl.text(`◄ ${filters.sugarMax}g ►`);
  proteinValueEl.text(`◄ ${filters.proteinMax}g ►`);
  carbsValueEl.text(`◄ ${filters.carbsMax}g ►`);
  fatValueEl.text(`◄ ${filters.fatMax}g ►`);
  fibreValueEl.text(`◄ ${filters.fibreMax}g ►`);
}

// aplica filtros e faz o render (usa D3 data binding por prateleira)
function applyFiltersAndRender(){
  // build filtered array
  filtered = data.filter(d => {
    if (d.calories > filters.kcalMax) return false;
    if (d.sugar > (filters.sugarMax ?? 9999)) return false;
    if (d.protein > (filters.proteinMax ?? 9999)) return false;
    if (d.carbs && d.carbs > (filters.carbsMax ?? 9999)) return false;
    if (d.fat && d.fat > (filters.fatMax ?? 9999)) return false;
    if (d.fibre && d.fibre > (filters.fibreMax ?? 9999)) return false;
    if (filters.brand !== "all" && d.brand !== filters.brand) return false;
    return true;
  });

  // apply ordering if any
  if(filters.order === "protein-asc"){
    filtered.sort((a,b) => a.protein - b.protein);
  } else if(filters.order === "protein-desc"){
    filtered.sort((a,b) => b.protein - a.protein);
  } else if(filters.order === "kcal-desc"){
    filtered.sort((a,b) => b.calories - a.calories);
  } else if(filters.order === "kcal-asc"){
    filtered.sort((a,b) => a.calories - b.calories);
  }

  // render per shelf
  [1,2,3].forEach(shelfNum => {
    const shelfData = filtered.filter(d => d.shelf === shelfNum);

    // bind
    const sel = shelfSel[shelfNum].selectAll(".cereal")
      .data(shelfData, d => d.id);

    // EXIT
    sel.exit()
      .transition().duration(350)
      .style("opacity", 0)
      .remove();

    // ENTER
    const enter = sel.enter()
      .append("div")
      .attr("class", "cereal")
      .style("opacity", 0)
      .on("click", (event, d) => {
        // toggle selection
        if(selected.has(d.id)){
          selected.delete(d.id);
        } else {
          selected.add(d.id);
        }
        renderSelectedList();
        // toggle class with small transition
        d3.select(event.currentTarget).classed("selected", selected.has(d.id));
      })
      .each(function(d){
        // initial content: name vertical + protein bar + small kcal overlay
        const node = d3.select(this);
        node.append("div").attr("class","protein-bar");
        node.append("div").attr("class","name-vertical").text(d.name);
      });

    // ENTER + UPDATE (merge)
    const merged = enter.merge(sel);

    // compute styles with scales and transitions
    merged.transition().duration(450)
      .style("opacity", 1)
      .style("height", d => heightScale(d.kcal) + "px")
      .style("width", d => widthScale(d.fat) + "px")
      .style("background", d => {
        const light = sugarColorScale(d.sugar);
        // HSL(15,80%, light%)
        return `hsl(15 80% ${light}%)`;
      })
      .style("transform-origin", "bottom center")
      .style("margin-bottom", "6px");

    // update protein stripe thickness
    merged.select(".protein-bar")
      .transition().duration(350)
      .style("height", d => proteinScale(d.protein) + "px");

    // update selected class (in case selection changed externally)
    merged.classed("selected", d => selected.has(d.id));
  });

  renderSelectedList();
}

// atualiza lista no painel do carrinho
function renderSelectedList(){
  const items = Array.from(selected).map(id => data.find(d => d.id === id)).filter(Boolean);
  const li = selectedList.selectAll("li").data(items, d => d.id);

  li.exit().remove();
  const liEnter = li.enter().append("li").text(d => `${d.name} — ${d.kcal} kcal`);

  // merge - update text if needed
  liEnter.merge(li).text(d => `${d.name} — ${d.kcal} kcal`);
}
