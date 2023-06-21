const express = require('express');
const dotenv = require('dotenv');
require('ethers');
const { PrismaClient } = require('@prisma/client');
const { Alchemy, Network } = require('alchemy-sdk');

dotenv.config();

//get alchemy node for mainnet
const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

const prisma = new PrismaClient();

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
    })
    .catch((err) => {
      console.log('Error connecting to database', err);
    });
});

//push a block to the database
const newBlock = async (block) => {
  const {
    hash,
    parentHash,
    number,
    timestamp,
    nonce,
    difficulty,
    gasLimit,
    gasUsed,
    miner,
    transactions,
  } = block;

  await prisma.block.create({
    data: {
      hash: hash,
      parentHash: parentHash,
      blockNumber: number,
      nonce: nonce,
      difficulty: difficulty,
      gasLimit: gasLimit,
      gasUsed: gasUsed,
      miner: miner,
      transactionCount: transactions.length,
    },
  });
  console.log(`Successfully added block: ${number}`);
};

//recieves a block number, retrieves the block and uses the function newBlock to push it the database
const addBlock = async (blockNumber) => {
  let block = await alchemy.core.getBlock(blockNumber);

  //set BigNumbers to strings
  block.gasLimit = block.gasLimit.toString();
  block.gasUsed = block.gasUsed.toString();

  //add Block to database
  newBlock(block);
};

const readNewBlock = async (hash) => {
  const block = await prisma.block.findUnique({
    where: {
      hash: hash,
    },
  });
  console.log(block);
};

alchemy.ws.on('block', (blockNumber) => {
  console.log(`Latest block is: ${blockNumber}`);
  addBlock(blockNumber);
});
