import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminDashboard() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    api.get("/admin/pending").then(res => setNotes(res.data));
  }, []);

  const action = async (id, type) => {
    await api.patch(`/admin/${type}/${id}`);
    setNotes(notes.filter(n => n._id !== id));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Pending Notes</h1>

      {notes.map(note => (
        <div key={note._id} className="bg-white shadow p-4 rounded mb-4">
          <h2 className="font-semibold">{note.title}</h2>
          <p>{note.subject} • {note.university}</p>

          <div className="flex gap-3 mt-3">
            <button
              onClick={() => action(note._id, "approve")}
              className="bg-green-600 text-white px-4 py-1 rounded"
            >
              Approve
            </button>
            <button
              onClick={() => action(note._id, "reject")}
              className="bg-red-600 text-white px-4 py-1 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}