/*
"use strict";

class SessionManager {

    static sectors = ['Gambe', 'Schiena', 'Addominali', 'Glutei', 'Petto', 'Bicipiti', 'Spalle', 'Cardio', 'Stretching'];

    // Costruttore della classe SessionManager
    // Inizializza la lista dei film come un array vuoto
    constructor () {
        this.sessions = [];
        // Invoca il metodo createSessionList per popolare la lista dei film desiderati
        this.createSessionList();
    }

    // Metodo per creare la lista dei film desiderati e aggiungerli alla lista this.sessions
    createSessionList() {
        // Il popolamento può essere estratto in modo più furbo da un db o da un file lato server
        this.addSession('28 June 2024', false, 'Gambe', 'Intermedio');
        this.addSession('06 May 2024', true, ['Schiena', 'Petto', 'Glutei'], 'Esperto');
        this.addSession('04 July 2024', true, ['Addominali', 'Cardio'], 'Intermedio');
        this.addSession('06 July 2024', false, ['Schiena', 'Stretching'], 'Principiante');
        /*
        this.addSession('Challengers', false, 'private', '15 May 2024', ['Dramas','Romantic', 'Sports'] );
        this.addSession('Civil War', true, 'public');
        //
    }

    // Metodo per aggiungere nuovi film alla lista sessions utilizzando il costruttore della classe Session
    addSession(date, unmissable=true, category=null, difficulty) {
        this.sessions.push(new Session(date, unmissable, category, difficulty));
    }

    // Metodo per ottenere la lista delle categorie effettivamente usate dai film 
    // La lista non deve contenere duplicati e deve essere restituita in ordine alfabetico
    getSectors () {
        let sectors = [];
        // Itera su ogni film per estrarre le categorie
        this.sessions.forEach( s => {
            sectors = sectors.concat(s.sectorList);
        });
        // Filtra le categorie rimuovendo i duplicati
        sectors = sectors.filter((item, index) => sectors.indexOf(item) === index);
        // Ordina le categorie in ordine alfabetico
        return sectors.sort();
    }
}
*/

"use strict";

//import { session } from 'passport';
import Session from './session.js';

class SessionManager {

    static sectors = ['Gambe', 'Schiena', 'Addominali', 'Glutei', 'Petto', 'Bicipiti', 'Spalle', 'Cardio', 'Stretching'];

    /**
     * Creates an instance of SessionManager.
     */
    constructor () {
        this.sessions = [];
    }

    /**
     * Gets all the sessions in the user's wishlist as JSON and builds a sorted array with them.
     * @return {Promise<void>}
     */
    async getUserSessionList(userId) {
        let response = await fetch(`/users/${userId}/sessions`);
        const sessionsJson = await response.json();
        console.log(sessionsJson);
        if (response.ok) {
            this.sessions = sessionsJson.map((m) => new Session(m));
            this.sessions.sort(SessionManager.compareDates);
            return this.sessions;
        } else {
            throw sessionsJson;  // an object with the error coming from the server
        }
    }

    /**
     * Adds a new session to the sessions array.
     * @param  {Object} session - The session object to add.
     */
    addSession(session) {
        this.sessions.push(new Session(session));
    }

    /**
     * Compares the dates of two sessions.
     * @param  {Object} a - The first session object.
     * @param  {Object} b - The second session object.
     * @return {number} - Comparison result: -1 if a < b, 1 if a > b, 0 if equal.
     */
    static compareDates(a, b) {
        const dateA = a.date;
        const dateB = b.date;
        return (dateA.isBefore(dateB) ? -1 : dateB.isBefore(dateA) ? 1 : 0);
    }

    /**
     * Fetches the list of sessions from the server.
     *
     * @async
     * @returns {Promise<Object[]>} A promise that resolves to an array of session objects.
     * @throws {Object} An error object containing the error message from the server if the fetch fails.
     */
    async createAllSessionList() {
        let response = await fetch(`/sessions`);
        const sessionsJson = await response.json();
        if (response.ok) {
            return sessionsJson;
        } else {
            throw sessionsJson;  // an object with the error coming from the server
        }
    }

    /**
     * Deletes a session from the database and the sessions array.
     * @param  {number} id - The ID of the session to delete.
     * @return {Promise<void>}
     * @throws {Response} - Throws the response if the deletion fails.
     */
    async dltSessionFromList(userId, session) {
        const response = await fetch(`/users/${userId}/sessions/${session.id}`, {
            method: 'DELETE',
        });
        if(!response.ok){
            console.log('Failed to remove data on server: ', response);
            throw response;
        } else { 
            const index = this.sessions.indexOf(session);
            if (index > -1) {
                this.sessions.splice(index, 1);
            }
        }
    }

    /**
     * Updates an existing session in a user's wishlist.
     * @param  {number} userId - id of the wishlist's user.
     * @param  {Object} session - The session object with updated details.
     * @return {Promise<void>}
     * @throws {Response} - Throws the response if the update fails.
     */
    async updSessionInWishList(userId, session) {
        const response = await fetch(`/users/${userId}/sessions/${session.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                unmissable: session.unmissable,
                difficulty: session.difficulty,
                done: session.done
            }),  
        });
        if (!response.ok) {
            console.log('Failed to store data on server: ', response);
            throw response;
        } else {
            const session2 = this.sessions.find((s) => s.id == session.id);
            session2.setProperties(session);
        }
    }

    /**
     * Adds a new session to the database and to the sessions array.
     * @param  {number} userId - id of the wishlist's user.
     * @param  {Object} session - The new session object to add.
     * @return {Promise<void>}
     * @throws {Response} - Throws the response if the addition fails.
     */
    async addSessionInList(userId, session) {
        const response = await fetch(`/users/${userId}/sessions`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(session)
        });
        //const json = await response.json();
        if (!response.ok) {
            throw response;
        } else {
            try{
                const data = await response.json();
                session.id = data;
                this.addSession(session);
            } catch (error) {
                console.error('Errore durante il parsing della risposta JSON:', error);
            }
        }
    }

    /**
     * Gets a session by its ID.
     * @param  {number} id - The ID of the session to retrieve.
     * @return {Promise<Session>} - The retrieved session object.
     * @throws {Object} - Throws the error response if the retrieval fails.
     */
    async getSession(id) {
        const response = await fetch(`/sessions/${id}`);
        const sessionJson = await response.json();
        if (response.ok) {
            const session = new Session(sessionJson);
            return session;
        } else {
            throw sessionJson;
        }
    }

    /**
     * Extracts a list of unique sectors from the sessions in the user wishlist and sorts them alphabetically.
     * 
     * @returns {string[]} A sorted array of unique sectors from the session list.
     */
    getSectors () {
        let sectors = [];
        // Itera su ogni film per estrarre le categorie
        this.sessions.forEach( m => {
            sectors = sectors.concat(m.category);
        });
        // Filtra le categorie rimuovendo i duplicati
        sectors = sectors.filter((item, index) => sectors.indexOf(item) === index);
        // Ordina le categorie in ordine alfabetico
        return sectors.sort();
    }
}

export default SessionManager;