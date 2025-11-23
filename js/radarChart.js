import { brandColors } from "./brandColors.js";

// Nutrient keys & labels
export const nutrientKeys = [
  "calories","protein","fat","carbo","sugars","sodium","potass","vitamins"
];
export const nutrientLabels = [
  "Calories","Protein","Fat","Carbs","Sugar","Sodium","Potassium","Vitamins"
];

// Max values per nutrient for scaling
export const maxValues = {
  calories: 400,  
  protein: 15, 
  fat: 10,      
  carbo: 80,      
  sugars: 20,       
  sodium: 500,    
  potass: 400,    
  vitamins: 100    
};

export function getRecommended(cereal) {
  const gramsPerServing = cereal.weight ? cereal.weight*28.3495 : cereal.cups ? cereal.cups*240 : 30;
  return nutrientKeys.map(k => cereal[k] || 0);
}

export function getTotalNutrients(bowlCereals) {
  return nutrientKeys.map(k => 
    bowlCereals.reduce((sum, c) => {
      const gramsPerServing = c.weight ? c.weight*28.3495 : c.cups ? c.cups*240 : 30;
      const factor = c.amount / gramsPerServing;
      return sum + (c[k] || 0) * factor;
    }, 0)
  );
}

export function drawRadar(bowlCereals, recommendedCereal) {
  const chartDiv = d3.select("#radarChart");
  chartDiv.selectAll("*").remove();

  const width = chartDiv.node().clientWidth || 250;
  const height = chartDiv.node().clientHeight || 250;
  const radius = Math.min(width, height) / 2 - 20;
  const angleSlice = (2*Math.PI) / nutrientKeys.length;

  const total = getTotalNutrients(bowlCereals);
  const recommended = getRecommended(recommendedCereal);

  // per-axis scale
  const scales = nutrientKeys.map(k => d3.scaleLinear().domain([0,maxValues[k] * 2]).range([0,radius]));

  const radarLine = d3.lineRadial()
    .radius((d,i)=> scales[i](d))
    .angle((d,i)=> i*angleSlice)
    .curve(d3.curveCardinalClosed);

  const svg = chartDiv.append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width/2},${height/2})`);

  // Draw axes
  nutrientKeys.forEach((k,i)=>{
    const angle = i*angleSlice - Math.PI/2;
    svg.append("line")
      .attr("x1",0).attr("y1",0)
      .attr("x2", Math.cos(angle)*radius)
      .attr("y2", Math.sin(angle)*radius)
      .attr("stroke","#ccc");
  });

  // Draw grid circles
  for(let lvl=1; lvl<=4; lvl++){
    const r = radius/4*lvl;
    svg.append("circle")
      .attr("cx",0).attr("cy",0)
      .attr("r",r)
      .attr("fill","none").attr("stroke","#eee");
  }

  // Recommended polygon (lighter)
  svg.append("path")
    .datum(recommended)
    .attr("d", radarLine)
    .attr("fill","rgba(200,200,200,0.2)")
    .attr("stroke","gray")
    .attr("stroke-width",1)
    .attr("stroke-dasharray","4,4");

  // Total polygon
  svg.append("path")
    .datum(total)
    .attr("d", radarLine)
    .attr("fill","rgba(128,0,128,0.2)")
    .attr("stroke","purple")
    .attr("stroke-width",2);

  // Individual cereals
  bowlCereals.forEach(c=>{
    const gramsPerServing = c.weight?c.weight*28.3495:c.cups?c.cups*240:30;
    const factor = c.amount / gramsPerServing;
    const data = nutrientKeys.map(k=> (c[k]||0)*factor );
    const color = brandColors[c.mfr] || {r:100,g:100,b:200};

    svg.append("path")
      .datum(data)
      .attr("d", radarLine)
      .attr("fill",`rgba(${color.r},${color.g},${color.b},0.5)`)
      .attr("stroke",`rgb(${color.r},${color.g},${color.b})`)
      .attr("stroke-width",2);
  });

  // Labels
  nutrientKeys.forEach((k,i)=>{
    const angle = i*angleSlice - Math.PI/2;
    svg.append("text")
      .attr("x", Math.cos(angle)*(radius + 10))
      .attr("y", Math.sin(angle)*(radius + 10))
      .attr("text-anchor","middle")
      .attr("alignment-baseline","middle")
      .style("font-size","10px")
      .text(nutrientLabels[i]);
  });
}
