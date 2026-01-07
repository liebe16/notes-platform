import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
      
      {/* NAVBAR */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-indigo-700">
            Notes & PYQ Hub
          </h1>

          <nav className="space-x-6 text-gray-700 font-medium">
            <Link className="hover:text-indigo-600" to="/">Home</Link>
            <Link className="hover:text-indigo-600" to="/upload">Upload</Link>
            <Link className="hover:text-indigo-600" to="/login">Login</Link>
          </nav>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {children}
      </main>
    </div>
  );
}
