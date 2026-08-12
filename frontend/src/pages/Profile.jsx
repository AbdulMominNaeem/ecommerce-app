import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

export const Profile = () => {
  const userJson = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  const user = userJson ? JSON.parse(userJson) : null;

  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [preview, setPreview] = useState(
    user?.avatar || "https://i.pravatar.cc/150?img=12"
  );

  const [newData, setNewData] = useState({
    email: user?.email || "",
    name: user?.name || "",
  });

  useEffect(() => {
    getUser();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!newData.email || !newData.name) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", newData.name);
      formData.append("email", newData.email);

      if (selectedImage) {
        formData.append("avatar", selectedImage);
      }

      const response = await fetch(
        "http://localhost:3001/api/user",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        toast.error("Failed to update user");
        return;
      }

      const data = await response.json();
      const updatedUser = data?.user;

      if (!updatedUser) {
        toast.error("Failed to update user");
        return;
      }

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setNewData({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
      });

      if (updatedUser.avatar) {
        setPreview(updatedUser.avatar);
      }

      setSelectedImage(null);

      toast.success(data?.message || "Successfully updated user!");
    } catch (error) {
      console.error(error);
      toast.error("Error updating user");
    } finally {
      setLoading(false);
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

      if (!response.ok) {
        toast.error("Failed to fetch user");
        return;
      }

      const data = await response.json();
      const fetchedUser = data?.user;

      if (!fetchedUser) {
        toast.error("Failed to fetch user");
        return;
      }

      setNewData({
        name: fetchedUser.name || "",
        email: fetchedUser.email || "",
      });

      if (fetchedUser.avatar) {
        setPreview(fetchedUser.avatar);
      }
    } catch (error) {
      console.error(error);
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
          <p className="px-10 py-5 flex gap-2 items-center">
            <ChevronLeft />
            Home
          </p>
        </Link>
      </div>

      <div className="h-screen flex justify-center items-center">
        <div className="h-200 w-150 border border-black rounded-2xl flex flex-col justify-center items-center">
          <form
            className="flex flex-col gap-4 justify-center items-center w-full"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <h1 className="text-2xl text-black my-8 py-3 border-b-4 border-cyan-700">
              Profile
            </h1>

            {preview && (
              <img
                src={preview}
                alt="Profile preview"
                className="w-40 h-40 rounded-full object-cover"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

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
              disabled={loading}
              className="bg-cyan-700 hover:bg-cyan-800 text-white font-medium py-2 px-4 rounded"
            >
              {loading ? "...." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};