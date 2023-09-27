const mongoose = require('mongoose');
require("dotenv").config();
const uri = process.env.DATABASE_URL 
const getConnection = async () => {
  try {
    await mongoose.connect(
      uri,
      {
        useNewUrlParser: true
      }
    );
    console.log('Connection to DB Successful');
  } catch (err) {
    console.log(err);
  }
};

module.exports = getConnection