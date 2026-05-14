// footer.js - Footer riutilizzabile

/**
 * Crea il footer standard dell'app.
 * @returns {HTMLElement} Elemento footer pronto
 */
export function createFooter() {
    const footer = document.createElement("footer");
    footer.className = "footer";

    footer.innerHTML = `
        <div class="footer-content">
            <p>TVmaze Tracker | Dati da <a href="https://www.tvmaze.com/api" target="_blank" rel="noreferrer">TVmaze API</a></p>
            <p>Ricerca serie TV, gestisci visti, da vedere e preferiti.</p>
        </div>
    `;

    return footer;
}

/**
 * Inserisce il footer nel container indicato.
 * @param {HTMLElement} [container=document.body]
 */
export function mountFooter(container = document.body) {
    const footer = createFooter();
    container.appendChild(footer);
}
