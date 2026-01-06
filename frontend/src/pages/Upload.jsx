import { useState } from "react";
import api from "../api/axios";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");

  const submit = async () => {
    if (!file || !title || !subject) {
      alert("All fields are required");
      return;
    }

    const form = new FormData();
    form.append("pdf", file);
    form.append("title", title);
    form.append("subject", subject);

    await api.post("/notes", form);
    alert("Uploaded for admin approval");
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">Upload Notes</h1>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-3"
        placeholder="Subject"
        value={subject}
        onChange={e => setSubject(e.target.value)}
      />

      <input
        type="file"
        accept="application/pdf"
        className="mb-4"
        onChange={e => setFile(e.target.files[0])}
      />

      <button
        onClick={submit}
        className="bg-indigo-600 text-white px-4 py-2 rounded w-full"
      >
        Upload
      </button>
    </div>
  );
}