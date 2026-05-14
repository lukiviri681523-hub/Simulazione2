// page-loader.js - Logica condivisa per aprire dettagli serie da record

import { getShowById } from "../services/api.js";
import { runAsyncSection } from "./view-state.js";
import { getShowDetailsModal } from "../components/show-details-modal.js";
import { renderShowPanels } from "../components/show-rendering.js";
import { showError } from "./errors.js";

/**
 * Apre la modale dei dettagli per un record e carica i dati completi (episodi, cast).
 * @param {Object} entry - Record minimale (deve contenere almeno `id` e `name`)
 * @param {function} [onBeforeRequest] - Callback invocata prima della richiesta HTTP
 * @returns {Promise} Promise risultante dall'esecuzione della richiesta
 */
export async function loadShowRecord(entry, onBeforeRequest) {
    const modal = getShowDetailsModal();
    const subtitle = `${entry.status || "N/D"} | ${entry.premiered || "N/D"}`;

    modal.open(entry.name, subtitle);

    return runAsyncSection({
        loadingContainer: modal.summaryContainer,
        clearContainers: [modal.detailsContainer],
        request: async () => {
            if (typeof onBeforeRequest === "function") {
                onBeforeRequest();
            }

            return getShowById(entry.id);
        },
        onSuccess: (show) => {
            renderShowPanels({
                show,
                titleOverride: show.name,
                summaryContainer: modal.summaryContainer,
                detailsContainer: modal.detailsContainer,
                compact: true,
            });
        },
        onError: (error) => {
            showError(modal.summaryContainer, "Errore caricamento dettagli", error.message);
        },
    });
}
