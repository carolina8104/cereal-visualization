// UI event handlers for index.html
import { resetFilters } from "./filters.js"

export function initInfoBox() {
    const infoBox = document.getElementById('info');

    if (!infoBox) return; // Safety check

    document.getElementById('info-circle').addEventListener('click', (event) => {
        event.stopPropagation(); // Impede que o clique no "i" feche imediatamente
        if (infoBox.style.display === 'block') {
            infoBox.classList.remove('show');
            setTimeout(() => {
                infoBox.style.display = 'none';
            }, 300);
        } else {
            infoBox.style.display = 'block';
            setTimeout(() => {
                infoBox.classList.add('show');
            }, 10);
        }
    });

    document.addEventListener('click', () => {
        if (infoBox.classList.contains('show')) {
            infoBox.classList.remove('show');
            setTimeout(() => {
                infoBox.style.display = 'none';
            }, 300);
        }
    });
}

export function initResetFilters(render) {
    document.getElementById("resetFilters")?.addEventListener("click", () => {
        resetFilters(render);
    });
}

export function initRestartButton(updateCartSummary, render) {
    const restartButton = document.querySelector("#menu1 .button-container button");
    if (restartButton) {
        restartButton.onclick = () => {
            const maxMessage = document.getElementById("maxCerealMessage");
            if (maxMessage) maxMessage.remove();

            // limpa cereais
            localStorage.setItem("savedCereals", JSON.stringify([]));

            // remove caixas do carrinho
            document.querySelectorAll(".flying-box").forEach(el => el.remove());
            localStorage.removeItem("flyingBoxes"); // limpa do storage

            updateCartSummary();
            render();
        };
    }
}

export function initDoneButton(updateCartSummary) {
    const doneButton = document.getElementById("doneButton");
    if (doneButton) {
        doneButton.addEventListener("click", () => {
            const savedCereals = JSON.parse(localStorage.getItem("savedCereals")) || [];
            let messageEl = document.getElementById("doneMessage");
            if (!messageEl) {
                messageEl = document.createElement("p");
                messageEl.id = "doneMessage";
                document.getElementById("menu1").appendChild(messageEl);
            }

            if (savedCereals.length === 0) {
                messageEl.textContent = "First add some cereals to cart!";
                messageEl.style.opacity = "1";
                setTimeout(() => {
                    messageEl.style.opacity = "0";
                }, 3000);
            } else {
                messageEl.style.opacity = "0";
                const carrinho = document.getElementById("carrinho");

                carrinho.style.left = "-200vh";
                carrinho.style.transition = "all 3s ease";
                carrinho.getBoundingClientRect();

                const flyingBoxes = document.querySelectorAll(".flying-box");
                flyingBoxes.forEach(box => {
                    box.style.left = "-200vh";
                    box.style.transition = "all 3s ease";
                });

                setTimeout(() => {
                    window.navigateToBowl();
                }, 1000);
            }
        });
    }
}