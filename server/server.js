const http = require("http");

const host = 'localhost';
const port = 9000;

const numberOfReservedAddresses = 6;
const vcReleasersChainLength = 3;

const ssiReservedAccountIndex = 0;
const inhReservedAccountIndex = 1;
const ownerReservedAccountIndex = 2;
const vcReleaserReservedAccountIndex = 3

const requestListener = function (req, res) {
  res.writeHead(200);
  res.end("My first server!");
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});