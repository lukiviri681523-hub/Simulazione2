// show-codes.js - Helper visuali per stato serie TV

/**
 * Restituisce una stringa con emoji+testo per rappresentare lo stato di una serie.
 * @param {string} status
 * @returns {string}
 */
export function getStatusBadge(status) {
    const normalized = (status || "").toLowerCase();

    if (normalized.includes("running")) {
        return "🟢 In corso";
    }

    if (normalized.includes("ended")) {
        return "⚪ Conclusa";
    }

    if (normalized.includes("to be determined")) {
        return "🟡 In valutazione";
    }

    return `🔵 ${status || "N/D"}`;
}

/**
 * Formatta l'array di generi in una stringa separata da virgole.
 * @param {Array<string>} genres
 * @returns {string}
 */
export function formatGenres(genres) {
    if (!Array.isArray(genres) || genres.length === 0) {
        return "N/D";
    }

    return genres.join(", ");
}