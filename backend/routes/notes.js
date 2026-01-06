import express from "express";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import uploadPDF from "../utils/cloudinary.js";
import Note from "../models/Note.js";

const router = express.Router();

/* =========================
   UPLOAD NOTE (USER)
========================= */
router.post("/", auth, upload.single("pdf"), async (req, res) => {
  try {
    const cloud = await uploadPDF(req.file.buffer);

    const note = await Note.create({
      title: req.body.title,
      subject: req.body.subject,
      university: req.user.university,
      pdfUrl: cloud.secure_url,
      uploadedBy: req.user.id,
      uploaderRole: req.user.role,
      status: "pending"
    });

    res.json({ msg: "Uploaded for admin approval", note });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Upload failed" });
  }
});

/* =========================
   SEARCH / LIST NOTES (PUBLIC)
========================= */
router.get("/", async (req, res) => {
  try {
    const { university } = req.query;

    const sortOptions = {
      uploaderRole: -1,
      createdAt: -1
    };

    if (university) {
      sortOptions.university = -1;
    }

    const notes = await Note.find({ status: "approved" }).sort(sortOptions);

    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch notes" });
  }
});


/* =========================
   RATE NOTE (USER)
========================= */
router.post("/:id/rate", auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    note.ratings = note.ratings.filter(
      r => r.user.toString() !== req.user.id
    );

    note.ratings.push({
      user: req.user.id,
      value: req.body.value
    });

    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ msg: "Rating failed" });
  }
});

export default router;