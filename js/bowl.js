import { brandColors, brandColors_bar } from "./brandColors.js"
import { drawRadar } from "./radarChart.js"
import cerealShapes from "./shapes.js"

const savedCereals = JSON.parse(localStorage.getItem("savedCereals")) || []
let radarMode = "total" // dose | all | total

savedCereals.forEach((c, i) => { //-----------// Adicionar ids que os cereais não têm
  if (!c.id) c.id = i + 1
  if (!c.milk) c.milk = 0 
})

function refreshChart() {
  drawRadar(bowlCereals, savedCereals, savedMilkAmount, radarMode, selectedCerealId)
}

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

function assignUniqueShape(cereal) {
  if (!cereal.shape) {
    // Get shapes already used
    const usedShapes = savedCereals
      .filter(c => c.shape)
      .map(c => c.shape);

    // Filter out used shapes
    const availableShapes = cerealShapes.filter(s => !usedShapes.includes(s));

    // If no shapes left, fallback to random
    const shape = availableShapes.length > 0 
      ? availableShapes[Math.floor(Math.random() * availableShapes.length)] 
      : cerealShapes[Math.floor(Math.random() * cerealShapes.length)]

    cereal.shape = shape
  }
}

const listEl = document.getElementById("cerealSelector")
let currentId = null
let selectedCerealId = null

const bowlEl = document.getElementById("bowlArea")
const caloriesEl = document.getElementById("calories")
const proteinEl = document.getElementById("protein")
const carbsEl = document.getElementById("carbs")
const sugarEl = document.getElementById("sugar")
const totalGramsEl = document.getElementById("totalGrams")

let bowlCereals = []
let savedMilkAmount = 0

//-------------------------------------// Renderiza tudo
function renderList() {
  listEl.innerHTML = ""
    // --- Add MILK item --- //
  const milkItem = document.createElement("div")
  milkItem.className = "cerealItem"
  milkItem.dataset.id = "milk"

  const milkIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  milkIcon.setAttribute("width", 36)
  milkIcon.setAttribute("height", 36)
  milkIcon.classList.add("shapeIndicator")

  // Milk drop icon
  const drop = document.createElementNS(milkIcon.namespaceURI, "path")
  drop.setAttribute("d", "M18 2 C25 12, 30 18, 30 24 C30 32,24 36,18 36 C12 36,6 32,6 24 C6 18,11 12,18 2 Z")
  drop.setAttribute("fill", "white")
  drop.setAttribute("stroke", "#d0e7ff")
  drop.setAttribute("stroke-width", "2")

  milkIcon.appendChild(drop)

  const milkName = document.createElement("div")
  milkName.className = "cerealName"
  milkName.textContent = "Milk"

  const milkBadge = document.createElement("div")
  milkBadge.className = "cerealMilkBadge"
  milkBadge.textContent = `${savedMilkAmount} ml` || "0 ml"

  milkItem.append(milkIcon, milkName, milkBadge)

  milkItem.addEventListener("click", ev => {
      ev.stopPropagation()
      selectItem("milk")
  })

  listEl.appendChild(milkItem)
  refreshChart()

  /*if (!savedCereals.length) {
    listEl.innerHTML = "<p>No cereal saved!</p>"
    statusEl.textContent = "No cereal available!"
    return
  }*/

  savedCereals.forEach(c => {
    const item = document.createElement("div")
    item.className = "cerealShapeItem"
    item.dataset.id = c.id
    assignUniqueShape(c)

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("width", c.shape.size)
    svg.setAttribute("height", c.shape.size)
    svg.classList.add("shapeIcon")

    const p = document.createElementNS(svg.namespaceURI, "path")
    p.setAttribute("d", c.shape.path)
    p.setAttribute("fill", `url(#${c.mfr}-gradient)`)
    svg.appendChild(p)

    const name = document.createElement("div")
    name.className = "cerealShapeName"
    name.textContent = c.name

    item.append(svg, name)

    const indicator = document.createElement("div")
    indicator.className = "shapeIndicator"

    const badge = document.createElement("div")
    badge.className = "cerealGramBadge"
    badge.textContent = "0 g"

    item.append(indicator, name, badge)
    item.style.zIndex = 150

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
function selectItem(id) {
    currentId = id
    selectedCerealId = id

    document.querySelectorAll(".cerealShapeItem").forEach(el => {
        el.classList.toggle("selected", el.dataset.id == id)
    })
    
    document.querySelectorAll(".cerealItem").forEach(el => {
        el.classList.toggle("selected", el.dataset.id == id)
    })
    
    refreshChart()
}

// ------------------------------------------// Atualiza badges dos cereais na lista
function updateCerealAmounts() {
    // Atualizar badges de todos os cereais (não só os que estão na taça)
    savedCereals.forEach(c => {
        const item = listEl.querySelector(`.cerealShapeItem[data-id='${c.id}']`)
        if (!item) return

        const gramBadge = item.querySelector(".cerealGramBadge")
        const cerealInBowl = bowlCereals.find(bc => bc.id === c.id)
        const amount = cerealInBowl ? cerealInBowl.amount : 0

        if (gramBadge) gramBadge.textContent = `${amount} g`
    })

    const milkItem = listEl.querySelector(".cerealItem[data-id='milk'] .cerealMilkBadge")
    if (milkItem) milkItem.textContent = `${savedMilkAmount} ml`
}
  
//-------------------------------------------// Atualizar valores nutricionais
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

  /*caloriesEl.textContent = totals.calories.toFixed(1)
  proteinEl.textContent = totals.protein.toFixed(1)
  carbsEl.textContent = totals.carbs.toFixed(1)
  sugarEl.textContent = totals.sugar.toFixed(1)*/
  totalGramsEl.textContent = totals.totalGrams

  refreshChart()
}

//----------------------------------------------// Adicionar cereal ao clicar na taça
bowlEl.addEventListener("click", (e) => {
    if (!selectedCerealId) return

    // --- MILK SELECTED --- //
if (selectedCerealId === "milk" && savedMilkAmount <= 400) {
  const gif = document.createElement("img");
  gif.src = "milk.gif?" + new Date().getTime(); 
  gif.classList.add("milkGif");

  bowlEl.appendChild(gif);
}

  const milkMessages = [
    "Milk overload! Your cereal can't handle it!",
    "It's not possible to add more milk!",
    "The milk will overflow!",
    "Careful! The bowl is full!",
    "Remember: even calcium has its limits!",
    "Slow down! The cereal is drowning in milk!",
];

if (selectedCerealId === "milk") {

 if (savedMilkAmount >= 450) {

        const msgDiv = document.createElement("div");
        msgDiv.classList.add("milkWarning");
        const randomIndex = Math.floor(Math.random() * milkMessages.length);
        msgDiv.textContent = milkMessages[randomIndex];

        document.body.appendChild(msgDiv);

        setTimeout(() => {
            msgDiv.style.opacity = 1;
            msgDiv.style.top = "15%";
        }, 10);

        // desaparece após 2s
        setTimeout(() => {
            msgDiv.style.opacity = 0;
            msgDiv.style.top = "10%";
            setTimeout(() => msgDiv.remove(), 500);
        }, 2000);

        return; // impede adicionar mais leite
    }

    savedMilkAmount += 50;

    // Atualiza badge do leite
    const milkItem = listEl.querySelector(".cerealItem[data-id='milk'] .cerealMilkBadge");
    milkItem.textContent = `${savedMilkAmount} ml`;

    const bowlElLocal = document.getElementById("bowlEl");

    // Cria leite se não existir
    let milkLiquid = bowlElLocal.querySelector(".milkLiquid");
    if (!milkLiquid) {
        milkLiquid = document.createElement("div");
        milkLiquid.classList.add("milkLiquid");
        bowlElLocal.appendChild(milkLiquid);
    }

    // Faz leite crescer
    setTimeout(() => {
    const maxHeight = bowlElLocal.clientHeight * 0.9;
    const heightPer50ml = 25;
    let newHeight = milkLiquid.clientHeight + heightPer50ml;
    if (newHeight > maxHeight) newHeight = maxHeight;
    milkLiquid.style.height = newHeight + "px";
        }, 800);

    // +50ml flutuante
    const floating = document.createElement("div");
    floating.className = "floatingAmount";
    floating.textContent = "+50ml";
    floating.style.left = `${bowlEl.clientWidth * 0.6}px`;
    floating.style.top = `${bowlEl.clientHeight * 0.5}px`;
    bowlEl.appendChild(floating);

    setTimeout(() => {
        floating.style.top = `${bowlEl.clientHeight / 2 - 100}px`;
        floating.style.opacity = 0;
    }, 20);
    setTimeout(() => floating.remove(), 1000);

    updateCerealAmounts();
    updateNutrients();
    return;
}



      // --- CEREAL SELECTED --- //
      const cereal = savedCereals.find(c => c.id === selectedCerealId)
      if (!cereal) return

      addCerealToBowl(cereal)
  })

  // Mensagens aleatórias para limite de cereais
const cerealWarnings = [
  "Cereal overload! A taça já não aguenta mais!",
  "Demasiados cereais! Está a ultrapassar o limite!",
  "O cereal está a transbordar!",
  "Calma! Isso são cereais a mais!",
  "A taça já está cheia de cereais!"
];

//--------------------------------------------// Animação dos cerais a cair
let positionIndex = 0
const positions = []
const leftLimit = bowlEl.clientWidth * 0.531
const rightLimit = bowlEl.clientWidth * 0.763
for (let p = leftLimit; p < rightLimit - 40; p += 30) {
  positions.push(p)
}
const stackHeights = new Array(positions.length).fill(bowlEl.clientHeight * 0.83)

function addCerealToBowl(cereal) {
  assignUniqueShape(cereal)
  const amount = 5

  // Importar os valores máximos do gráfico
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

  // Calcular nutrientes atuais + novo cereal
  const testBowl = [...bowlCereals, { ...cereal, amount }]
  const gramsPerServing = cereal.weight * 28.3495
  const factor = amount / gramsPerServing

  // Verificar se algum nutriente ultrapassaria o máximo
  const wouldExceedMax = Object.keys(maxValues).some(nutrient => {
    const currentTotal = bowlCereals.reduce((sum, c) => {
      const cServingGrams = c.weight * 28.3495
      const cFactor = c.amount / cServingGrams
      return sum + (c[nutrient] || 0) * cFactor
    }, 0)
    
    const newTotal = currentTotal + (cereal[nutrient] || 0) * factor
    return newTotal > maxValues[nutrient]
  })

    // -------------------- Aviso quando atingir o limite --------------------
  if (wouldExceedMax) {
    const cerealWarnings = [
      "Cereal overload! The bowl can't take any more!",
      "Too many cereals! You're exceeding the limit!",
      "The cereal is overflowing!",
      "Careful! That's too much cereal!",
      "The bowl is already full of cereal!"
    ]

    const msgDiv = document.createElement("div");
    msgDiv.classList.add("cerealWarning");

    // Texto aleatório
    const randomIndex = Math.floor(Math.random() * cerealWarnings.length);
    msgDiv.textContent = cerealWarnings[randomIndex];

    // Anexa e anima
    document.body.appendChild(msgDiv);
    // Forçar reflow para a animação CSS funcionar
    void msgDiv.offsetWidth;
    msgDiv.style.opacity = 1;
    msgDiv.style.top = "15%";

    // Desaparece após 2s
    setTimeout(() => {
      msgDiv.style.opacity = 0;
      msgDiv.style.top = "10%";
      setTimeout(() => msgDiv.remove(), 400);
    }, 2000);

    return; // impede adicionar mais cereais
  }
  // ---------------------------------------------------------------------

  // Find or add cereal in bowl
  const existing = bowlCereals.find(c => c.id === cereal.id)
  if (existing) {
    existing.amount += amount
  } else {
    bowlCereals.push({ ...cereal, amount: 5 })
  }

  const floating = document.createElement("div")
  floating.className = "floatingAmount"
  floating.textContent = `+${amount}g`
  floating.style.left = `${bowlEl.clientWidth * 0.6}px`
  floating.style.top = `${bowlEl.clientHeight * 0.5}px`
  bowlEl.appendChild(floating)

  setTimeout(() => {
    floating.style.top = `${bowlEl.clientHeight / 2 - 100}px`
    floating.style.opacity = 0
    floating.style.fontSize = "24px"
    setTimeout(() => floating.remove(), 1000)
  }, 10)

  // Animate falling shapes
  const config = cereal.shape;
  const shapeCount = 2; // pieces per click
  for (let i = 0; i < shapeCount; i++) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("width", config.size)
    svg.setAttribute("height", config.size)
    svg.style.position = "absolute"
    svg.style.top = "-60px"

    const path = document.createElementNS(svg.namespaceURI, "path")
    path.setAttribute("d", config.path)
    path.setAttribute("fill", `url(#${cereal.mfr}-gradient)`)

    svg.appendChild(path)
    bowlEl.appendChild(svg)

    const columnIndex = positionIndex % positions.length
    let x = positions[columnIndex] + (Math.random() - 0.5) * 15
    positionIndex++

    let y = 0
    let rotation = Math.random() * 360
    const fallSpeed = 2 + Math.random() * 3
    const targetY = stackHeights[columnIndex]

    function animate() {
      y += fallSpeed
      rotation += 2
      svg.style.top = y + "px"
      svg.style.left = x + "px"
      svg.style.transform = `rotate(${rotation}deg)`

      if (y >= targetY) {
        y = targetY
        svg.style.top = y + "px"
        stackHeights[columnIndex] -= config.size * 0.8

        // bounce effect
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

  // Update amounts and radar AFTER adding
  updateCerealAmounts()
  updateNutrients()

}

renderList()
createGradientDefs()

document.querySelectorAll(".filterBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    radarMode = btn.dataset.mode

    // UI highlight
    document.querySelectorAll(".filterBtn").forEach(b => b.classList.remove("active"))
    btn.classList.add("active")

    refreshChart()
  })
})
//-------------------------------------------------// Restart da taça de cereais (tudo a 0's)
console.log(savedCereals)

const resetBtn = document.getElementById("resetBowl")
function resetBowl() {
  // Limpar dados
  bowlCereals = []
  savedMilkAmount = 0

  // Limpar elementos visuais da taça
  bowlEl.querySelectorAll("svg, .bowlShape, .floatingAmount, .milkGif").forEach(el => el.remove())
  
  // Limpar o líquido de leite (procurar em bowlEl)
  const bowlElLocal = document.getElementById("bowlEl")
  const milkLiquid = bowlElLocal.querySelector(".milkLiquid")
  if (milkLiquid) {
    milkLiquid.style.height = "0px"
    milkLiquid.remove()
  }

  // Reset stack heights
  stackHeights.fill(bowlEl.clientHeight * 0.83)
  positionIndex = 0
  
  // Atualizar tudo
  updateCerealAmounts()
  updateNutrients()
  refreshChart()
}

if (resetBtn) {
  resetBtn.addEventListener("click", resetBowl)
}

// -------------------- dica de clique --------------------
function showInitialCerealTip() {
  const tipDiv = document.createElement("div");
  tipDiv.classList.add("cerealTip");


  const text = document.createElement("div");
  text.textContent = "Click to add cereals!";
  tipDiv.appendChild(text);


  const handImg = document.createElement("img");
  handImg.src = "click.gif";
  handImg.alt = "Click";
  handImg.style.width = "40px";
  handImg.style.height = "40px";
  tipDiv.appendChild(handImg);

  document.body.appendChild(tipDiv);


  setTimeout(() => {
    tipDiv.remove();
  }, 5000);
}


showInitialCerealTip();

