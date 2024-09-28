"use strict";

const {sequelize, Session, List} = require('./sequelize.js');

sequelize.sync()
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch(err => {
        console.error('Unable to create tables, shutting down...', err);
    });

function newSession(row) {
    const session = row.get({ plain: true });
    session.sector = (row.sector) ? row.sector.split(',') : null;
    session.difficulty = (row.difficulty === 0) ? 'Principiante' : (row.difficulty === 1) ? 'Intermedio' : 'Esperto';
    return session;
}

exports.getSessions = async function () {
    try {
        const rows = await Session.findAll();
        if (rows.length) {
            const sessions = rows.map(s => newSession(s));
            return sessions;
        } else {
            throw { status: 404, message: 'Nessuna sessione trovata nel database' };
        }
    } catch (err) {
        throw { status: err.status || 500, msg: err.message || 'Errore del server' };
    }
}

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
            throw { status: 404, message: 'Sessione non trovata' };
        }
    } catch (err) {
        throw { status: err.status || 500, msg: err.message || 'Errore del server' };
    }
}

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
            throw { status: 404, message: 'Errore interno del server: ID della sessione non trovato' };
        }
    } catch (err) {
        throw { status: err.status || 500, msg: err.message || 'Errore del server' };
    }
}

exports.deleteSession = async function (sessionId) {
    try{
        const res = await Session.destroy({
            where: {
                session_id: sessionId
            }
        });
        if (!res) {
            throw { status: 404, message: 'Errore interno del server: ID della sessione non trovato' };
        }
    } catch (err) {
        throw { status: err.status || 500, msg: err.message || 'Errore del server' };
    }
}

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
            returning: false
        });
    } catch (err) {
        throw { status: err.status || 500, msg: err.message || 'Errore del server' };
    }
}

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
        return sessions;
    } catch (err) {
        throw { status: err.status || 500, msg: err.message || 'Errore del server' };
    }
}

exports.getSectorsInList = async function (userId) {
    try {
        const sessions = await Session.findAll({
            include: [{
                model: List,
                where: { user_id: userId },
                attributes: []
            }],
            attributes: ['sector']
        });
        if (sessions.length) {
            let sectors = [];
            sessions.forEach(s => {
                sectors = sectors.concat(s.sector.split(','));
            });
            sectors = sectors.filter((item, index) => sectors.indexOf(item) === index);
            return sectors;
        } else {
            throw { status: 404, message: `Errore: nessuna sessione nella wishlist dell'utente ${userId}` };
        }
    } catch (err) {
        throw { status: err.status || 500, msg: err.message || 'Errore del server' };
    }
}

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
            throw { status: 500, message: 'Errore interno del server: impossibile creare la sessione' };
        }
        const newListEntry = await List.create({
            user_id: userId,
            session_id: newSession.session_id
        });
        if (!newListEntry) {
            throw { status: 500, message: 'Errore interno del server: Impossibile aggiungere la sessione alla lista dell\'utente' };
        }
        return newSession.session_id;
    } catch (err) {
        throw { status: err.status || 500, msg: err.message || 'Errore del server' };
    }
}

exports.deleteSessionInList = async function (userId, sessionId) {
    try{
        const res = await Session.destroy({
            where: {
                session_id: sessionId
            }
        })
        if(!res){
            throw { status: 404, message: 'Errore interno del server: ID della sessione non trovato'}
        }
    } catch (err) {
        throw { status: err.status || 500, msg: err.message || 'Errore del server' };
    }
}

exports.updateSessionInList = async function (userId, sessionId, sessionInfo) {
    try {
        const row = await List.findOne({
            where: {
                user_id: userId,
                session_id: sessionId
            }
        });
        if (!row) {
            throw { status: 422, message: `Errore: sessione con ID ${sessionId} non presente nella wishlist dell'utente ${userId}.` };
        }
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
    } catch (err) {
        throw { status: err.status || 500, msg: err.message || 'Errore del server' };
    }
}