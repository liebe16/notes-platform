export default function NoteCard({ note }) {
  const avg =
    note.ratings.reduce((a, r) => a + r.value, 0) / (note.ratings.length || 1);

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="font-bold text-lg">{note.title}</h2>
      <p className="text-sm text-gray-600">{note.subject}</p>
      <a
        href={note.pdfUrl}
        target="_blank"
        className="text-blue-600 mt-2 inline-block"
      >
        View PDF
      </a>
    </div>
  );
}