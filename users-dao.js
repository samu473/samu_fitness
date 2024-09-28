"use script";

const bcrypt = require('bcrypt');
const {sequelize, DataTypes, User, Profile} = require('./sequelize.js');

sequelize.sync()
.then(() => {
    console.log('Tabella "user" creata con successo.');
})
.catch(error => {
    console.error('Errore nella creazione della tabella "user":', error);
});

exports.getUsers = async function () {
    try {
        const users = await User.findAll();
        if (users.length > 0) {
            return users;
        } else {
            throw { status: 404, msg: "Errore: nessun user nel db" };
        }
      } catch (err) {
        throw { status: 500, msg: err.message };
    }
}; 

exports.doLogin = async function (username) {
    try {
        const user = await User.findOne({ where: { username } });
        if (user) {
            user.checkPassword = function (password) {
            return bcrypt.compareSync(password, user.password);
            };
            return user;
        } else {
            throw { status: 404, msg: `Username non valido: '${username}'` };
        }
    } catch (err) {
        throw { status: err.status, msg: err.msg };
    }
  };

exports.getUser = async function (userId) {
    try {
        const user = await User.findByPk(userId);
      
        if(user) {
        return user;
        } else {
            throw { status: 404, msg: `Errore: nessun user con id ${userId} nel database` };
        }
    } catch (err) {
        throw { status: err.status, msg: err.msg };
    }
};

exports.getUserByUsername = async function (username) {
    try {
        const user = await User.findOne({where: { username }});
        if(user) {
        return user;
        } else {
            throw { status: 404, msg: `Errore: nessun user con username ${username} nel database` };
        }
    } catch (err) {
        throw { status: err.status, msg: err.msg };
    }
};

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
            throw { status: 404, message: 'ID della sessione non trovato' };
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
        newListEntry = await List.create({
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
    } catch(err) {
        throw { status: 500, msg: 'Errore interno del server' };
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
        if (!res) {
            throw { status: 404, message: 'Errore interno del server: ID della sessione non trovato' };
        }
    } catch (err) {
        throw { status: err.status || 500, msg: err.message || 'Errore del server' };
    }
}

exports.createUser = async function(user) {
    try {
        const hash = await bcrypt.hash(user.password, 10);
        const newUser = await User.create({
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            password: hash,
            email: user.email
        });
        return newUser.id;
    } catch (err) {
        if(err == 'SequelizeUniqueConstraintError: Validation error') throw { status: 409, msg: 'Utente già esistente (e-mail o username già in uso)'};
        else throw { status: err.status || 500, msg: err.message || 'Errore interno del server' };
    }
};

exports.createProfile = async function(userId) {
    try {
        const newProfile = await Profile.create({
            userId,
        });
        return newProfile;
    } catch (err) {
        throw { status: err.status || 500, msg: err.message || 'Errore del server' };
    }
}

exports.getProfile = async function(userId){
    try {
        const profile = await Profile.findOne({ where: { userId } });
        return profile;
    } catch (err) {
        throw { status: err.status || 500, msg: err.message || 'Errore del server' };
    }
}

exports.updateUser = async function(user) {
    if (!user || !user.id) {
        throw { status: 400, msg: "Invalid user data" };
    }
    const updateFields = {};
    if (user.firstname) updateFields.firstname = user.firstname;
    if (user.lastname) updateFields.lastname = user.lastname;
    if (user.email) updateFields.email = user.email;
    try {
        const [updatedRows] = await User.update(updateFields, {
            where: { id: user.id }
        });
      
        if (updatedRows === 0) {
            throw { status: 404, message: `Utente con id ${user.id} non trovato` };
        }
        return;
    } catch (err) {
        throw { status: err.status || 500, msg: err.message || 'Errore del server' };
    }
};

exports.updatePrivacy = async function(userId) {
    try {
        const profile = await Profile.findOne({ where: { userId } });
        if (!profile) {
            throw { status: 404, message: 'Profilo non trovato' };
        }
        profile.private = !profile.private;
        await profile.save();
        return;
    } catch (err) {
        throw { status: err.status || 500, msg: err.message || 'Errore del server' };
    }
};

exports.dltProfile = async function (userId) {
    try {
        const res = await Profile.destroy({
            where: {
                userId: userId
            }
        });
        if (!res) {
            throw { status: 404, message: 'Errore interno del server: ID del profilo non trovato' };
        }
    } catch (err) {
        throw { status: err.status || 500, msg: err.message || 'Errore del server' };
    }
};