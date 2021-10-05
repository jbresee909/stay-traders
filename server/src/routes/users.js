module.exports = () => {
  const express = require("express");
  const router = express.Router();
  let db = require('../index').db;

  /**** Routes ****/
  router.get('/hello', async (req, res) => {
    res.json({ msg: "Hello, world!" });
  });

  router.get('/hello/:name', async (req, res) => {
    res.json({ msg: `Hello, ${req.params.name}` });
  });

  return router;
}
