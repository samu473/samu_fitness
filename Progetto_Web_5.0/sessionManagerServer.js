"use strict";

/********
 * questo file è molto simile a quello già allegato alla soluzione del lab05
 * per quanto siano state necessarie le seguenti modifiche:
 * - l'esecuzione di questo modulo è passata da client a server side, quindi deve essere esportato
 * ed importato ove utilizzato
 * - l'oggetto MovieManager non chiama più il metodo createMovieWishList in fase di costruzione
 * - il metodo createMovieWishList adesso si aspetta un parametro in ingresso per poter creare la wishlist 
 *   dell'utente. Ci si aspetta che questa lista sia stata precedentemente recuperata da db
 * - i metodi createMovieWishList e addSession sono stati modificati per consentire il passaggio dei campi 
 *   id e viewed
 ********/

// il modulo Session viene importato qui e non da file html
const Session = require("./sessionServer");

class SessionManager {

    static sectors = ['Gambe', 'Schiena', 'Addominali', 'Glutei', 'Petto', 'Bicipiti', 'Spalle', 'Cardio', 'Stretching'];

    // Costruttore della classe MovieManager
    // Inizializza la lista dei film come un array vuoto
    constructor () {
        this.sessions = [];
    }

    // Metodo per creare la lista dei film desiderati e aggiungerli alla lista this.sessions
    // Ci si aspetta che la lista sessions passata come argomento sia stata precedentemente recuperata da db.
    // In alternativa la query SQL per recuperare la lista può essere eseguita qui. In questo caso, bisogna
    // passare al metodo gli argomenti necessari per poter eseguire la query (ad esempio, userId)
    createSessionList(sessions) {
        sessions.forEach(s => this.addSession(s.session_id, s.date, s.unmissable, 
            s.sector, s.difficulty, s.done));
    }

    // Metodo per aggiungere nuovi film alla lista sessions utilizzando il costruttore della classe Session
    addSession(id, date, unmissable=true, sector, difficulty, done=null) {
        this.sessions.push(new Session(id, date, unmissable, sector, difficulty, done));
    }
}

// esportazione necessaria della classe perché la si possa usare anche altrove
module.exports = SessionManager;
