import { useEffect, useState } from "react";
import api from "../api/axios";
import NoteCard from "../components/NoteCard";

export default function Bookmarks() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    api.get("/users/bookmarks").then(res => setNotes(res.data));
  }, []);

  if (!notes.length) {
    return <p className="text-center mt-10">No bookmarks yet ❤️</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {notes.map(note => (
        <NoteCard key={note._id} note={note} />
      ))}
    </div>
  );
}