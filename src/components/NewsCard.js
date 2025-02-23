import React, { useState } from "react";

const NewsCard = ({ topic, content, image, createdAt, rating, reporter }) => {
  const [expanded, setExpanded] = useState(false);

  // Check if the image is in base64 format or a URL
  const imageSrc = image?.startsWith("data:image") ? image : image ? `data:image/jpeg;base64,${image}` : null;

  return (
    <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200 transition hover:shadow-lg">
      {/* News Image */}
      {imageSrc ? (
        <img
          src={imageSrc}
          alt="News"
          className="w-full h-48 object-cover rounded-md mb-4"
          onError={(e) => {
            e.target.src = "/placeholder.jpg"; // Fallback image
          }}
        />
      ) : (
        <p className="text-gray-400 text-sm">No Image Available</p>
      )}

      {/* News Topic */}
      <h3 className="text-xl font-bold text-gray-800 mb-2">{topic}</h3>

      {/* Reporter & Date */}
      <p className="text-gray-500 text-sm mb-2">
        📰 <strong>{reporter}</strong> | 🗓️ {new Date(createdAt).toLocaleString()}
      </p>

      {/* News Content */}
      <p className="text-gray-700">
        {expanded || content.length <= 50 ? content : content.substring(0, 50) + "..."}
      </p>

      {/* Read More / Read Less Button */}
      {content.length > 50 && (
        <button
          className="mt-2 text-blue-600 hover:underline"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Read Less" : "Read More"}
        </button>
      )}

      {/* Star Rating */}
      <div className="flex items-center mt-3">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? "text-yellow-500" : "text-gray-300"}>
            ★
          </span>
        ))}
      </div>
    </div>
  );
};

export default NewsCard;
