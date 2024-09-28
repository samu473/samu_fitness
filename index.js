"use strict";
const { app, port, passport } = require ('./init');
const {check, validationResult} = require('express-validator');

const dao = require('./dao');
const usersdao = require('./users-dao');
const SessionManager = require('./sessionManagerServer');

app.get('/sessions', (req, res) => {
    dao.getSessions()
    .then((sessions) => res.json(sessions))
    .catch((err) => res.status(err.status || 500).json(err.msg || 'Errore interno del server.' ));
});

app.get('/sessions/:sessionId', (req, res) => {
  dao.getSession(req.params.sessionId)
    .then((session) => res.json(session))
    .catch((err) => res.status(err.status || 500).json(err.msg || 'Errore interno del server.' ));
});

app.post('/sessions', [
    check('date').notEmpty(),
    check('unmissable').optional().isBoolean(),
    check('sectors').notEmpty(),
    check('difficulty').notEmpty().isString(),
    check('done').optional().isBoolean(),
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    dao.addSession(req.body)
    .then((id) => res.json(id))
    .catch((err) => res.status(err.status || 500).json(err.msg || 'Errore interno del server.' ));
});

app.delete('/sessions/:sessionId', (req, res) => {
  const sessionId = req.params.sessionId;
  dao.deleteSession(sessionId)
    .then(() => res.end())
    .catch((err) => res.status(err.status || 500).json(err.msg || 'Errore interno del server.' ));
});

app.put('/sessions/:sessionId', [
    check('date').notEmpty(),
    check('unmissable').optional().isBoolean(),
    check('sectors').notEmpty(),
    check('difficulty').notEmpty().isString(),
    check('done').optional().isBoolean(),
], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()});
  }
  const sessionId = req.params.sessionId;
  dao.updateSession(sessionId, req.body)
    .then(() => res.end())
    .catch((err) => res.status(err.status || 500).json(err.msg || 'Errore interno del server.' ));
});

app.get('/users/:userId', (req, res) => {
    usersdao.getUser(req.params.userId)
    .then((user) => res.json(user))
    .catch((err) => res.status(err.status || 500).json(err.msg || 'Errore interno del server.' ));
  });

app.get('/users/user/:username', (req, res) => {
    usersdao.getUserByUsername(req.params.username)
    .then((user) => res.json(user))
    .catch((err) => res.status(err.status || 500).json(err.msg || 'Errore interno del server.' ));
});


app.get('/users/:userId/sessions', [
    check('filter').optional().isString(),
    check('sector').optional().isString(),
    ], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    const userId = req.params.userId;
    dao.getSessionsInList(userId, req.query)
    .then((sessions) => res.json(sessions))
    .catch((err) => res.status(err.status || 500).json(err.msg || 'Errore interno del server.' ));
});

    // Aggiunge la sessione alla lista di un utente
app.post('/users/:userId/sessions', [
    check('date').notEmpty(),
    check('unmissable').optional().isBoolean(),
    check('sector').notEmpty(),
    check('difficulty').notEmpty().isString(),
    check('done').optional().isBoolean(),
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    const userId = req.params.userId;
    dao.addSessionInList(userId, req.body)
    .then((id) => {
        res.json(id);
    })
    .catch((err) => res.status(err.status || 500).json(err.msg || 'Errore interno del server.' ));
});

    // Cancella sessione dalla lista di un utente
app.delete('/users/:userId/sessions/:sessionId', (req, res) => {
    const userId = req.params.userId;
    const sessionId = req.params.sessionId;
    dao.deleteSessionInList(userId, sessionId)
    .then(() => res.end())
    .catch((err) => res.status(err.status || 500).json(err.msg || 'Errore interno del server.' ));
});

    // Aggiorna sessione nella lista di un utente
app.put('/users/:userId/sessions/:sessionId', [
    check('unmissable').optional().isBoolean(),
    check('difficulty').notEmpty().isString(),
    check('done').optional().isBoolean(),
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json('Errore di validazione');
    }
    const userId = req.params.userId;
    const sessionId = req.params.sessionId;
    dao.updateSessionInList(userId, sessionId, req.body)
    .then(() => res.end())
    .catch((err) => res.status(err.status || 500).json(err.msg || 'Errore interno del server.' ));
});

    // Cerca la lista di un utente
app.get('/search', async (req, res) => {
    const username = req.query.username;
    if (!username) {
        return res.status(404).json('Inserisci un username');
    }
    try {
        const user = await usersdao.getUserByUsername(username);
        const sessions = await dao.getSessionsInList(user.id);
        res.json(sessions);
    } catch (err) {
        res.status(err.status || 500).json(err.msg || 'Errore interno del server.' );
    }
});

    // Restituisce i settori
app.get('/sectors', (req,res) => {
    const sectors = SessionManager.sectors;
    res.json({sectors:sectors});
});


    // Restituisce i settori in una lista
app.get('/users/:userId/sessions/sectors', [
    check('userId').notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json('Errore di validazione');
    }
    const userId = req.params.userId;
    dao.getSectorsInList(userId)
    .then((sectors) => res.json({sectors:sectors}))
    .catch((err) => res.status(err.status || 500).json(err.msg || 'Errore interno del server.' ));
});

//Rotte del login

    // Controlla l'autenticazione di un utente
app.get('/check', async (req, res) => {
    try {
        if (req.session && req.user) {
            return res.status(200).json(req.user);
        } else {
            return res.status(401).json('Utente non autenticato');
        }
    } catch (err) {
        res.status(err.status || 500).json(err.message || 'Internal server error');
    }
});

app.post('/login', function(req, res, next) {
    passport.authenticate('local', async function(err, user, info) {
        try {
            if (err) { throw err; }
            if (!user) {
                return res.status(401).json('Nome utente o password errati');
            }
            req.login(user, function(err) {
                if (err) { throw err; }
                return res.json(req.user);
            });
        } catch (err) {
            res.status(err.status || 500).json(err.message || 'Internal server error');
        }
    })(req, res, next);
});

app.delete('/logout', async (req, res) => {
    try {
        req.logout((err) => {
            if(err) throw err;
        });
        res.end('');
    } catch (err) {
        res.status(err.status || 500).json(err.message || 'Errore interno del server');
    }
});

app.post('/users', [
    check('user').isObject()
    ], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const userId = await usersdao.createUser(req.body.user);
        await usersdao.createProfile(userId);
        res.status(201).header('Location', `/users/${userId}`).end();
    } catch (err) {
        res.status(err.status || 500).json(err.msg || 'Errore interno del server.' );
    }
});

    // Restituisce il profilo dell'utente
app.get('/users/:userId/profile', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const profile = await usersdao.getProfile(userId);
        res.json(profile);
    } catch (err) {
        res.status(err.status || 500).json(err.msg || 'Errore interno del server.');
    }
});

    // Cambia la privacy del profilo dell'utente
app.put('/users/:userId/profile/privacy', async (req, res) => {
    try{
        const { userId } = req.params;
        usersdao.updatePrivacy(userId);
        res.end();
    } catch(err) {
        res.status(err.status || 500).json(err.msg || 'Errore interno del server.');
    }
});

    // Elimina il profilo dell'utente
    app.delete('/users/:userId/profile', async (req, res) => {
        try {
            const userId = parseInt(req.params.userId);
            await usersdao.dltProfile(userId);
            res.end();
        } catch (err) {
            res.status(err.status || 500).json(err.msg || 'Errore interno del server.');
        }
    });

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});
