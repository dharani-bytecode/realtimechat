const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username : { type: String, required: true, unique: true },
  password : { type: String, required: true },      // NEW
  isOnline : { type: Boolean, default: false },
});

// helper for comparing passwords
userSchema.methods.matchPassword = async function (enteredPw) {
  return await bcrypt.compare(enteredPw, this.password);
};

// hash before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);
