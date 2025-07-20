const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
  name: String,
  members: [String], // array of usernames
});

module.exports = mongoose.model("ChatRoom", chatRoomSchema);
