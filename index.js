require('dotenv').config({
    path: '.env'
});
const Server = require('./src/server');

const server = new Server();
server.run();
