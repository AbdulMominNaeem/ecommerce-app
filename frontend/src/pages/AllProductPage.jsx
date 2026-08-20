import React from "react";
import { Header } from "../components/Header";
import { Nav } from "../components/Nav";
import GroceriesDrop from "../components/GroceriesDrop";
import { Footer } from "../components/Footer";
import { ProductG } from "../components/ProductG";

export const AllProductPage = () => {
    return (
        <div className="min-h-screen bg-[#f7f9fc]">

            <Header />
            <Nav />

            {/* Category Bar */}
            <div className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
                    <GroceriesDrop />
                </div>
            </div>

            {/* Products */}
            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

                {/* Heading */}
                <div className="mb-8 flex flex-col gap-3 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">

                    <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-cyan-600">
                            Explore Collection
                        </p>

                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Featured Products
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Discover our latest and most popular products.
                        </p>
                    </div>

                    <div className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm sm:block">
                        Premium Collection
                    </div>

                </div>

                {/* Product Grid */}
                <ProductG />


            </main>

            <Footer />

        </div>
    );
};