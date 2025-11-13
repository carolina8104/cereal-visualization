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
  filters.sugarMax = Math.ceil(d3.median(data, d => d.sugar) || 10)
  filters.proteinMax = Math.ceil(d3.median(data, d => d.protein) || 6)

  initScales()
  applyFiltersAndRender()
})

function initScales(){
  const kcalExtent = d3.extent(data, d => d.calories)
  const fatExtent = d3.extent(data, d => d.fat)
  const sugarExtent = d3.extent(data, d => d.sugar)
  const proteinExtent = d3.extent(data, d => d.protein)

  heightScale = d3.scaleLinear()
    .domain(kcalExtent)
    .range([70, 250]) 
    .clamp(true)

  widthScale = d3.scaleLinear()
    .domain(fatExtent)
    .range([20, 60])
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
    if (d.sugar > filters.sugarMax) return false
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
        const light = sugarColorScale(d.sugar)
        return `hsl(15 80% ${light}%)`
      })

    merged.select(".protein-bar")
      .transition().duration(300)
      .style("height", d => proteinScale(d.protein) + "px")
  })

  renderSelectedList()
}




