const appName = "Stay Traders";
const port = process.env.PORT || 8080;

// Set Environment variables config
require('dotenv').config()

// connect to database
const mongoose = require('mongoose');

// connect to database
const uri = "mongodb+srv://justinbresee:37Rigger909@staytraders.y99hr.mongodb.net/StayTraders?retryWrites=true&w=majority";
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

// Check connection
db.once('open', function () {
    console.log('Connected to mongodb!')

    // create server and run
    const createServer = require("./server");
    const server = createServer();
    server.listen(port, () => console.log(`${appName} running on port ${port}!`));
})

// check for db errors
db.on('error', function (err) {
    console.log(err);
})
