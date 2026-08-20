import {
    ChevronLeft,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    ShoppingBag,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError("Please enter your email and password.");
            toast.error("Please fill all fields");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:3001/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            if (data.user && data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                toast.success("Login successful!");

                navigate("/");
            } else {
                throw new Error("Invalid login response");
            }
        } catch (error) {
            console.error("Login error:", error);

            setError(error.message || "Something went wrong");
            toast.error(error.message || "Internal Server Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Back Home */}
            <div className="absolute top-5 left-5 sm:left-8">
                <Link
                    to="/"
                    className="group flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-teal-600 transition"
                >
                    <ChevronLeft
                        size={19}
                        className="group-hover:-translate-x-1 transition-transform"
                    />

                    Back to Home
                </Link>
            </div>

            {/* Main */}
            <div className="min-h-screen flex items-center justify-center px-4 py-16">

                <div className="w-full max-w-md">

                    {/* Logo / Brand */}
                    <div className="flex flex-col items-center mb-8">

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-600/20">
                            <ShoppingBag size={27} />
                        </div>

                        <h1 className="mt-4 text-2xl font-bold text-slate-900">
                            Mega Mart
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Welcome back! Please login to your account.
                        </p>

                    </div>

                    {/* Card */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/60">

                        <div className="mb-7">
                            <h2 className="text-2xl font-bold text-slate-900">
                                Sign in
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Enter your details to continue.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* Email */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Email Address
                                </label>

                                <div className="relative">

                                    <Mail
                                        size={19}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        disabled={loading}
                                        autoComplete="email"
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                                    />

                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">

                                    <label className="text-sm font-semibold text-slate-700">
                                        Password
                                    </label>

                                    <button
                                        type="button"
                                        className="text-xs font-semibold text-teal-600 hover:text-teal-700"
                                    >
                                        Forgot password?
                                    </button>

                                </div>

                                <div className="relative">

                                    <LockKeyhole
                                        size={19}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        disabled={loading}
                                        autoComplete="current-password"
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={19} />
                                        ) : (
                                            <Eye size={19} />
                                        )}
                                    </button>

                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                                    {error}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex h-12 w-full items-center justify-center rounded-xl bg-teal-600 px-4 text-sm font-bold text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Signing in...
                                    </div>
                                ) : (
                                    "Sign In"
                                )}
                            </button>

                        </form>

                        {/* Signup */}
                        <div className="mt-7 border-t border-slate-100 pt-6 text-center">

                            <p className="text-sm text-slate-500">
                                Don't have an account?{" "}

                                <Link
                                    to="/signup"
                                    className="font-bold text-teal-600 hover:text-teal-700"
                                >
                                    Create account
                                </Link>
                            </p>

                        </div>

                    </div>

                    {/* Footer */}
                    <p className="mt-6 text-center text-xs text-slate-400">
                        © 2026 Mega Mart. All rights reserved.
                    </p>

                </div>

            </div>
        </div>
    );
};