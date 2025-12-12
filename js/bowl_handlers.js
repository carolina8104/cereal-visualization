// UI handlers for bowl.html
export function initBowlHandlers() {
    // Milk item click
    const milkItem = document.querySelector("#cerealSelector .milk-item");
    if (milkItem) {
        milkItem.addEventListener("click", ev => {
            ev.stopPropagation();
            // Assuming selectItem is defined in bowl.js, but since we're moving, need to handle
            // For now, placeholder
            console.log("Milk selected");
        });
    }

    // Cereal items click
    document.querySelectorAll("#cerealSelector .cereal-item").forEach(item => {
        item.addEventListener("click", (ev) => {
            const cerealId = parseInt(item.dataset.id);
            // selectItem(cerealId);
            console.log("Cereal selected", cerealId);
        });
    });

    // Bowl click
    const bowlEl = document.getElementById("bowlEl");
    if (bowlEl) {
        bowlEl.addEventListener("click", (e) => {
            if (e.target === bowlEl) {
                // deselectItem();
                console.log("Bowl clicked");
            }
        });
    }

    // Filter buttons
    document.querySelectorAll(".filterBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            const radarMode = btn.dataset.mode;
            document.querySelectorAll(".filterBtn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            // refreshChart();
            console.log("Filter mode", radarMode);
        });
    });

    // Reset bowl button
    const resetBtn = document.getElementById("resetBowl");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            // resetBowl();
            console.log("Reset bowl");
        });
    }
}