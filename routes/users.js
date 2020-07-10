const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureGuest } = require('../config/auth');

// User model
const User = require('../models/User');

router.get('/register', ensureGuest, (req, res) => {
  res.render('register', {
    layout: 'layouts/login'
  });
});

router.get('/login', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'layouts/login'
  });
});

router.post('/register', ensureGuest, (req, res) => {
  const { first, last, email, password, password2 } = req.body;

  let errors = [];

  if (!first || !last || !email || !password || !password) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  if (password !== password2) {
    errors.push({ msg: "Passwords don't match" });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password needs to be at least 6 characters long' });
  }

  if (errors.length > 0) {
    res.render('register', {
      layout: 'layouts/login',
      errors,
      first,
      last,
      email
    });
  } else {
    User.findOne({ email: email })
      .then(user => {
        if (user) {
          error.push({ msg: 'Email is already registered' });

          res.render('register', {
            layout: 'layouts/login',
            errors,
            first,
            last
          });
        } else {

          // create User
          const newUser = new User({
            firstName: first,
            lastName: last,
            email,
            password
          });

          // encrypt password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;

              // hash password
              newUser.password = hash;

              newUser.save()
                .then(user => {
                  // redirect to login
                  req.flash('success_msg', 'You are now registered and can log in');
                  res.redirect('/users/login');
                })
                .catch(err => console.log(err));
            });
          });

        }
      })
      .catch(err => console.log(err));
  }
});

router.post('/login', ensureGuest, (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();

  req.flash('success_msg', 'You are now logged out');
  res.redirect('/users/login');
});

module.exports = router;
