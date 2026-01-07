import express from "express";
import multer from "multer";
import Note from "../models/Note.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* =========================
   MULTER CONFIG
========================= */
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* =========================
   CREATE NOTE (UPLOAD)
========================= */
router.post("/", auth, upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "PDF file required" });
    }

    const { title, subject } = req.body;

    if (!title || !subject) {
      return res.status(400).json({ msg: "Title & subject required" });
    }

    const note = await Note.create({
      title,
      subject,
      fileName: req.file.originalname,
      fileBuffer: req.file.buffer,
      uploadedBy: req.user.id,
      approved: false
    });

    res.json({ msg: "Note submitted for approval" });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ msg: "Upload failed" });
  }
});

/* =========================
   GET APPROVED NOTES
========================= */
router.get("/", async (req, res) => {
  const notes = await Note.find({ approved: true });
  res.json(notes);
});

export default router;