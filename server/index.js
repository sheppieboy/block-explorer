const express = require('express');
const dotenv = require('dotenv');
const { prisma, alchemy, addBlock } = require('./blocks');

dotenv.config();

const server = express();

server.use(express.json());

//connect server to db and start listening
server.listen(process.env.PORT_NUM, () => {
  console.log(`Server listening on port: ${process.env.PORT_NUM}`);
  prisma
    .$connect()
    .then(() => {
      console.log('Connected to postgres db');
      prisma.block.deleteMany();
      prisma.transaction.deleteMany();
    })
    .catch((err) => {
      console.log('Error connecting to database', err);
    });
});

alchemy.ws.on('block', (blockNumber) => {
  console.log(`Latest block is: ${blockNumber}`);
  addBlock(blockNumber);
});
