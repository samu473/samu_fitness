"use strict";

/********
 * Simile alla classe Filter client side, ma agisce lato server
 ********/

// il modulo moment adesso viene importato qui e non da file html
// (è necessario installarlo su node prima con 'npm install moment')
const moment = require('moment');

/**
 * Class representing a filter for movies.
 */
class Filter {
    /**
     * Creates an instance of Filter.
     * @param {Object} movieManager - The movie manager object.
     * @param {string} filterType - The type of filter to apply.
     */
    constructor(sessionManager, filterType) {
        // Inizializzazione delle variabili di istanza
        this.sessionManager = sessionManager; // Gestore degli allenamenti
        this.filterType = filterType; // Tipo di filtro da applicare
    }

    /**
     * Applies the configured filter.
     * For sector-based filters, the method expects the selected sector as a parameter.
     * @param {string|null} [category=null] - The selected sector.
     * @returns {Array} The filtered list of sectors.
     */
    apply(sector = null) {
        switch (this.filterType) {
            case 'all':
                // Restituisce tutti gli allenamenti
                return this.sessionManager.sessions;
            case 'unmissable':
                // Restituisce la lista degli allenamenti imperdibili
                return this.getUnmissableSessionList();
            case 'today':
                // Restituisce la lista degli allenamenti di oggi
                return this.getSessionListExpiringToday();
            case 'week':
                // Restituisce la lista degli allenamenti di questa settimana
                return this.getSessionListExpiringThisWeek();
            case 'public':
                // Restituisce la lista degli allenamenti svolti
                return this.getDoneSessionList(true);
            case 'private':
                // Restituisce la lista degli allenamenti inconclusi
                return this.getDoneSessionList(false);
            case 'category':
                // Restituisce la lista degli allenamenti filtrati per settori allenati
                if (sector == 'all-sectors') {
                    return this.sessionManager.sessions; // Tutti i film se la categoria è 'Tutte'
                } else {
                    return this.getSessionListBySector(sector); // Film per una categoria specifica
                }
            default:
                // Restituisce tutti i film come fallback
                return this.sessionManager.sessions;
        }
    }

    /**
    * Gets the list of sessions expiring today.
    * @returns {Array} The list of sessions expiring today.
    */
    getSessionListExpiringToday(){
        return this.sessionManager.sessions.filter(s => {
            if (s.date) { 
                return s.date.isSame(moment(),'day');
            }
        });
    }

    /**
    * Gets the list of movies expiring this week.
    * @returns {Array} The list of movies expiring this week.
    */
    getSessionListExpiringThisWeek(){
        return this.sessionManager.sessions.filter(s => {
            if (s.date) { 
                return s.date.isBetween(moment(), moment().add(6, 'days'),'day','[]');
            }
        });
    }

    /**
     * Gets the list of unmissable movies.
     * @returns {Array} The list of unmissable movies.
     */
    getUnmissableSessionList () {
        return this.sessions.filter( s => s.unmissable);
    }

    /**
     * Gets the list of movies by category.
     * @param {string} category - The selected category.
     * @returns {Array} The list of movies by category.
     */
    getSessionListByCategory (sector) {
        return this.sessions.filter( s => s.sectorList.includes(sector));
    }

    /**
     * Gets the list of viewed or not viewed movies.
     * @param {boolean} flag - True to get viewed movies, false to get not viewed movies.
     * @returns {Array} The list of viewed or not viewed movies.
     */
    getDoneSessionList(flag) {
        return this.sessionManager.sessions.filter(s => flag ? s.done : !s.done);
    }
}


// esportazione necessaria della classe perché la si possa usare anche altrove
module.exports = Filter;