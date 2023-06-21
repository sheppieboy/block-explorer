const express = require('express');
const dotenv = require('dotenv');
require('ethers');
const { PrismaClient } = require('@prisma/client');
const { Alchemy, Network } = require('alchemy-sdk');

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

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

const addBlock = async (blockNumber) => {
  let block = await alchemy.core.getBlock(blockNumber);

  //set BigNumbers to strings
  block.gasLimit = block.gasLimit.toString();
  block.gasUsed = block.gasUsed.toString();

  //add Block to database
  newBlock(block);
};

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
const readNewBlock = async (hash) => {
  const block = await prisma.block.findUnique({
    where: {
      hash: hash,
    },
  });
  console.log(block);
};
