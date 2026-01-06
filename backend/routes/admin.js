import express from "express";
import auth from "../middleware/auth.js";
import Note from "../models/Note.js";

const router = express.Router();

/* =========================
   ADMIN CHECK MIDDLEWARE
========================= */
function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ msg: "Admin only" });
  }
  next();
}

/* =========================
   GET PENDING NOTES
========================= */
router.get("/pending", auth, isAdmin, async (req, res) => {
  try {
    const notes = await Note.find({ status: "pending" })
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch pending notes" });
  }
});

/* =========================
   APPROVE NOTE
========================= */
router.patch("/approve/:id", auth, isAdmin, async (req, res) => {
  try {
    await Note.findByIdAndUpdate(req.params.id, {
      status: "approved"
    });

    res.json({ msg: "Note approved" });
  } catch (err) {
    res.status(500).json({ msg: "Approval failed" });
  }
});

/* =========================
   REJECT NOTE
========================= */
router.patch("/reject/:id", auth, isAdmin, async (req, res) => {
  try {
    await Note.findByIdAndUpdate(req.params.id, {
      status: "rejected"
    });

    res.json({ msg: "Note rejected" });
  } catch (err) {
    res.status(500).json({ msg: "Rejection failed" });
  }
});

export default router;