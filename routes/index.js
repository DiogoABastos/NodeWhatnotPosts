const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../config/auth');
const { formatDate } = require('../helpers/date');

// post model
const Post = require('../models/post');

router.get('/', ensureGuest, (req, res) => {
  res.render('landing', {
    layout: 'layouts/login'
  });
});

router.get('/dashboard', ensureAuth, async (req, res) => {

    try {

      const posts = await Post.find({ user: req.user.id });
      res.render('dashboard', {
        name: req.user.firstName,
        posts,
        formatDate
      });
    } catch(err) {

      console.log(err);
      res.render('errors/500');
    }
});

module.exports = router;
