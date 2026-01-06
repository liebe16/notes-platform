import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Search from "./pages/Search";
import Upload from "./pages/Upload";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Layout>
  );
}