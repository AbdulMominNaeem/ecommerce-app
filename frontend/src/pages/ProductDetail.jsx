import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Nav } from "../components/Nav";
import { Category } from "../components/Category";
import { useParams } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Star, ShieldCheck } from "lucide-react";

export const ProductDetail = () => {
    const { id } = useParams();

    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getProductDetails();
    }, [id]);

    const getProductDetails = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `http://localhost:3001/store/product/${id}`,
                {
                    method: "GET",
                }
            );

            const data = await response.json();

            console.log("API RESPONSE:", data);

            if (!response.ok) {
                console.error(data.message || "Failed to fetch product");
                return;
            }

            setProduct(data?.product || {});
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <Nav />
                <Category />

                <div className="min-h-[70vh] flex items-center justify-center bg-[#f8fafc]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-10 w-10 rounded-full border-4 border-slate-200 border-t-cyan-500 animate-spin"></div>
                        <p className="text-sm font-medium text-slate-500">
                            Loading product...
                        </p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <Nav />
            <Category />

            <main className="min-h-screen bg-[#f8fafc] px-4 py-10 md:px-8 lg:px-16">

                {/* Breadcrumb */}
                <div className="mx-auto mb-8 max-w-7xl">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-cyan-600"
                    >
                        <ArrowLeft size={18} />
                        Back to products
                    </button>
                </div>

                {/* Product Card */}
                <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">

                    <div className="grid grid-cols-1 lg:grid-cols-2">

                        {/* LEFT - IMAGE */}
                        <div className="relative flex min-h-[500px] items-center justify-center bg-gradient-to-br from-slate-50 via-white to-cyan-50 p-8 md:p-12">

                            {/* Decorative glow */}
                            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl"></div>

                            {/* Image container */}
                            <div className="relative flex h-[380px] w-full max-w-[480px] items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">

                                {product?.photo ? (
                                    <img
                                        src={product.photo}
                                        alt={product?.title || "Product"}
                                        className="h-full w-full object-contain transition duration-500 hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-3 text-slate-400">
                                        <ShoppingBag size={50} strokeWidth={1.5} />
                                        <span>No image available</span>
                                    </div>
                                )}

                                {/* Product badge */}
                                <div className="absolute left-5 top-5 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold tracking-wide text-white shadow-lg">
                                    PREMIUM
                                </div>
                            </div>
                        </div>

                        {/* RIGHT - DETAILS */}
                        <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">

                            {/* Small category label */}
                            <span className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
                                Featured Product
                            </span>

                            {/* Product title */}
                            <h1 className="max-w-xl text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                                {product?.title}
                            </h1>

                            {/* Rating */}
                            <div className="mt-5 flex items-center gap-3">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={18}
                                            className="fill-amber-400 text-amber-400"
                                        />
                                    ))}
                                </div>

                                <span className="text-sm font-medium text-slate-500">
                                    5.0 · Premium quality
                                </span>
                            </div>

                            {/* Price */}
                            <div className="mt-8 flex items-end gap-3">
                                <span className="text-4xl font-bold text-slate-900">
                                    ${product?.price}
                                </span>

                                <span className="mb-1 text-sm text-slate-400">
                                    USD
                                </span>
                            </div>

                            {/* Divider */}
                            <div className="my-8 h-px bg-slate-200"></div>

                            {/* Description */}
                            <div>
                                <h2 className="mb-3 text-lg font-semibold text-slate-900">
                                    Product Description
                                </h2>

                                <p className="max-w-xl text-base leading-7 text-slate-500">
                                    {product?.description}
                                </p>
                            </div>

                            {/* Features */}
                            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-cyan-600">
                                        <ShieldCheck size={20} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">
                                            Secure Purchase
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Safe & reliable
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-cyan-600">
                                        <ShoppingBag size={20} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">
                                            Premium Quality
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Carefully selected
                                        </p>
                                    </div>
                                </div>

                            </div>

                            {/* CTA */}
                            <div className="mt-10 flex flex-col gap-3 sm:flex-row">

                                <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 font-semibold text-white shadow-lg shadow-slate-900/20 transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-600 hover:shadow-cyan-500/20">
                                    <ShoppingBag size={20} />
                                    Add to Cart
                                </button>

                                <button className="rounded-xl border border-slate-300 px-6 py-4 font-semibold text-slate-700 transition hover:border-cyan-500 hover:text-cyan-600">
                                    Buy Now
                                </button>

                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};