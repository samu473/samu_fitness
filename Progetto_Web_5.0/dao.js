"use script";
/******
 * a data access object (DAO) is a pattern that provides an abstract interface 
 * to some type of database or other persistence mechanism.
******/

// modules import
const sessionManager = require('./sessionManagerServer');
const Filter = require('./filtersServer');
const {sequelize, DataTypes, Session, List} = require('./sequelize.js');


sequelize.sync()
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch(err => {
        console.error('Unable to create tables, shutting down...', err);
    });

/*
/**
 * // Trasforma il record nella linea row in un oggetto Sequelize Session
 * @param {Object} row - la riga nella tabella 'session'.
 * @returns {Object} - oggetto Sessione.
 *
async function newSession(object) {
    try {
        // Trasforma il record row in un oggetto Sequelize Session
        const session = await Session.create({
            session_id: object.session_id,
            date: object.date,
            unmissable: object.unmissable,
            difficulty: object.difficulty,
            sectorList: (object.sector) ? object.sector.split(',') : null,
            done: object.done
        });
        return session;
    } catch (error) {
        console.error('Errore durante la creazione di una sessione:', error);
        throw error;
    }
}
*/

/**
 * Create a session object from a record of the 'session' table in the database.
 * @param {Object} row - Row from the 'session' table.
 * @returns {Object} - Session object.
 */
function newSession(row) {
    const session = row.get({ plain: true });
    session.sector = (row.sector) ? row.sector.split(',') : null;
    session.difficulty = (row.difficulty === 0) ? 'Principiante' : (row.difficulty === 1) ? 'Intermedio' : 'Esperto';
    return session;
}

/**
 * Restituisce tutte le sessioni dal database.
 * @returns {Promise} - Oggetto Promise che rappresenta la lista delle sessioni.
 */
exports.getSessions = async function () {
    try {
        const rows = await Session.findAll();
        if (rows.length) {
            const sessions = rows.map(s => newSession(s));
            return sessions;
        } else {
            throw { status: 404, msg: 'Nessuna sessione trovata nel database' };
        }
    } catch (error) {
        throw { status: 500, msg: 'Errore interno del server' };
    }
}

/**
 * Get a movie by ID.
 * @param {string} sessionId - ID della sessione.
 * @returns {Promise} - Oggetto Promise che rappresenta la sessione.
 */
exports.getSession = async function (sessionId) {
    try {
        const row = await Session.findOne({
            where: {
                session_id: sessionId
            }
        });
        if (row) {
            session = newSession(row);
            return session;
        } else {
            throw { status: 404, msg: 'Sessione non trovata' };
        }
    } catch (error) {
        throw { status: 500, msg: 'Errore interno del server' };
    }
}

/**
 * Add a new movie.
 * @param {Object} session - Oggetto Session da aggiungere.
 * @returns {Promise} - Oggetto Promise che rappresenta l'id della sessione aggiunta.
 */
exports.addSession = async function (session) {
    try{
        const row = await Session.create({
            date: session.date,
            unmissable: session.unmissable,
            difficulty: session.difficulty === 'Principiante' ? 0 : session.difficulty === 'Intermedio' ? 1 : 2,
            sector: session.sectorList.join(','),
            done: session.done
        });
        if (row && row.session_id) {
            return row.session_id;
        } else {
            throw { status: 404, msg: 'Errore interno del server: ID della sessione non trovato' };
        }
    } catch(err) {
        throw { status: 500, msg: 'Errore interno del server' };
    }
}

/**
 * Delete a movie.
 * @param {string} movieId - Movie's unique ID.
 * @returns {Promise} - Promise object representing the deletion operation.
 */
exports.deleteSession = async function (sessionId) {
    try{
        const res = await Session.destroy({
            where: {
                session_id: sessionId
            }
        });
        if (!res) {
            throw { status: 404, msg: 'Errore interno del server: ID della sessione non trovato' };
        }
    } catch(err) {
        throw { status: 500, msg: 'Errore interno del server' };
    }
}

/**
 * Update a movie.
 * @param {string} movieId - Movie's unique ID.
 * @param {Object} movieInfo - New information for the movie.
 * @returns {Promise} - Promise object representing the update operation.
 */
exports.updateSession = async function (sessionId, sessionInfo) {
    try{
        const [res] = await Session.update({
            date: sessionInfo.date,
            unmissable: sessionInfo.unmissable,
            difficulty: sessionInfo.difficulty === 'Principiante' ? 0 : sessionInfo.difficulty === 'Intermedio' ? 1 : 2,
            sector: sessionInfo.sectorList.join(','),
            done: sessionInfo.done
        }, {
            where: {
                session_id: sessionId
            },
            returning: false    //Non restituisce le righe modificate
        });
        if (!res) {
            throw { status: 404, msg: 'Errore interno del server: ID della sessione non trovato' };
        }
    } catch(err) {
        throw { status: 500, msg: 'Errore interno del server: ' + err};
    }
}

/**
 * Get sessions in user's wishlist.
 * @param {string} userId - User's unique ID.
 * @param {Object} query - Query parameters for filtering movies.
 * @returns {Promise} - Promise object representing the list of movies.
 */
exports.getSessionsInList = async function (userId, query) {
    try{
        const rows = await Session.findAll({
            include: [{
                model: List,
                where: {
                    user_id: userId
                },
                required: true
            }]
        });
        if (!rows) {
            throw { status: 404, msg: 'Errore interno del server: ID della sessione non trovato' };
        }
        const sessions = rows.map(s => newSession(s));
        console.log(sessions);
        const filter = query.filter;
            if (filter) {
                const sessionManager = new SessionManager();
                sessionManager.createSessionList(sessions);

                const filterType = new Filter(sessionManager, filter);
                if (filter === 'category') {
                    const sector = query.sector;
                    if (sector) {
                        sessions = filterType.apply(sector);
                    } else {
                        sessions = filterType.apply('all-categories');
                    }
                } else {
                    sessions = filterType.apply();
                }
            }

            return sessions;

    } catch(err) {
        throw { status: 500, msg: 'Errore interno del server' + err };
    }
}

/**
 * Get settori in user's wishlist.
 * @param {string} userId - User's unique ID.
 * @returns {Promise} - Promise object representing the list of sectors.
 */
exports.getSectorsInList = async function (userId) {
    try {
        const sessions = await Session.findAll({
            include: [{
                model: List,
                where: { user_id: userId },
                attributes: [] // Non vogliamo nessun attributo da List, solo la relazione
            }],
            attributes: ['sector']
        });

        if (sessions.length) {
            let sectors = [];
            //Estrae i settori
            sessions.forEach(s => {
                sectors = sectors.concat(s.sector.split(','));
            });
            // Rimuove i duplicati
            sectors = sectors.filter((item, index) => sectors.indexOf(item) === index);
            return sectors;
        } else {
            throw { status: 404, msg: `Errore: nessuna sessione nella wishlist dell'utente ${userId}` };
        }
    } catch (error) {
        throw { status: 500, msg: 'Errore interno del server' };
    }
}

/**
 * Add a movie to the user's wishlist.
 * @param {string} userId - User's unique ID.
 * @param {string} movieId - Movie's unique ID.
 * @param {Object} movieInfo - Additional information about the movie.
 * @returns {Promise} - Promise object representing the addition operation.
 */
exports.addSessionInList = async function (userId, sessionInfo) {
    try {
        const newSession = await Session.create({
            date: sessionInfo.date,
            unmissable: sessionInfo.unmissable,
            difficulty: sessionInfo.difficulty === 'Principiante' ? 0 : sessionInfo.difficulty === 'Intermedio' ? 1 : 2,
            sector: sessionInfo.sector.join(','),
            done: sessionInfo.done
        });
        if (!newSession || !newSession.session_id) {
            throw { status: 500, msg: 'Errore interno del server: impossibile creare la sessione' };
        }
        newListEntry = await List.create({
            user_id: userId,
            session_id: newSession.session_id
        });
        if (!newListEntry) {
            throw { status: 500, msg: 'Errore interno del server: Impossibile aggiungere la sessione alla lista dell\'utente' };
        }
        return newSession.session_id;
    } catch (err) {
        if (err.status) {
            throw err;
        } else {
            throw { status: 500, msg: 'Errore interno del server ' + err };
        }
    }
}

/**
 * Delete a movie from the user's wishlist.
 * @param {string} userId - User's unique ID.
 * @param {string} movieId - Movie's unique ID.
 * @returns {Promise} - Promise object representing the deletion operation.
 */
exports.deleteSessionInList = async function (userId, sessionId) {
    try{
        const res = await Session.destroy({
            where: {
                session_id: sessionId
            }
        })
        /*
        Rimozione a cascata della sessione quindi non serve rimuoverla anche a List
        const res = await List.destroy({
            where:{
                user_id: userId,
                session_id: sessionId
            }
        });
        */
        if(!res){
            throw { status: 404, msg: 'Errore interno del server: ID della sessione non trovato'}
        }
    } catch(err) {
        throw { status: 500, msg: 'Errore interno del server' };
    }
}

/**
 * Update a movie in the user's wishlist.
 * @param {string} userId - User's unique ID.
 * @param {string} movieId - Movie's unique ID.
 * @param {Object} movieInfo - Updated information about the movie.
 * @returns {Promise} - Promise object representing the update operation.
 */
exports.updateSessionInList = async function (userId, sessionId, sessionInfo) {
    try {
        // Controlla se la sessione è nella wishlist dell'utente
        const row = await List.findOne({
            where: {
                user_id: userId,
                session_id: sessionId
            }
        });
        if (!row) {
            throw { status: 422, msg: `Errore: sessione con ID ${sessionId} non presente nella wishlist dell'utente ${userId}.` };
        }
        // Esegue l'aggiornamento della sessione
        const [res] = await Session.update(
            {
                unmissable: sessionInfo.unmissable,
                difficulty: sessionInfo.difficulty === 'Principiante' ? 0 : sessionInfo.difficulty === 'Intermedio' ? 1 : 2,
                done: sessionInfo.done
            },
            {
                where: {
                    session_id: sessionId
                }
            }
        );

        if (!res) {
            throw { status: 404, msg: 'Errore interno del server: ID della sessione non trovato' };
        }
    } catch(err) {
        throw { status: 500, msg: 'Errore interno del server' + err };
    }
}