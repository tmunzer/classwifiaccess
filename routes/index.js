var express = require('express');
var router = express.Router();
var apiAuth = require ('./../bin/ah_api/auth');
var apiParam = require ('./../bin/ah_api/config');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.query.hasOwnProperty('error')){
    res.send("Error: " + req.query.error);

  } else if (req.query.hasOwnProperty("authCode")){
    apiAuth.getPermanentToken(req.query.authCode, apiParam.redirect_url, apiParam.secret, apiParam.client_id);
    res.render()
  }
  else {
    res.render('index', { title: 'Express', client_id: apiParam.client_id, redirect_url: apiParam.redirect_url });
  }
});

module.exports = router;
