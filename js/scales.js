import { data } from "./dataLoader.js"

export let heightScale, widthScale, sugarColorScale, proteinScale

export function initScales() {
    const kcalExtent = d3.extent(data, d => d.calories)
    const fatExtent = d3.extent(data, d => d.fat)
    const sugarExtent = d3.extent(data, d => d.sugars)
    const proteinExtent = d3.extent(data, d => d.protein)

    heightScale = d3.scaleLinear().domain(kcalExtent).range([55, 200]).clamp(true)
    widthScale = d3.scaleLinear().domain(fatExtent).range([20, 55]).clamp(true)
    sugarColorScale = d3.scaleLinear().domain(sugarExtent).range([70, 30]).clamp(true)
    proteinScale = d3.scaleLinear().domain(proteinExtent).range([3, 14]).clamp(true)
}