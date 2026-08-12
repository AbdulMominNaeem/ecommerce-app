import React, { useState } from "react";
import { ChevronLeft} from "lucide-react";

import {Link, useNavigate} from "react-router-dom"
import { toast } from "react-toastify";

export const Signup = ()=>{
    const [name, setName] = useState("");
    const [email, setEmail]=useState("");
    const [loading, setLoading]=useState(false);
    const [password, setPassword] = useState("");
    const [errorr, setErrorr] = useState(false); 
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(!name || !email || !password){
                toast.error("Please fill all fields");
                setErrorr("Please fill all fields");
                // setErrorr(true);
                return;
            }
            setLoading(true);
            const response = await fetch("http://localhost:3001/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await response.json();
            console.log("Signup response:", data);
            if(response.ok){
                toast.success("Verification code sent to your email.");
                navigate('/verify-email', { state: { email } });
                setName("");
                setEmail("");
                setPassword("");
            }
            setLoading(false);
            if (!response.ok) {
                throw new Error(data.message || "Signup failed");
            }
        } catch (error) {
            setLoading(false);
            console.error("Signup error:", error);
            toast.error(error?.message || "Signup error:", error);
        }
    };

    return(
        <>
            <div>

                
                <Link to='/' className=" lg:block text-cyan-700 hover:text-cyan-900 font-semibold transition-colors">
                <p className="px-10 py-5 flex gap-2 items-center"> <ChevronLeft/> Home</p>
                </Link>
            </div>
            <div className="h-screen flex justify-center items-center">
                
                <div className="h-200 w-150 border border-black rounded-2xl flex flex-col justify-center items-center gap-3">
                    <div className="flex flex-col gap-3 justify-center items-center">
                        <h1 className="text-2xl text-black my-8 py-3 border-b-4 border-cyan-700">Sign Up</h1>
                        <form className="flex flex-col gap-3 justify-center items-center" onSubmit={handleSubmit}>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full h-12 px-4 text-lg border border-cyan-700 rounded-md" placeholder="Enter Username" />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-12 px-4 text-lg border border-cyan-700 rounded-md" placeholder="Enter Email" />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-12 px-4 text-lg border border-cyan-700 rounded-md" placeholder="Enter Password" />
                        <button type="submit" disabled={loading} className={`disabled:opacity-50 disabled:cursor-not-allowed bg-cyan-700 hover:bg-cyan-800 text-white font-medium py-2 px-4 rounded transition-colors duration-400`}> {loading ? "...." :"Submit" }</button>
                        {errorr && <p className="text-red-600">{errorr}</p>}
                        </form>
                    </div>    
                    
                        <p className="text-gray-600 text-sm mt-4 text-center">Don't Have the Account - {" "} 
                            <Link to="/login" className="text-cyan-700 hover:text-cyan-900 font-semibold underline decoration-2 underline-offset-4 transition-colors">
                                Log In
                            </Link>
                        </p>
                </div>
            </div>    
            
        </>
    )
}