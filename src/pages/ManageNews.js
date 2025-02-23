import { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function ManageNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch news posts from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      setNews(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          status: doc.data().status || "pending", // Default status
        }))
      );
      setLoading(false); // Set loading to false when data is fetched
    });

    return () => unsubscribe();
  }, []);

  // Handle approve action
  const handleApprove = async (id) => {
    try {
      await updateDoc(doc(db, "posts", id), { status: "approved" });
    } catch (error) {
      console.error("Error approving post:", error);
    }
  };

  // Handle delete action with confirmation
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "posts", id));
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading message while data is being fetched
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage News</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Caption</th>
            <th className="p-2">Image</th>
            <th className="p-2">Reporter</th>
            <th className="p-2">Topic</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {news.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-2">{item.caption}</td>
              <td className="p-2">
                <img src={item.image} alt={item.caption} className="w-32 h-20 object-cover" />
              </td>
              <td className="p-2">{item.reporter}</td>
              <td className="p-2">{item.topic}</td>
              <td className="p-2">{item.status}</td>
              <td className="p-2 space-x-2">
                {item.status !== "approved" && (
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
