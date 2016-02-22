/**
 * Created by treunanen on 16/02/16.
 */
var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var bodyparser = require('body-parser');
var app = express();
var opts = {};
var secret = "testiSekretti";

// Setup JWT options
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
opts.secretOrKey = secret;

passport.use(new LocalStrategy({session: false},
  function(username, password, done) {
    if (username == "testi" && password == "testi") {
       var token = jwt.sign(username, secret);
      return done(null, token);
    }
    else {
      return done(null, false);
    }
  }
));

passport.use(new JwtStrategy(opts, function (jtwPayload, done) {
    return done(null, "testiUseri");
}))

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
    done(err, user);
});

app.use(bodyparser());
app.use(passport.initialize());


app.post("/auth", passport.authenticate('local'), function (req, res, next) {
  res.json({token: req.user});
});

app.get("/stuff", passport.authenticate('jwt'), function (req, res) {
  res.json({success: "You are authenticated!"});
});

app.listen(3000);