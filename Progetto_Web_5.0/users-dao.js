"use script";
/******
 * a data access object (DAO) is a pattern that provides an abstract interface 
 * to some type of database or other persistence mechanism.
******/

// modules import
const bcrypt = require('bcrypt');
const sessionManager = require('./sessionManagerServer');
const Filter = require('./filtersServer');
const {sequelize, DataTypes, User} = require('./sequelize.js');

sequelize.sync()
.then(() => {
    console.log('Tabella "user" creata con successo.');
})
.catch(error => {
    console.error('Errore nella creazione della tabella "user":', error);
});

function removeTrailingComma(str) {
    if (str.endsWith(',')) {
        return str.slice(0, -1);
    }
    return str;
}

/**
 * Get users in db.
 * @param {string} userId - User's unique ID.
 * @returns {Promise} - Promise object representing the list of users.
 */
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

/**
 * 
 * @param {string} username user name
 * @returns user object
 */
exports.getUserByUsername = async function (username) {
    try {
      const user = await User.findOne({ where: { username } });
      
      if (user) {
        user.checkPassword = function (password) {
          return bcrypt.compareSync(password, user.password);
        };
        return user;
      } else {
        throw { status: 404, message: `Incorrect username='${username}'` };
      }
    } catch (err) {
      throw { status: 500, msg: err.message };
    }
  };

/**
 * Get a user by ID.
 * @param {string} userId - User's unique ID.
 * @returns {Promise} - Promise object representing the user.
 */
exports.getUser = async function (userId) {
    try {
        const user = await User.findByPk(userId);
      
        if(user) {
        return user;
        } else {
            throw { status: 404, msg: `Errore: nessun user con id ${userId} nel db` };
        }
    } catch (err) {
        throw { status: 500, msg: err.message };
    }
};


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

/**
 * Create a new user, eventually after a signup 
 * @param {Object} user - User's info.
 * @returns {Promise} - Promise object representing the creation operation.
 */
exports.createUser = async function(user) {
    //if(await doesUsernameExist(user)) throw { status: 409, msg: 'Username già in uso' };
    try {
        // create the hash as an async call, given that the operation may be CPU-intensive (and we don't want to block the server)
        const hash = await bcrypt.hash(user.password, 10);
        const newUser = await User.create({
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            password: hash,
            email: user.email
        });
        console.log(newUser.id);
        return newUser.id;
    } catch (err) {
        if(err == 'SequelizeUniqueConstraintError: Validation error') throw { status: 409, msg: 'Utente già esistente (e-mail o username già in uso)'};
        else throw { status: 500, msg: err.message };
    }
};

exports.updateUser = async function(user) {
    if (!user || !user.id) {
        throw { status: 400, msg: "Invalid user data" };
    }
  
    // Crea un oggetto contenente solo i campi che devono essere aggiornati
    const updateFields = {};
    if (user.firstname) updateFields.firstname = user.firstname;
    if (user.lastname) updateFields.lastname = user.lastname;
    if (user.email) updateFields.email = user.email;
  
    try {
        const [updatedRows] = await User.update(updateFields, {
            where: { id: user.id }
        });
      
        if (updatedRows === 0) {
            throw { status: 404, msg: `No user found with id ${user.id}` };
        }
  
        return;
    } catch (err) {
      throw { status: 500, msg: err.message };
    }
};

/*
doesUsernameExist = async function(user){
    try{
        const foundUser = await User.findOne({
            where: {
                username: user.username
            }
        });
        return !!foundUser;
    } catch (err) {
        throw { status: 500, msg: err.message}
    }
}
*/