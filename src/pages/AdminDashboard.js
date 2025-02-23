import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalNews: 0, pendingNews: 0, approvedNews: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const newsSnapshot = await getDocs(collection(db, "posts"));
      const pendingSnapshot = await getDocs(query(collection(db, "posts"), where("status", "==", "pending")));
      const approvedSnapshot = await getDocs(query(collection(db, "posts"), where("status", "==", "approved")));

      setStats({
        totalUsers: usersSnapshot.size,
        totalNews: newsSnapshot.size,
        pendingNews: pendingSnapshot.size,
        approvedNews: approvedSnapshot.size,
      });
    };

    fetchStats();
  }, []);

  

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <h3 className="text-xl font-semibold">Total Users</h3>
          <p className="text-3xl font-bold text-blue-500">{stats.totalUsers}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <h3 className="text-xl font-semibold">Total News</h3>
          <p className="text-3xl font-bold text-green-500">{stats.totalNews}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <h3 className="text-xl font-semibold">Pending Approvals</h3>
          <p className="text-3xl font-bold text-red-500">{stats.pendingNews}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <h3 className="text-xl font-semibold">Approved News</h3>
          <p className="text-3xl font-bold text-green-500">{stats.approvedNews}</p>
        </div>
      </div>
    </div>
  );
}
