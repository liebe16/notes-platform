import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Admin() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    api.get("/admin/pending").then(res => setNotes(res.data));
  }, []);

  const approve = async (id) => {
    await api.post(`/admin/approve/${id}`);
    setNotes(notes.filter(n => n._id !== id));
  };

  return (
    <div className="p-6">
      {notes.map(n => (
        <div key={n._id} className="card">
          <h3>{n.title}</h3>
          <button onClick={() => approve(n._id)}>Approve</button>
        </div>
      ))}
    </div>
  );
}