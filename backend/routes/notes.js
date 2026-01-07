import express from "express";
import multer from "multer";
import Note from "../models/Note.js";
import auth from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

/* =========================
   MULTER CONFIG
========================= */
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* =========================
   1️⃣ CREATE NOTE (UPLOAD)
   Uses isApproved: false to match Admin query
========================= */
router.post("/", auth, upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "PDF file required" });
    }

    const { title, subject, university } = req.body;

    if (!title || !subject) {
      return res.status(400).json({ msg: "Title & subject required" });
    }

    const note = await Note.create({
      title,
      subject,
      university,
      fileName: req.file.originalname,
      fileBuffer: req.file.buffer, // Storing as buffer in DB
      uploadedBy: req.user.id,     // Matches model field
      isApproved: false            // Standardized field name
    });

    res.json({ msg: "Note submitted for approval" });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ msg: "Upload failed" });
  }
});

/* =========================
   2️⃣ GET APPROVED NOTES (Public)
========================= */
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find({ isApproved: true })
      .populate("uploadedBy", "name")
      .sort("-createdAt");
    res.json(notes);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching notes" });
  }
});

/* =========================
   3️⃣ GET PENDING NOTES (Admin Only)
========================= */
router.get("/admin/pending", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ msg: "Unauthorized" });

    // FIX: Changed .populate("user") to .populate("uploadedBy", "name")
    const notes = await Note.find({ isApproved: false })
      .populate("uploadedBy", "name") 
      .sort("-createdAt");
      
    res.json(notes);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

/* =========================
   4️⃣ APPROVE A NOTE (Admin Only)
========================= */
router.put("/:id/approve", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const note = await Note.findByIdAndUpdate(
      req.params.id, 
      { isApproved: true }, 
      { new: true }
    );

    if (!note) return res.status(404).json({ msg: "Note not found" });
    
    res.json({ msg: "Note approved successfully", note });
  } catch (err) {
    res.status(500).json({ msg: "Approval failed" });
  }
});

/* =========================
   5️⃣ RATE NOTES
========================= */
router.post("/:id/rate", auth, async (req, res) => {
  try {
    const { value } = req.body;
    if (value < 1 || value > 5) return res.status(400).json({ msg: "Rating must be 1-5" });

    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ msg: "Note not found" });
    
    // Remove existing rating by this user if any
    note.ratings = note.ratings.filter(r => r.user.toString() !== req.user.id);
    
    // Add new rating
    note.ratings.push({ user: req.user.id, value });
    await note.save();
    
    res.json({ msg: "Rating added" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

/* =========================
   6️⃣ DELETE/REJECT NOTE (Admin Only)
========================= */
router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ msg: "Unauthorized" });

    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ msg: "Note not found" });

    res.json({ msg: "Note rejected and deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed" });
  }
});

/* =========================
   TOGGLE BOOKMARK
========================= */
router.post("/:id/bookmark", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const noteId = req.params.id;

    const isBookmarked = user.bookmarks.includes(noteId);

    if (isBookmarked) {
      // Remove if already exists
      user.bookmarks = user.bookmarks.filter(id => id.toString() !== noteId);
    } else {
      // Add if new
      user.bookmarks.push(noteId);
    }

    await user.save();
    res.json({ msg: isBookmarked ? "Removed from bookmarks" : "Saved to bookmarks" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

/* =========================
   📄 VIEW PDF (New)
========================= */
router.get("/:id/view", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || !note.fileBuffer) return res.status(404).json({ msg: "File not found" });

    // Set headers so the browser opens it in a PDF viewer
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${note.fileName}"`,
    });

    res.send(note.fileBuffer);
  } catch (err) {
    res.status(500).json({ msg: "Error opening PDF" });
  }
});

export default router;