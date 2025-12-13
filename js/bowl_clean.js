// ==================== IMPORTS ====================
import { brandColors, brandColors_bar } from "./brandColors.js"
import { drawRadar } from "./radarChart.js"
import cerealShapes from "./shapes.js"

// ==================== STATE ====================
const savedCereals = JSON.parse(localStorage.getItem("savedCereals")) || []
let radarMode = "total" // dose | all | total
let selectedCerealId = null
let bowlCereals = []
let savedMilkAmount = 0
let positionIndex = 0
let positions = []
let stackHeights = []

// ==================== DOM ELEMENTS ====================
const listEl = document.getElementById("cerealSelector")
const bowlEl = document.getElementById("bowlArea")
const bowlContainer = document.getElementById("bowlEl")
const totalGramsEl = document.getElementById("totalGrams")

// ==================== INITIALIZATION ====================
savedCereals.forEach((c, i) => {
  if (!c.id) c.id = i + 1
  if (!c.milk) c.milk = 0
})

// ==================== UTILITY FUNCTIONS ====================
function refreshChart() {
  drawRadar(bowlCereals, savedCereals, savedMilkAmount, radarMode, selectedCerealId)
}

function assignUniqueShape(cereal) {
  if (!cereal.shape) {
    const usedShapes = savedCereals.filter(c => c.shape).map(c => c.shape)
    const availableShapes = cerealShapes.filter(s => !usedShapes.includes(s))
    cereal.shape = availableShapes.length > 0
      ? availableShapes[Math.floor(Math.random() * availableShapes.length)]
      : cerealShapes[Math.floor(Math.random() * cerealShapes.length)]
  }
}

// ==================== GRADIENT SETUP ====================
function createGradientDefs() {
  const svgDefs = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svgDefs.style.width = 0
  svgDefs.style.height = 0
  svgDefs.style.position = "absolute"
  svgDefs.style.pointerEvents = "none"

  const defs = document.createElementNS(svgDefs.namespaceURI, "defs")

  Object.keys(brandColors).forEach(mfr => {
    const gradient = document.createElementNS(svgDefs.namespaceURI, "linearGradient")
    gradient.setAttribute("id", `${mfr}-gradient`)
    gradient.setAttribute("x1", "0%")
    gradient.setAttribute("y1", "0%")
    gradient.setAttribute("x2", "100%")
    gradient.setAttribute("y2", "100%")

    const stop1 = document.createElementNS(svgDefs.namespaceURI, "stop")
    stop1.setAttribute("offset", "0%")
    const c1 = brandColors[mfr]
    stop1.setAttribute("stop-color", `rgb(${c1.r},${c1.g},${c1.b})`)

    const stop2 = document.createElementNS(svgDefs.namespaceURI, "stop")
    stop2.setAttribute("offset", "100%")
    const c2 = brandColors_bar[mfr]
    stop2.setAttribute("stop-color", `rgb(${c2.r},${c2.g},${c2.b})`)

    gradient.appendChild(stop1)
    gradient.appendChild(stop2)
    defs.appendChild(gradient)
  })

  svgDefs.appendChild(defs)
  document.body.appendChild(svgDefs)
}

// ==================== RESPONSIVE POSITIONING ====================
function handleHintDownPosition() {
  const hintDown = document.querySelector('.hintDown')
  const leftColumn = document.getElementById('leftColumn')
  const container = document.querySelector('.container')

  if (!hintDown || !leftColumn || !container) return

  if (window.innerWidth < 1000 || window.innerHeight < 680) {
    if (hintDown.parentElement === leftColumn) {
      container.appendChild(hintDown)
    }
  } else {
    if (hintDown.parentElement !== leftColumn) {
      leftColumn.appendChild(hintDown)
    }
  }
}

function calculateBowlPositions() {
  if (!bowlContainer) return

  const bowlRect = bowlContainer.getBoundingClientRect()
  const bowlWidth = bowlRect.width
  const bowlHeight = bowlRect.height

  positions = []
  const leftLimit = bowlWidth * 0.15
  const rightLimit = bowlWidth * 0.85
  const spacing = 30

  for (let p = leftLimit; p < rightLimit - spacing; p += spacing) {
    positions.push(p)
  }

  // Adjust bottom offset based on screen size
  let bottomMultiplier = 0.7
  if (window.innerWidth < 800) {
    bottomMultiplier = 0.17
  } else if (window.innerWidth < 1200) {
    bottomMultiplier = 0.23
  } else if (window.innerWidth < 1600) {
    bottomMultiplier = 0.53
  }

  const bottomOffset = bowlHeight * bottomMultiplier
  stackHeights = new Array(positions.length).fill(bottomOffset)
}

// ==================== CEREAL SELECTOR ====================
function renderList() {
  listEl.innerHTML = ""

  // Add MILK item
  const milkItem = createMilkItem()
  listEl.appendChild(milkItem)

  // Add cereal items
  savedCereals.forEach(c => {
    assignUniqueShape(c)
    const item = createCerealItem(c)
    listEl.appendChild(item)
  })

  selectItem(savedCereals[0].id)
}

function createMilkItem() {
  const milkItem = document.createElement("div")
  milkItem.className = "cerealShapeItem"
  milkItem.dataset.id = "milk"

  const milkIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  milkIcon.setAttribute("width", 36)
  milkIcon.setAttribute("height", 36)
  milkIcon.setAttribute("viewBox", "0 0 36 44")
  milkIcon.setAttribute("preserveAspectRatio", "xMidYMax meet")
  milkIcon.classList.add("shapeIcon")

  const drop = document.createElementNS(milkIcon.namespaceURI, "path")
  drop.setAttribute("d", "M18 2 C25 12, 30 18, 30 24 C30 32,24 36,18 36 C12 36,6 32,6 24 C6 18,11 12,18 2 Z")
  drop.setAttribute("fill", "white")
  drop.setAttribute("stroke", "#d0e7ff")
  drop.setAttribute("stroke-width", "2")
  milkIcon.appendChild(drop)

  const milkName = document.createElement("div")
  milkName.className = "cerealShapeName"
  milkName.textContent = "Milk"

  const milkBadge = document.createElement("div")
  milkBadge.className = "cerealGramBadge"
  milkBadge.textContent = `${savedMilkAmount} ml`

  milkItem.append(milkIcon, milkName, milkBadge)
  milkItem.addEventListener("click", ev => {
    ev.stopPropagation()
    selectItem("milk")
  })

  return milkItem
}

function createCerealItem(cereal) {
  const item = document.createElement("div")
  item.className = "cerealShapeItem"
  item.dataset.id = cereal.id

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svg.setAttribute("width", cereal.shape.size)
  svg.setAttribute("height", cereal.shape.size)
  svg.setAttribute("viewBox", `0 0 ${cereal.shape.size} ${cereal.shape.size + 18}`)
  svg.setAttribute("preserveAspectRatio", "xMidYMax meet")
  svg.classList.add("shapeIcon")

  const path = document.createElementNS(svg.namespaceURI, "path")
  path.setAttribute("d", cereal.shape.path)
  path.setAttribute("fill", `url(#${cereal.mfr}-gradient)`)
  svg.appendChild(path)

  const name = document.createElement("div")
  name.className = "cerealShapeName"
  name.textContent = cereal.name

  const badge = document.createElement("div")
  badge.className = "cerealGramBadge"
  badge.textContent = "0 g"

  item.append(svg, name, badge)
  item.addEventListener("click", ev => {
    ev.stopPropagation()
    selectItem(cereal.id)
  })

  return item
}

function selectItem(id) {
  selectedCerealId = id

  document.querySelectorAll(".cerealShapeItem").forEach(el => {
    el.classList.toggle("selected", el.dataset.id == id)
  })

  refreshChart()
}

// ==================== UPDATE FUNCTIONS ====================
function updateCerealAmounts() {
  savedCereals.forEach(c => {
    const item = listEl.querySelector(`.cerealShapeItem[data-id='${c.id}']`)
    if (!item) return

    const gramBadge = item.querySelector(".cerealGramBadge")
    const cerealInBowl = bowlCereals.find(bc => bc.id === c.id)
    const amount = cerealInBowl ? cerealInBowl.amount : 0

    if (gramBadge) gramBadge.textContent = `${amount} g`
  })

  const milkItem = listEl.querySelector(".cerealShapeItem[data-id='milk'] .cerealGramBadge")
  if (milkItem) milkItem.textContent = `${savedMilkAmount} ml`
}

function updateNutrients() {
  const totals = bowlCereals.reduce((acc, c) => {
    const gramsPerServing = c.weight * 28.3495
    const factor = c.amount / gramsPerServing

    acc.calories += (c.calories || 0) * factor
    acc.protein += (c.protein || 0) * factor
    acc.carbs += (c.carbo || 0) * factor
    acc.sugar += (c.sugars || 0) * factor
    acc.totalGrams += c.amount

    return acc
  }, { calories: 0, protein: 0, carbs: 0, sugar: 0, totalGrams: 0 })

  totalGramsEl.textContent = totals.totalGrams
  refreshChart()
}

// ==================== WARNINGS ====================
function showWarning(messages, className) {
  const msgDiv = document.createElement("div")
  msgDiv.classList.add(className)
  msgDiv.textContent = messages[Math.floor(Math.random() * messages.length)]

  document.body.appendChild(msgDiv)
  void msgDiv.offsetWidth
  msgDiv.style.opacity = 1
  msgDiv.style.top = "15%"

  setTimeout(() => {
    msgDiv.style.opacity = 0
    msgDiv.style.top = "10%"
    setTimeout(() => msgDiv.remove(), 400)
  }, 2000)
}

// ==================== MILK HANDLING ====================
function addMilk() {
  const milkMessages = [
    "Milk overload! Your cereal can't handle it!",
    "It's not possible to add more milk!",
    "The milk will overflow!",
    "Careful! The bowl is full!",
    "Remember: even calcium has its limits!",
    "Slow down! The cereal is drowning in milk!"
  ]

  if (savedMilkAmount >= 350) {
    showWarning(milkMessages, "milkWarning")
    return
  }

  if (savedMilkAmount <= 300) {
    const gif = document.createElement("img")
    gif.src = "../data/milk.gif?" + new Date().getTime()
    gif.classList.add("milkGif")
    bowlEl.appendChild(gif)
  }

  savedMilkAmount += 50

  const bowlElLocal = document.getElementById("bowlEl")
  let milkLiquid = bowlElLocal.querySelector(".milkLiquid")
  if (!milkLiquid) {
    milkLiquid = document.createElement("div")
    milkLiquid.classList.add("milkLiquid")
    bowlElLocal.appendChild(milkLiquid)
  }

  setTimeout(() => {
    const maxHeight = bowlElLocal.clientHeight * 0.8
    const heightPer50ml = 25
    let newHeight = milkLiquid.clientHeight + heightPer50ml
    if (newHeight > maxHeight) newHeight = maxHeight
    milkLiquid.style.height = newHeight + "px"
  }, 800)

  showFloatingAmount("+50ml")
  updateCerealAmounts()
  updateNutrients()
}

// ==================== CEREAL HANDLING ====================
function addCerealToBowl(cereal) {
  assignUniqueShape(cereal)
  const amount = 5

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

  if (wouldExceedMaxNutrients(cereal, amount, maxValues)) {
    const cerealWarnings = [
      "Cereal overload! The bowl can't take any more!",
      "Too many cereals! You're exceeding the limit!",
      "The cereal is overflowing!",
      "Careful! That's too much cereal!",
      "The bowl is already full of cereal!"
    ]
    showWarning(cerealWarnings, "cerealWarning")
    return
  }

  const existing = bowlCereals.find(c => c.id === cereal.id)
  if (existing) {
    existing.amount += amount
  } else {
    bowlCereals.push({ ...cereal, amount: 5 })
  }

  showFloatingAmount(`+${amount}g`)
  animateFallingCereals(cereal)
  updateCerealAmounts()
  updateNutrients()
}

function wouldExceedMaxNutrients(cereal, amount, maxValues) {
  const gramsPerServing = cereal.weight * 28.3495
  const factor = amount / gramsPerServing

  return Object.keys(maxValues).some(nutrient => {
    const currentTotal = bowlCereals.reduce((sum, c) => {
      const cServingGrams = c.weight * 28.3495
      const cFactor = c.amount / cServingGrams
      return sum + (c[nutrient] || 0) * cFactor
    }, 0)

    const newTotal = currentTotal + (cereal[nutrient] || 0) * factor
    return newTotal > maxValues[nutrient]
  })
}

function showFloatingAmount(text) {
  const floating = document.createElement("div")
  floating.className = "floatingAmount"
  floating.textContent = text
  floating.style.left = `${bowlEl.clientWidth * 0.6}px`
  floating.style.top = `${bowlEl.clientHeight * 0.5}px`
  bowlEl.appendChild(floating)

  setTimeout(() => {
    floating.style.top = `${bowlEl.clientHeight / 2 - 100}px`
    floating.style.opacity = 0
    floating.style.fontSize = "24px"
    setTimeout(() => floating.remove(), 1000)
  }, 10)
}

function animateFallingCereals(cereal) {
  const config = cereal.shape
  let scale = 1
  if (screen.width < 1600) scale = 0.8
  if (screen.width < 1200) scale = 0.65
  if (screen.width < 800) scale = 0.5
  const scaledSize = config.size * scale

  const shapeCount = 2
  for (let i = 0; i < shapeCount; i++) {
    if (positions.length === 0) calculateBowlPositions()

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("width", scaledSize)
    svg.setAttribute("height", scaledSize)
    svg.setAttribute("viewBox", `0 0 ${config.size} ${config.size}`)
    svg.classList.add("cerealParticle")
    svg.style.position = "absolute"

    const bowlRect = bowlContainer.getBoundingClientRect()
    const bowlAreaRect = bowlEl.getBoundingClientRect()
    const bowlRelativeX = bowlRect.left - bowlAreaRect.left
    const bowlRelativeY = bowlRect.top - bowlAreaRect.top

    const path = document.createElementNS(svg.namespaceURI, "path")
    path.setAttribute("d", config.path)
    path.setAttribute("fill", `url(#${cereal.mfr}-gradient)`)
    svg.appendChild(path)
    bowlEl.appendChild(svg)

    const columnIndex = positionIndex % positions.length
    let x = bowlRelativeX + positions[columnIndex] + (Math.random() - 0.5) * 15
    positionIndex++

    let y = -60
    let rotation = Math.random() * 360
    const fallSpeed = 2 + Math.random() * 3
    const targetY = bowlRelativeY + stackHeights[columnIndex]

    function animate() {
      y += fallSpeed
      rotation += 2
      svg.style.top = y + "px"
      svg.style.left = x + "px"
      svg.style.transform = `rotate(${rotation}deg)`

      if (y >= targetY) {
        y = targetY
        svg.style.top = y + "px"
        stackHeights[columnIndex] -= scaledSize * 0.8

        svg.animate(
          [
            { transform: `translateY(0) rotate(${rotation}deg)` },
            { transform: `translateY(-10px) rotate(${rotation + 5}deg)` },
            { transform: `translateY(0) rotate(${rotation}deg)` }
          ],
          { duration: 300, easing: "ease-out" }
        )

        return
      }
      requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }
}

// ==================== RESET ====================
function resetBowl() {
  bowlCereals = []
  savedMilkAmount = 0

  bowlEl.querySelectorAll("svg, .bowlShape, .floatingAmount, .milkGif").forEach(el => el.remove())

  const bowlElLocal = document.getElementById("bowlEl")
  const milkLiquid = bowlElLocal.querySelector(".milkLiquid")
  if (milkLiquid) {
    milkLiquid.style.height = "0px"
    milkLiquid.remove()
  }

  calculateBowlPositions()
  positionIndex = 0

  updateCerealAmounts()
  updateNutrients()
  refreshChart()
}

// ==================== INITIAL TIP ====================
function showInitialCerealTip() {
  const tipDiv = document.createElement("div")
  tipDiv.classList.add("cerealTip")

  const text = document.createElement("div")
  text.textContent = "Click to add cereals!"
  tipDiv.appendChild(text)

  const handImg = document.createElement("img")
  handImg.src = "../data/click.gif"
  handImg.alt = "Click"
  handImg.style.width = "40px"
  handImg.style.height = "40px"
  tipDiv.appendChild(handImg)

  document.body.appendChild(tipDiv)

  setTimeout(() => tipDiv.remove(), 5000)
}

// ==================== EVENT LISTENERS ====================
bowlEl.addEventListener("click", () => {
  if (!selectedCerealId) return

  if (selectedCerealId === "milk") {
    addMilk()
    return
  }

  const cereal = savedCereals.find(c => c.id === selectedCerealId)
  if (cereal) addCerealToBowl(cereal)
})

document.querySelectorAll(".filterBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    radarMode = btn.dataset.mode
    document.querySelectorAll(".filterBtn").forEach(b => b.classList.remove("active"))
    btn.classList.add("active")
    refreshChart()
  })
})

const resetBtn = document.getElementById("resetBowl")
if (resetBtn) {
  resetBtn.addEventListener("click", resetBowl)
}

window.addEventListener('resize', () => {
  handleHintDownPosition()
  calculateBowlPositions()
})

// ==================== INITIALIZE ====================
handleHintDownPosition()
calculateBowlPositions()
renderList()
createGradientDefs()
showInitialCerealTip()
