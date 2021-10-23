module.exports = () => {
  const express = require("express");
  const router = express.Router();
  const User = require('../models/user');
  const bcrypt = require('bcrypt');
  const passport = require('passport');

  // Routes
  router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user) => {
      if (err) throw err;
      if (!user) res.send({ error: 'No user found', success: null });
      else {
        req.logIn(user, (err) => {
          if (err) throw err;
          res.send({ error: null, success: 'User logged in!', firstName: user.firstName });
        });
      }
    })(req, res, next);
  });

  router.post("/register", (req, res) => {
    User.findOne({ username: req.body.username.toLowerCase() }, async (err, doc) => {
      if (err) throw err;
      if (doc) res.send({ error: "User with that email already exists.", success: null });
      if (!doc) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username,
          password: hashedPassword,
        });
        await newUser.save().then(() => res.send({ success: "New user created!", firstName: req.body.firstName, error: null })).catch((err) => console.log(err));

      }
    });
  });

  router.post('/logout', (req, res) => {
    req.logOut();
    req.session.destroy((err) => {
      if (err) res.send(err);
      else res.send('User logged out!')
    })
  })

  router.get("/user", (req, res) => {
    console.log(req.user);
    res.send(req.user)
  });

  return router;
}
