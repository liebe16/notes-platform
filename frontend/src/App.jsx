import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth"; // Make sure to create this file!

// Pages
import Home from "./pages/Home";
import Search from "./pages/Search";
import Upload from "./pages/Upload";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import Bookmarks from "./pages/Bookmarks";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Layout>
      <Routes>
        {/* =========================
           PUBLIC ROUTES
        ========================= */}
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* =========================
           PROTECTED ROUTES (Any User)
        ========================= */}
        <Route element={<RequireAuth allowedRoles={["student", "admin", "teacher"]} />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
        </Route>

        {/* =========================
           ADMIN ONLY ROUTES
        ========================= */}
        <Route element={<RequireAuth allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* 404 Fallback (Optional) */}
        <Route path="*" element={<div className="p-10 text-center text-2xl font-bold">404: Page Not Found</div>} />
      </Routes>
    </Layout>
  );
}