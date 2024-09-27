"use strict";

class Filter {
    // Costruttore della classe Filter
    constructor(sessionManager, filterType) {
        // Inizializzazione delle variabili di istanza
        this.sessionManager = sessionManager; // Gestore degli allenamenti
        this.filterType = filterType; // Tipo di filtro da applicare

        this.sessions = this.sessionManager.sessions;
    }

    // Metodo apply per applicare il filtro configurato dal costruttore
    // Nel caso dei filtri basati sulle categorie, il metodo apply si aspetta  
    // di ricevere anche quale categoria l'utente ha selezionato tramite il parametro category
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
            case 'done':
                // Restituisce la lista degli allenamenti svolti
                return this.getDoneSessionList(true);
            case 'undone':
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

      // Metodo per ottenere la lista degli allenamenti in scadenza oggi
      getSessionListExpiringToday(){
        return this.sessions.filter(s => {
            // Filtra i film che hanno una data di scadenza (deadline) uguale a oggi
            if (s.date) { 
                return s.date.isSame(moment(),'day');
            }
        });
    }

    // Metodo per ottenere la lista degli allenamenti in scadenza questa settimana
    getSessionListExpiringThisWeek(){
        return this.sessions.filter(s => {
            // Filtra i film che hanno una data di scadenza (deadline) entro i prossimi 6 giorni
            if (s.date) { 
                return s.date.isBetween(moment(), moment().add(6, 'days'),'day','[]');
            }
        });
    }

    // Metodo per ottenere la lista degli allenamenti pubblici
    getDoneSessionList(flag) {
        return this.sessions.filter(s => flag ? s.done : !s.done);
    }

    // Metodo per ottenere la lista degli allenamenti imperdibili
    getUnmissableSessionList () {
        return this.sessions.filter( s => s.unmissable);
    }

    // Metodo per ottenere la lista degli allenamenti per categoria
    getSessionListByCategory (sector) {
        return this.sessions.filter( s => s.sectorList.includes(sector));
    }
}

export default Filter;
