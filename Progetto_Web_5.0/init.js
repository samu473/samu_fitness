"use strict";

// require
const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); 
//const FileStore = require('session-file-store')(session);

const usersdao = require('./users-dao');


// init
const app = express();
const port = 3333;
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.static('client'));

// set up the "username and password" login strategy
// by setting a function to verify username and password

passport.use(new LocalStrategy( function(username, password, done) { 
    usersdao.getUserByUsername(username).then((user) => { 
  
      if (!user) { return done(null, false, { message: 'Incorrect username.' }); }
  
      if (!user.checkPassword(password)) { 
        return done(null, false, { message: 'Incorrect password.' }); 
      } 
  
      return done(null, user);
    }).catch((err) => {
      { return done(null, false, { message: err.message }); }
    }); 
}));

// set up the session
app.use(session({ // set up here express-session
    //store: new FileStore(), // by default, Passport uses a MemoryStore to keep track of the sessions - if you want to use this, launch nodemon with the option: --ignore sessions/
    secret: "a secret phrase of your choice",
    resave: false,
    saveUninitialized: false,
}));
  
// init passport
app.use(passport.initialize()); 
app.use(passport.session());

// serialize and de-serialize the user (user object <-> session)
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(async function(id, done) { 
    usersdao.getUser(id).then((user) => {
        done(null, user);
    })
    .catch((err) => {
        done(err, null);
    });
});



module.exports = {app, port, passport}