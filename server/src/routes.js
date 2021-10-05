module.exports = () => {
  const express = require("express");
  const router = express.Router();
  const mongoose = require('mongoose');

  const uri = "mongodb+srv://justinbresee:justinbresee@staytraders.y99hr.mongodb.net/StayTraders?retryWrites=true&w=majority";
  try {
    // Connect to the MongoDB cluster
    mongoose.connect(
      uri,
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => console.log("Connected to database.")
    );

  } catch (e) {
    console.log("Unable to connect to database.")
    console.log(e);
  }

  const db = mongoose.connection;

  /**** Routes ****/
  router.get('/hello', async (req, res) => {
    res.json({ msg: "Hello, world!" });
  });

  router.get('/hello/:name', async (req, res) => {
    res.json({ msg: `Hello, ${req.params.name}` });
  });

  return router;
}
