import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useState, useEffect } from "react";
import { UserCircleIcon } from '@heroicons/react/outline'; // Correct import for Heroicons v2

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [userProfilePic, setUserProfilePic] = useState(null);  // Fix here

  const navLinkClasses = (path) =>
    `block px-4 py-2 rounded-lg ${pathname === path ? "bg-gray-700" : "hover:bg-gray-700"}`;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Fetch the user's profile picture from Firebase Auth (optional if you want to keep the profile pic)
  useEffect(() => {
    const fetchProfilePic = () => {
      const user = auth.currentUser;
      if (user) {
        setUserProfilePic(user.photoURL || null); // Optional, only if you want to keep the pic
      }
    };

    fetchProfilePic();
  }, []);

  return (
    <div className="w-64 h-full bg-gray-800 text-white flex flex-col justify-between p-4 space-y-4">

      <div>
        {/* Profile Link with Icon */}
        <div className="mt-3.5">
          <Link
            to="/profile"
            className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            <UserCircleIcon className="h-8 w-8 text-white mr-3" /><h2 className="text-2xl font-bold text-center">Admin</h2>
            <span className="text-sm"></span>
          </Link>
        </div>
        
        <nav className="space-y-2 mt-4">
          <Link to="/" className={navLinkClasses("/")}>Dashboard</Link>
          <Link to="/approved-news" className={navLinkClasses("/approved-news")}>Approved News</Link>
          <Link to="/rejected-news" className={navLinkClasses("/rejected-news")}>Rejected News</Link> {/* New Rejected News Link */}
          <Link to="/users" className={navLinkClasses("/users")}>Manage Users</Link>
          <Link to="/news" className={navLinkClasses("/news")}>Manage News</Link>
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-center font-semibold mt-4"
      >
        Log Out
      </button>
    </div>
  );
}
