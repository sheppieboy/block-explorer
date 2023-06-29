require('ethers');
const { PrismaClient } = require('@prisma/client');
const { Alchemy, Network } = require('alchemy-sdk');
const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

const prisma = new PrismaClient();

//push a block to the database
const createBlock = async (block) => {
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
  try {
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
    await createTransactions(transactions, number);
  } catch (error) {
    console.log('There has been an error adding the block to the db: ', error);
  }
};

const createTransactions = async (transactions, blockNumber) => {
  for (const transaction of transactions) {
    const { hash, to, from, confirmations, blockNumber } = transaction;

    //create transactions in db
    try {
      await prisma.transaction.create({
        data: {
          hash: hash,
          to: to,
          from: from,
          confirmations: confirmations,
          blockNumber: blockNumber,
        },
      });
      console.log(`Added the transactions for block ${blockNumber}`);
    } catch (err) {
      console.log(
        'There has been an error creating transactions in the database:',
        err
      );
    }
  }
};

//read the newest block
const readNewBlock = async (number) => {
  const block = await prisma.block.findUnique({
    where: {
      blockNumber: number,
    },
  });
  console.log('The block added to the Database: ', block.blockNumber);
};

//recieves a block number, retrieves the block and uses the function newBlock to push it the database
const addBlock = async (blockNumber) => {
  let block = await alchemy.core.getBlockWithTransactions(blockNumber);

  //set BigNumbers to strings
  block.gasLimit = block.gasLimit.toString();
  block.gasUsed = block.gasUsed.toString();

  //add Block to database
  createBlock(block);
};

module.exports = { prisma, alchemy, addBlock };
