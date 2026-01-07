import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-white/80 backdrop-blur shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link
        to="/"
        className="text-2xl font-extrabold text-indigo-600 tracking-tight"
      >
        Notes & PYQ Hub
      </Link>

      <div className="flex items-center gap-6 text-sm font-medium">
        <Link to="/" className="hover:text-indigo-600">Home</Link>

        {token && (
          <Link to="/upload" className="hover:text-indigo-600">
            Upload
          </Link>
        )}

        {role === "admin" && (
          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs">
            ADMIN
          </span>
        )}

        {!token ? (
          <>
            <Link to="/login" className="hover:text-indigo-600">
              Login
            </Link>

            <Link
              to="/register"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Sign up
            </Link>
          </>
        ) : (
          <>
            <Link to="/bookmarks" className="hover:text-indigo-600">
              Bookmarks
            </Link>

            <button
              onClick={logout}
              className="text-red-600 hover:underline"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}