# TVmaze Tracker

Applicazione web sviluppata in Vanilla JavaScript, HTML5 e CSS3 per la consultazione e la gestione di serie TV. Il progetto utilizza la REST API pubblica di [TVmaze](https://www.tvmaze.com/api) e segue un'architettura modulare basata su ES6 Modules, in modo simile a Simulazione1.

### Architettura e Struttura Directory

Il codice è organizzato secondo il principio di *Separation of Concerns*, separando layer di rendering, logica di pagina, servizi dati e componenti UI riutilizzabili.

```text
├── public/                # Viste HTML
│   ├── style.css          # Foglio di stile globale
│   ├── favorites.html     # Gestione dei preferiti
│   ├── index.html         # Entry point e panoramica app
│   ├── search.html        # Ricerca serie e suggerimenti
│   ├── visti.html         # Archivio delle serie viste
│   └── da-vedere.html     # Lista delle serie da vedere
├── scripts/               # Logica di business e manipolazione DOM
│   ├── components/        # UI modules per card, suggerimenti, modali e tabelle
│   ├── core/              # Stato globale, bootstrap ed error handling
│   ├── pages/             # Controller di binding per le singole view
│   └── services/          # Data access layer e persistenza localStorage
├── LICENSE
└── README.md
```

### Funzionalità Core

* **Ricerca Serie (`search.js`, `api.js`):** recupero delle serie tramite TVmaze con gestione della query, suggerimenti e caricamento dei risultati.
* **Dettagli e Schede (`show-details-modal.js`, `show-rendering.js`):** apertura di una scheda approfondita con informazioni sulla serie, cast e dati correlati.
* **Persistenza Client-Side (`storage.js`):** utilizzo di `localStorage` per conservare preferiti, viste, da vedere e cronologia tra sessioni diverse.
* **Rendering Dinamico (`show-card.js`, `records-table.js`):** aggiornamento del DOM in modo asincrono per liste, card e tabelle informative.

### Setup ed Esecuzione

Trattandosi di un'applicazione front-end statica, non è richiesto alcun build step né l'installazione di pacchetti npm. È sufficiente servire i file statici tramite un local web server e aprire `public/index.html` come entry point del progetto.


# Esercizi da Svolgere

Gli esercizi totali sono suddivisi in 3 macro-aree di intervento, ognuna con un peso specifico in termini di punteggio finale.
I primi due avranno anche dei commenti `TODO` all'interno del codice per guidarvi nei punti esatti in cui intervenire.
Il terzo esercizio richiede invece un'attività di debugging logico, per cui dovrete esplorare autonomamente i file per trovare e risolvere il problema.

### 1. INTEGRAZIONI DATI (60p)

**Obiettivo:** Ripristinare il sistema di recupero e visualizzazione dei dati delle serie TV. Il sito per ora da errore o mostra dati incompleti in praticamente tutte le sezioni chiave.

**Task richiesti:**

1. **Data Fetching in [scripts/services/api.js](scripts/services/api.js)**\
   Completa la logica della funzione `getShowById` in modo che effettui la/le chiamate corrette all'API di TVmaze per recuperare i dettagli di una serie, gestendo eventuali errori e ritornando i risultati attesi. Segui i TODO nel file per i dettagli tecnici.

2. **Data Binding & UI Rendering in [scripts/components/show-card.js](scripts/components/show-card.js)**\
   UNa volta recuperati i dati, completa la funzione `renderCard` in modo che i dettagli della serie vengano trasformati in elementi HTML da iniettare nella card, assicurandoti di sanificare i dati dinamici per evitare vulnerabilità di sicurezza. Segui i TODO nel file.

### 2. CORREZIONE LAYOUT (30p)

**Obiettivo:** Ripristinare la visualizzazione di alcune sezioni del sito che presentano anomalie strutturali ed estetiche.

**Task richiesti:**

1. **Struttura a Griglia in [public/search.html](public/search.html)**\
   Qualcuno ha rimosso le classi CSS necessarie per mostrare correttamente il pulsante di ricerca. Trova le classi mancanti (guarda nelle altre pagine con pulsanti simili) e aggiungile al pulsante in `search.html` per farlo apparire correttamentamente arancione e ben visibile.

2. **Layout Disallineato in [public/style.css](public/style.css)**\
   Nello stile è presente la regola per `.header-nav ul`, ma è rimasta praticamente vuota. Aggiungi le regole CSS necessarie per allineare correttamente i link del navbar, mantenendo un aspetto coerente con il design generale del sito.

3. **Design del Componente in [public/style.css](public/style.css)**\
   Tutti i pulsanti di eliminazione dei record all'interno delle tabelle (Preferiti, Visti, Da Vedere) sono attualmente privi di stile e poco visibili. Aggiungi una regola CSS per il selettore `.btn-danger` che dia a questi pulsanti un aspetto più evidente e coerente con il tema del sito. Segui le indicazioni specifiche nei TODO del file.

### 3. DEBUGGING LOGICO (10p)

**Obiettivo:** Individuare e risolvere un'anomalia nel flusso esecutivo della user interface.

**Problema riscontrato:**\
Quando viene aperto per la ***prima volta*** il sito, appare in tutte e tre le aree (Preferiti, Visti, Da Vedere) il record di una serie TV (Dark) che non dovrebbe essere presente. Se viene poi eliminato, il record scompare e non appare più.

**Task richiesti:**
1. Esamina il codice, comprendi da dove viene generato questo record e perché viene inserito nelle tabelle al primo caricamento del sito, nonostante non sia stato aggiunto dall'utente.
2. Correggi il bug in modo che questo record non appaia più al primo caricamento, ma che venga mostrato solo se effettivamente aggiunto dall'utente tramite le funzionalità del sito.
