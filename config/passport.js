const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// import User model
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {

      User.findOne({ email: email })
        .then(user => {
          if(!user) {
            return done(null, false, { message: 'Wrong Credentials' });
          }

          // compare password with hashed password
          bcrypt.compare(password, user.password, (err, isMatched) => {
            if (err) throw err;

            if (!isMatched) {
              return done(null, false, { message: 'Wrong Credentials' });
            }

            // Right Credentials
            return done(null, user);
          });
        })
        .catch(err => console.log(err));
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}
