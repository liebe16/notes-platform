export default function Navbar() {
  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between">
      <h1 className="font-bold text-xl text-indigo-600">
        NotesPlatform
      </h1>

      <div className="flex gap-6">
        <a href="/" className="hover:text-indigo-600">Home</a>
        <a href="/upload" className="hover:text-indigo-600">Upload</a>
        <a href="/admin" className="hover:text-indigo-600">Admin</a>
      </div>
    </nav>
  );
}