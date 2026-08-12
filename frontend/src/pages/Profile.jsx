import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

// Helper function to ensure image paths from the database point to the backend server URL
const formatAvatarUrl = (avatarPath) => {
  if (!avatarPath) return "";
  // If it's already a full URL (blob:, http://, https://), return it as is
  if (avatarPath.startsWith("data:") || avatarPath.startsWith("blob:") || avatarPath.startsWith("http://") || avatarPath.startsWith("https://")) {
    return avatarPath;
  }
  // Otherwise, prefix it with your backend server address
  return `http://localhost:3001${avatarPath.startsWith("/") ? "" : "/"}${avatarPath}`;
};

export const Profile = () => {
  const userJson = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  const user = userJson ? JSON.parse(userJson) : null;

  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Initialize with formatted avatar URL from localStorage if it exists
  const [preview, setPreview] = useState(
    formatAvatarUrl(user?.avatar || user?.photo)
  );

  const [newData, setNewData] = useState({
    email: user?.email || "",
    name: user?.name || "",
  });

  useEffect(() => {
    getUser();
  }, []);

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);

    await updateImg(file);

    URL.revokeObjectURL(imageUrl);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!newData.email.trim() || !newData.name.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", newData.name.trim());
      formData.append("email", newData.email.trim());

      const response = await fetch("http://localhost:3001/api/user", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data?.message || "Failed to update user");
        return;
      }

      const updatedUser = data?.user;

      if (!updatedUser) {
        toast.error("User was updated, but no user data was returned");
        return;
      }

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setNewData({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
      });

      if (updatedUser.avatar || updatedUser.photo) {
        setPreview(formatAvatarUrl(updatedUser.avatar || updatedUser.photo));
      }

      toast.success(data?.message || "Successfully updated profile!");
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error("Error updating user");
    } finally {
      setLoading(false);
    }
  };

  const updateImg = async (file) => {
    try {
      setImageLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "http://localhost:3001/api/auth/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data?.message || "Failed to update image");
        return;
      }

      console.log("Image upload response:", data);

      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.avatar || data.user.photo) {
          setPreview(formatAvatarUrl(data.user.avatar || data.user.photo));
        }
      }

      toast.success(data?.message || "Image updated successfully!");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Error updating image");
    } finally {
      setImageLoading(false);
    }
  };

  const getUser = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:3001/api/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data?.message || "Failed to fetch user");
        return;
      }

      const fetchedUser = data?.user;

      if (!fetchedUser) {
        toast.error("Failed to fetch user");
        return;
      }

      localStorage.setItem("user", JSON.stringify(fetchedUser));

      setNewData({
        name: fetchedUser.name || "",
        email: fetchedUser.email || "",
      });

      if (fetchedUser.avatar || fetchedUser.photo) {
        setPreview(formatAvatarUrl(fetchedUser.avatar || fetchedUser.photo));
      }
    } catch (error) {
      console.error("Fetch user error:", error);
      toast.error("Error fetching user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />

      <div>
        <Link
          to="/"
          className="lg:block text-cyan-700 hover:text-cyan-900 font-semibold transition-colors"
        >
          <div className="px-10 py-5 flex gap-2 items-center">
            <ChevronLeft />
            Home
          </div>
        </Link>
      </div>

      <div className="min-h-screen flex justify-center items-center">
        <div className="min-h-[800px] w-[600px] border border-black rounded-2xl flex flex-col justify-center items-center">
          <form
            className="flex flex-col gap-4 justify-center items-center w-full"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <h1 className="text-2xl text-black my-8 py-3 border-b-4 border-cyan-700">
              Profile
            </h1>

            <div className="flex flex-col items-center">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile preview"
                  onClick={handleImageClick}
                  className="w-40 h-40 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                />
              ) : (
                <div
                  onClick={handleImageClick}
                  className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-300 transition-colors font-semibold"
                >
                  Upload Img
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                disabled={imageLoading}
                className="hidden"
              />
            </div>

            {imageLoading && (
              <p className="text-cyan-700">
                Uploading image...
              </p>
            )}

            <div className="flex flex-col gap-2 w-full px-6">
              <label className="font-semibold text-left">
                Name
              </label>

              <input
                type="text"
                value={newData.name}
                onChange={(e) =>
                  setNewData({
                    ...newData,
                    name: e.target.value,
                  })
                }
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            <div className="flex flex-col gap-2 w-full px-6">
              <label className="font-semibold text-left">
                Email
              </label>

              <input
                type="email"
                value={newData.email}
                onChange={(e) =>
                  setNewData({
                    ...newData,
                    email: e.target.value,
                  })
                }
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            <button
              type="submit"
              disabled={loading || imageLoading}
              className="bg-cyan-700 hover:bg-cyan-800 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
