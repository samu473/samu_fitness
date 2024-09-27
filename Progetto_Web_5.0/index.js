"use strict";

// require
const { app, port, passport } = require ('./init');
const {check, validationResult} = require('express-validator'); // validation middleware
//const swaggerUi = require('swagger-ui-express');
//const YAML = require('yamljs');

// require custom modules
const dao = require('./dao');
const usersdao = require('./users-dao');
const SessionManager = require('./sessionManagerServer');

//const swaggerDocument = YAML.load('./swagger.yaml');
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
      return next();
    }
    return res.status(401).json({status: 401, message : "not authenticated"});
}

// routes

/************************
 * 
 * APIs to manage sessions
 * 
 ***********************/

/**
 * @api {get} /sessions Get all sessions
 * @apiName GetMovies
 * @apiGroup Movies
 * 
 * @apiSuccess {Object[]} sessions List of sessions.
 * @apiError {Object} 400 Bad Request.
 * @apiError {Object} 500 Internal Server Error.
 */
app.get('/sessions', (req, res) => {
    dao.getSessions()
    .then((sessions) => res.json(sessions))
    .catch((err) => res.status(err.status).json(err.msg));
});

/**
 * @api {get} /sessions/:sessionId Get session by ID
 * @apiName GetMovie
 * @apiGroup Movies
 * 
 * @apiParam {String} sessionId Movie's unique ID.
 * 
 * @apiSuccess {Object} session Movie details.
 * @apiError {Object} 400 Bad Request.
 * @apiError {Object} 404 Not Found.
 * @apiError {Object} 500 Internal Server Error.
 */
app.get('/sessions/:sessionId', (req, res) => {
  dao.getSession(req.params.sessionId)
    .then((session) => res.json(session))
    .catch((err) => res.status(err.status).json(err.msg));
});

/**
 * @api {post} /sessions Create a new session
 * @apiName CreateMovie
 * @apiGroup Movies
 * 
 * @apiBody {String} title Movie title.
 * @apiBody {String} [deadline] Movie deadline.
 * @apiBody {String[]} [sector] List of sectors.
 * 
 * @apiSuccess {String} id Created session ID.
 * @apiError {Object} 422 Unprocessable Entity.
 * @apiError {Object} 500 Internal Server Error.
 */
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
    .catch((err) => res.status(err.status).json(err.msg));
});

/**
 * @api {delete} /sessions/:sessionId Delete a session
 * @apiName DeleteMovie
 * @apiGroup Movies
 * 
 * @apiParam {String} sessionId Movie's unique ID.
 * 
 * @apiSuccess {void} 200 OK.
 * @apiError {Object} 400 Bad Request.
 * @apiError {Object} 404 Not Found.
 * @apiError {Object} 500 Internal Server Error.
 */
app.delete('/sessions/:sessionId', (req, res) => {
  const sessionId = req.params.sessionId;
  dao.deleteSession(sessionId)
    .then(() => res.end())
    .catch((err) => res.status(err.status).json(err.msg));
});

/**
 * @api {put} /sessions/:sessionId Update a session
 * @apiName UpdateMovie
 * @apiGroup Movies
 * 
 * @apiParam {String} sessionId Movie's unique ID.
 * 
 * @apiBody {String} [title] Movie title.
 * @apiBody {String} [deadline] Movie deadline.
 * @apiBody {String[]} [sector] List of sectors.
 * 
 * @apiSuccess {void} 200 OK.
 * @apiError {Object} 422 Unprocessable Entity.
 * @apiError {Object} 500 Internal Server Error.
 */
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
    .catch((err) => res.status(err.status).json(err.msg));
});

/***********************************
 * 
 * APIs to manage users' wish lists
 * 
 **********************************/

/**
 * @api {get} /users/:userId/sessions Get user's wishlist
 * @apiName GetWishlist
 * @apiGroup Wishlist
 * 
 * @apiParam {String} userId User's unique ID.
 * @apiParam {String} [filter] Filter for sessions.
 * @apiParam {String} [sector] Filter by sector.
 * 
 * @apiSuccess {Object[]} sessions List of sessions in the wishlist.
 * @apiError {Object} 422 Unprocessable Entity.
 * @apiError {Object} 500 Internal Server Error.
 */
app.get('/users/:userId/sessions', [
    check('filter').optional().isString(),
    check('sector').optional().isString(),
    ], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    const userId = req.params.userId;
    console.log('1');
    dao.getSessionsInList(userId, req.query)
    .then((sessions) => res.json(sessions))
    .catch((err) => {
        console.log(err);
        res.status(err.status).json(err.msg);
    });
});

/**
 * @api {post} /users/:userId/sessions Add session to wishlist
 * @apiName AddMovieToWishlist
 * @apiGroup Wishlist
 * 
 * @apiParam {String} userId User's unique ID.
 * 
 * @apiBody {String} id Movie's unique ID.
 * @apiBody {Boolean} [unmissable] Is the session unmissable.
 * @apiBody {Boolean} [visibility] Movie visibility.
 * @apiBody {Boolean} [viewed] Has the session been viewed.
 * 
 * @apiSuccess {String} id Added session ID.
 * @apiError {Object} 422 Unprocessable Entity.
 * @apiError {Object} 500 Internal Server Error.
 */
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
    .catch((err) => res.status(err.status).json(err.msg));
});

/**
 * @api {delete} /users/:userId/sessions/:sessionId Remove session from wishlist
 * @apiName RemoveMovieFromWishlist
 * @apiGroup Wishlist
 * 
 * @apiParam {String} userId User's unique ID.
 * @apiParam {String} sessionId Movie's unique ID.
 * 
 * @apiSuccess {void} 200 OK.
 * @apiError {Object} 400 Bad Request.
 * @apiError {Object} 404 Not Found.
 * @apiError {Object} 500 Internal Server Error.
 */
app.delete('/users/:userId/sessions/:sessionId', (req, res) => {
    const userId = req.params.userId;
    const sessionId = req.params.sessionId;
    dao.deleteSessionInList(userId, sessionId)
    .then(() => res.end())
    .catch((err) => res.status(err.status).json(err.msg));
});

/**
 * @api {put} /users/:userId/sessions/:sessionId Update wishlist session
 * @apiName UpdateWishlistMovie
 * @apiGroup Wishlist
 * 
 * @apiParam {String} userId User's unique ID.
 * @apiParam {String} sessionId Movie's unique ID.
 * 
 * @apiBody {Boolean} [unmissable] Is the session unmissable.
 * @apiBody {Boolean} [visibility] Movie visibility.
 * @apiBody {Boolean} [viewed] Has the session been viewed.
 * 
 * @apiSuccess {void} 200 OK.
 * @apiError {Object} 422 Unprocessable Entity.
 * @apiError {Object} 500 Internal Server Error.
 */
app.put('/users/:userId/sessions/:sessionId', [
    check('unmissable').optional().isBoolean(),
    check('difficulty').notEmpty().isString(),
    check('done').optional().isBoolean(),
], (req, res) => {
    console.log(req.body);
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()});
  }
  const userId = req.params.userId;
  const sessionId = req.params.sessionId;
  console.log('avvio funzione');
  dao.updateSessionInList(userId, sessionId, req.body)
    .then(() => res.end())
    .catch(err => res.status(err.status).json(err.msg));
});

/***************************
 * 
 * APIs to manage sectors
 * 
 ***************************/

/**
 * @api {get} /sectors Ottieni tutti i settori
 * @apiName GetSectors
 * @apiGroup Sectors
 * 
 * @apiSuccess {Object[]} sectors List of sectors.
 * @apiError {Object} 500 Internal Server Error.
 */
app.get('/sectors', (req,res) => {
  const sectors = SessionManager.sectors;
  res.json({sectors:sectors});
});

/**
 * @api {get} /sectors/:sessionId Get sectors of a session
 * @apiName GetMovieSectors
 * @apiGroup Sectors
 * 
 * @apiParam {String} sessionId Movie's unique ID.
 * 
 * @apiSuccess {String} id Movie's unique ID.
 * @apiSuccess {String[]} sector List of sectors associated with the session.
 * @apiError {Object} 400 Bad Request.
 * @apiError {Object} 404 Not Found.
 * @apiError {Object} 500 Internal Server Error.
 */
app.get('/sectors/:sessionId', (req,res) => {
  dao.getSectors(req.params.sessionId)
    .then((session) => res.json({id:session.id, sector: session.sector}))
    .catch((err) => res.status(err.status).json(err.msg));
});

/**
 * @api {get} /users/:userId/sessions/sectors Get sectors in user's wishlist
 * @apiName GetUserWishlistSectors
 * @apiGroup Sectors
 * 
 * @apiParam {String} userId User's unique ID.
 * 
 * @apiSuccess {String[]} sectors List of sectors in the user's wishlist.
 * @apiError {Object} 422 Unprocessable Entity.
 * @apiError {Object} 500 Internal Server Error.
 */
app.get('/users/:userId/sessions/sectors', [
  check('userId').notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()});
  }
  const userId = req.params.userId;
  dao.getSectorsInList(userId)
    .then((sectors) => res.json({sectors:sectors}))
    .catch((err) => res.status(err.status).json(err.msg));
});

//Per le rotte del login
//verifica se un utente è admin
app.get('/check', [
    check('isAdmin').isBoolean()
  ], async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
  
      const isAdmin = (req.query.isAdmin === 'true');
      if (req.session && req.user && (isAdmin === req.user.admin)) {
        res.status(200).json(req.user);
      } else {
        res.status(401).json(false);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /sessions/login 
// Login
app.post('/login', function(req, res, next) {
    passport.authenticate('local', async function(err, user, info) {
      try {
        if (err) { throw err; }
        if (!user) {
          return res.status(401).json(info);
        }
        /*
        const user = await User.findOne({ where: { id: req.user.id } });
        console.log('User from DB:', user);  // Verifica se contiene `admin`
        */
        req.login(user, function(err) {
            if (err) { throw err; }
            return res.json(req.user);
        });
      } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
      }
    })(req, res, next);
});
  
  // ALTERNATIVE: if we are not interested in sending error messages...
  /*
  app.post('/sessions/login', passport.authenticate('local'), (req,res) => {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.json(req.user.username);
  });
  });
  */
  
// DELETE /sessions/logout 
// Logout
app.delete('/logout', async (req, res) => {
    try {
      req.logout();
      res.end('');
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @api {post} /users create a new user
 * @apiName PostUser
 * @apiGroup Users
 * 
 * @apiParam {Object} user Users details
 * 
 * @apiSuccess {Object} 201 id Users details.
 * @apiError {Object} 400 Bad Request.
 * @apiError {Object} 404 Not Found.
 * @apiError {Object} 422 Unprocessable Entity.
 * @apiError {Object} 503 Database error during the signup.
 */
app.post('/users', [
    check('user').isObject()
    ], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const userId = await usersdao.createUser(req.body.user);
        res.status(201).header('Location', `/users/${userId}`).end();
    } catch (err) {
        res.status(err.status || 500).json({ status: err.status || 500, message: err.msg || 'Errore sconosciuto.' });
    }
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
});
