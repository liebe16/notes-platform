import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [university, setUniversity] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const register = async () => {
    if (!name || !email || !password || !university) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        name,
        email,
        password,
        university,
      });

      alert("Signup successful ✅ Please login");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h1>

        <input
          className="border p-3 w-full mb-3 rounded"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          className="border p-3 w-full mb-3 rounded"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-3 w-full mb-3 rounded"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <input
          className="border p-3 w-full mb-4 rounded"
          placeholder="University"
          value={university}
          onChange={e => setUniversity(e.target.value)}
        />

        <button
          onClick={register}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </div>
    </div>
  );
}