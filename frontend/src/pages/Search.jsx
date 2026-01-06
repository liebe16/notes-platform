import { useEffect, useState } from "react";
import api from "../api/axios";
import NoteCard from "../components/NoteCard";

export default function Search() {
  const [notes, setNotes] = useState([]);
  const [q, setQ] = useState("");
  const [university, setUniversity] = useState("");

  useEffect(() => {
    api
      .get("/notes", {
        params: { q, university }
      })
      .then(res => setNotes(res.data));
  }, [q, university]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* HERO */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Find Study Notes from Top Universities
        </h1>
        <p className="text-gray-600">
          Search by subject, topic or university
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="flex gap-4 mb-6">
        <input
          className="flex-1 border p-3 rounded"
          placeholder="Search notes..."
          value={q}
          onChange={e => setQ(e.target.value)}
        />

        <input
          className="border p-3 rounded"
          placeholder="University"
          value={university}
          onChange={e => setUniversity(e.target.value)}
        />
      </div>

      {/* NOTES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {notes.map(note => (
          <NoteCard key={note._id} note={note} />
        ))}
      </div>
    </div>
  );
}