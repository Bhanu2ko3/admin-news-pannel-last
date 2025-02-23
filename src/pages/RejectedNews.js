import React, { useState, useEffect } from "react";
import { ref, get } from "firebase/database";  // Use the modular import
import { database } from "../firebase";  // Import the database directly from firebase.js

const RejectedNews = () => {
  const [rejectedNews, setRejectedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRejectedNews = async () => {
      try {
        const newsRef = ref(database, 'newsReject'); // Reference to the 'newsReject' node in Realtime Database
        const snapshot = await get(newsRef); // Fetch the data
        if (!snapshot.exists()) {
          setError("No rejected news found.");
        } else {
          const data = snapshot.val();
          const newsArray = [];
          for (let id in data) {
            newsArray.push({ id, ...data[id] });
          }
          setRejectedNews(newsArray);
        }
      } catch (err) {
        console.error("Error fetching rejected news:", err);
        setError("Failed to load rejected news.");
      } finally {
        setLoading(false); // Always stop loading once the fetch attempt is done
      }
    };

    fetchRejectedNews();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Rejected News</h2>
      {rejectedNews.length === 0 ? (
        <p>No rejected news available.</p>
      ) : (
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2">Content</th>
              <th className="border px-4 py-2">Reporter</th>
              <th className="border px-4 py-2">Rejection Reason</th>
              <th className="border px-4 py-2">Rejected At</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rejectedNews.map((news) => (
              <tr key={news.id}>
                <td className="border px-4 py-2">{news.content}</td>
                <td className="border px-4 py-2">{news.reporter}</td>
                <td className="border px-4 py-2">{news.rejectionReason}</td>
                <td className="border px-4 py-2">{news.rejectedAt}</td>
                <td className="border px-4 py-2">{news.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RejectedNews;
