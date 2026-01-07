import express from "express";
import Note from "../models/Note.js";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* =========================
   ADMIN CHECK MIDDLEWARE
========================= */
const isAdmin = (req, res, next) => {
  // Ensure user is authenticated and is an admin
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied. Admin rights required." });
  }
  next();
};

/* =========================
   📊 GET ADMIN ANALYTICS
   Used for the StatCards in Dashboard
========================= */
router.get("/stats", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ msg: "Admin only" });

    const totalNotes = await Note.countDocuments({ isApproved: true });
    const totalUsers = await User.countDocuments();
    // Ensure this matches the field in Step 1
    const pending = await Note.countDocuments({ isApproved: false });

    res.json({ totalNotes, totalUsers, pending });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching stats" });
  }
});
/* =========================
   🔍 GET PENDING NOTES
   Used to populate the admin table
========================= */
router.get("/pending", auth, isAdmin, async (req, res) => {
  try {
    const notes = await Note.find({ isApproved: false })
      .populate("user", "name email") // Shows who uploaded it
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch pending notes" });
  }
});

/* =========================
   ✅ APPROVE NOTE
   Changes isApproved to true
========================= */
router.put("/approve/:id", auth, isAdmin, async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    
    if (!note) return res.status(404).json({ msg: "Note not found" });

    res.json({ msg: "Note approved and is now public!", note });
  } catch (err) {
    res.status(500).json({ msg: "Approval failed" });
  }
});

/* =========================
   ❌ REJECT/DELETE NOTE
   Removes the note from the database
========================= */
router.delete("/reject/:id", auth, isAdmin, async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    
    if (!note) return res.status(404).json({ msg: "Note not found" });

    res.json({ msg: "Note rejected and removed" });
  } catch (err) {
    res.status(500).json({ msg: "Rejection failed" });
  }
});

export default router;