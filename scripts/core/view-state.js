// view-state.js - Helper per sezioni asincrone

import { clearContainer, showLoading } from "./errors.js";

/**
 * Esegue una richiesta asincrona gestendo lo stato di loading e gli handlers.
 * @param {Object} options
 * @param {HTMLElement} options.loadingContainer - Nodo dove mostrare il loader
 * @param {string} [options.loadingMessage]
 * @param {function(): Promise} options.request - Funzione che esegue la richiesta e restituisce una Promise
 * @param {function} options.onSuccess - Callback invocata con i dati ricevuti
 * @param {function} [options.onError] - Callback opzionale per gestire errori
 * @param {Array<HTMLElement>} [options.clearContainers] - Array di container da pulire prima della richiesta
 * @returns {Promise<*>} Valore restituito da `onSuccess` o `onError` se presente
 */
export async function runAsyncSection({
    loadingContainer,
    loadingMessage = "Caricamento...",
    request,
    onSuccess,
    onError,
    clearContainers = [],
}) {
    if (!loadingContainer || !request || !onSuccess) {
        console.error("runAsyncSection: parametri mancanti");
        return;
    }

    showLoading(loadingContainer, loadingMessage);

    clearContainers.forEach((container) => {
        if (container) {
            clearContainer(container);
        }
    });

    try {
        const data = await request();
        return onSuccess(data);
    } catch (error) {
        if (onError) {
            return onError(error);
        }

        throw error;
    }
}
