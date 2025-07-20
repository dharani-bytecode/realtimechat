const express  = require("express");
const bcrypt   = require("bcryptjs");
const router   = express.Router();
const User     = require("../models/User");

// POST  /api/auth/register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username & password required" });

  const userExists = await User.findOne({ username });
  if (userExists) return res.status(409).json({ error: "User already exists" });

  const user = await User.create({ username, password });
  res.json({ user: { username: user.username } });
});

// POST  /api/auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const match = await user.matchPassword(password);
  if (!match) return res.status(400).json({ error: "Invalid credentials" });

  user.isOnline = true;
  await user.save();
  res.json({ user: { username: user.username } });
});

// POST  /api/auth/logout
router.post("/logout", async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    user.isOnline = false;
    await user.save();
  }
  res.json({ message: "Logged out" });
});

module.exports = router;
