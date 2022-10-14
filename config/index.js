const mongoose = require("mongoose");

module.exports = async function connection() {
  try {
    const connectionParams = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    await mongoose.connect(process.env.DATABASE, connectionParams);
    console.log("Connected to Mongo.. Database..");
  } catch (err) {
    console.log(err);
    console.log("몽고DB 연결 실패.");
  }
};
