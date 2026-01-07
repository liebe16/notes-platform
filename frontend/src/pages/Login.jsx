import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      alert("Login successful ✅");

      // Redirect admin to admin dashboard
      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login to Notes & PYQ Hub
        </h1>

        <input
          className="border p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-indigo-500"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-indigo-500"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg w-full font-semibold transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* SIGN UP LINK */}
        <p className="text-center text-sm text-gray-600 mt-5">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}