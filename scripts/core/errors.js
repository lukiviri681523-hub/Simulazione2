// errors.js - Gestione stati UI e utility

/**
 * Mostra un indicatore di caricamento all'interno di un container.
 * @param {HTMLElement} container - Nodo DOM dove inserire il messaggio
 * @param {string} [message="Caricamento..."] - Testo da mostrare
 */
export function showLoading(container, message = "Caricamento...") {
    container.innerHTML = `<div class="loading">${message}</div>`;
}

/**
 * Mostra un messaggio di errore formattato.
 * @param {HTMLElement} container - Nodo dove inserire il messaggio
 * @param {string} [title="Errore"] - Titolo breve
 * @param {string} [message=""] - Messaggio dettagliato (verrà sanitizzato)
 */
export function showError(container, title = "Errore", message = "") {
    container.innerHTML = `
        <div class="error">
            <strong>${title}</strong>
            ${message ? `<p>${sanitizeHTML(message)}</p>` : ""}
        </div>
    `;
    console.error(`${title}: ${message}`);
}

/**
 * Mostra un messaggio di empty state nel container.
 * @param {HTMLElement} container
 * @param {string} [message]
 */
export function showEmpty(container, message = "Nessun dato disponibile.") {
    container.innerHTML = `<div class="empty">${sanitizeHTML(message)}</div>`;
}

/**
 * Pulisce il contenuto HTML di un container.
 * @param {HTMLElement} container
 */
export function clearContainer(container) {
    container.innerHTML = "";
}

/**
 * Sostituisce caratteri speciali con entità HTML per evitare XSS.
 * @param {string} html
 * @returns {string}
 */
export function sanitizeHTML(html) {
    const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
    };

    return String(html).replace(/[&<>"']/g, (match) => map[match]);
}

/**
 * Rimuove qualsiasi markup HTML e restituisce solo testo semplice.
 * @param {string} html
 * @returns {string}
 */
export function stripHtml(html) {
    if (!html) {
        return "";
    }

    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
}
