import { brandColors, brandColors_bar } from "./brandColors.js"

const savedCereals = JSON.parse(localStorage.getItem("savedCereals")) || []

savedCereals.forEach((c, index) => { //-----------// Adicionar ids que os cereais não têm
  if (c.id === undefined) {
    c.id = index + 1
  }
})

const listEl = document.getElementById("cerealSelector")
const statusEl = document.getElementById("status")
let currentId = null
let selectedCerealId = null

const bowlEl = document.getElementById("bowlArea")
const caloriesEl = document.getElementById("calories")
const proteinEl = document.getElementById("protein")
const carbsEl = document.getElementById("carbs")
const sugarEl = document.getElementById("sugar")
const totalGramsEl = document.getElementById("totalGrams")

let bowlCereals = []

//-------------------------------------// Renderiza tudo
function renderList() {
  listEl.innerHTML = ""

  if (!savedCereals.length) {
    listEl.innerHTML = "<p>No cereal saved!</p>"
    statusEl.textContent = "No cereal available!"
    return
  }

  savedCereals.forEach(c => {
    const item = document.createElement("div")
    item.className = "cerealItem"
    item.dataset.id = c.id

    const indicator = document.createElement("div")
    indicator.className = "shapeIndicator"

    const col1 = brandColors[c.mfr]
    const col2 = brandColors_bar[c.mfr]

    const bg = `linear-gradient(135deg,
      rgba(${col1.r},${col1.g},${col1.b},1) 0%,
      rgba(${col1.r},${col1.g},${col1.b},1) 50%,
      rgba(${col2.r},${col2.g},${col2.b},1) 50%,
      rgba(${col2.r},${col2.g},${col2.b},1) 100%)`
    indicator.style.background = bg

    const name = document.createElement("div")
    name.className = "cerealName"
    name.textContent = c.name

    const badge = document.createElement("div")
    badge.className = "cerealGramBadge"
    badge.textContent = "0 g"

    item.appendChild(indicator)
    item.appendChild(name)
    item.appendChild(badge)

    // Seleção do cereal
    item.addEventListener("click", (ev) => {
      ev.stopPropagation() 
      selectItem(c.id)
    })

    listEl.appendChild(item)
  })

  selectItem(savedCereals[0].id)
}

//----------------------------------------// Selecionar cereais
function selectItem(id){
  currentId = id
  selectedCerealId = id

  document.querySelectorAll(".cerealItem").forEach(el => {
    const is = el.dataset.id == id
    el.classList.toggle("selected", is)
  })

  const c = savedCereals.find(x => x.id == id)
  statusEl.textContent = c ? `Selecionado: ${c.name}` : "Nenhum cereal selecionado"
}

// ------------------------------------------// Atualiza badges dos cereais na lista
function updateCerealAmounts() {
  bowlCereals.forEach(c => {
    const item = listEl.querySelector(`.cerealItem[data-id='${c.id}']`)
    const badge = item.querySelector(".cerealGramBadge")
    if (badge) badge.textContent = `${c.amount} g`
  })
}

//-------------------------------------------// Atualizar valores nutricionais
function updateNutrients() {
  const totals = bowlCereals.reduce((acc, c) => {
    const factor = c.amount / 100
    acc.calories += (c.calories || 0) * factor
    acc.protein += (c.protein || 0) * factor
    acc.carbs += (c.carbs || 0) * factor
    acc.sugar += (c.sugar || 0) * factor
    acc.totalGrams += c.amount
    return acc
  }, { calories: 0, protein: 0, carbs: 0, sugar: 0, totalGrams: 0 })

  caloriesEl.textContent = totals.calories.toFixed(1)
  proteinEl.textContent = totals.protein.toFixed(1)
  carbsEl.textContent = totals.carbs.toFixed(1)
  sugarEl.textContent = totals.sugar.toFixed(1)
  totalGramsEl.textContent = totals.totalGrams
}

//----------------------------------------------// Adicionar cereal ao clicar na taça
bowlEl.addEventListener("click", () => {
  if (!selectedCerealId) return
  const cereal = savedCereals.find(c => c.id === selectedCerealId)
  if (!cereal) return

  addCerealToBowl(cereal)
})

//--------------------------------------------// Animação dos cerais a cair
function addCerealToBowl(cereal) {
  const amount = 5

  let existing = bowlCereals.find(c => c.id === cereal.id)
  if (existing) {
    existing.amount += amount
  } else {
    bowlCereals.push({ ...cereal, amount: amount })
  }

  updateNutrients()
  updateCerealAmounts()

  //-----------------------------------------------// +5g animado no centro
  const floating = document.createElement("div")
  floating.className = "floatingAmount"
  floating.textContent = `+${amount}g`
  floating.style.left = `${bowlEl.clientWidth / 2}px`
  floating.style.top = `${bowlEl.clientHeight / 2}px`
  bowlEl.appendChild(floating)

  setTimeout(() => {
    floating.style.top = `${bowlEl.clientHeight / 2 - 100}px`
    floating.style.opacity = 0
    floating.style.fontSize = "24px"
    setTimeout(() => floating.remove(), 1000)
  }, 10)

  //-------------------------------------------------// Forma a cair do topo
  const shape = document.createElement("div")
  shape.className = "bowlShape"
  shape.style.left = `${Math.random() * (bowlEl.clientWidth - 50)}px`
  shape.style.background = `linear-gradient(135deg,
    rgba(${brandColors[cereal.mfr].r},${brandColors[cereal.mfr].g},${brandColors[cereal.mfr].b},1) 0%,
    rgba(${brandColors_bar[cereal.mfr].r},${brandColors_bar[cereal.mfr].g},${brandColors_bar[cereal.mfr].b},1) 100%)`
  bowlEl.appendChild(shape)

  let top = -60
  let left = parseFloat(shape.style.left)
  let rotation = 0
  const fall = setInterval(() => {
    top += 10
    left += Math.sin(top / 20) * 2
    rotation += 15
    shape.style.top = top + "px"
    shape.style.left = left + "px"
    shape.style.transform = `rotate(${rotation}deg)`
    if (top >= bowlEl.clientHeight) {
      clearInterval(fall)
      shape.remove()
    }
  }, 20)
}

renderList()
