import express from "express";
import admin from "../middleware/admin.js";
import Note from "../models/Note.js";

const router = express.Router();

/**
 * GET all pending notes (ADMIN ONLY)
 * GET /api/admin/pending
 */
router.get("/pending", admin, async (req, res) => {
  try {
    const notes = await Note.find({ status: "pending" })
      .populate("uploadedBy", "name email university role")
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch pending notes" });
  }
});

/**
 * APPROVE a note (ADMIN ONLY)
 * POST /api/admin/approve/:id
 */
router.post("/approve/:id", admin, async (req, res) => {
  try {
    await Note.findByIdAndUpdate(req.params.id, {
      status: "approved"
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Approval failed" });
  }
});

export default router;