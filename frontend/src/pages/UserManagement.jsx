import {
  Pencil,
  Plus,
  RotateCw,
  Trash,
  X,
  UserPlus,
  ShieldCheck,
  Mail,
  Phone,
} from "lucide-react";

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Sidebar } from "../components/Sidebar";

// =========================
// IMAGE URL HELPER
// =========================

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

  return `http://localhost:3001${avatarPath.startsWith("/") ? "" : "/"
    }${avatarPath}`;
};

// =========================
// COMPONENT
// =========================

export const UserManagement = () => {
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState([]);

  const [currentUser, setCurrentUser] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [newData, setNewData] = useState({});

  const [preview, setPreview] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  const [imageLoading, setImageLoading] = useState(false);

  const fileInputRef = useRef(null);

  // =========================
  // FIELD CHANGE
  // =========================

  const handleFieldChange = (key, value) => {
    setNewData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // =========================
  // IMAGE CLICK
  // =========================

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // =========================
  // IMAGE CHANGE
  // =========================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setSelectedFile(file);

    const imageUrl = URL.createObjectURL(file);

    setPreview(imageUrl);
  };

  // =========================
  // START EDITING
  // =========================

  const startEditing = (user) => {
    if (!user) return;

    console.log("Editing user:", user);

    setCurrentUser(user);

    setNewData({
      _id: user._id,
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "user",
      password: "",
      isVerified: user.isVerified || false,
    });

    setPreview(
      formatAvatarUrl(user.photo || user.avatar)
    );

    setSelectedFile(null);

    setIsEditing(true);
  };

  // =========================
  // RESET
  // =========================

  const resetEditing = () => {
    setIsEditing(false);

    setIsCreating(false);

    setCurrentUser(null);

    setNewData({});

    setPreview("");

    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =========================
  // GET ALL USERS
  // =========================

  useEffect(() => {
    getAll();
  }, []);

  const getAll = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:3001/api/user/all",
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.message || "Failed to fetch users"
        );

        navigate("/");

        return;
      }

      const fetchedUsers = data?.users || [];

      setUsers(fetchedUsers);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.message || "Unauthorized"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE USER
  // =========================

  const handleDeleteUser = async (user) => {
    if (!user?._id) {
      toast.error("No user selected");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:3001/api/user/delete",
        {
          method: "DELETE",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            email: user.email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.message || "Failed to delete user"
        );

        return;
      }

      toast.success(
        data.message ||
        "User deleted successfully!"
      );

      setCurrentUser(null);

      await getAll();
    } catch (error) {
      console.error(error);

      toast.error(
        error?.message || "Unauthorized"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UPDATE USER
  // =========================

  const submitUpdate = async (e) => {
    e.preventDefault();

    if (!currentUser?._id) {
      toast.error("No user selected");

      return;
    }

    if (!newData?.email) {
      toast.error("Email is required");

      return;
    }

    try {
      setLoading(true);

      // =========================
      // CREATE FORMDATA
      // =========================

      const formData = new FormData();

      /*
        IMPORTANT:

        Use the OLD email to identify the user.

        This allows the user to change their email
        without losing the user record.
      */

      formData.append(
        "oldEmail",
        currentUser.email || ""
      );

      // New email
      formData.append(
        "email",
        newData.email || ""
      );

      // Name
      formData.append(
        "name",
        newData.name || ""
      );

      // Phone
      formData.append(
        "phone",
        newData.phone || ""
      );

      // Role
      formData.append(
        "role",
        newData.role || "user"
      );

      // Verified status
      formData.append(
        "isVerified",
        String(
          Boolean(newData.isVerified)
        )
      );

      /*
        Only send password if the user actually
        entered a new password.
      */

      if (
        newData.password &&
        newData.password.trim() !== ""
      ) {
        formData.append(
          "password",
          newData.password
        );
      }

      // Image
      if (selectedFile) {
        formData.append(
          "photo",
          selectedFile
        );
      }

      // =========================
      // DEBUG
      // =========================

      console.log(
        "Updating user:",
        currentUser
      );

      console.log(
        "New data:",
        newData
      );

      for (const pair of formData.entries()) {
        console.log(
          pair[0],
          pair[1]
        );
      }

      // =========================
      // REQUEST
      // =========================

      const response = await fetch(
        "http://localhost:3001/api/user/updatebyemail",
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const data = await response.json();

      console.log(
        "Update response:",
        data
      );

      if (!response.ok) {
        toast.error(
          data?.message ||
          "Failed to update user"
        );

        return;
      }

      toast.success(
        data?.message ||
        "User updated successfully"
      );

      // Close modal
      resetEditing();

      // Fetch updated users
      await getAll();
    } catch (error) {
      console.error(
        "UPDATE ERROR:",
        error
      );

      toast.error(
        error?.message ||
        "Error updating user"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CREATE USER
  // =========================

  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (
      !newData.name ||
      !newData.email ||
      !newData.password
    ) {
      toast.error(
        "Please fill all fields"
      );

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:3001/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            newData
          ),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.message ||
          "Signup failed"
        );

        return;
      }

      toast.success(
        "User created successfully"
      );

      resetEditing();

      await getAll();
    } catch (error) {
      console.error(error);

      toast.error(
        error?.message ||
        "Signup error"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RETURN
  // =========================

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">

      <Sidebar />

      <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8">

        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

        <div className="mb-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>

              <p className="text-sm font-medium text-cyan-700">
                Administration
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                User Management
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Manage your users, roles and accounts
              </p>

            </div>

            <div className="flex items-center gap-3">

              {/* Refresh */}

              <button
                type="button"
                onClick={getAll}
                disabled={loading}
                className="
                  h-10 w-10
                  flex items-center justify-center
                  rounded-lg
                  border border-gray-200
                  bg-white
                  text-gray-600
                  hover:text-cyan-700
                  hover:border-cyan-300
                  hover:bg-cyan-50
                  transition
                  disabled:opacity-50
                "
              >
                <RotateCw
                  size={19}
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />
              </button>

              {/* Add User */}

              <button
                type="button"
                onClick={() => {
                  setNewData({
                    name: "",
                    email: "",
                    password: "",
                  });

                  setPreview("");

                  setSelectedFile(null);

                  setIsCreating(true);
                }}
                className="
                  flex items-center gap-2
                  h-10 px-4
                  rounded-lg
                  bg-cyan-700
                  hover:bg-cyan-800
                  text-white
                  text-sm
                  font-semibold
                  shadow-sm
                  transition
                "
              >
                <Plus size={18} />

                Add User
              </button>

            </div>

          </div>

        </div>

        {/* ========================= */}
        {/* STATS */}
        {/* ========================= */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

          {/* Total */}

          <div className="bg-white border border-gray-200 rounded-xl p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Total Users
                </p>

                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {users.length}
                </p>

              </div>

              <div className="h-11 w-11 rounded-lg bg-cyan-50 flex items-center justify-center">

                <UserPlus
                  size={22}
                  className="text-cyan-700"
                />

              </div>

            </div>

          </div>

          {/* Verified */}

          <div className="bg-white border border-gray-200 rounded-xl p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Verified
                </p>

                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {
                    users.filter(
                      (user) =>
                        user.isVerified
                    ).length
                  }
                </p>

              </div>

              <div className="h-11 w-11 rounded-lg bg-green-50 flex items-center justify-center">

                <ShieldCheck
                  size={22}
                  className="text-green-600"
                />

              </div>

            </div>

          </div>

          {/* Unverified */}

          <div className="bg-white border border-gray-200 rounded-xl p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Unverified
                </p>

                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {
                    users.filter(
                      (user) =>
                        !user.isVerified
                    ).length
                  }
                </p>

              </div>

              <div className="h-11 w-11 rounded-lg bg-red-50 flex items-center justify-center">

                <Mail
                  size={21}
                  className="text-red-500"
                />

              </div>

            </div>

          </div>

        </div>

        {/* ========================= */}
        {/* TABLE */}
        {/* ========================= */}

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

          <div className="px-5 py-4 border-b border-gray-100">

            <h2 className="font-semibold text-gray-900">
              All Users
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              {users.length} users registered
            </p>

          </div>

          <div className="max-h-[500px] overflow-y-auto overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">

                <tr>

                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    User
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Email
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Role
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Phone
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {users.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="px-5 py-16 text-center"
                    >

                      <div className="flex flex-col items-center">

                        <UserPlus
                          size={40}
                          className="text-gray-300"
                        />

                        <p className="mt-3 font-medium text-gray-600">
                          No users found
                        </p>

                        <p className="text-sm text-gray-400">
                          Add a new user to get started
                        </p>

                      </div>

                    </td>

                  </tr>

                ) : (

                  users.map((user) => (

                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition"
                    >

                      {/* USER */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          {user.photo ? (

                            <img
                              src={formatAvatarUrl(
                                user.photo
                              )}
                              alt={user.name}
                              className="
                                h-10 w-10
                                rounded-full
                                object-cover
                                border border-gray-200
                              "
                            />

                          ) : (

                            <div
                              className="
                                h-10 w-10
                                rounded-full
                                bg-cyan-100
                                text-cyan-700
                                flex items-center
                                justify-center
                                font-bold
                              "
                            >
                              {user.name
                                ?.charAt(0)
                                ?.toUpperCase()}
                            </div>

                          )}

                          <div>

                            <p className="font-semibold text-gray-900">
                              {user.name}
                            </p>

                            <p className="text-xs text-gray-400">
                              ID:{" "}
                              {user._id?.slice(-6)}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* EMAIL */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-sm text-gray-600">

                          <Mail
                            size={15}
                            className="text-gray-400"
                          />

                          {user.email}

                        </div>

                      </td>

                      {/* ROLE */}

                      <td className="px-5 py-4">

                        <span
                          className={`
                            inline-flex
                            px-2.5 py-1
                            rounded-full
                            text-xs
                            font-semibold
                            ${user.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-gray-100 text-gray-700"
                            }
                          `}
                        >
                          {user.role || "User"}
                        </span>

                      </td>

                      {/* PHONE */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-sm text-gray-600">

                          <Phone
                            size={15}
                            className="text-gray-400"
                          />

                          {user.phone || "—"}

                        </div>

                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">

                        {user.isVerified ? (

                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">

                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                            Verified

                          </span>

                        ) : (

                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold">

                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />

                            Unverified

                          </span>

                        )}

                      </td>

                      {/* ACTIONS */}

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              startEditing(user)
                            }
                            className="
                              h-9 w-9
                              flex items-center
                              justify-center
                              rounded-lg
                              text-gray-500
                              hover:text-cyan-700
                              hover:bg-cyan-50
                              transition
                            "
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteUser(user)
                            }
                            disabled={loading}
                            className="
                              h-9 w-9
                              flex items-center
                              justify-center
                              rounded-lg
                              text-gray-500
                              hover:text-red-600
                              hover:bg-red-50
                              transition
                              disabled:opacity-40
                            "
                          >
                            <Trash size={17} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </main>

      {/* ================================================= */}
      {/* EDIT USER MODAL */}
      {/* ================================================= */}

      {isEditing && (

        <div className="
          fixed inset-0
          z-50
          bg-black/50
          backdrop-blur-sm
          flex items-center
          justify-center
          p-4
        ">

          <form
            onSubmit={submitUpdate}
            className="
              bg-white
              w-full
              max-w-lg
              max-h-[90vh]
              overflow-y-auto
              rounded-2xl
              shadow-2xl
            "
          >

            {/* HEADER */}

            <div className="flex items-center justify-between px-6 py-5 border-b">

              <div>

                <h2 className="text-xl font-bold text-gray-900">
                  Edit User
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Update user information
                </p>

              </div>

              <button
                type="button"
                onClick={resetEditing}
                className="
                  h-9 w-9
                  rounded-lg
                  flex items-center
                  justify-center
                  hover:bg-gray-100
                "
              >
                <X size={20} />
              </button>

            </div>

            {/* BODY */}

            <div className="p-6">

              {/* IMAGE */}

              <div className="flex flex-col items-center mb-6">

                <div
                  onClick={handleImageClick}
                  className="relative cursor-pointer group"
                >

                  {preview ? (

                    <img
                      src={preview}
                      alt="Profile"
                      className="
                        h-28 w-28
                        rounded-full
                        object-cover
                        border-4
                        border-white
                        shadow-md
                      "
                    />

                  ) : (

                    <div className="
                      h-28 w-28
                      rounded-full
                      bg-cyan-100
                      text-cyan-700
                      flex items-center
                      justify-center
                      text-3xl
                      font-bold
                    ">
                      {newData.name
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </div>

                  )}

                  <div className="
                    absolute inset-0
                    rounded-full
                    bg-black/40
                    opacity-0
                    group-hover:opacity-100
                    flex items-center
                    justify-center
                    text-white
                    text-xs
                    font-semibold
                    transition
                  ">
                    Change
                  </div>

                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={imageLoading}
                  className="hidden"
                />

                <p className="text-xs text-gray-400 mt-2">
                  Click image to change
                </p>

              </div>

              {/* NAME */}

              <div className="mb-4">

                <label className="
                  block
                  text-sm
                  font-semibold
                  text-gray-700
                  mb-2
                ">
                  Name
                </label>

                <input
                  type="text"
                  value={newData.name || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "name",
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    h-11
                    px-3
                    border
                    border-gray-300
                    rounded-lg
                    outline-none
                    focus:border-cyan-600
                    focus:ring-2
                    focus:ring-cyan-100
                  "
                />

              </div>

              {/* EMAIL */}

              <div className="mb-4">

                <label className="
                  block
                  text-sm
                  font-semibold
                  text-gray-700
                  mb-2
                ">
                  Email
                </label>

                <input
                  type="email"
                  value={newData.email || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "email",
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    h-11
                    px-3
                    border
                    border-gray-300
                    rounded-lg
                    outline-none
                    focus:border-cyan-600
                    focus:ring-2
                    focus:ring-cyan-100
                  "
                />

              </div>

              {/* PHONE */}

              <div className="mb-4">

                <label className="
                  block
                  text-sm
                  font-semibold
                  text-gray-700
                  mb-2
                ">
                  Phone
                </label>

                <input
                  type="text"
                  value={newData.phone || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "phone",
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    h-11
                    px-3
                    border
                    border-gray-300
                    rounded-lg
                    outline-none
                    focus:border-cyan-600
                    focus:ring-2
                    focus:ring-cyan-100
                  "
                />

              </div>

              {/* ROLE */}

              <div className="mb-4">

                <label className="
                  block
                  text-sm
                  font-semibold
                  text-gray-700
                  mb-2
                ">
                  Role
                </label>

                <select
                  value={newData.role || "user"}
                  onChange={(e) =>
                    handleFieldChange(
                      "role",
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    h-11
                    px-3
                    border
                    border-gray-300
                    rounded-lg
                    outline-none
                    focus:border-cyan-600
                    focus:ring-2
                    focus:ring-cyan-100
                  "
                >

                  <option value="user">
                    User
                  </option>

                  <option value="admin">
                    Admin
                  </option>

                </select>

              </div>

              {/* PASSWORD */}

              <div className="mb-4">

                <label className="
                  block
                  text-sm
                  font-semibold
                  text-gray-700
                  mb-2
                ">
                  New Password
                </label>

                <input
                  type="password"
                  value={newData.password || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "password",
                      e.target.value
                    )
                  }
                  placeholder="Leave empty to keep current password"
                  className="
                    w-full
                    h-11
                    px-3
                    border
                    border-gray-300
                    rounded-lg
                    outline-none
                    focus:border-cyan-600
                    focus:ring-2
                    focus:ring-cyan-100
                  "
                />

              </div>

              {/* VERIFIED */}

              <div className="mb-4">

                <label className="flex items-center gap-3">

                  <input
                    type="checkbox"
                    checked={
                      Boolean(
                        newData.isVerified
                      )
                    }
                    onChange={(e) =>
                      handleFieldChange(
                        "isVerified",
                        e.target.checked
                      )
                    }
                    className="
                      h-4 w-4
                      accent-cyan-700
                    "
                  />

                  <span className="
                    text-sm
                    font-semibold
                    text-gray-700
                  ">
                    Verified user
                  </span>

                </label>

              </div>

            </div>

            {/* FOOTER */}

            <div className="
              px-6
              py-4
              bg-gray-50
              border-t
              flex
              justify-end
              gap-3
            ">

              <button
                type="button"
                onClick={resetEditing}
                className="
                  px-4
                  py-2
                  border
                  border-gray-300
                  rounded-lg
                  text-gray-700
                  font-medium
                  hover:bg-white
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="
                  px-5
                  py-2
                  bg-cyan-700
                  hover:bg-cyan-800
                  text-white
                  rounded-lg
                  font-semibold
                  disabled:bg-gray-400
                "
              >
                {loading
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </form>

        </div>

      )}

      {/* ================================================= */}
      {/* CREATE USER MODAL */}
      {/* ================================================= */}

      {isCreating && (

        <div className="
          fixed inset-0
          z-50
          bg-black/50
          backdrop-blur-sm
          flex items-center
          justify-center
          p-4
        ">

          <form
            onSubmit={handleCreateUser}
            className="
              bg-white
              w-full
              max-w-md
              rounded-2xl
              shadow-2xl
            "
          >

            {/* HEADER */}

            <div className="
              px-6
              py-5
              border-b
              flex
              items-center
              justify-between
            ">

              <div>

                <h2 className="text-xl font-bold text-gray-900">
                  Create User
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Add a new user account
                </p>

              </div>

              <button
                type="button"
                onClick={resetEditing}
                className="
                  h-9 w-9
                  rounded-lg
                  flex items-center
                  justify-center
                  hover:bg-gray-100
                "
              >
                <X size={20} />
              </button>

            </div>

            {/* BODY */}

            <div className="p-6 space-y-4">

              {/* NAME */}

              <div>

                <label className="
                  block
                  text-sm
                  font-semibold
                  text-gray-700
                  mb-2
                ">
                  Name
                </label>

                <input
                  type="text"
                  value={newData.name || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "name",
                      e.target.value
                    )
                  }
                  placeholder="Enter name"
                  className="
                    w-full h-11
                    px-3
                    border border-gray-300
                    rounded-lg
                    outline-none
                    focus:border-cyan-600
                    focus:ring-2
                    focus:ring-cyan-100
                  "
                />

              </div>

              {/* EMAIL */}

              <div>

                <label className="
                  block
                  text-sm
                  font-semibold
                  text-gray-700
                  mb-2
                ">
                  Email
                </label>

                <input
                  type="email"
                  value={newData.email || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "email",
                      e.target.value
                    )
                  }
                  placeholder="Enter email"
                  className="
                    w-full h-11
                    px-3
                    border border-gray-300
                    rounded-lg
                    outline-none
                    focus:border-cyan-600
                    focus:ring-2
                    focus:ring-cyan-100
                  "
                />

              </div>

              {/* PASSWORD */}

              <div>

                <label className="
                  block
                  text-sm
                  font-semibold
                  text-gray-700
                  mb-2
                ">
                  Password
                </label>

                <input
                  type="password"
                  value={newData.password || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "password",
                      e.target.value
                    )
                  }
                  placeholder="Enter password"
                  className="
                    w-full h-11
                    px-3
                    border border-gray-300
                    rounded-lg
                    outline-none
                    focus:border-cyan-600
                    focus:ring-2
                    focus:ring-cyan-100
                  "
                />

              </div>

            </div>

            {/* FOOTER */}

            <div className="
              px-6
              py-4
              bg-gray-50
              border-t
              flex
              justify-end
              gap-3
            ">

              <button
                type="button"
                onClick={resetEditing}
                className="
                  px-4
                  py-2
                  border
                  border-gray-300
                  rounded-lg
                  font-medium
                  text-gray-700
                  hover:bg-white
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="
                  px-5
                  py-2
                  bg-cyan-700
                  hover:bg-cyan-800
                  text-white
                  rounded-lg
                  font-semibold
                  disabled:bg-gray-400
                "
              >
                {loading
                  ? "Creating..."
                  : "Create User"}
              </button>

            </div>

          </form>

        </div>

      )}

    </div>
  );
};