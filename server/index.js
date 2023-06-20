const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
const server = express();

mongoose.set('strictQuery', false);

const start_db_server = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION);
    console.log('MongoDB connected');
    server.listen(process.env.PORT_NUM, () => {
      console.log(`Server is up and running at port ${process.env.PORT_NUM}`);
    });
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
  }
};

start_db_server();
