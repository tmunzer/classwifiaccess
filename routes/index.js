var express = require('express');
var User = require("./../models/user");
var Group = require("./../models/group");
var UILanguage = require("./../models/uiLanguage");
var router = express.Router();

var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/login');
};

module.exports = function(passport){

  /* GET login page. */
  router.get('/login', function(req, res) {
    var translationFile = translate(req);
    // Display the Login page with any flash message, if any
    res.render('login', { message: translationFile.login_page[req.flash('message')], text : translationFile.login_page });
  });

  /* Handle Login POST */
  router.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash : true
  }));

  /* Handle Logout */
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });


  /* GET Home Page */
  router.get('/', isAuthenticated, function(req, res){
    var translationFile = translate(req);
    console.log("index");
    res.render('index', { user: req.user, user_button: translationFile.user_button});
  });


  /* GET Conf listing. */
  router.get('/conf', isAuthenticated, function(req, res, next) {
    var translationFile = translate(req);
    res.render('conf', { user: req.user , user_button: translationFile.user_button, config_page: translationFile.config_page});
  });


  /* GET User Edit page. */
  router.get("/user", isAuthenticated, function(req, res, next){
    var translationFile = translate(req);
    var userId = req.query.id;
    if ((req.user.id == userId) || (req.user.group != 1)) {
      User.findById(req.query.id, function(err, user) {
        Group.getAll(function(err, groups){
          console.log(groups);
          UILanguage.getAll(function(err, languages) {
            res.render('userDisplay', { user: req.user , user: user, groups: groups, languages: languages,
              user_button: translationFile.user_button, user_page: translationFile.user_page});
          });
        });
      });
    } else {
      res.redirect('/');
    }
  });

  /* GET User Edit page. */
  router.get('/user/edit', isAuthenticated, function(req, res, next) {
    var translationFile = translate(req);
    var userId = req.query.id;
    // check if requested user to display is the same as the current user
    // or if current user is an admin
    if ((req.user.id == userId) || (req.user.group != 1)) {
      User.findById(req.query.id, function(err, user) {
        Group.getAll(function(err, groups){
          console.log(groups);
          UILanguage.getAll(function(err, languages) {
            res.render('userEdit', { user: req.user , user: user, groups: groups, languages: languages,
              user_button: translationFile.user_button, user_page: translationFile.user_page});
          });
        });
      });
    } else {
        res.redirect('/');
    }
  });
  /* POST User Edit page. */
  router.post("/user/edit", isAuthenticated, function(req, res, next) {
    var userId = req.query.id;
    // check if requested user to display is the same as the current user
    // or if current user is an admin
    if ((req.user.id == userId) || (req.user.group != 1)) {
      if (req.user.is == "new"){
        console.log('new');
      } else {
        User.findById(req.query.id, function(err, user) {
          var userToDB = new User.UserToDB(req.body);
          userToDB.updateDB(userId, function(err){
            res.redirect('/user?id='+userId);
          });
    });
      }
    } else {
      res.redirect('/');
    }  });

  router.get("/*", function(req, res, next){
    res.redirect('/');
  });

  return router;
};

function translate(req){
  console.log(req.headers["accept-language"]);
  var language = req.headers["accept-language"].toLowerCase();
  switch (true){
    case language.indexOf("fr") == 0:
      return require('./../translate/fr');
      break;
    case language.indexOf("en") == 0:
      console.log("en");
      return require('./../translate/en');
      break;
    default:
      console.log("default");
      return require('./../translate/en');
      break;
  }
}