import { useState } from "react";
import { FaBookmark, FaRegBookmark, FaFilePdf, FaDownload } from "react-icons/fa";
import api from "../api/axios";

export default function NoteCard({ note }) {
  // Check if the current user has this note in their bookmarks array
  // (Assuming you pass the initial bookmark status from the parent)
  const [saved, setSaved] = useState(note.isBookmarked || false);

  const toggleBookmark = async () => {
    try {
      await api.post(`/notes/${note._id}/bookmark`);
      setSaved(!saved);
    } catch (err) {
      alert("Please login to save notes");
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <FaFilePdf className="text-red-500 text-2xl" />
          <div>
            <h3 className="font-bold text-gray-800">{note.title}</h3>
            <p className="text-xs text-gray-500">{note.subject}</p>
          </div>
        </div>
        
        {/* 📌 PASTE BUTTON HERE */}
        <button 
          onClick={toggleBookmark} 
          className={`p-2 rounded-full transition ${saved ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50'}`}
        >
          {saved ? <FaBookmark size={20} /> : <FaRegBookmark size={20} />}
        </button>
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded text-gray-600">
          {note.university || "General"}
        </span>
        <button className="text-blue-600 hover:underline flex items-center gap-1 text-sm font-bold">
          <FaDownload size={14} /> Download
        </button>
      </div>
    </div>
  );
}