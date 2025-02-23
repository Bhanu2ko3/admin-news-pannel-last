import { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function ManageNews() {
  const [news, setNews] = useState([]);
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "news"), (snapshot) => {
      setNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const handleApprove = async (id) => {
    await updateDoc(doc(db, "news", id), { status: "approved" });
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "news", id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage News</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
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
                  <button onClick={() => handleApprove(item.id)} className="bg-green-500 text-white px-3 py-1 rounded">Approve</button>
                )}
                <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
