// visti.js - Pagina Visti

import { mountFooter } from "../core/footer.js";
import { mountHeader } from "../core/header.js";
import { getWatched, removeWatched, clearWatched, addToHistory } from "../services/storage.js";
import { renderRecordsTable } from "../components/records-table.js";
import { getShowDetailsModal } from "../components/show-details-modal.js";
import { loadShowRecord } from "../core/page-loader.js";

const watchedContainer = document.getElementById("visti-container");

/**
 * Rende la vista dei visti usando `renderRecordsTable`.
 */
function displayWatched() {
    const watched = getWatched();

    renderRecordsTable({
        container: watchedContainer,
        emptyMessage: "Nessuna serie nei visti. Segna una serie dalla pagina Ricerca.",
        records: watched,
        columns: [
            { header: "Serie", render: (show) => show.name },
            { header: "Stato", render: (show) => show.status || "N/D" },
            { header: "Aggiunta", render: (show) => new Date(show.timestamp).toLocaleString("it-IT") },
        ],
        onRowClick: (entry) => loadShowRecord(entry, () => addToHistory(entry)),
        onDelete: (entry) => {
            removeWatched(entry.id);
            getShowDetailsModal().close();
            displayWatched();
        },
        onDeleteAll: () => {
            clearWatched();
            getShowDetailsModal().close();
            displayWatched();
        },
        clearAllLabel: "Cancella visti",
        deleteLabel: "Rimuovi",
    });
}

/**
 * Inizializza la pagina Visti.
 */
function init() {
    mountHeader("visti");
    mountFooter();
    displayWatched();
}

init();
