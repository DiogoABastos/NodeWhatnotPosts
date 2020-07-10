const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../config/auth');
const { truncate } = require('../helpers/string');
const { editIcon, showName } = require('../helpers/edit');

// post model
const Post = require('../models/post');

router.get('/add', ensureAuth, (req, res) => {

  res.render('posts/add');
});

router.post('/', ensureAuth, async (req, res) => {

  try {

    req.body.user = req.user.id;
    await Post.create(req.body);
    res.redirect('/dashboard');

  } catch (err) {

    console.log(err);
    res.render('errors/500');
  }
});

router.get('/', ensureAuth, async (req, res) => {

  try {

    const posts = await Post.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' });

    res.render('posts/index', {
      posts,
      truncate,
      editIcon,
      showName,
      name: false
    });

  } catch(err) {

    console.log(err);
    res.render('errors/500');
  }
});

router.get('/:id', ensureAuth, async (req, res) => {

  try {

    const post = await Post.findById(req.params.id)
      .populate('user');

    if (!post) {
      return res.render('errors/404');
    }

    res.render('posts/show', {
      post,
      editIcon
    });

  } catch (err) {

    console.log(err);
    res.render('errors/404');
  }
});

router.get('/user/:userId', ensureAuth, async (req, res) => {

  try {

    const posts = await Post.find({ user: req.params.userId, status: 'public' })
      .populate('user');

    res.render('posts/index', {
      posts,
      truncate,
      editIcon,
      showName,
      name: true
    });

  } catch (err) {

    console.log(err);
    res.render('errors/500');
  }
});

router.get('/edit/:id', ensureAuth, async (req, res) => {

  try {
    const post = await Post.findOne({ _id: req.params.id });

    if (!post) {
      return res.render('errors/404');
    }

    if (post.user != req.user.id) {
      res.redirect('/posts');

    } else {
      res.render('posts/edit', {
        post
      });
    }

  } catch(err) {

    console.log(err);
    res.render('errors/500');
  }
});

router.put('/:id', ensureAuth, async (req, res) => {

  try {

    let post = await Post.findById(req.params.id);

    if (!post) {
      res.render('errors/404');
    }

    if (post.user != req.user.id) {
      res.redirect('/posts');
    } else {

      post = await Post.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
      });

      res.redirect('/dashboard');
    }

  } catch (err) {

    console.log(err);
    res.render('errors/500');
  }
});

router.delete('/:id', ensureAuth, async (req, res) => {

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {

      return res.render('errors/500');
    }

    if (post.user != req.user.id) {

      res.redirect('/dashboard');
    } else {

      await Post.remove({ _id: req.params.id });

      res.redirect('/dashboard');
    }


  } catch(err) {

    console.log(err);
    res.render('errors/500');
  }
});

module.exports = router;
