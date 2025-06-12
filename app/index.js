require('dotenv').config();

const express        = require('express');
const createError    = require('http-errors');
const path           = require('path');
const cookieParser   = require('cookie-parser');
const logger         = require('morgan');
const cors           = require('cors');
const session        = require('express-session');
const flash          = require('connect-flash');

// Routes
const authRoutes     = require('./routes/auth');
const usersRoutes    = require('./routes/users');
const wargaRoutes    = require('./routes/wargas');

// Middleware
const middlewareLog  = require('./middleware/logs');
const middlewareAuth = require('./middleware/auth');

const app  = express();
const URL  = '/api';


// ===== View engine setup =====
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// ===== Global Middleware =====
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,  
    cookie: { secure: true }
}));
app.use(cors());
app.use(flash());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));


// ===== Routes =====
app.use(`${URL}`, authRoutes);         // Public route
app.use(middlewareLog);               // Custom logging
app.use(middlewareAuth);              // Auth check

app.use(`${URL}/users`, usersRoutes);
app.use(`${URL}/warga`, wargaRoutes);


// ===== Error Handling =====
app.use((req, res, next) => {
    next(createError(404));
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error   = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;