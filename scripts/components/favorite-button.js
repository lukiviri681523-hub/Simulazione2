// favorite-button.js - Pulsante rapido preferiti

/**
 * Crea il pulsante circolare per aggiungere ai preferiti.
 * @param {function} [onClick] - Callback al click
 * @returns {HTMLButtonElement}
 */
export function createFavoriteButton(onClick) {
    const button = document.createElement("button");
    button.id = "btn-add-favorite";
    button.type = "button";
    button.className = "btn btn-inline-action btn-favorite-inline hidden";
    button.textContent = "♡";
    button.title = "Aggiungi ai preferiti";

    if (typeof onClick === "function") {
        button.addEventListener("click", onClick);
    }

    return button;
}

/**
 * Crea il pulsante per marcare la serie come vista.
 * @param {function} [onClick] - Callback al click
 * @returns {HTMLButtonElement}
 */
export function createWatchedButton(onClick) {
    const button = document.createElement("button");
    button.id = "btn-add-watched";
    button.type = "button";
    button.className = "btn btn-inline-action btn-secondary btn-watched-inline hidden";
    button.textContent = "✓";
    button.title = "Segna come visto";

    if (typeof onClick === "function") {
        button.addEventListener("click", onClick);
    }

    return button;
}

/**
 * Crea il pulsante per aggiungere la serie alla lista "Da vedere".
 * @param {function} [onClick] - Callback al click
 * @returns {HTMLButtonElement}
 */
export function createToWatchButton(onClick) {
    const button = document.createElement("button");
    button.id = "btn-add-to-watch";
    button.type = "button";
    button.className = "btn btn-inline-action btn-secondary btn-towatch-inline hidden";
    button.textContent = "+";
    button.title = "Aggiungi a Da vedere";

    if (typeof onClick === "function") {
        button.addEventListener("click", onClick);
    }

    return button;
}

/**
 * Mette in pagina i pulsanti di azione all'interno della header della card.
 * Se necessario crea il wrapper `.series-actions`.
 * @param {HTMLElement} seriesCard - Elemento `.series-card` dove montare i bottoni
 * @param {Array<HTMLButtonElement>} buttons - Array di bottoni da montare
 */
export function mountSeriesActions(seriesCard, buttons) {
    const header = seriesCard.querySelector(".series-card-header");

    if (!header || !Array.isArray(buttons) || buttons.length === 0) {
        return;
    }

    let actions = header.querySelector(".series-actions");

    if (!actions) {
        actions = document.createElement("div");
        actions.className = "series-actions";
        header.appendChild(actions);
    }

    buttons.forEach((button) => {
        if (!button) {
            return;
        }

        button.classList.remove("hidden");
        actions.appendChild(button);
    });
}

/**
 * Aggiorna lo stato visuale del pulsante preferiti.
 * @param {HTMLButtonElement} button
 * @param {boolean} isAlreadyFavorite
 */
export function setFavoriteButtonState(button, isAlreadyFavorite) {
    if (!button) {
        return;
    }

    button.classList.remove("hidden");

    if (isAlreadyFavorite) {
        button.textContent = "♥";
        button.title = "Gia nei preferiti";
        button.disabled = true;
    } else {
        button.textContent = "♡";
        button.title = "Aggiungi ai preferiti";
        button.disabled = false;
    }
}

/**
 * Aggiorna lo stato visuale del pulsante "visto".
 * @param {HTMLButtonElement} button
 * @param {boolean} isWatched
 */
export function setWatchedButtonState(button, isWatched) {
    if (!button) {
        return;
    }

    button.classList.remove("hidden");
    button.textContent = isWatched ? "✓" : "✓";
    button.title = isWatched ? "Gia nei visti" : "Segna come visto";
    button.disabled = isWatched;
}

/**
 * Aggiorna lo stato visuale del pulsante "Da vedere".
 * @param {HTMLButtonElement} button
 * @param {boolean} isInToWatch
 */
export function setToWatchButtonState(button, isInToWatch) {
    if (!button) {
        return;
    }

    button.classList.remove("hidden");
    button.textContent = isInToWatch ? "−" : "+";
    button.title = isInToWatch ? "Rimuovi da Da vedere" : "Aggiungi a Da vedere";
    button.disabled = false;
}
