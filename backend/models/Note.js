import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  subject: { type: String, required: true, index: true },
  university: { type: String, index: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // 🟢 Standardized field for your Admin Dashboard
  isApproved: { type: Boolean, default: false }, 
  fileName: String,
  fileBuffer: Buffer, // Use this if not using Cloudinary/S3 yet
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    value: { type: Number, min: 1, max: 5 }
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

noteSchema.virtual("avgRating").get(function () {
  if (!this.ratings || this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((a, r) => a + r.value, 0);
  return parseFloat((sum / this.ratings.length).toFixed(1));
});

export default mongoose.model("Note", noteSchema);