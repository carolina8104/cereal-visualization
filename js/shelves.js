import { filters, applyFilters } from "./filters.js"
import { heightScale, widthScale, sugarColorScale, proteinScale } from "./scales.js"
import { brandColors, brandColors_bar } from "./brandColors.js"
import { openModal } from "./modal.js"
import { data } from "./dataLoader.js"
import { updateCartSummary } from "./cart.js"
import { createFlyingBoxAnimation, renderFlyingBoxesFromStorage } from "./modal.js"

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

        // Add drag and drop functionality using native JavaScript events
        merged.each(function(d) {
            const element = this;
            element.draggable = true;
            
            element.addEventListener("dragstart", function(e) {
                console.log("Native dragstart for:", d.name);
                e.dataTransfer.setData("application/json", JSON.stringify(d));
                e.dataTransfer.effectAllowed = "copy";
                e.dataTransfer.dropEffect = "copy";
                
                // Add dragging class to body for cursor control
                document.body.classList.add("dragging");
                
                // Clean up on drag end
                element.addEventListener("dragend", function cleanup() {
                    // Remove dragging class from body and element
                    document.body.classList.remove("dragging");
                    element.classList.remove("dragging");
                    element.removeEventListener("dragend", cleanup);
                }, { once: true });
            });
            
            element.addEventListener("dragend", function(e) {
                console.log("Native dragend for:", d.name);
                // Visibility is restored in the cleanup function above
            });
        });

        // Add drop zone to cart - moved to main.js
        // initCartDropZone();

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

// Function to add cereal to cart exactly like the modal "Yes" button
function addCerealToCart(cerealData) {
    
    let savedCereals = JSON.parse(localStorage.getItem("savedCereals")) || [];

    // Limite máximo 5 cereais (same as modal)
    const cerealMessages = [
        "You can only add up to 5 cereals!",
        "That's enough cereal for today!",
        "No more cereals allowed!"
    ];

    if (savedCereals.length >= 5) {
        let maxMessage = document.getElementById("maxCerealMessage");

        if (!maxMessage) {
            maxMessage = document.createElement("p");
            maxMessage.id = "maxCerealMessage";
            document.body.appendChild(maxMessage);
        }

        const randomIndex = Math.floor(Math.random() * cerealMessages.length);
        maxMessage.textContent = cerealMessages[randomIndex];

        maxMessage.style.opacity = 0;
        maxMessage.style.display = "block";
        setTimeout(() => {
            maxMessage.style.opacity = 1;
        }, 10);

        setTimeout(() => {
            maxMessage.style.opacity = 0;
            setTimeout(() => maxMessage.remove(), 500);
        }, 3000); // Tempo que a mensagem fica visível (3 segundos)

        return;
    } else {
        const maxMessage = document.getElementById("maxCerealMessage");
        if (maxMessage) maxMessage.remove();
    }

    // Add cereal if not already in cart (same as modal)
    if (!savedCereals.some(c => c.name === cerealData.name)) {
        savedCereals.unshift(cerealData);
    }

    // Save to localStorage (same as modal)
    localStorage.setItem("savedCereals", JSON.stringify(savedCereals));

    // Create flying box animation (same as modal)
    createFlyingBoxAnimation(cerealData);

    // Update cart summary (same as modal)
    updateCartSummary();
}

// Initialize drag and drop for cart (called once)
function initCartDropZone() {
    const cartElement = document.getElementById("carrinho");

    if (cartElement && !cartElement.hasAttribute("data-drop-listener")) {
        cartElement.setAttribute("data-drop-listener", "true");
        
        cartElement.addEventListener("dragover", function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy"; // This prevents the red "not allowed" icon
            this.style.opacity = "0.7";
            this.style.transform = "scale(1.05)";
        });
        
        cartElement.addEventListener("dragleave", function(e) {
            this.style.opacity = "1";
            this.style.transform = "scale(1)";
        });
        
        cartElement.addEventListener("drop", function(e) {
            e.preventDefault();
            this.style.opacity = "1";
            this.style.transform = "scale(1)";
            
            try {
                const data = e.dataTransfer.getData("application/json");
                if (data && data.trim()) {
                    const cerealData = JSON.parse(data);
                    addCerealToCart(cerealData);
                }
            } catch (error) {
                console.error("Error parsing dropped data:", error);
            }
        });
        
    } else {
        console.warn("Cart element not found or already has listeners");
    }
    
    // Add global drag event listeners for debugging
    document.addEventListener("dragstart", function(e) {
        console.log("GLOBAL dragstart detected on:", e.target);
    });
    
    document.addEventListener("dragend", function(e) {
        console.log("GLOBAL dragend detected on:", e.target);
    });
    
    // Make document a valid drag target to prevent "not allowed" cursor
    document.addEventListener("dragover", function(e) {
        // Allow drag everywhere but only drop on cart
        e.preventDefault(); // Prevent default behavior
        e.dataTransfer.dropEffect = "copy"; // Always show copy cursor
    });
}

export { initCartDropZone };