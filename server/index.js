const express = require('express');
const dotenv = require('dotenv');
const { Alchemy, Network } = require('alchemy-sdk');

dotenv.config();
const server = express();
server.use(express.json());

server.listen(process.env.PORT_NUM, () => {
  console.log(`Server listening on port: ${process.env.PORT_NUM}`);
});
