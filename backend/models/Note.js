import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: String,
  subject: String,
  university: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  uploaderRole: String,
  pdfUrl: String,
  status: { type: String, enum: ["pending", "approved"], default: "pending" },
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    value: Number
  }]
}, { timestamps: true });

export default mongoose.model("Note", noteSchema);