module.exports = () => {
  const express = require("express");
  const router = express.Router();
  const User = require('../models/user');
  const bcrypt = require('bcrypt');
  const passport = require('passport');

  /**** Routes ****/
  router.get('/hello', async (req, res) => {
    res.json({ msg: "Hello, world!" });
  });

  // Routes
  router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user) => {
      if (err) throw err;
      if (!user) res.send("No User Exists");
      else {
        req.logIn(user, (err) => {
          if (err) throw err;
          res.send("Successfully Authenticated");
        });
      }
    })(req, res, next);
  });

  router.post("/register", (req, res) => {
    User.findOne({ username: req.body.username }, async (err, doc) => {
      if (err) throw err;
      if (doc) res.send("User Already Exists");
      if (!doc) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username,
          password: hashedPassword,
        });
        await newUser.save().then(() => console.log('New User Added')).catch((err) => console.log(err));
        res.send("User Created");
      }
    });
  });
  router.get("/user", (req, res) => {
    console.log(req.user)
    res.send(req.user)
  });

  return router;
}
