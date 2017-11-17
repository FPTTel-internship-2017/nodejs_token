var express = require('express'),
  router = express.Router(),
  bodyParser = require('body-parser');
var User = require('../models/user');
var Token = require('../models/token');
var crypto = require('crypto');

router.use(bodyParser.urlencoded({ extended: true }));
//router.use(csrfProtection);

function handleError(res, reason, message, code) {
  console.log('ERROR: ' + reason);
  res.status(code || 500).json({
    error: [{ userMessage: message, internalMessage: reason, code: code }]
  });
}
function createToken(string) {
  var sha256 = crypto.createHash('sha256');
  var hash = sha256.update(string).digest('hex');
  console.log(hash);

  return hash;
}

// Login
router.post('/signin', function(req, res, err) {
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({ username: username }, function(err, user) {
    if (err) {
      handleError(res, err.message, 'Login failed', 400);
    } else if (!user) {
      // No user found with that username
      res.status(200).json({
        code: 200,
        data: {},
        message: 'Username or password invalid'
      });
    } else {
      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
        if (err) {
          handleError(res, err.message, 'Login failed', 400);
        } else if (!isMatch) {
          // Password did not match
          res.status(200).json({
            code: 200,
            data: {},
            message: 'Username or password invalid'
          });
        } else {
          var token = new Token({
            value: createToken(username + new Date()),
            userId: user._id
          });

          // Save the access token and check for errors
          token.save(function(err, token) {
            if (err) {
              handleError(res, err.message, 'Login failed', 400);
            } else {
              res.status(200).json({
                code: 200,
                data: token,
                message: 'Login Successfully'
              });
            }
          });
        }
      });
    }
  });
});

// Register
router.post('/signup', function(req, res, err) {
  var newUser = new User(req.body);
  newUser.save(function(err, user) {
    if (err) {
      handleError(res, err.message, 'User Creation was Unsuccesfull', 400);
    } else {
      res.status(201).json({
        code: 201,
        data: user,
        message: 'Successfully Created User'
      });
    }
  });
});

module.exports = router;
