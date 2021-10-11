/**** Node.js libraries *****/
const path = require('path');

/**** External libraries ****/
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require("passport");


// connect to database
const mongoose = require('mongoose');

// connect to database
const uri = process.env.MONGO_URI;
try {
  // Connect to the MongoDB cluster
  mongoose.connect(
    uri,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );

} catch (e) {
  console.log("Unable to connect to database.")
  console.log(e);
}

let db = mongoose.connection;

db.on('open', () => {
  console.log('connected to mongo db')
})

/**** Configuration ****/
const app = express();

function createServer() {
  const routes = require("./routes/users")();

  app.use(morgan('combined'));
  app.use(express.json());
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
  app.use(express.static(path.resolve('..', 'client', 'build')));
  app.use(express.urlencoded({ extended: true }));
  app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: true,
    saveUninitialized: true
  }));
  app.use(cookieParser(process.env.SESSION_SECRET_KEY));
  app.use(passport.initialize());
  app.use(passport.session());
  require("../passportConfig")(passport);




  /**** Add routes ****/
  app.use("/api/users", routes);

  // "Redirect" all non-API GET requests to React's entry point (index.html)
  app.get('*', (req, res) =>
    res.sendFile(path.resolve('..', 'client', 'build', 'index.html'))
  );

  return app;
}

module.exports = createServer;