const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatRoom: { type: String, default: "global" },
  user: String,
  text: String,
  time: String,
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);
