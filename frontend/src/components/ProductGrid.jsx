import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductG } from "./ProductG";

export const ProductGrid = () => {
    return (
        <section className="bg-[#f8fafc] py-10">

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="mb-8 flex items-end justify-between border-b border-slate-200 pb-5">

                    <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-cyan-600">
                            Our Collection
                        </p>

                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Featured Products
                        </h2>

                        <p className="mt-2 hidden text-sm text-slate-500 sm:block">
                            Explore our most popular products.
                        </p>
                    </div>

                    {/* View All */}
                    <Link
                        to="/products"
                        className="
                            group
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            px-3
                            py-2
                            text-sm
                            font-semibold
                            text-cyan-600
                            transition-all
                            hover:bg-cyan-50
                        "
                    >
                        <span>View All</span>

                        <ArrowRight
                            size={17}
                            className="transition-transform duration-200 group-hover:translate-x-1"
                        />
                    </Link>

                </div>

                {/* Products */}
                <ProductG />

            </div>

        </section>
    );
};