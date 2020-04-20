var express = require('express');
var router = express.Router();

var jwt = require('express-jwt');

router.get('/me', jwt({ secret: 'SignSecretKey' }), function(req, res, next) {
  res.send({
    username: 'guest',
    allowed: true,
    roles: ['guest-role']
  });
});

module.exports = router;
