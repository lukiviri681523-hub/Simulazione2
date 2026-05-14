// header.js - Header riutilizzabile

/**
 * Crea l'elemento header della pagina con la navigazione principale.
 * @param {string} [currentPage="home"] - Identificatore della pagina corrente per applicare lo stato active
 * @returns {HTMLElement} Header pronto per essere inserito nel DOM
 */
export function createHeader(currentPage = "home") {
    const header = document.createElement("header");
    header.className = "header";

    const pages = [
        { name: "Home", path: "index.html", id: "home" },
        { name: "Ricerca", path: "search.html", id: "search" },
        { name: "Visti", path: "visti.html", id: "visti" },
        { name: "Da vedere", path: "da-vedere.html", id: "to-watch" },
        { name: "Preferiti", path: "favorites.html", id: "favorites" },
    ];

    const navItems = pages
        .map((page) => {
            const isActive = page.id === currentPage ? " active" : "";
            return `<li><a href="${page.path}" class="nav-link${isActive}">${page.name}</a></li>`;
        })
        .join("");

    header.innerHTML = `
        <div class="header-content">
            <h1 class="logo">
                <a href="index.html">TVmaze Tracker</a>
            </h1>
            <nav class="header-nav">
                <ul>
                    ${navItems}
                </ul>
            </nav>
        </div>
    `;

    return header;
}

/**
 * Monta l'header nella pagina (prepend sul container indicato).
 * @param {string} [currentPage="home"]
 * @param {HTMLElement} [container=document.body]
 */
export function mountHeader(currentPage = "home", container = document.body) {
    const header = createHeader(currentPage);
    container.prepend(header);
}
