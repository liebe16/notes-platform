import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* =========================
   REGISTER
========================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, university } = req.body;

    if (!name || !email || !password || !university) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // 🔒 Default role = user (admin must be set manually in DB)
    const user = await User.create({
      name,
      email,
      password: hashed,
      university,
      role: "user"
    });

    res.json({ msg: "Registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Registration failed" });
  }
});

/* =========================
   LOGIN
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ IMPORTANT: role is returned at top-level
    res.json({
      token,
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        university: user.university
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Login failed" });
  }
});

/* =========================
   CURRENT USER
========================= */
router.get("/me", auth, (req, res) => {
  res.json({
    user: req.user
  });
});

export default router;