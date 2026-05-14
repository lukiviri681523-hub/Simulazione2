// records-table.js - Tabella riusabile per visti, da vedere, preferiti

import { sanitizeHTML } from "../core/errors.js";

/**
 * Renderizza una tabella riusabile per elenchi (visti, preferiti, da vedere).
 * @param {Object} options
 * @param {HTMLElement} options.container - Nodo dove inserire la tabella
 * @param {string} options.emptyMessage - Messaggio da mostrare se non ci sono record
 * @param {Array} options.records - Array di record da mostrare
 * @param {Array<{header:string,render:function}>} options.columns - Definizione colonne (header + render(record))
 * @param {function(Object)} [options.onRowClick] - Callback al click sulla riga
 * @param {function(Object)} [options.onDelete] - Callback per rimuovere un elemento
 * @param {function} [options.onDeleteAll] - Callback per cancellare tutti gli elementi
 * @param {string} [options.clearAllLabel]
 * @param {string} [options.deleteLabel]
 */
export function renderRecordsTable({
    container,
    emptyMessage,
    records,
    columns,
    onRowClick,
    onDelete,
    onDeleteAll,
    clearAllLabel = "Cancella tutto",
    deleteLabel = "Rimuovi",
}) {
    if (!container) {
        return;
    }

    if (!records || records.length === 0) {
        container.innerHTML = `
            <section style="padding: 20px; text-align: center;">
                <p>${sanitizeHTML(emptyMessage)}</p>
            </section>
        `;
        return;
    }

    const headerHtml = `${columns.map((col) => `<th>${col.header}</th>`).join("")}<th>Azioni</th>`;
    const rowsHtml = records
        .map((record) => {
            const cellsHtml = columns
                .map((col) => `<td>${sanitizeHTML(String(col.render(record)))}</td>`)
                .join("");

            return `
                <tr class="records-row" tabindex="0">
                    ${cellsHtml}
                    <td class="records-actions">
                        <button class="btn btn-danger btn-delete" type="button">${deleteLabel}</button>
                    </td>
                </tr>
            `;
        })
        .join("");

    container.innerHTML = `
        <section class="records-panel">
            <div class="records-header" style="display: flex; justify-content: flex-end; align-items: center; padding: 10px 20px;">
                ${onDeleteAll ? `<button id="btn-clear-all" class="btn btn-secondary btn-danger">${clearAllLabel}</button>` : ""}
            </div>
            <div class="records-table-wrapper">
                <table class="records-table">
                    <thead>
                        <tr>${headerHtml}</tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>
        </section>
    `;

    const rows = container.querySelectorAll(".records-row");
    const deleteButtons = container.querySelectorAll(".btn-delete");

    for (let i = 0; i < rows.length; i += 1) {
        const row = rows[i];
        const record = records[i];
        const deleteBtn = deleteButtons[i];

        row.addEventListener("click", () => {
            if (onRowClick) {
                onRowClick(record);
            }
        });

        row.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                if (onRowClick) {
                    onRowClick(record);
                }
            }
        });

        deleteBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            if (onDelete) {
                onDelete(record);
            }
        });
    }

    if (onDeleteAll) {
        const btnClearAll = container.querySelector("#btn-clear-all");

        if (btnClearAll) {
            btnClearAll.addEventListener("click", () => {
                const conferma = confirm("Sei sicuro?");
                if (conferma) {
                    onDeleteAll();
                }
            });
        }
    }
}
