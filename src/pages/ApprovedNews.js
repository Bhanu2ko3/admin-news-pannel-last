import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import NewsCard from "../components/NewsCard";

const ApprovedNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApprovedNews = async () => {
      try {
        const q = query(collection(db, "newsApproved"), where("status", "==", "Approved"));
        const querySnapshot = await getDocs(q);
        const approvedNews = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNews(approvedNews);
      } catch (err) {
        console.error("Error fetching approved news:", err);
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedNews();
  }, []);

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-center">Approved News</h2>

      {/* Loading & Error Handling */}
      {loading ? (
        <p className="text-center text-gray-500">Loading news...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : news.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {news.map((item) => (
            <NewsCard
              key={item.id}
              topic={item.topic || "Untitled News"}
              content={item.content || "No content available."}
              image={item.image ? item.image : "https://via.placeholder.com/400"} // ✅ Corrected: Use the direct URL
              createdAt={item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleString() : "Unknown"}
              rating={item.rating || 0}
              reporter={item.reporter || "Unknown"}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No approved news available.</p>
      )}
    </div>
  );
};

export default ApprovedNews;
