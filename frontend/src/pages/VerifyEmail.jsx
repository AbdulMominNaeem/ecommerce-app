import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !code) {
      toast.error("Please enter your email and verification code.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      toast.success(data.message || "Email verified successfully.");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Verification failed.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Please enter your email to resend the code.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Resend failed");
      }
      toast.success(data.message || "Verification code resent.");
    } catch (error) {
      toast.error(error.message || "Unable to resend code.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <Link to='/' className="lg:block text-cyan-700 hover:text-cyan-900 font-semibold transition-colors">
          <p className="px-10 py-5 flex gap-2 items-center"> <ChevronLeft/> Home</p>
        </Link>
      </div>
      <div className="h-screen flex justify-center items-center">
        <div className="h-200 w-150 border border-black rounded-2xl flex flex-col justify-center items-center gap-3">
          <div className="flex flex-col gap-3 justify-center items-center">
            <h1 className="text-2xl text-black my-8 py-3 border-b-4 border-cyan-700">Verify Email</h1>
            <form className="flex flex-col gap-3 justify-center items-center" onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 text-lg border border-cyan-700 rounded-md"
                placeholder="Enter Email"
              />
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-12 px-4 text-lg border border-cyan-700 rounded-md"
                placeholder="Enter 6-digit code"
              />
              <button
                type="submit"
                disabled={loading}
                className="disabled:opacity-50 disabled:cursor-not-allowed bg-cyan-700 hover:bg-cyan-800 text-white font-medium py-2 px-4 rounded transition-colors duration-400"
              >
                {loading ? "..." : "Verify Email"}
              </button>
            </form>
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="text-sm text-cyan-700 hover:text-cyan-900 underline decoration-2 underline-offset-4"
            >
              Resend verification code
            </button>
          </div>
          <p className="text-gray-600 text-sm mt-4 text-center">
            Already verified?{' '}
            <Link to="/login" className="text-cyan-700 hover:text-cyan-900 font-semibold underline decoration-2 underline-offset-4">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};
