const appName = "Stay Traders";
const port = process.env.PORT || 8080;
require('dotenv').config()
const createServer = require("./server");
const server = createServer();
server.listen(port, () => console.log(`${appName} running on port ${port}!`));


