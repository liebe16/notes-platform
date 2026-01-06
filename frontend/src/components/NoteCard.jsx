export default function NoteCard({ note }) {
  const avg =
    note.ratings.reduce((a, r) => a + r.value, 0) / (note.ratings.length || 1);

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="font-bold">{note.title}</h2>
      <p>{note.university}</p>
      <p>⭐ {avg.toFixed(1)}</p>
      <a href={note.pdfUrl} target="_blank">View PDF</a>
    </div>
  );
}