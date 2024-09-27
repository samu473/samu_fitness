"use strict";

// il modulo moment lato server viene importato qui e non da file html
// (è necessario installarlo su node prima con 'npm install moment')
const moment = require('moment');

class Session {


    constructor (id, date, unmissable, sector, difficulty, done=false) {
        // Costruttore della classe Session per creare istanze di allenamenti con attributi specifici
        this.session_id = id;  // Assegna un ID univoco alla sessione di allenamento utilizzando il contatore statico
        moment.locale('it');
        this.date = date;   // Data allenamento
        this.unmissable = unmissable;   // Allenamento imperdibile
        this.difficulty = difficulty;   // Difficoltà allenamento
        this.sectorList = [];  // Lista dei settori allenati inizializzata come array vuoto
        this.done = done;   // Allenamento svolto

        // Aggiunge la categoria alla categoriaList se è specificata come stringa
        if (sector && typeof sector === "string") {
            this.sectorList.push(sector);
        }

        // Aggiunge le categorie alla categoriaList se è specificata come array
        if (sector && Array.isArray(sector)) {
            // Filtra le categorie rimuovendo eventuali duplicati passati per errore 
            this.sectorList = sector.filter((item, index) => sector.indexOf(item) === index);
        }
    }
}
// esportazione necessaria della classe perché la si possa usare anche altrove
module.exports = Session;