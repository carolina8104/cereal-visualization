import { brandColors } from "./brandColors.js"

// Nutrient keys & labels
export const nutrientKeys = [
  "calories","protein","fat","carbo","sugars","sodium","potass","vitamins"
]
export const nutrientLabels = [
  "Calories","Protein","Fat","Carbs","Sugar","Sodium","Potassium","Vitamins"
]

export const milkNutrition = {
  name: "Milk",
  calories: 42,  // per 100ml
  protein: 3.4,
  fat: 1,
  carbo: 5,
  sugars: 5,
  sodium: 50,
  potass: 150,
  vitamins: 5
}

// Max values per nutrient for scaling
  const maxValues = {
    calories: 600,  
    protein: 15,   
    fat: 12,       
    carbo: 90,      
    sugars: 40,   
    sodium: 375,     
    potass: 600,     
    vitamins: 150   
  }


export function getRecommended(cereal) {
  const gramsPerServing = cereal.weight ? cereal.weight*28.3495 : cereal.cups ? cereal.cups*240 : 30
  return nutrientKeys.map(k => cereal[k] || 0);
}

export function getRecommendedMilk() {
  // Dose recomendada de leite: 200ml (padrão)
  const recommendedMlMilk = 200
  const factor = recommendedMlMilk / 100
  return nutrientKeys.map(k => milkNutrition[k] * factor || 0)
}

export function getTotalNutrients(bowlCereals, milkAmount = 0) {
  const cerealTotals = nutrientKeys.map(k => 
    bowlCereals.reduce((sum, c) => {
      const gramsPerServing = c.weight ? c.weight*28.3495 : c.cups ? c.cups*240 : 30
      const factor = c.amount / gramsPerServing
      return sum + (c[k] || 0) * factor
    }, 0)
  )

  if (milkAmount > 0) {
    const factor = milkAmount / 100 // milkNutrition per 100ml
    nutrientKeys.forEach((k,i)=>{
      cerealTotals[i] += milkNutrition[k] * factor || 0
    })
  }

  // Clamp to max values
  nutrientKeys.forEach((k,i)=>{
    if (cerealTotals[i] > maxValues[k]) cerealTotals[i] = maxValues[k]
  })

  return cerealTotals
}

export function drawRadar(bowlCereals, savedCereals, milkAmount = 0, mode = "total", selectedId = null) {

  const chartDiv = d3.select("#radarChart")
  chartDiv.selectAll("*").remove()

  const width = chartDiv.node().clientWidth || 250
  const height = chartDiv.node().clientHeight || 250
  const radius = Math.min(width, height) / 2 - 20
  const angleSlice = (2*Math.PI) / nutrientKeys.length

  const svg = chartDiv.append("svg")
    .attr("width", width)
    .attr("height", height + 60)
    .append("g")
    .attr("transform", `translate(${width/2},${height/2 + 30})`)

  const radarLine = d3.lineRadial()
    .radius((d,i)=> d)
    .angle((d,i)=> i*angleSlice)
    .curve(d3.curveCardinalClosed)

  // ---------- AXIS + GRID ----------
  nutrientKeys.forEach((k,i)=>{
    const angle = i*angleSlice - Math.PI/2
    svg.append("line")
      .attr("x1",0).attr("y1",0)
      .attr("x2",Math.cos(angle)*radius)
      .attr("y2",Math.sin(angle)*radius)
      .attr("stroke","#4b4b4b57")
  })

  for(let l=1;l<=4;l++){
    svg.append("circle")
      .attr("r", (radius/4)*l)
      .attr("fill","none")
      .attr("stroke","#4b4b4b57")

  }

  // Helper: convert nutrient values to radial distances
  function scaleValues(arr) {
    return arr.map((v,i)=>{
      return (v / maxValues[nutrientKeys[i]]) * radius
    })
  }

  // ---------- MODE: ALL ----------
  // if (mode === "all") {
    bowlCereals.forEach(c => {
      const gramsPerServing = c.weight ? c.weight*28.3495 : c.cups ? c.cups*240 : 30
      const factor = c.amount / gramsPerServing

      let data = nutrientKeys.map(k => (c[k] || 0) * factor)

      // CLAMP INDIVIDUAL CEREAL
      data = data.map((v, i) => Math.min(v, maxValues[nutrientKeys[i]]))

      const scaled = scaleValues(data)

      const color = brandColors[c.mfr] || {r:120,g:120,b:200}

      svg.append("path")
        .datum(scaled)
        .attr("d", radarLine)
        .attr("fill",`rgba(${color.r},${color.g},${color.b},0.35)`)
        .attr("stroke",`rgb(${color.r},${color.g},${color.b})`)
        .attr("stroke-width",2);
    })

    // Add MILK
    if (milkAmount > 0) {
      const factor = milkAmount / 100
      let milkData = nutrientKeys.map(k => milkNutrition[k] * factor)

      // CLAMP MILK TOO
      milkData = milkData.map((v, i) => Math.min(v, maxValues[nutrientKeys[i]]))

      const scaled = scaleValues(milkData)

      svg.append("path")
        .datum(scaled)
        .attr("d", radarLine)
        .attr("fill","rgba(255,255,255,0.35)")
        .attr("stroke","white")
        .attr("stroke-width",2)
    }
  // }

  // ---------- MODE: DOSE ----------
  if (mode === "dose" && selectedId) {

    if (selectedId === "milk") {
      // Mostrar dose recomendada do leite
      const recommendedMilk = getRecommendedMilk()
      const scaled = scaleValues(recommendedMilk)

      svg.append("path")
        .datum(scaled)
        .attr("d", radarLine)
        .attr("fill","rgba(150,150,150,0.25)")
        .attr("stroke","gray")
        .attr("stroke-width",2)
    } else {
      // Mostrar dose do cereal
      const cereal = savedCereals.find(c => c.id == selectedId);
      if (!cereal) return;

      const recommended = getRecommended(cereal)
      const scaled = scaleValues(recommended)

      svg.append("path")
        .datum(scaled)
        .attr("d", radarLine)
        .attr("fill","rgba(150,150,150,0.25)")
        .attr("stroke","gray")
        .attr("stroke-width",2)
    }
  }

  // ---------- MODE: TOTAL ----------

  // ---------- MODE: TOTAL ----------
  if (mode === "total") {
    const totalData = getTotalNutrients(bowlCereals, milkAmount)
    const scaled = scaleValues(totalData)

    svg.append("path")
      .datum(scaled)
      .attr("d", radarLine)
      .attr("fill","rgba(128,0,128,0.25)")
      .attr("stroke","purple")
      .attr("stroke-width",3)
  }

  // ---------- LABELS ----------
  nutrientKeys.forEach((k,i)=>{
    const angle = i*angleSlice - Math.PI/2;

    // Combined label at the end
    const labelGroup = svg.append("text")
      .attr("x", Math.cos(angle)*(radius+20))
      .attr("y", Math.sin(angle)*(radius+20))
      .attr("text-anchor","middle")
      .attr("font-size","10px")

    labelGroup.append("tspan")
      .text(nutrientLabels[i])

    labelGroup.append("tspan")
      .attr("x", Math.cos(angle)*(radius+20))
      .attr("dy", "14")
      .text(`(max ${maxValues[k]})`)
  })
}
