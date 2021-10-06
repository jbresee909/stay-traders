module.exports = () => {
  const express = require("express");
  const router = express.Router();
  let db = require('../index').db;
  const User = require('../models/user')

  /**** Routes ****/
  router.get('/hello', async (req, res) => {
    res.json({ msg: "Hello, world!" });
  });

  router.post('/add', (req, res) => {
    console.log('new user added')
  })

  return router;
}
