import { useEffect, useState } from "react";
import axios from "../api/axios";
import NoteCard from "../components/NoteCard";

export default function Search() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    axios.get("/notes").then(res => setNotes(res.data));
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {notes.map(note => <NoteCard key={note._id} note={note} />)}
    </div>
  );
}