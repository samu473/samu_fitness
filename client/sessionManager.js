import Session from './session.js';

class SessionManager {
    static sectors = ['Gambe', 'Schiena', 'Addominali', 'Glutei', 'Petto', 'Bicipiti', 'Spalle', 'Cardio', 'Stretching'];
    constructor () {
        this.sessions = [];
    }

    async getUserSessionList(userId){
        let response = await fetch(`/users/${userId}/sessions`);
        const sessionsJson = await response.json();
        if (response.ok) {
            this.sessions = sessionsJson.map((s) => new Session(s));
            this.sessions.sort(SessionManager.compareDates);
            return this.sessions;
        } else {
            throw sessionsJson;
        }
    }

    async getUsernameSessionList(username){
        let response = await fetch(`/search?username=${encodeURIComponent(username)}`);
        const sessionsJson = await response.json();
        if (response.ok) {
            this.sessions = sessionsJson.map((s) => new Session(s));
            this.sessions.sort(SessionManager.compareDates);
            return this.sessions;
        } else {
            throw sessionsJson;
        }
    }

    addSession(session) {
        this.sessions.push(new Session(session));
        this.sessions.sort(SessionManager.compareDates);
    }

    static compareDates(a, b) {
        const dateA = a.date;
        const dateB = b.date;
        return (dateA.isBefore(dateB) ? -1 : dateB.isBefore(dateA) ? 1 : 0);
    }

    async createAllSessionList() {
        let response = await fetch(`/sessions`);
        const sessionsJson = await response.json();
        if (response.ok) {
            return sessionsJson;
        } else {
            throw sessionsJson;
        }
    }

    async dltSessionFromList(userId, session) {
        const response = await fetch(`/users/${userId}/sessions/${session.id}`, {
            method: 'DELETE',
        });
        if(!response.ok){
            throw response;
        } else { 
            const index = this.sessions.indexOf(session);
            if (index > -1) {
                this.sessions.splice(index, 1);
            }
        }
    }

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
            throw response;
        } else {
            const session2 = this.sessions.find((s) => s.id == session.id);
            session2.setProperties(session);
        }
    }

    async addSessionInList(userId, session) {
        const response = await fetch(`/users/${userId}/sessions`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(session)
        });
        const res = await response.json();
        if (!response.ok) {
            throw res;
        } else {
            try {
                session.session_id = res;
                this.addSession(session);
            } catch (error) {
                throw error;
            }
        }
    }

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

    getSectors () {
        let sectors = [];
        this.sessions.forEach(s => {
            s.sector.forEach(sec => {
                sectors.push(sec);
            });
        });
        sectors = sectors.filter((item, index) => sectors.indexOf(item) === index);
        return sectors.sort();
    }
}

export default SessionManager;