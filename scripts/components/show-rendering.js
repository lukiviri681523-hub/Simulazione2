// show-rendering.js - Rendering condiviso per schede serie

import { clearContainer } from "../core/errors.js";
import { createShowCard, createShowDetails } from "./show-card.js";

/**
 * Renderizza i pannelli riassunto e dettagli di una serie dentro due contenitori dati.
 * Pulisce i contenitori prima di inserire i nuovi elementi e può chiamare un callback
 * quando la card è stata creata.
 * @param {Object} options
 * @param {Object} options.show - Oggetto show dall'API
 * @param {string} [options.titleOverride] - Titolo opzionale per la card
 * @param {HTMLElement} options.summaryContainer - Nodo DOM dove montare la card
 * @param {HTMLElement} options.detailsContainer - Nodo DOM dove montare i dettagli
 * @param {boolean} [options.compact=false] - Modalità compatta
 * @param {string} [options.detailsTitle] - Titolo da mostrare nella sezione dettagli
 * @param {function} [options.onCardCreated] - Callback invocata con la card creata
 * @returns {{showCard:HTMLElement, details:HTMLElement}|null} Oggetti creati o null se mancano parametri
 */
export function renderShowPanels({
    show,
    titleOverride = "",
    summaryContainer,
    detailsContainer,
    compact = false,
    detailsTitle,
    onCardCreated,
}) {
    if (!show || !summaryContainer || !detailsContainer) {
        return null;
    }

    const showCard = createShowCard(show, titleOverride, { compact });
    clearContainer(summaryContainer);
    summaryContainer.appendChild(showCard);

    if (typeof onCardCreated === "function") {
        onCardCreated(showCard);
    }

    const details = createShowDetails(show, {
        compact,
        title: detailsTitle,
    });

    clearContainer(detailsContainer);
    detailsContainer.appendChild(details);

    return { showCard, details };
}