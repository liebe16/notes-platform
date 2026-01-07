import { useEffect, useState } from "react";
import { FaUserCircle, FaBookmark, FaFileUpload, FaGraduationCap, FaEnvelope } from "react-icons/fa";
import api from "../api/axios";
import NoteCard from "../components/NoteCard"; // Reuse the NoteCard we discussed earlier

export default function Profile() {
  const [activeTab, setActiveTab] = useState("uploads");
  const [data, setData] = useState({ user: null, bookmarks: [], uploads: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        setData(res.data);
      } catch (err) {
        console.error("Profile fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="p-20 text-center text-gray-500">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 👤 HEADER SECTION */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="bg-blue-100 p-1 rounded-full">
              <FaUserCircle className="text-blue-600 text-8xl" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800">{data.user?.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-gray-600">
                <span className="flex items-center gap-2"><FaEnvelope /> {data.user?.email}</span>
                <span className="flex items-center gap-2 text-blue-600 font-semibold">
                  <FaGraduationCap /> {data.user?.university || "Student"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-10">
        {/* 📑 TABS NAVIGATION */}
        <div className="flex gap-8 border-b mb-8">
          <button 
            onClick={() => setActiveTab("uploads")}
            className={`pb-4 flex items-center gap-2 font-bold transition ${activeTab === "uploads" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-400"}`}
          >
            <FaFileUpload /> My Uploads ({data.uploads.length})
          </button>
          <button 
            onClick={() => setActiveTab("bookmarks")}
            className={`pb-4 flex items-center gap-2 font-bold transition ${activeTab === "bookmarks" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-400"}`}
          >
            <FaBookmark /> My Bookmarks ({data.bookmarks.length})
          </button>
        </div>

        {/* 🗂️ CONTENT AREA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeTab === "uploads" ? (
            data.uploads.length > 0 ? (
              data.uploads.map(note => (
                <div key={note._id} className="relative">
                  <NoteCard note={note} />
                  {/* Status Badge for Uploads */}
                  <span className={`absolute top-2 right-2 px-2 py-1 text-[10px] font-bold uppercase rounded ${note.isApproved ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {note.isApproved ? "Approved" : "Pending Approval"}
                  </span>
                </div>
              ))
            ) : (
              <p className="col-span-2 text-center text-gray-400 py-10">You haven't uploaded any notes yet.</p>
            )
          ) : (
            data.bookmarks.length > 0 ? (
              data.bookmarks.map(note => (
                <NoteCard key={note._id} note={note} />
              ))
            ) : (
              <p className="col-span-2 text-center text-gray-400 py-10">Your saved list is empty.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}