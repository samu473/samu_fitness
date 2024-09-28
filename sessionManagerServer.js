const Session = require("./sessionServer");

class SessionManager {
    static sectors = ['Gambe', 'Schiena', 'Addominali', 'Glutei', 'Petto', 'Bicipiti', 'Spalle', 'Cardio', 'Stretching'];

    constructor () {
        this.sessions = [];
    }

    createSessionList(sessions) {
        sessions.forEach(s => this.addSession(s.session_id, s.date, s.unmissable, s.sector, s.difficulty, s.done));
    }

    addSession(id, date, unmissable = true, sector, difficulty, done = null) {
        this.sessions.push(new Session(id, date, unmissable, sector, difficulty, done));
    }
}

module.exports = SessionManager;