import { useEffect, useState } from "react";
import { FaCheck, FaTimes, FaFilePdf, FaChartLine, FaUsers, FaBookOpen } from "react-icons/fa";
import api from "../api/axios";

export default function AdminDashboard() {
  const [pendingNotes, setPendingNotes] = useState([]);
  const [stats, setStats] = useState({ totalNotes: 0, totalUsers: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Assuming you have an endpoint for admin stats and pending notes
      const [notesRes, statsRes] = await Promise.all([
        api.get("/notes/admin/pending"),
        api.get("/admin/stats") 
      ]);
      setPendingNotes(notesRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      if (action === "approve") {
        await api.put(`/notes/${id}/approve`);
      } else {
        await api.delete(`/notes/${id}`);
      }
      // Refresh list
      setPendingNotes(prev => prev.filter(note => note._id !== id));
      alert(`Note ${action === "approve" ? "Approved" : "Rejected"} successfully`);
    } catch (err) {
      alert("Action failed");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center md:text-left">Admin Control Center</h1>

        {/* 📊 ANALYTICS DASHBOARD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard icon={<FaBookOpen />} label="Total Notes" value={stats.totalNotes} color="bg-blue-500" />
          <StatCard icon={<FaUsers />} label="Total Students" value={stats.totalUsers} color="bg-purple-500" />
          <StatCard icon={<FaChartLine />} label="Pending Reviews" value={pendingNotes.length} color="bg-orange-500" />
        </div>

        {/* 📝 PENDING APPROVALS LIST */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Pending Approvals</h2>
            <p className="text-sm text-gray-500">Review notes before they go public</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Document</th>
                  <th className="px-6 py-4">Uploaded By</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingNotes.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-gray-400">No pending notes to review! 🎉</td>
                  </tr>
                ) : (
                  pendingNotes.map((note) => (
                    <tr key={note._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <FaFilePdf className="text-red-500 text-xl" />
                          <span className="font-medium text-gray-700">{note.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{note.uploadedBy?.name || "Unknown"}</td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
                          {note.subject}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <button 
                            onClick={() => handleAction(note._id, "approve")}
                            className="bg-green-100 text-green-600 p-2 rounded-lg hover:bg-green-600 hover:text-white transition"
                            title="Approve"
                          >
                            <FaCheck />
                          </button>
                          <button 
                            onClick={() => handleAction(note._id, "reject")}
                            className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-600 hover:text-white transition"
                            title="Reject"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Small Component for Stats
function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
      <div className={`${color} p-4 rounded-xl text-white text-2xl`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}