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


  })


  renderSelectedList()
}




