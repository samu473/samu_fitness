"use strict";

class Session {

        constructor(sessionObj) {
            this.setProperties(sessionObj);
            this.id = sessionObj.session_id;
        }

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