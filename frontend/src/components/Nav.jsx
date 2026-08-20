import {
    Menu,
    Search,
    ShoppingCart,
    UserRound,
    X,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import LogOutDrop from "./LogoutDrop";
import DashDrop from "./DashDrop";

export const Nav = () => {
    const [open, setOpen] = useState(false);

    let user = null;

    try {
        const storedUser = localStorage.getItem("user");
        user = storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        console.error("Invalid user data:", error);
    }

    return (
        <>
            <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">

                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">

                    {/* Left Section */}
                    <div className="flex shrink-0 items-center gap-3">

                        {/* Mobile Menu */}
                        <button
                            type="button"
                            onClick={() => setOpen(true)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-cyan-50 hover:text-cyan-600 lg:hidden"
                        >
                            <Menu size={23} />
                        </button>

                        {/* Logo */}
                        <Link to="/" className="hidden lg:block">
                            <h1 className="text-2xl font-black tracking-tight text-slate-900">
                                Mega<span className="text-cyan-500">Mart</span>
                            </h1>
                        </Link>

                    </div>

                    {/* Search */}
                    <div className="relative flex-1 sm:max-w-md lg:max-w-xl">

                        <Search
                            size={19}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            placeholder="Search for products..."
                            className="
                                h-10
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50
                                pl-11
                                pr-4
                                text-sm
                                text-slate-700
                                outline-none
                                transition-all
                                placeholder:text-slate-400
                                focus:border-cyan-400
                                focus:bg-white
                                focus:ring-4
                                focus:ring-cyan-500/10
                                sm:h-11
                            "
                        />

                    </div>

                    {/* Right Section */}
                    <div className="flex shrink-0 items-center gap-2 sm:gap-4">

                        {/* Login / Profile */}
                        {user ? (
                            <LogOutDrop />
                        ) : (
                            <Link
                                to="/login"
                                className="
                                    hidden
                                    items-center
                                    gap-2
                                    rounded-xl
                                    px-3
                                    py-2
                                    text-sm
                                    font-semibold
                                    text-slate-600
                                    transition
                                    hover:bg-cyan-50
                                    hover:text-cyan-600
                                    sm:flex
                                "
                            >
                                <UserRound size={20} />
                                <span>Sign In</span>
                            </Link>
                        )}

                        {/* Admin */}
                        {user?.role === "admin" && (
                            <DashDrop />
                        )}

                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="
                                group
                                relative
                                flex
                                h-10
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-3
                                text-slate-600
                                shadow-sm
                                transition-all
                                hover:border-cyan-300
                                hover:bg-cyan-50
                                hover:text-cyan-600
                            "
                        >
                            <ShoppingCart
                                size={20}
                                className="transition-transform group-hover:-rotate-6"
                            />

                            <span className="hidden text-sm font-semibold lg:block">
                                Cart
                            </span>

                            {/* Cart Count */}
                            <span
                                className="
                                    absolute
                                    -right-1.5
                                    -top-1.5
                                    flex
                                    h-5
                                    min-w-5
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-cyan-500
                                    px-1
                                    text-[10px]
                                    font-bold
                                    text-white
                                "
                            >
                                0
                            </span>
                        </Link>

                    </div>

                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {open && (
                <div className="fixed inset-0 z-50 lg:hidden">

                    {/* Background */}
                    <div
                        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="absolute left-0 top-0 h-full w-80 max-w-[85%] bg-white shadow-2xl">

                        {/* Drawer Header */}
                        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-5">

                            <Link
                                to="/"
                                onClick={() => setOpen(false)}
                            >
                                <h1 className="text-2xl font-black text-slate-900">
                                    Mega<span className="text-cyan-500">
                                        Mart
                                    </span>
                                </h1>
                            </Link>

                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                            >
                                <X size={22} />
                            </button>

                        </div>

                        {/* Mobile Links */}
                        <div className="space-y-2 p-5">

                            <Link
                                to="/"
                                onClick={() => setOpen(false)}
                                className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-cyan-50 hover:text-cyan-600"
                            >
                                Home
                            </Link>

                            <Link
                                to="/products"
                                onClick={() => setOpen(false)}
                                className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-cyan-50 hover:text-cyan-600"
                            >
                                Products
                            </Link>

                            <Link
                                to="/categories"
                                onClick={() => setOpen(false)}
                                className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-cyan-50 hover:text-cyan-600"
                            >
                                Categories
                            </Link>

                            <Link
                                to="/cart"
                                onClick={() => setOpen(false)}
                                className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-cyan-50 hover:text-cyan-600"
                            >
                                Cart
                            </Link>

                            {!user && (
                                <Link
                                    to="/login"
                                    onClick={() => setOpen(false)}
                                    className="mt-4 block rounded-xl bg-cyan-500 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-cyan-600"
                                >
                                    Sign In / Register
                                </Link>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </>
    );
};