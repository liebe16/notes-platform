import { useState } from "react";
import { FaStar } from "react-icons/fa";
import api from "../api/axios";

export default function StarRating({ noteId, initialRating, onRate }) {
  const [rating, setRating] = useState(initialRating || 0);
  const [hover, setHover] = useState(null);

  const handleRate = async (value) => {
    setRating(value);
    try {
      await api.post(`/notes/${noteId}/rate`, { value });
      if (onRate) onRate(); // Refresh parent
    } catch (err) {
      console.error("Rating failed");
    }
  };

  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1;
        return (
          <label key={i} className="cursor-pointer">
            <input 
              type="radio" 
              className="hidden" 
              value={ratingValue} 
              onClick={() => handleRate(ratingValue)}
            />
            <FaStar 
              size={20} 
              className="transition-colors duration-200"
              color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
            />
          </label>
        );
      })}
    </div>
  );
}