const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 10,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 10,
  },
  role: {
    type: Number,
    default: 0,
  },
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
  secondpassword: {
    type: String,
    minlength: 4,
  },
});

userSchema.pre("save", function (next) {
  var user = this;

  if (user.isModified("password") && user.isModified("secondpassword")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if(err) return next(err)
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
      });
      bcrypt.hash(user.secondpassword, salt, function (err, hash) {
        if (err) return next(err);
        user.secondpassword = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.compareSecondPassword = function (plainSecondPassword, cb) {
  bcrypt.compare(
    plainSecondPassword,
    this.secondpassword,
    function (err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
    }
  );
};

userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;

  var token = jwt.sign(user._id.toHexString(), "secretToken");

  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  jwt.verify(token, "secretToken", function (err, decoded) {
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
