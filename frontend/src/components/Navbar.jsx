export default function Navbar() {
  return (
    <nav className="bg-indigo-600 text-white p-4 flex justify-between">
      <h1 className="font-bold text-lg">Notes Platform</h1>

      <div className="space-x-4">
        <a href="/">Home</a>
        <a href="/upload">Upload</a>
        <a href="/admin">Admin</a>
      </div>
    </nav>
  );
}