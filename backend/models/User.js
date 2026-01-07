import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, select: false }, // Hide password by default
  googleId: String, // For OAuth
  isVerified: { type: Boolean, default: false }, // Email verification
  verificationToken: String,
  role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },
  university: String,
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }]
}, { timestamps: true });

export default mongoose.model("User", userSchema);