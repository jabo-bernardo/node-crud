require("dotenv").config();

/**
 * 
 * NodeJS, Express, and MongoDB CRUD Web Application
 * Developed by jabp-bernardo
 * 
 */

const express = require("express");
let app = express();

// Authentication
const passport = require("passport");
let googleStrategy = require("passport-google-oauth").OAuth2Strategy;

passport.use(new googleStrategy({
    clientID: process.env.AUTH_CLIENTID,
    clientSecret: process.env.AUTH_CLIENTSECRET,
    callbackURL: "http://localhost:8080/auth/google/callback"
}, (token, tokenSecret, profile, done) => {
    done(null, profile);
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    done(null, id)
});


const expressSessions = require("express-session");
const bodyParser = require("body-parser");

// App Configurations
app.use(bodyParser.urlencoded( { extended: false } ));
app.use(expressSessions({
    secret: "secret69",
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/dashboard", (req, res) => {
    res.send(req.user);
});

app.get("/auth/google", passport.authenticate("google", { scope: ["https://www.googleapis.com/auth/plus.login"] }));
app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/auth/google" }), (req, res) => {
    res.redirect("/dashboard");
})

app.listen(process.env.PORT, () => console.log(`Listening to http://localhost:${process.env.PORT}`));