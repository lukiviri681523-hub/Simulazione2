// api.js - Funzioni per interrogare la TVmaze API

const API_BASE = "https://api.tvmaze.com";

/**
 * Esegue una fetch e restituisce il JSON, sollevando un errore in caso di status non ok.
 * @param {string} url
 * @param {string} errorPrefix - Prefisso da usare nel messaggio d'errore
 * @returns {Promise<any>}
 */
async function requestJson(url, errorPrefix) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`${errorPrefix} (errore ${response.status})`);
    }

    return response.json();
}

/**
 * Mappa un oggetto show dalla API in una forma semplificata usata dall'app.
 * @param {Object} show
 * @returns {Object}
 */
export function mapShowSummary(show) {
    return {
        id: show.id,
        name: show.name,
        language: show.language || "N/D",
        genres: Array.isArray(show.genres) ? show.genres : [],
        status: show.status || "N/D",
        premiered: show.premiered || "N/D",
        rating: show.rating?.average ?? null,
        image: show.image?.medium || show.image?.original || "",
        network: show.network?.name || show.webChannel?.name || "N/D",
        summary: show.summary || "",
    };
}

/**
 * Cerca show tramite TVmaze e restituisce l'array di oggetti show.
 * @param {string} query
 * @returns {Promise<Array>}
 */
export async function searchShows(query) {
    const url = `${API_BASE}/search/shows?q=${encodeURIComponent(query)}`;
    const data = await requestJson(url, "Errore nella ricerca serie");

    if (!Array.isArray(data)) {
        return [];
    }

    return data
        .map((item) => item.show)
        .filter(Boolean);
}

/**
 * Restituisce un array di suggerimenti ridotti (id, name, year) per l'autocomplete.
 * @param {string} query
 * @returns {Promise<Array<{id:number,name:string,year:string}>>}
 */
export async function getShowSuggestions(query) {
    const shows = await searchShows(query);

    return shows.slice(0, 7).map((show) => {
        const year = show.premiered ? show.premiered.slice(0, 4) : "N/D";

        return {
            id: show.id,
            name: show.name,
            year,
        };
    });
}

/**
 * Recupera i dettagli di una serie per ID, includendo cast ed episodi in _embedded.
 * @param {number|string} showId
 * @returns {Promise<Object>} Oggetto show esteso con _embedded
 */
export async function getShowById(showId) {
    // TODO 1: Usa l'id passato come argomento per recuperare i dettagli della serie, cast ed episodi.
    // Prima controlla che l'id sia un numero intero positivo, altrimenti solleva un errore.
    // Poi esegui tre fetch con la funzione requestJson:
    // - una per i dettagli della serie (endpoint /shows/{id}) --> show
    try {
        if (!(showId >= 0)) {
            throw new Error("questo id non esiste")
        }
        let rispostaDettagli = await fetch(`${API_BASE}/shows/${showId}`)
        // - una per il cast (endpoint /shows/{id}/cast) --> cast
        let rispostaCast = await fetch(`${API_BASE}/shows/${showId}/cast`)
        // - una per gli episodi (endpoint /shows/{id}/episodes) --> episodes
        let rispostaEpisodes = await fetch(`${API_BASE}/shows/${showId}/episodes`)
        if (!rispostaDettagli || !rispostaCast || !rispostaEpisodes) {
            throw new Error("c'è un errore di fetch")
        }
        let show = await rispostaDettagli.json()
        let datiCast = await rispostaCast.json()
        let datiEpisodes = await rispostaEpisodes.json()
        let cast = datiCast
        let episodes = datiEpisodes

        console.log("sdfghj")
        //let show=datiShow
        return {
            ...show,
            _embedded: {
                cast: cast,
                episodes: episodes,
            },
            // Restituisci un oggetto che unisce i dettagli della serie con un campo _embedded che contiene cast ed episodi.
        };
    }
    catch (error) {
        console.error(error)
    }

}
