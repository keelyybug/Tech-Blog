const router = require('express').Router();
const session = require('express-session');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');
const sequalize = require('../config/connection');

//! get all posts for homepage
router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include:{User},//!should this be in [] took from mini project
    });

    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('all-posts', { //!is this before or after logged in
      posts, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//! get single post
router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        User,
        {
          model: Comment,
          attributes: [User],//! maybe change to content and date created 
        },
      ],
    });

    const post = postData.get({ plain: true });

    res.render('post', {
      ...post,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//!took from mini project not sure if needed
router.get('/profile', withAuth, async (req, res) => {
  try {
    //  Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });

    res.render('ost', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//*login and signup routes
router.get('/login', (req, res) => {
  // *If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});

  // *same as login but change to sign up and no redirect
router.get('/signup', (req, res) => {
  res.render('signup');
});

module.exports = router;
