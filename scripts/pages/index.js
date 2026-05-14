// index.js - Pagina Home

import { mountFooter } from "../core/footer.js";
import { mountHeader } from "../core/header.js";

/**
 * Inizializza la pagina Home montando header e footer.
 */
function init() {
    mountHeader("home");
    mountFooter();
}

init();
