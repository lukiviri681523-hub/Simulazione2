// search.js - Pagina Ricerca

import { mountFooter } from "../core/footer.js";
import { mountHeader } from "../core/header.js";
import { getShowById, getShowSuggestions, mapShowSummary, searchShows } from "../services/api.js";
import { runAsyncSection } from "../core/view-state.js";
import { setupShowSuggestions } from "../components/show-suggestions.js";
import {
    createFavoriteButton,
    createToWatchButton,
    createWatchedButton,
    mountSeriesActions,
    setFavoriteButtonState,
    setToWatchButtonState,
    setWatchedButtonState,
} from "../components/favorite-button.js";
import { showError, showEmpty } from "../core/errors.js";
import {
    addFavorite,
    addToHistory,
    addToWatch,
    addWatched,
    isFavorite,
    isInToWatch,
    isWatched,
    removeToWatch,
} from "../services/storage.js";
import { renderShowPanels } from "../components/show-rendering.js";

let currentShow = null;
let btnAddFavorite = null;
let btnAddWatched = null;
let btnAddToWatch = null;

const queryInput = document.getElementById("show-input");
const btnSearch = document.getElementById("btn-search-show");
const suggestions = document.getElementById("show-suggestions");
const resultContainer = document.getElementById("result-container");
const detailsContainer = document.getElementById("show-details-container");
const listContainer = document.getElementById("matches-container");

/**
 * Aggiorna lo stato visuale dei pulsanti azione in base allo show corrente.
 */
function updateActionButtons() {
    if (!currentShow) {
        return;
    }

    const showId = currentShow.id;

    setFavoriteButtonState(btnAddFavorite, isFavorite(showId));
    setWatchedButtonState(btnAddWatched, isWatched(showId));
    setToWatchButtonState(btnAddToWatch, isInToWatch(showId));
}

/**
 * Mappa l'oggetto show completo alla forma compatta usata per storage/record.
 * @param {Object} show
 * @returns {Object}
 */
function toRecord(show) {
    return mapShowSummary(show);
}

/**
 * Carica i dettagli di uno show e rende la card + dettagli nella UI.
 * @param {number} showId
 * @param {string} [fallbackName]
 * @returns {Promise}
 */
async function loadShow(showId, fallbackName = "") {
    return runAsyncSection({
        loadingContainer: resultContainer,
        clearContainers: [detailsContainer],
        request: () => getShowById(showId),
        onSuccess: (show) => {
            currentShow = show;
            const record = toRecord(show);

            addToHistory(record);

            renderShowPanels({
                show,
                titleOverride: fallbackName || show.name,
                summaryContainer: resultContainer,
                detailsContainer,
                compact: true,
                detailsTitle: "Approfondimento",
                onCardCreated: (seriesCard) => {
                    mountSeriesActions(seriesCard, [btnAddFavorite, btnAddWatched, btnAddToWatch]);
                },
            });

            updateActionButtons();
        },
        onError: (error) => {
            showError(resultContainer, "Errore caricamento serie", error.message);
        },
    });
}

/**
 * Renderizza una griglia di bottoni con i match della ricerca.
 * @param {Array} shows
 */
function renderMatchButtons(shows) {
    if (!shows || shows.length === 0) {
        showEmpty(listContainer, "Nessun risultato.");
        return;
    }

    const html = shows
        .slice(0, 18)
        .map((show) => {
            const year = show.premiered ? show.premiered.slice(0, 4) : "N/D";
            return `<button type="button" class="btn btn-secondary match-btn" data-id="${show.id}">${show.name} (${year})</button>`;
        })
        .join("");

    listContainer.innerHTML = `<div class="actions-grid">${html}</div>`;

    listContainer.querySelectorAll(".match-btn").forEach((button) => {
        button.addEventListener("click", () => {
            loadShow(Number(button.dataset.id), button.textContent);
        });
    });
}

/**
 * Esegue la ricerca per titolo usando il valore dell'input e aggiorna la UI.
 * @returns {Promise}
 */
async function searchByTitle() {
    const query = queryInput.value.trim();

    if (!query) {
        alert("Inserisci il titolo di una serie");
        return;
    }

    return runAsyncSection({
        loadingContainer: resultContainer,
        clearContainers: [detailsContainer, listContainer],
        request: () => searchShows(query),
        onSuccess: (results) => {
            if (!results.length) {
                showEmpty(resultContainer, "Nessuna serie trovata");
                return;
            }

            renderMatchButtons(results);
            loadShow(results[0].id, results[0].name);
        },
        onError: (error) => {
            showError(resultContainer, "Errore nella ricerca", error.message);
        },
    });
}

/**
 * Aggiunge lo show corrente ai preferiti se presente.
 */
function addCurrentToFavorites() {
    if (!currentShow) {
        return;
    }

    const saved = addFavorite(toRecord(currentShow));

    if (saved) {
        updateActionButtons();
    }
}

/**
 * Aggiunge lo show corrente alla lista dei visti e lo rimuove dai "Da vedere" se presente.
 */
function addCurrentToWatched() {
    if (!currentShow) {
        return;
    }

    const saved = addWatched(toRecord(currentShow));

    if (saved) {
        removeToWatch(currentShow.id);
        updateActionButtons();
    }
}

/**
 * Alterna lo stato "Da vedere" per lo show corrente.
 */
function toggleCurrentToWatch() {
    if (!currentShow) {
        return;
    }

    if (isInToWatch(currentShow.id)) {
        removeToWatch(currentShow.id);
    } else {
        addToWatch(toRecord(currentShow));
    }

    updateActionButtons();
}

/**
 * Inizializza gli event listener della pagina (ricerca, suggerimenti, bottoni azione).
 */
function setupEventListeners() {
    btnSearch.addEventListener("click", searchByTitle);

    queryInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            searchByTitle();
        }
    });

    btnAddWatched.addEventListener("click", addCurrentToWatched);
    btnAddToWatch.addEventListener("click", toggleCurrentToWatch);

    setupShowSuggestions({
        input: queryInput,
        suggestions,
        fetchSuggestions: getShowSuggestions,
        onSelect: ({ id, name }) => {
            queryInput.value = name;
            loadShow(id, name);
        },
    });
}

/**
 * Inizializza la pagina: monta header/footer, crea bottoni e setta i listener.
 */
function init() {
    mountHeader("search");
    mountFooter();

    btnAddFavorite = createFavoriteButton(addCurrentToFavorites);
    btnAddWatched = createWatchedButton(addCurrentToWatched);
    btnAddToWatch = createToWatchButton(toggleCurrentToWatch);
    setupEventListeners();
}

init();
