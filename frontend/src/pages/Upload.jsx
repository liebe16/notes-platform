import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt, FaFilePdf, FaArrowLeft } from "react-icons/fa";
import api from "../api/axios";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({ title: "", subject: "" });
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!file) {
      alert("Please select a PDF file to upload.");
      return;
    }

    setLoading(true);

    // Prepare Multipart Form Data
    const form = new FormData();
    form.append("pdf", file);
    form.append("title", details.title);
    form.append("subject", details.subject);

    try {
      // Sending to backend (Note: Ensure your backend route is /api/notes)
      await api.post("/notes", form);
      
      alert("Note uploaded successfully! It is now pending admin approval. 🚀");
      
      // Clear form
      setDetails({ title: "", subject: "" });
      setFile(null);
      
      // Redirect to home or search page
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#1a73e8] p-8 text-white text-center">
            <h2 className="text-3xl font-bold">Upload Study Material</h2>
            <p className="text-blue-100 mt-2">Share your notes and help others succeed</p>
          </div>

          <form onSubmit={handleUpload} className="p-8 space-y-6">
            
            {/* Title Input */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wider">
                Document Title
              </label>
              <input 
                required 
                type="text"
                className="w-full border-2 border-gray-100 rounded-xl p-4 focus:border-blue-500 focus:ring-0 outline-none transition"
                placeholder="e.g. CS50 Data Structures Lecture 1"
                value={details.title}
                onChange={e => setDetails({...details, title: e.target.value})}
              />
            </div>

            {/* Subject Input */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wider">
                Subject / Course Name
              </label>
              <input 
                required 
                type="text"
                className="w-full border-2 border-gray-100 rounded-xl p-4 focus:border-blue-500 focus:ring-0 outline-none transition"
                placeholder="e.g. Computer Science"
                value={details.subject}
                onChange={e => setDetails({...details, subject: e.target.value})}
              />
            </div>

            {/* Drag & Drop Upload Area */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wider">
                PDF Document
              </label>
              <div className="relative group">
                <div className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer
                  ${file ? 'border-green-400 bg-green-50' : 'border-blue-200 bg-blue-50/30 group-hover:border-blue-400 group-hover:bg-blue-50'}
                `}>
                  <input 
                    type="file" 
                    accept="application/pdf"
                    required
                    onChange={e => setFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  
                  {file ? (
                    <div className="text-center">
                      <FaFilePdf className="text-red-500 text-5xl mx-auto mb-3 animate-bounce" />
                      <p className="font-bold text-gray-800">{file.name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FaCloudUploadAlt className="text-blue-500 text-6xl mx-auto mb-3" />
                      <p className="font-bold text-gray-700">Drag & Drop or Click to browse</p>
                      <p className="text-sm text-gray-400 mt-1 font-medium">Maximum file size: 10MB (PDF only)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a73e8] hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading to Secure Server...
                </>
              ) : (
                "Submit for Admin Review"
              )}
            </button>
            
            <p className="text-center text-xs text-gray-400 italic">
              By uploading, you agree that this content is your own work and contains no copyright material.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}