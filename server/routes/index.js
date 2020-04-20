var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var v4 = require('uuid');

let refreshToken = null;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Token */
router.post('/token', function(req, res, next) {
  if(req.body.grant_type=='auth_token') {
    if(req.body.username!='guest' 
    || req.body.password!='guest' 
    || req.body.client_id!='native-app') res.sendStatus(401);
    else {
      refreshToken = v4();
      res.json({
        username : 'guest',
        token: jwt.sign({ username: 'guest', exp: Math.floor(Date.now()/1000) + (60*60), rooms: ['guest-room'] }, 'SignSecretKey'),
        refresh_token: refreshToken,
        rooms: ['guest-room']
      });
    }
  } else if(req.body.grant_type=='refresh_token') {
    if(req.body.client_id!='native-app'
    || req.body.client_secret!='ClientSecretKey'
    || req.body.refresh_token!=refreshToken) res.sendStatus(401);
    else {
      refreshToken = v4();
      res.json({
        username : 'guest',
        token: jwt.sign({ username: 'guest', exp: Math.floor(Date.now()/1000) + (60*60), rooms: ['guest-room'] }, 'SignSecretKey'),
        refresh_token: refreshToken,
        rooms: ['guest-room']
      });
    }
  } else res.sendStatus(400);
});

module.exports = router;
