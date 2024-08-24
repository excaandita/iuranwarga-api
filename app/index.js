require('dotenv').config()

const express       = require('express');

let createError     = require('http-errors');
let path            = require('path');
let cookieParser    = require('cookie-parser');
let logger          = require('morgan');
let cors            = require('cors')
const session       = require('express-session');
const flash         = require('connect-flash');

const usersRoutes   = require('./routes/users');
const middlewareLog = require('./middleware/logs');

const app   = express();
let URL     = `/api`;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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

app.use(middlewareLog);

// Routes 
app.use(`${URL}/users`, usersRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message  = err.message;
    res.locals.error    = req.app.get('env') === 'development' ? err : {};
    
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;