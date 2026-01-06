export default function NoteCard({ note }) {
  const avg =
    note.ratings.reduce((a, r) => a + r.value, 0) /
    (note.ratings.length || 1);

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="font-semibold text-lg">{note.title}</h2>
      <p className="text-sm text-gray-600">
        {note.subject} • {note.university}
      </p>

      <div className="flex items-center justify-between mt-2">
        <span className="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-700">
          {note.uploaderRole}
        </span>
        <span className="text-sm">⭐ {avg.toFixed(1)}</span>
      </div>

      <a
        href={note.pdfUrl}
        target="_blank"
        className="block mt-4 text-center bg-indigo-600 text-white py-2 rounded"
      >
        View PDF
      </a>
    </div>
  );
}