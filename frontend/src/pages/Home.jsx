import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaUniversity, FaBook } from "react-icons/fa";

export default function Home() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${search}`);
  };

  return (
    <div className="w-full">
      {/* 🟢 HERO SECTION */}
      <div className="bg-[#1a73e8] text-white py-20 px-6 text-center rounded-b-[3rem] shadow-xl">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          Master your studies.
        </h1>
        <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Access 20,000+ study notes, PYQs, and summaries from top universities.
        </p>

        {/* 🔍 SEARCH BAR */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
          <input
            type="text"
            placeholder="Search for courses, books or exams..."
            className="w-full py-4 pl-6 pr-14 rounded-full text-gray-800 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="absolute right-3 top-2.5 bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700">
            <FaSearch size={20} />
          </button>
        </form>
      </div>

      {/* 🏛 UNIVERSITY FILTERS */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaUniversity className="text-[#1a73e8]" /> Top Universities
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Delhi University", "Mumbai University", "IGNOU", "IIT Bombay"].map((uni) => (
            <div 
              key={uni} 
              onClick={() => navigate(`/search?university=${uni}`)}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md cursor-pointer transition flex items-center gap-3"
            >
              <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                <FaUniversity />
              </div>
              <span className="font-semibold text-gray-700">{uni}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}