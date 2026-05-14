// show-suggestions.js - Autocomplete per ricerca serie

import { sanitizeHTML, showLoading } from "../core/errors.js";

/**
 * Imposta l'autocomplete per la ricerca di serie.
 * Si lega a un `input` e a un contenitore `suggestions`, chiamando `fetchSuggestions`.
 * @param {Object} options
 * @param {HTMLInputElement} options.input - Campo input dove l'utente scrive
 * @param {HTMLElement} options.suggestions - Contenitore dove mostrare i suggerimenti
 * @param {function(string): Promise<Array>} options.fetchSuggestions - Funzione che riceve il testo e restituisce una Promise con la lista di risultati
 * @param {function(Object): void} options.onSelect - Callback chiamata alla selezione di un elemento (riceve {id,name,year})
 * @returns {{hide:function, destroy:function}|null} API per nascondere o distruggere il componente
 */
export function setupShowSuggestions({
    input,
    suggestions,
    fetchSuggestions,
    onSelect,
}) {
    if (!input || !suggestions || !fetchSuggestions || !onSelect) {
        console.error("setupShowSuggestions: parametri mancanti");
        return null;
    }

    let timer = null;

    /**
     * Mostra la lista di suggerimenti all'interno del contenitore `suggestions`.
     * @param {Array} items - Array di oggetti suggerimento (id, name, year)
     */
    function renderList(items) {
        if (!items || items.length === 0) {
            suggestions.innerHTML = "<div style='padding: 10px;'>Nessuna serie trovata</div>";
            suggestions.classList.remove("hidden");
            return;
        }

        const html = items
            .slice(0, 7)
            .map(
                (item) => `
                    <div class="suggestion-item"
                        data-id="${sanitizeHTML(String(item.id))}"
                        data-name="${sanitizeHTML(item.name)}"
                        data-year="${sanitizeHTML(item.year || "N/D")}">
                        ${sanitizeHTML(item.name)} (${sanitizeHTML(item.year || "N/D")})
                    </div>
                `
            )
            .join("");

        suggestions.innerHTML = html;
        suggestions.classList.remove("hidden");
    }

    /**
     * Esegue la ricerca usando `fetchSuggestions` e aggiorna la UI.
     * Funzione interna asincrona.
     */
    async function search() {
        const text = input.value.trim();

        if (text.length < 2) {
            suggestions.innerHTML = "";
            suggestions.classList.add("hidden");
            return;
        }

        try {
            showLoading(suggestions, "Ricerca...");
            const items = await fetchSuggestions(text);
            renderList(items);
        } catch (error) {
            suggestions.innerHTML = "<div class='suggestion-error'>Errore nella ricerca</div>";
            suggestions.classList.remove("hidden");
            console.error("Errore suggerimenti:", error);
        }
    }

    input.addEventListener("input", () => {
        clearTimeout(timer);
        timer = setTimeout(search, 300);
    });

    suggestions.addEventListener("click", (event) => {
        const selected = event.target.closest(".suggestion-item");

        if (!selected) {
            return;
        }

        suggestions.innerHTML = "";
        suggestions.classList.add("hidden");

        onSelect({
            id: Number(selected.dataset.id),
            name: selected.dataset.name,
            year: selected.dataset.year,
        });
    });

    return {
        hide() {
            suggestions.innerHTML = "";
            suggestions.classList.add("hidden");
        },
        destroy() {
            clearTimeout(timer);
        },
    };
}