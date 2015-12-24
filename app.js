//var EventEmitter = require("events").EventEmitter;
//var messenger = new EventEmitter();

var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//===============CREATE APP=================

var app = express();

//===============CONF APP=================

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//===============SQLITE=================

var database = require('./bin/sqlite/sqlite');
var db = new database();
module.exports.db = db;


//===============PASSPORT=================
var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

//===============ROUTES=================

var routes = require('./routes/index')(passport);
app.use('/', routes);

//===============ERRORS=================

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//===============CREATE CRON=================
var CronJob = require("cron").CronJob;
var Control = require("./bin/device_control");
Control.checkLessons();
try {
    new CronJob({
            cronTime: "0 */1 * * * *",
            onTick: function () {
                console.log("========== CRON");
                Control.checkLessons();
            },
            start: true
        });
}catch(ex) {
    console.log("cron pattern not valid");
}

module.exports = app;