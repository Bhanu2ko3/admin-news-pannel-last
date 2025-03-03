import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import AdminDashboard from "./pages/AdminDashboard";
import UsersTable from "./components/UsersTable";
import NewsTable from "./components/NewsTable";
import LoginPage from "./pages/LoginPage";
import Profile from "./pages/Profile";
import { auth } from "./firebase";
import ApprovedNews from "./pages/ApprovedNews";
import RejectedNews from "./pages/RejectedNews"; // Import the new page

function PrivateRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  // Redirect to login if no user is found
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Route for login page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Private routes for admin pages */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
                  {/* Admin Dashboard and other routes */}
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="users" element={<UsersTable />} />
                    <Route path="news" element={<NewsTable />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="approved-news" element={<ApprovedNews />} />
                    <Route path="rejected-news" element={<RejectedNews />} /> {/* New RejectedNews Route */}
                  </Routes>
                </div>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
