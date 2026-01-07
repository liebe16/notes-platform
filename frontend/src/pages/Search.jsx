import { useEffect, useState } from "react";
import api from "../api/axios";
import NoteCard from "../components/NoteCard";

export default function Search() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");
  const [university, setUniversity] = useState("");
  const [subject, setSubject] = useState("");
  const [rating, setRating] = useState("");

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notes", {
        params: { q, university, subject, rating },
      });
      setNotes(res.data);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* HERO SECTION */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-10 rounded-2xl shadow-lg mb-12 text-white">
        <h1 className="text-4xl font-extrabold mb-4 leading-tight">
          Best Platform for Notes & PYQs
        </h1>

        <p className="text-lg text-indigo-100 max-w-2xl mb-8">
          Access verified study notes and previous year question papers from
          top universities — uploaded by students and educators.
        </p>

        {/* SEARCH FILTERS */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl">
          <input
            className="border p-2 rounded"
            placeholder="Search topic"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <input
            className="border p-2 rounded"
            placeholder="University"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
          />
          <input
            className="border p-2 rounded"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <select
            className="border p-2 rounded"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="">Min Rating</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5</option>
          </select>
        </div>

        <button
          onClick={fetchNotes}
          className="mt-6 bg-white text-indigo-600 font-semibold px-8 py-3 rounded-full hover:bg-indigo-50 transition"
        >
          Search Notes
        </button>
      </div>

      {/* STATES */}
      {loading && (
        <p className="text-center text-gray-600">Loading notes…</p>
      )}

      {!loading && notes.length === 0 && (
        <p className="text-center text-gray-500">
          No notes found. Try adjusting filters.
        </p>
      )}

      {/* RESULTS */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
        {notes.map((note) => (
          <NoteCard key={note._id} note={note} />
        ))}
      </div>
    </div>
  );
}
