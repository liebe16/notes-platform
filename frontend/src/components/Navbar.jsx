export default function Navbar() {
  return (
    <nav className="bg-indigo-600 text-white p-4 flex justify-between">
      <h1 className="font-bold text-lg">Notes Platform</h1>

      <div className="space-x-4">
        <a href="/upload" className="hover:underline">
          Upload
        </a>
        <a href="/admin" className="hover:underline">
          Admin
        </a>
      </div>
    </nav>
  );
}
export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  );
}