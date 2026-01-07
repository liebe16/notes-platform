import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import User from "../models/User.js";
import Note from "../models/Note.js";
import auth from "../middleware/auth.js";
// import sendEmail from "../utils/sendEmail.js"; // Implement your email sender later

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* =========================
   1️⃣ REGISTER (Email + Password)
   Creates user with isVerified: false
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

    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashed,
      university,
      role: "student", // Default role
      verificationToken,
      isVerified: false // Requires email verification
    });

    // TODO: Send Email here
    // const verifyUrl = `http://localhost:5173/verify/${verificationToken}`;
    // await sendEmail(email, "Verify Account", `Click here: ${verifyUrl}`);

    res.json({ msg: "Registered! Please check your email to verify account." });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ msg: "Registration failed" });
  }
});

/* =========================
   2️⃣ LOGIN (Email + Password)
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password required" });
    }

    // 🔴 CRITICAL CHANGE: We must explicitly .select("+password") 
    // because we set { select: false } in the User model.
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check Password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Optional: Check if verified
    // if (!user.isVerified) return res.status(400).json({ msg: "Please verify your email" });

    // Create Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

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
    console.error("Login Error:", err);
    res.status(500).json({ msg: "Login failed" });
  }
});

/* =========================
   3️⃣ GOOGLE OAUTH LOGIN
========================= */
router.post("/google", async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const { name, email, sub } = ticket.getPayload();

    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user from Google
      user = await User.create({
        name,
        email,
        googleId: sub,
        isVerified: true, // Google accounts are already verified
        password: await bcrypt.hash(crypto.randomBytes(16).toString("hex"), 10), // Random dummy password
        university: "Not Specified", // User can update this later
        role: "student"
      });
    }

    const jwtToken = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    res.json({
      token: jwtToken,
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        university: user.university
      }
    });
  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(400).json({ msg: "Google Auth Failed" });
  }
});

/* =========================
   4️⃣ VERIFY EMAIL ENDPOINT
   (Handles the link click)
========================= */
router.post("/verify-email", async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ verificationToken: token });

    if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

    user.isVerified = true;
    user.verificationToken = undefined; // Clear token
    await user.save();

    res.json({ msg: "Email verified successfully! You can now login." });
  } catch (err) {
    res.status(500).json({ msg: "Verification failed" });
  }
});

/* =========================
   5️⃣ CURRENT USER (Protected)
========================= */
router.get("/me", auth, (req, res) => {
  res.json({
    user: req.user
  });
});

/* =========================
   GET USER PROFILE (Includes Uploads & Bookmarks)
========================= */

router.get("/profile", auth, async (req, res) => {
  try {
    // 1. Get user and their bookmarks
    const user = await User.findById(req.user.id).populate("bookmarks");
    
    // 2. Get notes uploaded by this user
    const myUploads = await Note.find({ uploadedBy: req.user.id });

    res.json({
      user: {
        name: user.name,
        email: user.email,
        university: user.university,
        role: user.role
      },
      bookmarks: user.bookmarks,
      uploads: myUploads
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

export default router;