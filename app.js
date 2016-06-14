//var EventEmitter = require("events").EventEmitter;
//var messenger = new EventEmitter();

var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//===============CREATE ROOT PATH=================

var path = require('path');
global.appRoot = path.resolve(__dirname);

//===============CREATE APP=================

var app = express();

//=============CREATE LOGGER===============
var winston = require('winston');
winston.emitErrs = true;
var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: __dirname + '/logs/all-logs.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

module.exports.logger = logger;
module.exports.logger.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};

logger.debug("Overriding 'Express' logger");
app.use(require('morgan')({ "stream": logger.stream }));
//===============CONF APP=================

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(appRoot + '/bower_components'));

//===============SQLITE=================

var database = require(appRoot + '/bin/sqlite/sqlite');
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

//var routes = require(appRoot + '/routes/routes')(app, passport);
var login = require('./routes/login');
var webapp = require('./routes/web-app');
var api = require('./routes/api');

app.use('/login/', login);
app.use('/web-app/', webapp);
app.use('/api/', api);

app.get('*', function (req, res) {
    res.redirect('/web-app/');
});
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
                Control.checkLessons();
            },
            start: true
        });
}catch(ex) {
    logger.warn("cron pattern not valid");
}

module.exports = app;