import { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc, deleteDoc, doc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function ManageNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState(""); // Store the rejection reason

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
      alert("There was an error approving the post. Please try again.");
    }
  };

  // Handle reject action with a reason
  const handleReject = async (id) => {
    const postToReject = news.find((item) => item.id === id);

    if (rejectReason.trim() === "") {
      alert("Please provide a reason for rejecting the post.");
      return;
    }

    try {
      // Update status to 'rejected' in posts collection
      await updateDoc(doc(db, "posts", id), { status: "rejected" });

      // Add the rejected post to the newsReject collection
      await addDoc(collection(db, "newsReject"), {
        ...postToReject,
        rejectionReason: rejectReason,
        rejectedAt: serverTimestamp(),
      });

      // Optionally, remove the rejected post from the posts collection
      await deleteDoc(doc(db, "posts", id));

      // Reset the rejection reason after submission
      setRejectReason("");

      alert("Post has been rejected successfully.");
    } catch (error) {
      console.error("Error rejecting post:", error);
      alert("There was an error rejecting the post. Please try again.");
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
        alert("There was an error deleting the post. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <div className="spinner"></div> {/* Placeholder for your spinner */}
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage News</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Content</th>
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
              <td className="p-2">{item.content}</td>
              <td className="p-2">
                {/* Add fallback for missing images */}
                {item.image ? (
                  <img src={item.image} alt={item.content} className="w-32 h-20 object-cover" />
                ) : (
                  <img src="/placeholder.jpg" alt="Placeholder" className="w-32 h-20 object-cover" />
                )}
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
                {item.status !== "rejected" && (
                  <button
                    onClick={() => handleReject(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-gray-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Reject Modal (Optional) */}
      {rejectReason && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Enter Rejection Reason</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="p-2 mb-4 w-full border rounded"
              placeholder="Enter reason for rejection"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleReject(item.id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
              <button
                onClick={() => setRejectReason("")}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
