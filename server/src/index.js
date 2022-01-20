const appName = "Stay Traders";
const port = process.env.PORT || 8080;
require('dotenv').config()
const createServer = require("./server");
const server = createServer();
const { wakeDyno } = require('heroku-keep-awake');

// keep heroku app awake
const DYNO_URL = 'https://staytraders.herokuapp.com/';

const opts = {
    interval: 29,
    logging: true,
    stopTimes: { start: '00:00', end: '04:00' }
}

server.listen(port, () => {
    wakeDyno(DYNO_URL, opts);

    console.log(`${appName} running on port ${port}!`)
});


