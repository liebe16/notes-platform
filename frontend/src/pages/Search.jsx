import { useEffect, useState } from "react";
import api from "../api/axios";
import NoteCard from "../components/NoteCard";

export default function Search() {
  const [notes, setNotes] = useState([]);
  const [q, setQ] = useState("");
  const [university, setUniversity] = useState("");
  const [subject, setSubject] = useState("");

  const fetchNotes = async () => {
    const res = await api.get("/notes", {
      params: {
        q,
        university,
        subject
      }
    });
    setNotes(res.data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          className="border p-2 rounded"
          placeholder="Search title / subject"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="University"
          value={university}
          onChange={e => setUniversity(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Subject"
          value={subject}
          onChange={e => setSubject(e.target.value)}
        />
        <button
          onClick={fetchNotes}
          className="bg-indigo-600 text-white rounded px-4 py-2"
        >
          Search
        </button>
      </div>

      {/* RESULTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {notes.length === 0 && (
          <p className="text-gray-500">No notes found</p>
        )}

        {notes.map(note => (
          <NoteCard key={note._id} note={note} />
        ))}
      </div>
    </div>
  );
}