import { Pencil, Plus, RotateCw, Trash, } from "lucide-react";
import { useState } from "react";
import { useEffect, useRef } from "react";
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


export const Products = () => {
  const productJson = localStorage.getItem("product");
  const product = productJson ? JSON.parse(productJson) : null;

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [Products, setProducts] = useState([])
  const [currentProduct, setCurrentProduct] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newData, setNewData] = useState({})
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [imageLoading, setImageLoading] = useState(false);


  const [preview, setPreview] = useState("");

  const token = localStorage.getItem('token')

  const handleFieldChange = (key, value) => {
    setNewData((prev) => ({ ...prev, [key]: value }));
  };

  const startEditing = (product) => {
    if (!product) return;

    console.log("Selected product:", product);
    console.log("Selected image:", product.photo);

    setCurrentProduct(product);
    setNewData({ ...product });

    // IMPORTANT: use the image of THIS product
    setPreview(formatAvatarUrl(product.photo));

    setSelectedFile(null);
    setIsEditing(true);
  };

    const startDeleting = (product) => {
    if (!product) return;

    setCurrentProduct(product);
    setNewData({ ...product });
    handleDeleteProduct(product);
    setSelectedFile(null);
    setIsDeleting(true);
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
    setCurrentProduct(null);
    setNewData({});
  };

  useEffect(() => {
    getAll();
  }, []);


  const getAll = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/store/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to fetch Products");
        setLoading(false);
        navigate('/');
        return;
      }

      const Products = data?.products || [];
      setProducts(Products);
      toast.success(data?.message || "Successfully Fetched All Products!");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.message || "Unauthorize")
    }


  };

const handleDeleteProduct = async (product) => {
  if (!product?._id) {
    toast.error("No product selected");
    return;
  }

  try {
    setLoading(true);

    const response = await fetch("http://localhost:3001/store/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        _id: product._id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message || "Failed to delete product");
      return;
    }

    toast.success(data.message || "Product deleted successfully");

    await getAll();
  } catch (error) {
    toast.error(error?.message || "Unauthorized");
  } finally {
    setLoading(false);
  }
};
  const submitUpdate = async (e) => {
    e && e.preventDefault();

    if (!currentProduct?._id) {
      toast.error("No product selected for update");
      return;
    }


    
    const formData = new FormData();
    formData.append("_id", currentProduct._id);
    formData.append("title", newData.title || "");
    formData.append("description", newData.description || "");
    formData.append("productImg", newData.photo);


    if (selectedFile) {
      formData.append("productImg", selectedFile);
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:3001/store/updatebyid", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data?.message || "Failed to update product");
        setLoading(false);
        return;
      }

      toast.success(data?.message || "Product updated successfully");
      resetEditing();
      setSelectedFile(null);
      getAll();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error?.message || "Error updating product");
      
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select an image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("file", selectedFile);
      formData.append("title", newData.title || "");
      formData.append("description", newData.description || "");

      const response = await fetch(
        "http://localhost:3001/store/",
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
        toast.error(data?.message || "Product creation failed");
        return;
      }

      toast.success("Product created successfully");

      setIsCreating(false);
      setNewData({});
      setSelectedFile(null);

      getAll();
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Creation error");
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
                      description: "",
                      title: "",
                    });
                    setIsCreating(true);
                  }}
                />
              </div>
            </div>



            <tbody className="mt-10 h-80 divide-y overflow-auto divide-gray-100 border border-gray-100">

              {Products.map((product) => (
                <tr
                  key={product._id}

                  className="hover:bg-gray-50 transition-colors duration-200 activate:bg-black "
                >
                  <td className="mx-6 my-4 font-medium text-gray-900">
                    <img src={product.photo} />                  
                    </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {product.fil}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {product.title}
                  </td>

                  <td className="px-6 py-4">
                    {product.description}
                  </td>


                  <td className="px-6 py-4">
                    <Pencil className="cursor-pointer hover:text-gray-700 hover:fill-cyan-300" onClick={(e) => {
                      e.stopPropagation();
                      startEditing(product);
                    }}>

                      Edit product
                    </Pencil>
                  </td>

                  <td className="px-6 py-4">
                    <Trash className="cursor-pointer hover:text-gray-700 hover:fill-red-300" onClick={() => handleDeleteProduct(product)} disabled={!currentProduct}>Delete product</Trash>


                  </td>
                </tr>
              ))}
            </tbody>






            {/* {isEditing && newData && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <form onSubmit={submitUpdate} className="bg-white p-6 rounded-lg w-11/12 max-w-lg">
                  <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
                  {Object.entries(newData).map(([key, value]) => {
                    if (key === '_id') return null;
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
                    <button type="button" className="px-4 py-2 border rounded" onClick={resetEditing}>Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-cyan-700 text-white rounded">Save</button>
                  </div>
                </form>
              </div>
            )} */}
            {isEditing && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <form
                  onSubmit={submitUpdate}
                  className="bg-white p-6 rounded-lg w-11/12 max-w-lg"
                >
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
                      onChange={(e) => {
                        handleImageChange(e);
                        setSelectedFile(e.target.files?.[0] || null)
                      }}

                      disabled={imageLoading}
                      className="hidden"
                    />
                  </div>
                  <h2 className="text-xl font-semibold mb-4">
                    Update Product
                  </h2>

                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1 text-cyan-400">
                      Title
                    </label>

                    <input
                      type="text"
                      className="border p-2 w-full"
                      value={newData.title || ""}
                      onChange={(e) =>
                        handleFieldChange("title", e.target.value)
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1 text-cyan-400">
                      Description
                    </label>

                    <textarea
                      className="border p-2 w-full"
                      value={newData.description || ""}
                      onChange={(e) =>
                        handleFieldChange("description", e.target.value)
                      }
                    />
                  </div>



                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      className="px-4 py-2 border rounded"
                      onClick={resetEditing}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-cyan-700 text-white rounded"
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {isCreating && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <form
                  onSubmit={handleCreateProduct}
                  className="bg-white p-6 rounded-lg w-11/12 max-w-lg"
                >
                  <h2 className="text-xl font-semibold mb-4">
                    Create Product
                  </h2>

                  <div className="mb-3">
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
                        onChange={(e) => {
                          handleImageChange(e);
                          setSelectedFile(e.target.files?.[0] || null)
                        }}

                        disabled={imageLoading}
                        className="hidden"
                      />
                    </div>
                    <label className="block text-sm font-medium mb-1 text-cyan-400">
                      Title
                    </label>

                    <input
                      type="text"
                      className="border p-2 w-full"
                      value={newData.title || ""}
                      onChange={(e) =>
                        handleFieldChange("title", e.target.value)
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1 text-cyan-400">
                      Description
                    </label>

                    <textarea
                      className="border p-2 w-full"
                      value={newData.description || ""}
                      onChange={(e) =>
                        handleFieldChange("description", e.target.value)
                      }
                    />
                  </div>


                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      className="px-4 py-2 border rounded"
                      onClick={() => {
                        setIsCreating(false);
                        setNewData({});
                        setSelectedFile(null);
                      }}
                    >
                      Cancel
                    </button>

                   <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-cyan-700 text-white rounded"
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
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