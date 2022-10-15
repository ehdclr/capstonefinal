const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { User } = require("./User");

const user3Schema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 10,
  },
  address: {
    type: String,
    minlength: 2,
  },
  id: {
    type: String,
    minlength: 2,
  },
  age: {
    type: Number,
    maxlength: 5,
  },
  images: {
    type: String,
  },
  email: {
    type: String,
    unique: 1,
  },
  encryptedMessage: {
    type: String,
  }
});

user3Schema.pre("save", function (next) {
  var user3 = this;

  if (user3.isModified("id")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(user3.id, salt, function (err, hash) {
        if (err) return next(err);
        user3.id = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User3 = mongoose.model("User3", user3Schema);

module.exports = { User3 };
