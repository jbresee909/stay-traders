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
          securityQuestions: req.body.securityQuestions
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
    if (req.user) res.send(req.user)
    else res.status(404).send({ error: err, message: "No user currently logged in" })
  });

  router.get("/security-questions/:email", (req, res) => {
    User.findOne({ username: req.params.email }).exec((err, user) => {
      if (!user) res.status(400).send({ error: err, message: "Email not found in database" })
      else {
        questions = user.securityQuestions.map((data) => {
          return data.question
        })

        res.send({ questions: questions, userID: user.id })
      }

    })
  })

  router.post("/check-security-answers", (req, res) => {
    User.findById(req.body.userID).exec((err, user) => {
      if (!user) res.status(400).send({ error: err, message: "Email not found in database" })
      else {
        let questions = user.securityQuestions;
        if (questions[0].answer === req.body.answers[0] && questions[1].answer === req.body.answers[1] && questions[2].answer === req.body.answers[2]) {
          res.send(true);
        } else {
          res.send(false);
        }
      }
    })
  })

  router.post('/reset-password', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    User.findByIdAndUpdate(req.body.userID, { password: hashedPassword }).exec((err, data) => {
      if (!data) res.status(400).send({ error: err, message: "Unable to reset password" });
      else res.send("password reset!")
    })
  })

  return router;
}
