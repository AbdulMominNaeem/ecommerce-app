import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ArrowRight } from "lucide-react";

export const CircleProduct = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const getAll = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:3001/category/getallp",
                {
                    method: "GET",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Failed to fetch categories");
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

    return (
        <section className="bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <span className="h-[2px] w-8 bg-cyan-600"></span>

                            <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-600">
                                Explore
                            </p>
                        </div>

                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Shop by Category
                        </h2>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                            Explore our collection and discover products
                            that match your style and needs.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="
                            hidden
                            items-center
                            gap-2
                            text-sm
                            font-semibold
                            text-slate-700
                            transition-colors
                            hover:text-cyan-600
                            sm:flex
                        "
                    >
                        View All
                        <ArrowRight size={17} />
                    </button>
                </div>

                {/* Categories */}
                {loading ? (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
                        {[...Array(7)].map((_, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center"
                            >
                                <div className="h-28 w-28 animate-pulse rounded-full bg-slate-100 sm:h-32 sm:w-32" />

                                <div className="mt-5 h-4 w-20 animate-pulse rounded-full bg-slate-100" />
                            </div>
                        ))}
                    </div>
                ) : categories.length > 0 ? (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
                        {categories.map((category) => (
                            <div
                                key={category._id}
                                className="
                                    group
                                    flex
                                    cursor-pointer
                                    flex-col
                                    items-center
                                "
                            >
                                {/* Image Container */}
                                <div
                                    className="
                                        relative
                                        h-28
                                        w-28
                                        rounded-full
                                        bg-slate-50
                                        p-1
                                        transition-all
                                        duration-300
                                        group-hover:-translate-y-2
                                        group-hover:shadow-xl
                                        group-hover:shadow-cyan-100
                                        sm:h-32
                                        sm:w-32
                                    "
                                >
                                    {/* Cyan border */}
                                    <div
                                        className="
                                            absolute
                                            inset-0
                                            rounded-full
                                            border
                                            border-slate-200
                                            transition-all
                                            duration-300
                                            group-hover:border-cyan-400
                                            group-hover:scale-105
                                        "
                                    />

                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="
                                            h-full
                                            w-full
                                            rounded-full
                                            object-cover
                                            transition-transform
                                            duration-500
                                            group-hover:scale-110
                                        "
                                    />

                                    {/* Hover overlay */}
                                    <div
                                        className="
                                            absolute
                                            inset-1
                                            rounded-full
                                            bg-cyan-950/0
                                            transition-all
                                            duration-300
                                            group-hover:bg-cyan-950/10
                                        "
                                    />

                                    {/* Arrow */}
                                    <div
                                        className="
                                            absolute
                                            bottom-0
                                            right-0
                                            flex
                                            h-8
                                            w-8
                                            translate-y-1
                                            items-center
                                            justify-center
                                            rounded-full
                                            border
                                            border-white
                                            bg-cyan-600
                                            text-white
                                            opacity-0
                                            shadow-md
                                            transition-all
                                            duration-300
                                            group-hover:translate-y-0
                                            group-hover:opacity-100
                                        "
                                    >
                                        <ArrowRight size={15} />
                                    </div>
                                </div>

                                {/* Name */}
                                <h3
                                    className="
                                        mt-5
                                        max-w-[130px]
                                        text-center
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                        transition-colors
                                        duration-200
                                        group-hover:text-cyan-600
                                    "
                                >
                                    {category.name}
                                </h3>

                                <span
                                    className="
                                        mt-1
                                        h-[2px]
                                        w-0
                                        bg-cyan-500
                                        transition-all
                                        duration-300
                                        group-hover:w-8
                                    "
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
                        <p className="text-sm font-medium text-slate-500">
                            No categories available.
                        </p>

                        <button
                            onClick={getAll}
                            className="mt-3 text-sm font-semibold text-cyan-600 hover:text-cyan-700"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Mobile View All */}
                {!loading && categories.length > 0 && (
                    <div className="mt-10 flex justify-center sm:hidden">
                        <button
                            type="button"
                            className="
                                flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-slate-200
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-slate-700
                                transition-all
                                hover:border-cyan-300
                                hover:text-cyan-600
                            "
                        >
                            View All
                            <ArrowRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};