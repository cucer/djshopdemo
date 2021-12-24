const mongoose = require("mongoose");

const connectDB = async () => {
  const con = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected: ${con.connection.host}`.green.inverse);
  try {
  } catch (error) {
    console.log(`MongoDB connection error: ${error.message}`.red.inverse.bold);
    process.exit(1);
  }
};

module.exports = connectDB;
