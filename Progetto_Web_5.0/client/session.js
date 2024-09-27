/*
"use strict";

class Session {

    static counter = 1;  // Contatore statico per generare un ID univoco per ogni film

    constructor (date, unmissable, sector=null, difficulty) {
        // Costruttore della classe Session per creare istanze di film con attributi specifici
        this.done = false;
        this.id = Session.counter++;  // Assegna un ID univoco al film utilizzando il contatore statico
        this.unmissable = unmissable;  // Indica se il film è "imperdibile"
        this.sectorList = [];  // Lista delle categorie del film inizializzata come array vuoto
        this.difficulty = difficulty;  // Visibilità del film (pubblico o privato)

        moment.locale('it');
        // Aggiunge la data di scadenza (deadline) se è specificata
        if (date)
            this.date = moment(date);

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
*/

"use strict";

class Session {
        /**
     * Creates an instance of Session.
     * @param  {Object} sessionObj - The Session object containing Session details.
     */
        constructor(sessionObj) {
            this.setProperties(sessionObj);
            this.id = sessionObj.session_id;
        }
    
        /**
         * Sets the properties of the Session instance.
         * @param  {Object} sessionObj - The Session object containing Session details.
         */
        setProperties(sessionObj) {
            moment.locale('it');
            this.date = moment(sessionObj.date);
            this.unmissable = (sessionObj.unmissable) ? true : false;
            this.sector = sessionObj.sector;
            this.difficulty = sessionObj.difficulty;
            this.done = (sessionObj.done) ? true : false;
        }
}

export default Session;