// favorites.js - Pagina Preferiti

import { mountFooter } from "../core/footer.js";
import { mountHeader } from "../core/header.js";
import { getFavorites, removeFavorite, clearFavorites, addToHistory } from "../services/storage.js";
import { renderRecordsTable } from "../components/records-table.js";
import { getShowDetailsModal } from "../components/show-details-modal.js";
import { loadShowRecord } from "../core/page-loader.js";

const favoritesContainer = document.getElementById("favorites-container");

/**
 * Rende la lista dei preferiti usando `renderRecordsTable`.
 */
function displayFavorites() {
    const favorites = getFavorites();

    renderRecordsTable({
        container: favoritesContainer,
        emptyMessage: "Nessun preferito. Vai su Ricerca per aggiungerne uno.",
        records: favorites,
        columns: [
            { header: "Serie", render: (show) => show.name },
            { header: "Generi", render: (show) => (show.genres || []).join(", ") || "N/D" },
            { header: "Rating", render: (show) => show.rating ?? "N/D" },
        ],
        onRowClick: (entry) => loadShowRecord(entry, () => addToHistory(entry)),
        onDelete: (entry) => {
            removeFavorite(entry.id);
            getShowDetailsModal().close();
            displayFavorites();
        },
        onDeleteAll: () => {
            clearFavorites();
            getShowDetailsModal().close();
            displayFavorites();
        },
        clearAllLabel: "Cancella preferiti",
        deleteLabel: "Rimuovi",
    });
}

/**
 * Inizializza la pagina Preferiti.
 */
function init() {
    mountHeader("favorites");
    mountFooter();
    displayFavorites();
}

init();
