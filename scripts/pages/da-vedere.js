// da-vedere.js - Pagina Da vedere

import { mountFooter } from "../core/footer.js";
import { mountHeader } from "../core/header.js";
import { getToWatch, removeToWatch, clearToWatch, addToHistory } from "../services/storage.js";
import { renderRecordsTable } from "../components/records-table.js";
import { getShowDetailsModal } from "../components/show-details-modal.js";
import { loadShowRecord } from "../core/page-loader.js";

const toWatchContainer = document.getElementById("da-vedere-container");

/**
 * Rende la lista "Da vedere" usando `renderRecordsTable`.
 */
function displayToWatch() {
    const toWatch = getToWatch();

    renderRecordsTable({
        container: toWatchContainer,
        emptyMessage: "Nessuna serie nella lista Da vedere.",
        records: toWatch,
        columns: [
            { header: "Serie", render: (show) => show.name },
            { header: "Generi", render: (show) => (show.genres || []).join(", ") || "N/D" },
            { header: "Prima uscita", render: (show) => show.premiered || "N/D" },
        ],
        onRowClick: (entry) => loadShowRecord(entry, () => addToHistory(entry)),
        onDelete: (entry) => {
            removeToWatch(entry.id);
            getShowDetailsModal().close();
            displayToWatch();
        },
        onDeleteAll: () => {
            clearToWatch();
            getShowDetailsModal().close();
            displayToWatch();
        },
        clearAllLabel: "Cancella lista",
        deleteLabel: "Rimuovi",
    });
}

/**
 * Inizializza la pagina Da vedere.
 */
function init() {
    mountHeader("to-watch");
    mountFooter();
    displayToWatch();
}

init();
