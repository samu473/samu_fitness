"use strict";

// require
const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); 
const usersdao = require('./users-dao');

const app = express();
const port = 3333;
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.static('client'));

passport.use(new LocalStrategy( function(username, password, done) { 
    usersdao.doLogin(username)
    .then((user) => { 
        if (!user) { return done(null, false, { message: 'Incorrect username.' }); }
        if (!user.checkPassword(password)) { 
            return done(null, false, { message: 'Incorrect password.' }); 
        } 
        return done(null, user);
    })
    .catch((err) => {
        { return done(null, false, { message: err.message }); }
    }); 
}));

app.use(session({ 
    secret: "c10311efe53d9028bd0ecae84291aa1f9d7fcb8d746dc01dc60ae18bd29c5e1f25a0f0c1a8d80a09fb6167886e1c769666ce578f07dced2d6dec7c2f3d6db9f4",
    resave: false,
    saveUninitialized: false,
}));
  
app.use(passport.initialize()); 
app.use(passport.session());

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