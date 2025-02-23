import { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc, deleteDoc, doc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function NewsTable() {
  const [news, setNews] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editNews, setEditNews] = useState({ postId: "", caption: "", reporter: "", topic: "", status: "", image: "", timestamp: 0 });
  const [modalState, setModalState] = useState({ open: false, postId: null, topic: "",  feedback: "", rating: 0 });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts"), snapshot => {
      setNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditNews((prev) => ({ ...prev, [name]: value }));
  };

  const handleApprove = (id, topic) => setModalState({ open: true, postId: id, topic,  feedback: "", rating: 0 });

  const handleDelete = async (id) => await deleteDoc(doc(db, "posts", id));

  const handleSaveEdit = async () => {
    const { postId, caption, reporter, topic, image, status, timestamp } = editNews;
    await updateDoc(doc(db, "posts", postId), { caption, reporter, topic, status: status || "pending", image, timestamp });
    setEditMode(false);
  };

  const handleFeedbackSubmit = async () => {
    const { feedback, rating } = modalState;
    try {
      const docRef = await addDoc(collection(db, "news"), {
        topic: modalState.topic,
        content: feedback,
        reporter:  "",
        status: "pending",
        feedback,
        rating,
        createdAt: serverTimestamp(),
      });
      console.log("Document written with ID:", docRef.id);
      setModalState({ open: false, postId: null, topic: "", feedback: "", rating: 0 });
    } catch (e) {
      console.error("Error adding document:", e);
    }
  };

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Manage News</h2>

      {editMode ? (
        <div className="mb-4 p-4 border rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Edit News</h3>
          {["caption", "reporter", "topic", "image"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              value={editNews[field]}
              onChange={handleEditChange}
              className="p-2 mb-2 w-full border rounded"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            />
          ))}
          <select name="status" value={editNews.status} onChange={handleEditChange} className="p-2 mb-2 w-full border rounded">
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>
          <div>
            <button onClick={handleSaveEdit} className="bg-blue-500 text-white px-4 py-2 rounded">Save Changes</button>
            <button onClick={() => setEditMode(false)} className="bg-gray-500 text-white px-4 py-2 rounded ml-2">Cancel</button>
          </div>
        </div>
      ) : (
        <table className="w-full border rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              {["Image", "Caption", "Reporter", "Topic", "Status", "Actions"].map((header) => (
                <th key={header} className="p-2">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {news.map((item) => (
              <tr key={item.postId} className="border-t">
                <td className="p-2">{item.image ? <img src={`data:image/jpeg;base64,${item.image}`} alt="Post" className="w-16 h-16 object-cover" /> : "No Image"}</td>
                <td className="p-2">{item.caption}</td>
                <td className="p-2">{item.reporter}</td>
                <td className="p-2">{item.topic}</td>
                <td className="p-2">{item.status || "pending"}</td>
                <td className="p-2 space-x-2">
                  {item.status !== "approved" && <button onClick={() => handleApprove(item.postId, item.topic)} className="bg-green-500 text-white px-3 py-1 rounded">Approve</button>}
                  <button onClick={() => handleDelete(item.postId)} className="bg-red-500 text-white px-3 py-1 rounded">Reject</button>
                  <button onClick={() => { setEditNews(item); setEditMode(true); }} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalState.open && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Provide Feedback and Rating</h3>
            <textarea
              value={modalState.feedback}
              onChange={(e) => setModalState((prev) => ({ ...prev, feedback: e.target.value }))}
              className="p-2 mb-4 w-full border rounded"
              placeholder="Enter feedback"
            />
            <div className="flex mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} onClick={() => setModalState((prev) => ({ ...prev, rating: star }))} className={`cursor-pointer text-2xl ${modalState.rating >= star ? "text-yellow-500" : "text-gray-300"}`}>
                  {modalState.rating >= star ? "★" : "☆"}
                </span>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={handleFeedbackSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
              <button onClick={() => setModalState((prev) => ({ ...prev, open: false }))} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
