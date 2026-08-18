import { Pencil, Plus, RotateCw, Trash, } from "lucide-react";
import { useState, useRef } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Sidebar } from "../components/Sidebar";

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


export const UserManagement = () => {

  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newData, setNewData] = useState({})
  const [preview, setPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [currentItem, setCurrentItem] = useState(null)


  const fileInputRef = useRef(null);




  const token = localStorage.getItem('token')

  const handleFieldChange = (key, value) => {
    setNewData((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const startEditing = (user) => {
    if (!user) return;
    setCurrentUser(user);
    setNewData({ ...user, password: "" });
    console.log("Selected image:", user.photo);

    setPreview(formatAvatarUrl(user.photo));

    setSelectedFile(null);
    setIsEditing(true);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    setSelectedFile(e.target.files?.[0] || null)

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);

  };

  const resetEditing = () => {
    setIsEditing(false);
    setCurrentUser(null);
    setNewData({});
  };

  useEffect(() => {
    getAll();
  }, []);


  const getAll = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/user/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to fetch users");
        setLoading(false);
        navigate('/')
        return;
      }
      const users = data?.users || ''
      if (!users) {
        toast.success(data.message || "Failed to fetch users");
        setLoading(false);
        return;
      }
      setUsers(users)
      toast.success(data?.message || "Successfully Fetched All Users!")
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.message || "Unauthorize")
    }


  };

  const handleDeleteUser = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/user/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: currentUser.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to delete user");
        setLoading(false);
        return;
      }

      toast.success(data.message || "User deleted successfully!");
      setCurrentUser(null);
      getAll();
    } catch (error) {
      setLoading(false);
      toast.error(error?.message || "Unauthorized");
    }
  };

  const submitUpdate = async (e) => {
    e && e.preventDefault();
    if (!newData) return;

    const formData = new FormData();
    formData.append("email", newData.email || "");

    if (selectedFile) {
      formData.append("photo", selectedFile);
    }
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/user/updatebyemail", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data?.message || "Failed to update user");
        setLoading(false);
        return;
      }

      toast.success(data?.message || "User updated successfully");
      resetEditing();
      setSelectedFile(null);
      getAll();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error?.message || "Error updating user");
    }
  };
  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:3001/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Signup failed");
        return;
      }

      toast.success("User created successfully");

      setIsCreating(false);
      setNewData({});

      getAll();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Signup error");
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
      <div className="flex flex-row">
        <Sidebar />


        <div className="h-screen w-screen flex justify-center items-center">
          <div className="h-200 w-150  flex flex-col justify-center items-center gap-3">
            <div className="flex gap-20 justify-center items-center">
              <div>
                <h1 className="text-xl text-black my-8 py-3 border-b-4 border-cyan-700">
                  Admin Dashboard
                </h1>
              </div>

              <div className="flex gap-6 justify-center items-center ">
                <RotateCw
                  size={24}
                  className=" hover:border-cyan-500 cursor-pointer hover:text-cyan-700 transition-transform duration-700 hover:rotate-180"
                  onClick={getAll}
                />

                <Plus
                  size={28}
                  className="cursor-pointe hover:text-cyan-700 transition-all duration-300 hover:scale-125"
                  onClick={() => {
                    setNewData({
                      name: "",
                      email: "",
                      password: "",
                    });
                    setIsCreating(true);
                  }}
                />
              </div>
            </div>



            <tbody className="mt-10 h-80 divide-y overflow-auto divide-gray-100 border border-gray-100">

              {users.map((user) => (
                <tr
                  key={user._id}

                  className="hover:bg-gray-50 transition-colors duration-200 activate:bg-black "
                >
                  <td className="mx-6 my-4 font-medium text-gray-900">
                    <img className="h-10 w-10" src={user.photo} />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {user.name}
                  </td>

                  <td className="px-6 py-4">
                    {user.email}
                  </td>

                  <td className="px-6 py-4">
                    {user.role}
                  </td>

                  <td className="px-6 py-4">
                    {user.phone}
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-semibold">
                      <span className="relative flex h-5 w-5 justify-center items-center">
                        <span
                          className={`absolute h-[8px] w-[8px] rounded-full ${user.isVerified ? "bg-cyan-400" : "bg-red-400"
                            }`}
                        ></span>

                        <span className="h-4 w-4 rounded-full bg-blue-950"></span>
                      </span>

                      {/* {user.isVerified ? "Verified" : "Not Verified"} */}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <Pencil className="cursor-pointer hover:text-gray-700 hover:fill-cyan-300" onClick={(e) => {
                      e.stopPropagation();
                      startEditing(user);
                    }}>

                      Edit user
                    </Pencil>
                  </td>

                  <td className="px-6 py-4">
                    <Trash className="cursor-pointer hover:text-gray-700 hover:fill-red-300" onClick={() => { setCurrentUser(user); handleDeleteUser() }} disabled={!currentUser}>Delete user</Trash>


                  </td>
                </tr>
              ))}
            </tbody>






            {isEditing && newData && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <form onSubmit={submitUpdate} className="bg-white p-6 rounded-lg w-11/12 max-w-lg">
                  <h2 className="text-xl font-semibold mb-4">Edit User</h2>
                  <div className="object-center" >
                    {preview ? (
                      <img
                        src={preview}
                        alt="Profile preview"
                        onClick={handleImageClick}
                        className="w-40 h-40 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity "
                      />
                    ) : (
                      <div
                        onClick={handleImageClick}
                        className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-300 transition-colors font-semibold"
                      >
                        Upload Img
                      </div>
                    )}
                  </div>
                  {Object.entries(newData).map(([key, value]) => {
                    if (key === '_id' || key === '__v' || key === 'id' || key === 'verificationCode' || key === 'verificationCodeExpires' || key === 'id' || key === 'photo' || key === 'avatar') return null;
                    const fieldValue = value ?? '';
                    return (
                      <div className="mb-3" key={key}>
                        <label className="block text-sm font-medium mb-1 text-cyan-400">{key}</label>
                        {typeof fieldValue === 'object' && fieldValue !== null ? (
                          <textarea className="border p-2 w-full" value={JSON.stringify(fieldValue)} onChange={(e) => handleFieldChange(key, tryParseJSON(e.target.value))} rows={3} />
                        ) : (
                          <input className="border p-2 w-full" value={fieldValue} onChange={(e) => handleFieldChange(key, e.target.value)} />
                        )}
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={(e) => {
                            handleImageChange(e);
                            setSelectedFile(e.target.files?.[0] || null)
                          }}

                          disabled={imageLoading}
                          className="hidden"
                        />
                      </div>

                    )
                  })}

                  <div className="flex justify-end gap-2 mt-4">
                    <button type="button" className="px-4 py-2 border rounded" onClick={resetEditing}>Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-cyan-700 text-white rounded">Save</button>
                  </div>
                </form>
              </div>
            )}

            {isCreating && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <form onSubmit={handleCreateUser} className="bg-white p-6 rounded-lg w-11/12 max-w-lg">
                  <h2 className="text-xl font-semibold mb-4">Edit User</h2>
                  {Object.entries(newData).map(([key, value]) => {
                    if (key === '_id' || key === '__v') return null;
                    const fieldValue = value ?? '';
                    return (
                      <div className="mb-3" key={key}>
                        <label className="block text-sm font-medium mb-1 text-cyan-400">{key}</label>
                        {typeof fieldValue === 'object' && fieldValue !== null ? (
                          <textarea className="border p-2 w-full" value={JSON.stringify(fieldValue)} onChange={(e) => handleFieldChange(key, tryParseJSON(e.target.value))} rows={3} />
                        ) : (
                          <input className="border p-2 w-full" value={fieldValue} onChange={(e) => handleFieldChange(key, e.target.value)} />
                        )}
                      </div>
                    )
                  })}
                  <div className="flex justify-end gap-2 mt-4">

                    <button type="button" className="px-4 py-2 border rounded" onClick={resetEditing}><Link to="/dashboard">Cancel</Link></button>

                    <button type="submit" className="px-4 py-2 bg-cyan-700 text-white rounded">Save</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div >

    </>
  )
}

function tryParseJSON(input) {
  try {
    return JSON.parse(input);
  } catch (e) {
    return input;
  }
}