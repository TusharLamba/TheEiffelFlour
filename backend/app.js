const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const pgSession = require('connect-pg-simple')(session);
const { v4: uuidv4 } = require('uuid');

// route imports
const usersRoute = require('./routes/users');
const productRoute =  require('./routes/products');

// db
const { pool } = require('./db/dbPool');


// helpers & middleware
const verifyJWT = require('./middleware/verifyJWT');
const errorHandler = require('./middleware/errorHandler');
const { logger } = require('./middleware/logHandler');

require('dotenv').config();
const PORT = process.env.PORT || 3500

const app = express();

// serverlogs
app.use(logger);

// CROSS Origin Resource Sharing
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}));

// json + form data parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// parsing cookies
app.use(cookieParser());


/**
 * -------------- SESSION SETUP ----------------
 */
app.use(session({
    store: new pgSession({
        pool,
        tableName: 'session'
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        secure: true 
    }
}));


/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */
require('./utils/passport');

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log('sid = ', req.sessionID);
    if (!req.session.user) {
        // send back the sessionID to be set as a cookie
        res.cookie('sid', req.sessionID, req.session.cookie);
    }
    console.log('SESSION = ', req.session);
    next();
});



app.get('/cart', (req, res) => {
    if(!req.session.cart) {
        req.session.cart = []; // initialize cart if it doesn't exist
    }
    res.json(req.session.cart);
})

app.post('/cart', (req, res) => {
    const { cartObj } = req.body;
    if(!req.session.cart) {
        req.session.cart = [];
    }
    req.session.cart.push(cartObj);
    res.json(req.session.cart);
})


app.use('/user', usersRoute);

app.use('/product', productRoute);
// we verify JWT before we start giving access to other routes & resources in app
app.use(verifyJWT);




// main error Handler
app.use(errorHandler);

// listen at the PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));