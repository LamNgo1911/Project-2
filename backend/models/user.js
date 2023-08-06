const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "please add a name"],
    maxLength: 8,
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "please provide valid email",
    },
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minLength: 6,
    select: false,
  },
  status: {
    type: Boolean,
    default: true,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  otp: {
    type: String,
  },
  otpExpiration: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  // console.log(this.modifiedPaths);
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, name: this.name, role: this.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

// Match user entered password to hashed password in database

UserSchema.methods.matchPassword = async function (enterPassword) {
  const isMatch = await bcrypt.compare(enterPassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
