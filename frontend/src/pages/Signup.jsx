import React, { useState } from "react";
import { ChevronLeft, Mail, Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [errorr, setErrorr] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!name || !email || !password) {
                toast.error("Please fill all fields");
                setErrorr("Please fill all fields");
                return;
            }

            setErrorr("");
            setLoading(true);

            const response = await fetch(
                "http://localhost:3001/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            console.log("Signup response:", data);

            if (!response.ok) {
                throw new Error(data.message || "Signup failed");
            }

            toast.success("Verification code sent to your email.");

            navigate("/verify-email", {
                state: { email },
            });

            setName("");
            setEmail("");
            setPassword("");

        } catch (error) {
            console.error("Signup error:", error);
            setErrorr(error?.message || "Signup error");
            toast.error(error?.message || "Signup error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Home Link */}
            <Link
                to="/"
                className="absolute top-6 left-6 flex items-center gap-2
                text-cyan-700 hover:text-cyan-900 font-semibold
                transition-colors"
            >
                <ChevronLeft size={20} />
                Home
            </Link>

            {/* Signup Container */}
            <div className="min-h-screen flex items-center justify-center px-4">

                <div className="w-full max-w-md">

                    {/* Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8">

                        {/* Header */}
                        <div className="text-center mb-8">

                            <div className="mx-auto mb-4 w-14 h-14 rounded-full
                            bg-cyan-100 flex items-center justify-center">

                                <User
                                    size={28}
                                    className="text-cyan-700"
                                />

                            </div>

                            <h1 className="text-3xl font-bold text-gray-900">
                                Create Account
                            </h1>

                            <p className="text-gray-500 mt-2">
                                Create your account to get started
                            </p>

                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-5"
                        >

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Name
                                </label>

                                <div className="relative">

                                    <User
                                        size={20}
                                        className="absolute left-3 top-1/2
                                        -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder="Enter your name"
                                        className="w-full h-12 pl-11 pr-4
                                        border border-gray-300 rounded-lg
                                        outline-none
                                        focus:border-cyan-600
                                        focus:ring-2 focus:ring-cyan-100
                                        transition"
                                    />

                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email
                                </label>

                                <div className="relative">

                                    <Mail
                                        size={20}
                                        className="absolute left-3 top-1/2
                                        -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="Enter your email"
                                        className="w-full h-12 pl-11 pr-4
                                        border border-gray-300 rounded-lg
                                        outline-none
                                        focus:border-cyan-600
                                        focus:ring-2 focus:ring-cyan-100
                                        transition"
                                    />

                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </label>

                                <div className="relative">

                                    <Lock
                                        size={20}
                                        className="absolute left-3 top-1/2
                                        -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Create a password"
                                        className="w-full h-12 pl-11 pr-4
                                        border border-gray-300 rounded-lg
                                        outline-none
                                        focus:border-cyan-600
                                        focus:ring-2 focus:ring-cyan-100
                                        transition"
                                    />

                                </div>
                            </div>

                            {/* Error */}
                            {errorr && (
                                <p className="text-sm text-red-600 bg-red-50
                                border border-red-200 rounded-lg px-4 py-3">
                                    {errorr}
                                </p>
                            )}

                            {/* Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 rounded-lg
                                bg-cyan-700 hover:bg-cyan-800
                                disabled:bg-gray-400
                                disabled:cursor-not-allowed
                                text-white font-semibold
                                transition-all duration-200
                                shadow-sm hover:shadow-md"
                            >
                                {loading ? "Creating Account..." : "Create Account"}
                            </button>

                        </form>

                        {/* Login */}
                        <div className="mt-7 pt-6 border-t border-gray-100 text-center">

                            <p className="text-sm text-gray-500">
                                Already have an account?{" "}

                                <Link
                                    to="/login"
                                    className="text-cyan-700 hover:text-cyan-900
                                    font-semibold underline
                                    underline-offset-4"
                                >
                                    Log In
                                </Link>
                            </p>

                        </div>

                    </div>

                    {/* Bottom Text */}
                    <p className="text-center text-xs text-gray-400 mt-5">
                        By creating an account, you agree to our terms and policies.
                    </p>

                </div>

            </div>
        </div>
    );
};