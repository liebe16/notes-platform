import { useState } from "react";
import api from "../api/axios";

export default function Upload() {
  const [file, setFile] = useState(null);

  const submit = async () => {
    const form = new FormData();
    form.append("pdf", file);
    form.append("title", "DSA Notes");
    form.append("subject", "DSA");

    await api.post("/notes", form);
    alert("Uploaded for admin approval");
  };

  return (
    <div className="p-6">
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={submit} className="btn">Upload</button>
    </div>
  );
}