const express = require('express');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

dotenv.config();
const server = express();
server.use(express.json());

server.listen(process.env.PORT_NUM, () => {
  console.log(`Server listening on port: ${process.env.PORT_NUM}`);
  prisma
    .$connect()
    .then(console.log('Connected to postgres db'))
    .catch((err) => {
      console.log('Error connecting to database', err);
    });
});
