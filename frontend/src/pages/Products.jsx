import { Pencil, Plus, RotateCw, Trash, } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const [selectedOption, setSelectedOption] = useState("");
  const [categories, setCategories] = useState([]);


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
    getAllCategory();

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
    formData.append("price", newData.price);
    formData.append("category", newData.category)


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
      formData.append("price", newData.price || "");
      formData.append("category", newData.category || "");


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

  const getAllCategory = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:3001/category/getallp",
        {
          method: "GET",
        }
      );

      const data = await response.json();

      console.log("API RESPONSE:", data);

      if (!response.ok) {
        toast.error(data.message || "Failed to fetch categories");
        return;
      }

      const fetchedCategories = data?.category || [];

      setCategories(fetchedCategories);

      console.log("Categories:", fetchedCategories);

    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };


  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />

      <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-700">
              Administration
            </p>

            <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-gray-900">
              Product Management
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your store products, prices and categories.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Refresh */}
            <button
              type="button"
              onClick={getAll}
              disabled={loading}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 disabled:opacity-50"
            >
              <RotateCw
                size={18}
                className={loading ? "animate-spin" : ""}
              />
            </button>

            {/* Add Product */}
            <button
              type="button"
              onClick={() => {
                setNewData({
                  title: "",
                  description: "",
                  price: "",
                  category: categories[0]?._id || "",
                });

                setPreview("");
                setSelectedFile(null);

                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }

                setIsCreating(true);
              }}
              className="flex items-center gap-2 rounded-lg bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-800 active:scale-95"
            >
              <Plus size={19} />
              Add Product
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {Products.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Categories</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {categories.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Status</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-green-600">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Store Active
            </p>
          </div>
        </div>

        {/* Product Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="font-semibold text-gray-900">
              All Products
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View and manage your products.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Product
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Description
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Price
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-sm text-gray-500"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <RotateCw
                          size={25}
                          className="animate-spin text-cyan-700"
                        />
                        Loading products...
                      </div>
                    </td>
                  </tr>
                ) : Products.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No products found.
                    </td>
                  </tr>
                ) : (
                  Products.map((product) => (
                    <tr
                      key={product._id}
                      className="transition hover:bg-gray-50"
                    >
                      {/* Product */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                            <img
                              src={formatAvatarUrl(product.photo)}
                              alt={product.title || "Product"}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900">
                              {product.title}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              ID: {product._id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="max-w-xs px-6 py-4">
                        <p className="line-clamp-2 text-sm text-gray-600">
                          {product.description || "No description"}
                        </p>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">
                          ${product.price}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700">
                          {product?.category?.name || "Uncategorized"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEditing(product)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                            title="Edit product"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(product)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            title="Delete product"
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

        {/* ================= EDIT MODAL ================= */}
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <form
              onSubmit={submitUpdate}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Edit Product
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Update product information.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetEditing}
                  className="rounded-lg px-3 py-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Image */}
              <div className="mb-6 flex flex-col items-center">
                <div
                  onClick={handleImageClick}
                  className="group relative h-32 w-32 cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Product preview"
                      className="h-full w-full object-cover transition group-hover:opacity-70"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm font-medium text-gray-400">
                      Upload
                    </div>
                  )}

                  <div className="absolute inset-0 hidden items-center justify-center bg-black/30 text-sm font-semibold text-white group-hover:flex">
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

                <p className="mt-2 text-xs text-gray-400">
                  Click image to change
                </p>
              </div>

              {/* Title */}
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Product Title
                </label>

                <input
                  type="text"
                  value={newData.title || ""}
                  onChange={(e) =>
                    handleFieldChange("title", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  placeholder="Enter product title"
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  rows="4"
                  value={newData.description || ""}
                  onChange={(e) =>
                    handleFieldChange("description", e.target.value)
                  }
                  className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  placeholder="Enter product description"
                />
              </div>

              {/* Price */}
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Price
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    $
                  </span>

                  <input
                    type="number"
                    value={newData.price || ""}
                    onChange={(e) =>
                      handleFieldChange("price", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-8 pr-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Category
                </label>

                <select
                  value={
                    newData.category?._id ||
                    newData.category ||
                    ""
                  }
                  onChange={(e) =>
                    handleFieldChange("category", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                >
                  <option value="">Select category</option>

                  {categories.map((category) => (
                    <option
                      key={category._id}
                      value={category._id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={resetEditing}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= CREATE MODAL ================= */}
        {isCreating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <form
              onSubmit={handleCreateProduct}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
            >
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Add Product
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Create a new product for your store.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setNewData({});
                    setSelectedFile(null);
                    setPreview("");
                  }}
                  className="rounded-lg px-3 py-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Image */}
              <div className="mb-6 flex flex-col items-center">
                <div
                  onClick={handleImageClick}
                  className="group relative h-32 w-32 cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Product preview"
                      className="h-full w-full object-cover group-hover:opacity-70"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-1 text-gray-400">
                      <Plus size={25} />
                      <span className="text-xs font-medium">
                        Upload Image
                      </span>
                    </div>
                  )}

                  {preview && (
                    <div className="absolute inset-0 hidden items-center justify-center bg-black/30 text-sm font-semibold text-white group-hover:flex">
                      Change
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={imageLoading}
                  className="hidden"
                />

                <p className="mt-2 text-xs text-gray-400">
                  JPG, PNG or WEBP
                </p>
              </div>

              {/* Title */}
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Product Title
                </label>

                <input
                  type="text"
                  value={newData.title || ""}
                  onChange={(e) =>
                    handleFieldChange("title", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  placeholder="Enter product title"
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  rows="4"
                  value={newData.description || ""}
                  onChange={(e) =>
                    handleFieldChange("description", e.target.value)
                  }
                  className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  placeholder="Enter product description"
                />
              </div>

              {/* Price */}
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Price
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    $
                  </span>

                  <input
                    type="number"
                    value={newData.price || ""}
                    onChange={(e) =>
                      handleFieldChange("price", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-8 pr-3 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Category
                </label>

                <select
                  value={newData.category || ""}
                  onChange={(e) =>
                    handleFieldChange("category", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                >
                  <option value="">Select category</option>

                  {categories.map((category) => (
                    <option
                      key={category._id}
                      value={category._id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setNewData({});
                    setSelectedFile(null);
                    setPreview("");
                  }}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-800 disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
