import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  Camera,
  User,
  Mail,
  Save,
  Loader2,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

// Helper function to ensure image paths from the database point to the backend server URL
const formatAvatarUrl = (avatarPath) => {
  if (!avatarPath) return "";

  if (
    avatarPath.startsWith("data:") ||
    avatarPath.startsWith("blob:") ||
    avatarPath.startsWith("http://") ||
    avatarPath.startsWith("https://")
  ) {
    return avatarPath;
  }

  return `http://localhost:3001${
    avatarPath.startsWith("/") ? "" : "/"
  }${avatarPath}`;
};

export const Profile = () => {
  const userJson = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  const user = userJson ? JSON.parse(userJson) : null;

  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const fileInputRef = useRef(null);

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
    fileInputRef.current?.click();
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
        setPreview(
          formatAvatarUrl(updatedUser.avatar || updatedUser.photo)
        );
      }

      toast.success(
        data?.message || "Successfully updated profile!"
      );
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

      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.avatar || data.user.photo) {
          setPreview(
            formatAvatarUrl(
              data.user.avatar || data.user.photo
            )
          );
        }
      }

      toast.success(
        data?.message || "Image updated successfully!"
      );
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

      const response = await fetch(
        "http://localhost:3001/api/user",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data?.message || "Failed to fetch user"
        );
        return;
      }

      const fetchedUser = data?.user;

      if (!fetchedUser) {
        toast.error("Failed to fetch user");
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify(fetchedUser)
      );

      setNewData({
        name: fetchedUser.name || "",
        email: fetchedUser.email || "",
      });

      if (
        fetchedUser.avatar ||
        fetchedUser.photo
      ) {
        setPreview(
          formatAvatarUrl(
            fetchedUser.avatar || fetchedUser.photo
          )
        );
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
      <ToastContainer position="top-right" />

      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 py-5 text-cyan-700 font-semibold hover:text-cyan-900 transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Home</span>
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="min-h-[calc(100vh-73px)] bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">

          {/* Profile Card */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">

            {/* Card Header */}
            <div className="bg-gradient-to-r from-cyan-700 to-cyan-900 px-6 sm:px-10 py-8">
              <h1 className="text-3xl font-bold text-white">
                Profile Settings
              </h1>

              <p className="mt-2 text-cyan-100">
                Manage your account information and profile picture.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              className="p-6 sm:p-10"
            >

              {/* Avatar */}
              <div className="flex flex-col items-center mb-10">

                <div className="relative group">

                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile"
                      onClick={handleImageClick}
                      className="w-36 h-36 sm:w-44 sm:h-44 rounded-full object-cover border-4 border-white shadow-xl cursor-pointer"
                    />
                  ) : (
                    <div
                      onClick={handleImageClick}
                      className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gray-100 border-4 border-white shadow-xl flex items-center justify-center cursor-pointer"
                    >
                      <User
                        size={60}
                        className="text-gray-400"
                      />
                    </div>
                  )}

                  {/* Camera Button */}
                  <button
                    type="button"
                    onClick={handleImageClick}
                    disabled={imageLoading}
                    className="absolute bottom-1 right-1 w-11 h-11 rounded-full bg-cyan-700 text-white flex items-center justify-center shadow-lg border-4 border-white hover:bg-cyan-800 transition-colors disabled:bg-gray-400"
                  >
                    {imageLoading ? (
                      <Loader2
                        size={19}
                        className="animate-spin"
                      />
                    ) : (
                      <Camera size={19} />
                    )}
                  </button>

                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={imageLoading}
                  className="hidden"
                />

                <p className="mt-4 text-sm text-gray-500">
                  Click the camera icon to change your photo
                </p>

                {imageLoading && (
                  <p className="mt-2 text-sm font-medium text-cyan-700">
                    Uploading image...
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 mb-8" />

              {/* Name */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={newData.name}
                    onChange={(e) =>
                      setNewData({
                        ...newData,
                        name: e.target.value,
                      })
                    }
                    placeholder="Enter your name"
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 outline-none transition-all focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100 focus:bg-white"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    value={newData.email}
                    onChange={(e) =>
                      setNewData({
                        ...newData,
                        email: e.target.value,
                      })
                    }
                    placeholder="Enter your email"
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 outline-none transition-all focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100 focus:bg-white"
                  />
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={loading || imageLoading}
                className="w-full h-12 rounded-xl bg-cyan-700 hover:bg-cyan-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={19}
                      className="animate-spin"
                    />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={19} />
                    Update Profile
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Footer text */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Your profile information is securely stored.
          </p>
        </div>
      </main>
    </>
  );
};