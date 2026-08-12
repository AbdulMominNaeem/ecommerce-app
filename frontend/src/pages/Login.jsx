import { ChevronLeft } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [errorr, setErrorr] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!formData.email || !formData.password) {
                toast.error("Please fill all fields");
                setErrorr("Please fill all fields");
                // setErrorr(true);
                return;
            }
            setLoading(true)

            const response = await fetch("http://localhost:3001/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Login failed");
                return;
            }
            if (data.user && data.token) {
                localStorage.setItem("token", data?.token);
                localStorage.setItem("user", JSON.stringify(data?.user));
                toast.success("Login Successfully!");
                navigate('/')
            }
            else {
                toast.error("Failed to Login");
            }

            setLoading(false)
        } catch (error) {
            setLoading(false);
            toast.error(error?.message || "Internal Server");
            console.error("Login error:", error);
        }
    };

    


        

    return (
        <>
            <div>
                <Link to='/' className=" lg:block text-cyan-700 hover:text-cyan-900 font-semibold  transition-colors">
                    <p className="px-10 py-5 flex gap-2 items-center"> <ChevronLeft /> Home</p>
                </Link>
            </div>
            <div className="h-screen flex justify-center items-center">
                <div className="h-200 w-150 border border-black rounded-2xl flex flex-col justify-center items-center gap-3">
                    <div className="flex flex-col gap-3 justify-center items-center">
                        <form className="flex flex-col gap-3 justify-center items-center" onSubmit={handleSubmit}>
                            <h1 className="text-2xl text-black my-8 py-3 border-b-4 border-cyan-700">Login</h1>
                            <input type="email" value={formData.email} onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    email: e.target.value
                                });
                            }} className="w-full h-12 px-4 text-lg border border-cyan-700 rounded-md" placeholder="Email" />
                            <input type="password" value={formData.password} onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    password: e.target.value
                                });
                            }} className="w-full h-12 px-4 text-lg border border-cyan-700 rounded-md" placeholder="Password" />
                            <button type="submit" className="bg-cyan-700 hover:bg-cyan-800 text-white font-medium py-2 px-4 rounded transition-colors duration-400">{loading ? "...." : "Submit"}</button>
                            {errorr && <p className="text-red-600">{errorr}</p>}
                        </form>
                    </div>
                    <p className="text-gray-600 text-sm mt-4 text-center">Don't Have the Account - {" "}
                        <Link to="/signup" disabled={loading} className="disabled:cursor-not-allowed disabled:opacity-50 text-cyan-700 hover:text-cyan-900 font-semibold underline decoration-2 underline-offset-4 transition-colors">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </>
    )
}