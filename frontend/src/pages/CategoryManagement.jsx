import {
    Pencil,
    Plus,
    RefreshCw,
    Trash2,
    X,
    ImagePlus,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Sidebar } from "../components/Sidebar";

const API_URL = "http://localhost:3001";

const formatImageUrl = (imagePath) => {
    if (!imagePath) return "";

    if (
        imagePath.startsWith("data:") ||
        imagePath.startsWith("blob:") ||
        imagePath.startsWith("http://") ||
        imagePath.startsWith("https://")
    ) {
        return imagePath;
    }

    return `${API_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

export const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [currentItem, setCurrentItem] = useState(null);
    const [newData, setNewData] = useState({
        name: "",
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const fileInputRef = useRef(null);

    const token = localStorage.getItem("token");

    // --------------------------------
    // Fetch Categories
    // --------------------------------

    const getAll = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/category/all`,
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
                    data?.message || "Failed to fetch categories"
                );
                return;
            }

            setCategories(data?.category || []);

        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAll();
    }, []);

    // --------------------------------
    // Input Change
    // --------------------------------

    const handleFieldChange = (key, value) => {
        setNewData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    // --------------------------------
    // Image Selection
    // --------------------------------

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        setSelectedFile(file);

        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl);
    };

    // --------------------------------
    // Reset Form
    // --------------------------------

    const resetForm = () => {
        setCurrentItem(null);

        setNewData({
            name: "",
        });

        setSelectedFile(null);
        setPreview("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        setIsEditing(false);
        setIsCreating(false);
        setIsDeleting(false);
    };

    // --------------------------------
    // Edit
    // --------------------------------

    const startEditing = (category) => {
        if (!category) return;

        setCurrentItem(category);

        setNewData({
            name: category.name || "",
        });

        setPreview(formatImageUrl(category.image));
        setSelectedFile(null);

        setIsEditing(true);
    };

    // --------------------------------
    // Create
    // --------------------------------

    const startCreating = () => {
        setCurrentItem(null);

        setNewData({
            name: "",
        });

        setSelectedFile(null);
        setPreview("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        setIsCreating(true);
    };

    // --------------------------------
    // Delete Confirmation
    // --------------------------------

    const startDeleting = (category) => {
        if (!category?._id) {
            toast.error("No category selected");
            return;
        }

        setCurrentItem(category);
        setIsDeleting(true);
    };

    // --------------------------------
    // Delete Category
    // --------------------------------

    const handleDeleteCategory = async () => {
        if (!currentItem?._id) {
            toast.error("No category selected");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/category/delete`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        _id: currentItem._id,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                toast.error(
                    data?.message || "Failed to delete category"
                );
                return;
            }

            toast.success(
                data?.message || "Category deleted successfully"
            );

            setIsDeleting(false);
            setCurrentItem(null);

            await getAll();

        } catch (error) {
            console.error(error);
            toast.error("Failed to delete category");
        } finally {
            setLoading(false);
        }
    };

    // --------------------------------
    // Update Category
    // --------------------------------

    const submitUpdate = async (event) => {
        event.preventDefault();

        if (!currentItem?._id) {
            toast.error("No category selected");
            return;
        }

        if (!newData.name.trim()) {
            toast.error("Category name is required");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append("_id", currentItem._id);
            formData.append("name", newData.name);

            // Only send image if user selected a NEW image
            if (selectedFile) {
                formData.append("categoryImg", selectedFile);
            }

            const response = await fetch(
                `${API_URL}/category/updatebyid`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                toast.error(
                    data?.message || "Failed to update category"
                );
                return;
            }

            toast.success(
                data?.message || "Category updated successfully"
            );

            resetForm();
            await getAll();

        } catch (error) {
            console.error(error);
            toast.error("Error updating category");
        } finally {
            setLoading(false);
        }
    };

    // --------------------------------
    // Create Category
    // --------------------------------

    const handleCreateCategory = async (event) => {
        event.preventDefault();

        if (!newData.name.trim()) {
            toast.error("Category name is required");
            return;
        }

        if (!selectedFile) {
            toast.error("Please select an image");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append("file", selectedFile);
            formData.append("name", newData.name);

            const response = await fetch(
                `${API_URL}/category/`,
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
                toast.error(
                    data?.message || "Category creation failed"
                );
                return;
            }

            toast.success("Category created successfully");

            resetForm();
            await getAll();

        } catch (error) {
            console.error(error);
            toast.error("Category creation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <Sidebar />

            <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
        

                {/* Header */}
                <div className="border-b border-slate-200 bg-white">

                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">

                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600">
                                Administration
                            </p>

                            <h1 className="mt-1 text-2xl font-black text-slate-900">
                                Category Management
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Create, edit and manage your product categories.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">

                            {/* Refresh */}
                            <button
                                type="button"
                                onClick={getAll}
                                disabled={loading}
                                className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    text-slate-500
                                    shadow-sm
                                    transition
                                    hover:border-cyan-300
                                    hover:bg-cyan-50
                                    hover:text-cyan-600
                                    disabled:opacity-50
                                "
                            >
                                <RefreshCw
                                    size={19}
                                    className={
                                        loading
                                            ? "animate-spin"
                                            : ""
                                    }
                                />
                            </button>

                            {/* Add */}
                            <button
                                type="button"
                                onClick={startCreating}
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    bg-cyan-500
                                    px-4
                                    py-3
                                    text-sm
                                    font-bold
                                    text-slate-950
                                    shadow-lg
                                    shadow-cyan-500/20
                                    transition
                                    hover:bg-cyan-400
                                "
                            >
                                <Plus size={18} />
                                Add Category
                            </button>

                        </div>

                    </div>

                </div>

                {/* Content */}
                <div className="mx-auto max-w-7xl px-6 py-8">

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        {/* Table Header */}
                        <div className="border-b border-slate-200 px-6 py-5">

                            <div className="flex items-center justify-between">

                                <div>
                                    <h2 className="font-bold text-slate-900">
                                        All Categories
                                    </h2>

                                    <p className="mt-1 text-xs text-slate-400">
                                        {categories.length} categories
                                    </p>
                                </div>

                            </div>

                        </div>

                        {/* Table */}
                        <div className="overflow-y-auto overflow-x-auto ">
                            <table className="w-full min-w-[900px]">

                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50">

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Category
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Name
                                        </th>

                                        <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Actions
                                        </th>

                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">

                                    {loading && categories.length === 0 ? (

                                        <tr>
                                            <td
                                                colSpan="3"
                                                className="px-6 py-16 text-center text-sm text-slate-400"
                                            >
                                                Loading categories...
                                            </td>
                                        </tr>

                                    ) : categories.length === 0 ? (

                                        <tr>
                                            <td
                                                colSpan="3"
                                                className="px-6 py-16 text-center"
                                            >
                                                <p className="font-semibold text-slate-700">
                                                    No categories found
                                                </p>

                                                <p className="mt-1 text-sm text-slate-400">
                                                    Create your first category.
                                                </p>
                                            </td>
                                        </tr>

                                    ) : (

                                        categories.map((category) => (

                                            <tr
                                                key={category._id}
                                                className="group transition hover:bg-slate-50"
                                            >

                                                {/* Image */}
                                                <td className="px-6 py-4">

                                                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">

                                                        <img
                                                            src={formatImageUrl(
                                                                category.image
                                                            )}
                                                            alt={category.name}
                                                            className="h-full w-full object-cover"
                                                        />

                                                    </div>

                                                </td>

                                                {/* Name */}
                                                <td className="px-6 py-4">

                                                    <p className="font-semibold text-slate-800">
                                                        {category.name}
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-400">
                                                        ID: {category._id}
                                                    </p>

                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4">

                                                    <div className="flex justify-end gap-2">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                startEditing(
                                                                    category
                                                                )
                                                            }
                                                            className="
                                                                flex
                                                                h-9
                                                                w-9
                                                                items-center
                                                                justify-center
                                                                rounded-lg
                                                                text-slate-400
                                                                transition
                                                                hover:bg-cyan-50
                                                                hover:text-cyan-600
                                                            "
                                                        >
                                                            <Pencil size={17} />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                startDeleting(
                                                                    category
                                                                )
                                                            }
                                                            className="
                                                                flex
                                                                h-9
                                                                w-9
                                                                items-center
                                                                justify-center
                                                                rounded-lg
                                                                text-slate-400
                                                                transition
                                                                hover:bg-red-50
                                                                hover:text-red-500
                                                            "
                                                        >
                                                            <Trash2 size={17} />
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

                </div>

            </main>

            {/* =========================
                EDIT MODAL
            ========================== */}

            {isEditing && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

                    <form
                        onSubmit={submitUpdate}
                        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
                    >

                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

                            <div>
                                <h2 className="font-bold text-slate-900">
                                    Edit Category
                                </h2>

                                <p className="mt-1 text-xs text-slate-400">
                                    Update category information
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={resetForm}
                                className="text-slate-400 hover:text-slate-700"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <div className="p-6">

                            {/* Image */}
                            <div className="mb-6 flex flex-col items-center">

                                <button
                                    type="button"
                                    onClick={handleImageClick}
                                    className="group relative h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-lg"
                                >

                                    {preview ? (

                                        <img
                                            src={preview}
                                            alt="Category preview"
                                            className="h-full w-full object-cover"
                                        />

                                    ) : (

                                        <div className="flex h-full w-full flex-col items-center justify-center text-slate-400">
                                            <ImagePlus size={25} />
                                            <span className="mt-1 text-xs">
                                                Upload
                                            </span>
                                        </div>

                                    )}

                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
                                        Change Image
                                    </div>

                                </button>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />

                            </div>

                            {/* Name */}
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Category Name
                            </label>

                            <input
                                type="text"
                                value={newData.name}
                                onChange={(e) =>
                                    handleFieldChange(
                                        "name",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter category name"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    px-4
                                    py-3
                                    text-sm
                                    outline-none
                                    transition
                                    focus:border-cyan-400
                                    focus:ring-4
                                    focus:ring-cyan-500/10
                                "
                            />

                            {/* Buttons */}
                            <div className="mt-6 flex justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
                                >
                                    {loading
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>

                            </div>

                        </div>

                    </form>

                </div>
            )}

            {/* =========================
                CREATE MODAL
            ========================== */}

            {isCreating && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

                    <form
                        onSubmit={handleCreateCategory}
                        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
                    >

                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

                            <div>
                                <h2 className="font-bold text-slate-900">
                                    Create Category
                                </h2>

                                <p className="mt-1 text-xs text-slate-400">
                                    Add a new product category
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={resetForm}
                                className="text-slate-400 hover:text-slate-700"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <div className="p-6">

                            {/* Image */}
                            <div className="mb-6 flex flex-col items-center">

                                <button
                                    type="button"
                                    onClick={handleImageClick}
                                    className="flex h-32 w-32 flex-col items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 transition hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-600"
                                >

                                    {preview ? (

                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="h-full w-full object-cover"
                                        />

                                    ) : (
                                        <>
                                            <ImagePlus size={28} />
                                            <span className="mt-2 text-xs font-semibold">
                                                Upload Image
                                            </span>
                                        </>
                                    )}

                                </button>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />

                            </div>

                            {/* Name */}
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Category Name
                            </label>

                            <input
                                type="text"
                                value={newData.name}
                                onChange={(e) =>
                                    handleFieldChange(
                                        "name",
                                        e.target.value
                                    )
                                }
                                placeholder="e.g. Electronics"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    px-4
                                    py-3
                                    text-sm
                                    outline-none
                                    focus:border-cyan-400
                                    focus:ring-4
                                    focus:ring-cyan-500/10
                                "
                            />

                            {/* Buttons */}
                            <div className="mt-6 flex justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
                                >
                                    {loading
                                        ? "Creating..."
                                        : "Create Category"}
                                </button>

                            </div>

                        </div>

                    </form>

                </div>
            )}

            {/* =========================
                DELETE MODAL
            ========================== */}

            {isDeleting && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">

                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                            <Trash2 size={22} />
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-slate-900">
                            Delete Category?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-slate-700">
                                {currentItem?.name}
                            </span>
                            ? This action cannot be undone.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDeleteCategory}
                                disabled={loading}
                                className="rounded-xl bg-red-500 px-5 py-3 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-50"
                            >
                                {loading
                                    ? "Deleting..."
                                    : "Delete"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};