import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { toast } from "react-toastify";
import { PaginationComponent } from "./PaginationComponent";

export const ProductG = () => {

 const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(false);

const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 100,
    itemsPerPage: 4,
    hasNextPage: false,
    hasPrevPage: false,
});

const getAllProduct = async (page = 1) => {
    try {
        setLoading(true);

        const limit = "";

        const response = await fetch(
            `http://localhost:3001/store/all-p?page=${page}&limit=${limit}`
        );

        const data = await response.json();

        console.log("PAGE:", page);
        console.log("PRODUCTS RECEIVED:", data.products);
        console.log("COUNT:", data.products?.length);
        console.log("META:", data.meta);

        if (!response.ok) {
            toast.error(data.message || "Failed to fetch products");
            return;
        }

        // IMPORTANT: only these products should be displayed
        setProducts(data.products || []);

        setPagination({
            currentPage: data.meta.currentPage,
            totalPages: data.meta.totalPages,
            totalItems: data.meta.totalItems,
            itemsPerPage: data.meta.itemsPerPage,
            hasNextPage: data.meta.hasNextPage,
            hasPrevPage: data.meta.hasPrevPage,
        });

    } catch (error) {
        console.error(error);
        toast.error("Failed to fetch products");
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    getAllProduct(1);
}, []);

    const handlePageChange = (page) => {
        getAllProduct(page);
    };


    return (
        <section className="bg-[#f8fafc]">

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {loading ? (

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (

                            <div
                                key={item}
                                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                            >

                                <div className="h-56 animate-pulse bg-slate-200" />

                                <div className="space-y-3 p-5">

                                    <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />

                                    <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />

                                    <div className="h-6 w-1/3 animate-pulse rounded bg-slate-200" />

                                </div>

                            </div>

                        ))}

                    </div>

                ) : products.length === 0 ? (

            

                    <div className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white">

                        <ShoppingCart
                            size={28}
                            className="text-slate-400"
                        />

                        <h2 className="mt-4 text-xl font-bold text-slate-900">
                            No products found
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Check back later for new products.
                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                        {products.map((product) => (

                            <Link
                                key={product._id}
                                to={`/productdetail/${product._id}`}
                                className="group"
                            >

                                <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)]">


                                    <div className="relative flex h-56 items-center justify-center overflow-hidden bg-slate-50 p-5">

                                        <img
                                            src={product.photo}
                                            alt={product.title || "Product Image"}
                                            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                                        />

                                        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-700 shadow-sm backdrop-blur">
                                            Featured
                                        </span>

                                    </div>



                                    <div className="p-5">


                                        <div className="mb-3 flex items-center gap-2">

                                            {product?.category?.image && (

                                                <img
                                                    src={product.category.image}
                                                    alt=""
                                                    className="h-6 w-6 rounded-full object-cover"
                                                />

                                            )}

                                            <span className="text-xs font-medium text-slate-400">
                                                {product?.category?.name || "Category"}
                                            </span>

                                        </div>


                                        {/* Title */}

                                        <h3 className="line-clamp-2 min-h-[48px] text-base font-semibold text-slate-800 transition-colors group-hover:text-cyan-600">
                                            {product.title}
                                        </h3>


                                        {/* Rating */}

                                        <div className="mt-3 flex items-center gap-1">

                                            <div className="flex">

                                                {[1, 2, 3, 4, 5].map((star) => (

                                                    <Star
                                                        key={star}
                                                        size={13}
                                                        className="fill-amber-400 text-amber-400"
                                                    />

                                                ))}

                                            </div>

                                            <span className="ml-1 text-xs text-slate-400">
                                                5.0
                                            </span>

                                        </div>


                                        {/* Price */}

                                        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                                            <div>

                                                <p className="text-xs text-slate-400">
                                                    Price
                                                </p>

                                                <p className="text-xl font-bold text-slate-900">
                                                    ${product.price}
                                                </p>

                                            </div>


                                            <button
                                                type="button"
                                                onClick={(e) => {

                                                    e.preventDefault();
                                                    e.stopPropagation();

                                                    toast.success(
                                                        "Product added to cart"
                                                    );

                                                }}
                                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white transition-all hover:bg-cyan-500"
                                            >

                                                <ShoppingCart size={18} />

                                            </button>

                                        </div>

                                    </div>

                                </article>

                            </Link>

                        ))}

                    </div>

                )}


                <div className="mt-12 flex justify-center border-t border-slate-200 pt-8">

                    <PaginationComponent
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        hasNextPage={pagination.hasNextPage}
                        hasPrevPage={pagination.hasPrevPage}
                        onPageChange={handlePageChange}
                    />

                </div>

            </div>

        </section>
    );
};