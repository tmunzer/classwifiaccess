const express = require('express');
const path = require('path');
const morgan = require('morgan')
const parseurl = require('parseurl');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const favicon = require('serve-favicon');

var cookieParser = require('cookie-parser');

//===============CREATE APP=================
const app = express();
app.use(morgan('\x1b[32minfo\x1b[0m: :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]', {
  skip: function (req, res) { return res.statusCode < 400 && req.url != "/" && req.originalUrl.indexOf("/api") < 0 }
}));


//===============MONGODB=================
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const mongoConfig = require('./config').mongoConfig;
global.db = mongoose.connection;

db.on('error', console.error.bind(console, '\x1b[31mERROR\x1b[0m: unable to connect to mongoDB on ' + mongoConfig.host + ' server'));
db.once('open', function () {
  console.info("\x1b[32minfo\x1b[0m:", "Connected to mongoDB on " + mongoConfig.host + " server");
  const refreshAcsToken = require("./bin/refreshAcsToken").auto();
  const monitor = require("./bin/monitor");
  monitor.devices();
});

mongoose.connect('mongodb://' + mongoConfig.host + '/' + mongoConfig.base);


//===============PASSPORT=================
app.use(session({
  secret: 'f0rEYf6m9n08dtrdLnhYVnvQ2XM5',
  resave: true,
  store: new MongoDBStore({
    uri: 'mongodb://' + mongoConfig.host + '/express-session',
    collection: 'wifiswitch'
  }),
  saveUninitialized: true,
  cookie: {
    maxAge: 30 * 60 * 1000 // 30 minutes
  }
}));

var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);


//===============CONF APP=================

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static('./bower_components'));


//===============ROUTES=================

//var routes = require('./routes/routes')(app, passport);

var login = require('./routes/login');
app.use('/login/', login);
var webapp = require('./routes/web-app');
app.use('/web-app/', webapp);
var apis = require('./routes/api.apis');
app.use('/api/apis/', apis);
var classrooms = require('./routes/api.classrooms');
app.use('/api/classrooms/', classrooms);
var devices = require('./routes/api.devices');
app.use('/api/devices/', devices);
var schedules = require('./routes/api.schedules');
app.use('/api/schedules/', schedules);
var schools = require('./routes/api.schools');
app.use('/api/schools/', schools);
var users = require('./routes/api.users');
app.use('/api/users/', users);
var oauth = require('./routes/api.oauth');
app.use('/api/oauth/', oauth);

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
    console.info("\x1b[32minfo\x1b[0m:", "cron pattern not valid");
}

module.exports = app;