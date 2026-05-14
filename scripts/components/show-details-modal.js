// show-details-modal.js - Modale condivisa per dettagli serie TV

import { clearContainer, showLoading } from "../core/errors.js";

let modalState = null;

/**
 * Crea lo stato e il DOM della modale per i dettagli di una serie.
 * La modale viene montata sul `document.body` e fornisce metodi `open`, `close`, `destroy`.
 * @returns {{overlay:HTMLElement,title:HTMLElement,subtitle:HTMLElement,summaryContainer:HTMLElement,detailsContainer:HTMLElement,open:function,close:function,destroy:function}}
 */
function createModalState() {
    const overlay = document.createElement("div");
    overlay.className = "series-modal-overlay hidden";
    overlay.innerHTML = `
        <div class="series-modal" role="dialog" aria-modal="true" aria-labelledby="series-modal-title">
            <div class="series-modal-header">
                <div>
                    <p class="series-modal-kicker">Dettagli serie</p>
                    <h2 id="series-modal-title"></h2>
                    <p class="series-modal-subtitle"></p>
                </div>
                <button type="button" class="series-modal-close" aria-label="Chiudi modale">x</button>
            </div>
            <div class="series-modal-body">
                <div class="series-modal-summary"></div>
                <div class="series-modal-details"></div>
            </div>
        </div>
    `;

    const title = overlay.querySelector("#series-modal-title");
    const subtitle = overlay.querySelector(".series-modal-subtitle");
    const summaryContainer = overlay.querySelector(".series-modal-summary");
    const detailsContainer = overlay.querySelector(".series-modal-details");
    const closeButton = overlay.querySelector(".series-modal-close");

    function close() {
        overlay.classList.add("hidden");
        clearContainer(summaryContainer);
        clearContainer(detailsContainer);
    }

    closeButton.addEventListener("click", close);

    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
            close();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (!overlay.classList.contains("hidden") && event.key === "Escape") {
            close();
        }
    });

    document.body.appendChild(overlay);

    return {
        overlay,
        title,
        subtitle,
        summaryContainer,
        detailsContainer,
        open(recordTitle, recordSubtitle = "") {
            title.textContent = recordTitle;
            subtitle.textContent = recordSubtitle;
            overlay.classList.remove("hidden");
            showLoading(summaryContainer, "Caricamento dettagli...");
            clearContainer(detailsContainer);
        },
        close,
        destroy() {
            overlay.remove();
        },
    };
}

export function getShowDetailsModal() {
    if (!modalState) {
        modalState = createModalState();
    }

    /**
     * Restituisce l'istanza singleton della modale dei dettagli.
     * @returns {Object} Istanza della modale con metodi `open`/`close`/`destroy`.
     */
    return modalState;
}