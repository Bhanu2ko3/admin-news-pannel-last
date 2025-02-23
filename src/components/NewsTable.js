import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

export default function NewsTable() {
  const [news, setNews] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editNews, setEditNews] = useState({
    id: "",
    title: "",
    author: "",
    status: "",
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "news"), (snapshot) => {
      setNews(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const handleApprove = async (id) => {
    await updateDoc(doc(db, "news", id), { status: "approved" });
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "news", id));
  };

  const handleEdit = (item) => {
    setEditNews({
      id: item.id,
      title: item.title,
      author: item.author,
      status: item.status,
    });
    setEditMode(true);
  };

  const handleSaveEdit = async () => {
    // Ensure that status is defined
    const updatedStatus = editNews.status || "pending"; // Default to "pending" if status is undefined

    // Update Firestore document
    await updateDoc(doc(db, "news", editNews.id), {
      title: editNews.title,
      author: editNews.author,
      status: updatedStatus, // Make sure to use a valid value for status
    });

    setEditMode(false); // Exit edit mode after saving
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditNews((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Manage News</h2>

      {/* Edit Form */}
      {editMode && (
        <div className="mb-4 p-4 border rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Edit News</h3>
          <input
            type="text"
            name="title"
            value={editNews.title}
            onChange={handleChange}
            className="p-2 mb-2 w-full border rounded"
            placeholder="Title"
          />
          <input
            type="text"
            name="author"
            value={editNews.author}
            onChange={handleChange}
            className="p-2 mb-2 w-full border rounded"
            placeholder="Author"
          />
          <select
            name="status"
            value={editNews.status}
            onChange={handleChange}
            className="p-2 mb-2 w-full border rounded"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>
          <button
            onClick={handleSaveEdit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
          <button
            onClick={() => setEditMode(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
          >
            Cancel
          </button>
        </div>
      )}

      {/* News Table */}
      {!editMode && (
        <table className="w-full border rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Title</th>
              <th className="p-2">Author</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {news.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-2">{item.title}</td>
                <td className="p-2">{item.author}</td>
                <td className="p-2">{item.status || "pending"}</td>
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
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
