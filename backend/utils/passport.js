const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../models/Users');
const validatePassword = require('./passwordUtils').validatePassword;


const verifyCallback = async (username, password, done) => {
    try {
        const user = await User.findByUsername(username);
        if (!user) {
            return done(null, false);
        }
        const isValid = validatePassword(password, user.salt, user.password);
        if (!isValid) {
            return done(null, false);
        }
        return done(null, user);
    } catch (err) {
        done(err);
    }
}

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);



// passing callbacks to serialize/deserialize
// serializeUser - will add the user to session upon sign in
// deserializeUser - will remove the user from session

passport.serializeUser((user, done) => {
    done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
    try {
        const user = await User.findByUsername(username);
        done(null, user);
    }
    catch(err) {
        done(err);
    }
});

