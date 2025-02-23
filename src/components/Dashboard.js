import { Link } from "react-router-dom";
export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <Link to="/users" className="p-4 bg-blue-500 text-white rounded-2xl text-center">Manage Users</Link>
        <Link to="/news" className="p-4 bg-green-500 text-white rounded-2xl text-center">Manage News</Link>
      </div>
    </div>
  );
}