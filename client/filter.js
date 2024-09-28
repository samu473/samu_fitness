"use strict";

class Filter {
    constructor(sessionManager, filterType) {
        this.sessionManager = sessionManager;
        this.filterType = filterType;
        this.sessions = this.sessionManager.sessions;
    }

    apply(sector = null) {
        switch (this.filterType) {
            case 'all':
                return this.sessionManager.sessions;
            case 'unmissable':
                return this.getUnmissableSessionList();
            case 'today':
                return this.getSessionListExpiringToday();
            case 'week':
                return this.getSessionListExpiringThisWeek();
            case 'done':
                return this.getDoneSessionList(true);
            case 'undone':
                return this.getDoneSessionList(false);
            case 'sector':
                if (sector == 'all-sectors') {
                    return this.sessionManager.sessions;
                } else {
                    return this.getSessionListBySector(sector);
                }
            default:
                return this.sessionManager.sessions;
        }
    }

      getSessionListExpiringToday(){
        return this.sessions.filter(s => {
            if (s.date) { 
                return s.date.isSame(moment(),'day');
            }
        });
    }

    getSessionListExpiringThisWeek(){
        return this.sessions.filter(s => {
            if (s.date) { 
                return s.date.isBetween(moment(), moment().add(6, 'days'),'day','[]');
            }
        });
    }

    getDoneSessionList(flag) {
        const today = moment();
    
        return this.sessions.filter(s => 
            flag ? s.done : (!s.done && moment(s.date).isSameOrBefore(today))
        );
    }

    getUnmissableSessionList () {
        return this.sessions.filter( s => s.unmissable);
    }

    getSessionListBySector (sector) {
        return this.sessions.filter( s => s.sector.includes(sector));
    }
}

export default Filter;
