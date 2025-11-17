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
                const alpha = 0.6 + 0.4 * (d.sugars / sugarColorScale.domain()[1])
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
            .style("color", d => {
                const c = brandColors_bar[d.mfr]
                return `rgba(${c.r}, ${c.g}, ${c.b}, 1)`
            })

        merged.on("click", (event, d) => openModal(d))
    })
}