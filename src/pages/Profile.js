import { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase"; // Ensure that Firebase is correctly initialized
import { updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Profile() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    photoURL: "",
  });
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPhotoURL, setNewPhotoURL] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const userId = auth.currentUser?.uid; // Get the current user's UID

  // Fetch user profile data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    fetchUserData();
  }, [userId]);

  // Handle form changes for email, password, and photoURL
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "newEmail") setNewEmail(value);
    if (name === "newPassword") setNewPassword(value);
    if (name === "newPhotoURL") setNewPhotoURL(value);
  };

  // Handle file input change for profile picture
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setPreview(URL.createObjectURL(file)); // Preview the image before uploading
  };

  // Upload the profile picture to Firebase Storage
  const uploadProfilePicture = async () => {
    if (!file) return;

    const storageRef = ref(storage, `profile-pictures/${userId}`);
    await uploadBytes(storageRef, file);
    const photoURL = await getDownloadURL(storageRef);

    return photoURL;
  };

  // Save updated profile data to Firestore and Firebase Auth
  const handleSave = async () => {
    if (userId) {
      try {
        let photoURL;

        // If the user uploaded a new profile picture, upload it to Firebase Storage
        if (file) {
          photoURL = await uploadProfilePicture();
        }

        // Update profile picture in Firebase Auth if provided
        if (photoURL || newPhotoURL) {
          await updateProfile(auth.currentUser, {
            photoURL: photoURL || newPhotoURL,
          });
        }

        // Update email in Firebase Auth if provided
        if (newEmail && newEmail !== userData.email) {
          await updateEmail(auth.currentUser, newEmail);
        }

        // Update password in Firebase Auth if provided
        if (newPassword) {
          await updatePassword(auth.currentUser, newPassword);
        }

        // Save the updated data to Firestore
        const docRef = doc(db, "users", userId);
        await updateDoc(docRef, {
          name: userData.name,
          email: newEmail || userData.email,
          photoURL: photoURL || newPhotoURL || userData.photoURL,
        });

        // Update the userData state with new information
        setUserData({
          ...userData,
          email: newEmail || userData.email,
          photoURL: photoURL || newPhotoURL || userData.photoURL,
        });

        setSuccessMessage("Profile updated successfully!");
        setError(""); // Clear any previous errors
        setIsEditing(false); // Exit editing mode after saving
      } catch (err) {
        setError("Failed to update profile. Please try again.");
        console.error("Error updating profile:", err);
      }
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center">Profile</h1>

      {/* Display success message */}
      {successMessage && (
        <div className="text-green-500 text-center">{successMessage}</div>
      )}

      {/* Display error message */}
      {error && (
        <div className="text-red-500 text-center">{error}</div>
      )}

      {/* Profile Info Display */}
      {!isEditing ? (
        <div className="space-y-4">
          <div className="flex flex-col items-center">
            <img
              src={userData.photoURL || "https://via.placeholder.com/150"}
              alt="Profile"
              className="rounded-full w-32 h-32 mb-4"
            />
            <h2 className="text-2xl font-semibold">{userData.name}</h2>
            <p className="text-lg text-gray-500">{userData.email}</p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Email Update */}
          <input
            type="email"
            name="newEmail"
            value={newEmail || userData.email}
            onChange={handleChange}
            className="p-2 w-full border rounded"
            placeholder="New Email"
          />

          {/* Password Update */}
          <input
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={handleChange}
            className="p-2 w-full border rounded"
            placeholder="New Password"
          />

          {/* Profile Picture Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="p-2 w-full border rounded"
          />
          {preview && (
            <div className="mt-4 text-center">
              <img src={preview} alt="Profile Preview" className="w-32 h-32 rounded-full" />
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
