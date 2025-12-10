import { filters, applyFilters } from "./filters.js"
import { heightScale, widthScale, sugarColorScale, proteinScale } from "./scales.js"
import { brandColors, brandColors_bar } from "./brandColors.js"
import { openModal } from "./modal.js"
import { data } from "./dataLoader.js"

export const shelf = {
    1: d3.select("#shelf-1"),
    2: d3.select("#shelf-2"),
    3: d3.select("#shelf-3")
}

export function renderShelves() {
    const filtered = applyFilters(data);

    [1,2,3].forEach(shelfNum => {
        const shelfData = filtered.filter(d => d.shelf === shelfNum)
        const sel = shelf[shelfNum].selectAll(".cereal").data(shelfData, d => d.id)

        sel.exit().remove()

        
        const enter = sel.enter()
            .append("div")
            .attr("class", "cereal")
            .style("opacity", 0)

        // cria uma div de tooltip no body, só uma vez
        const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("padding", "4px 8px")
        .style("background", "rgba(0,0,0,0.7)")
        .style("font-size", "15px")
        .style("color", "#fff")
        .style("border-radius", "4px")
        .style("pointer-events", "none") 
        .style("opacity", 0);

        enter.append("div").attr("class", "protein-bar")
        enter.append("div").attr("class", "name-vertical").text(d => {
            const partes = d.name.trim().split(" ");  

            const primeiro = partes[0];               
            const segundoInicial = partes[1]          
                ? partes[1][0] + "."                  
                : "";                              

            return primeiro + " " + segundoInicial;           
})


        const merged = enter.merge(sel)

        merged.transition()
            .duration(450)
            .style("opacity", 1)
            .style("height", d => heightScale(d.calories) + "px")
            .style("width", d => widthScale(d.fat) + "px")
            .style("background", d => {
                const c = brandColors[d.mfr];
                const alpha = 0.5 + 0.3 * (d.sugars / sugarColorScale.domain()[1])
                return `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`
            })

        merged.select(".protein-bar")
            .transition().duration(300)
            .style("height", d => proteinScale(d.protein) + "px")
            .style("background", d => {
                const c = brandColors_bar[d.mfr]
                return `rgba(${c.r}, ${c.g}, ${c.b}, 1)`
            })

        merged.select(".name-vertical")
            .text(d => {
                const partes = d.name.trim().split(" ");  
                const primeiro = partes[0];               
                const segundoInicial = partes[1] ? partes[1][0] + "." : "";                              
                return primeiro + " " + segundoInicial;
            })
            .style("color", d => {
                const c = brandColors_bar[d.mfr];
                return `rgba(${c.r}, ${c.g}, ${c.b}, 1)`;
            });
        merged.on("click", (event, d) => openModal(d))

        merged
  .on("mouseover", function(event, d) {
    tooltip.transition()
      .duration(100)
      .style("opacity", 1)
      .text(d.name);  // mostra o nome completo
  })
  .on("mousemove", function(event) {
    tooltip
      .style("left", (event.pageX + 10) + "px")  // desloca 10px para a direita do cursor
      .style("top", (event.pageY - 20) + "px");  // desloca 20px acima do cursor
  })
  .on("mouseout", function() {
    tooltip.transition()
      .duration(100)
      .style("opacity", 0);
  });
})
}