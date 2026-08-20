import React, { useState, useEffect } from "react";
import { ChevronLeft, Mail, ShieldCheck } from "lucide-react";
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

      const response = await fetch(
        "http://localhost:3001/api/auth/verify-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code }),
        }
      );

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

      const response = await fetch(
        "http://localhost:3001/api/auth/resend-verification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

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
    <div className="min-h-screen bg-gray-50">

      {/* Home */}
      <div className="absolute top-0 left-0">
        <Link
          to="/"
          className="flex items-center gap-2 px-8 py-6 text-gray-600 hover:text-cyan-700 font-medium transition-colors"
        >
          <ChevronLeft size={20} />
          Home
        </Link>
      </div>

      {/* Main */}
      <div className="min-h-screen flex items-center justify-center px-4 py-16">

        {/* Card */}
        <div className="w-full max-w-md">

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-7 py-9 sm:px-10">

            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-cyan-50 flex items-center justify-center">
                <ShieldCheck
                  size={34}
                  className="text-cyan-700"
                />
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Verify Your Email
              </h1>

              <p className="text-sm text-gray-500 mt-3 leading-6">
                We've sent a verification code to your email.
                Enter the code below to verify your account.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
            >

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="
                      w-full
                      h-12
                      pl-11
                      pr-4
                      text-sm
                      border border-gray-300
                      rounded-lg
                      outline-none
                      bg-gray-50
                      transition-all
                      focus:bg-white
                      focus:border-cyan-600
                      focus:ring-2
                      focus:ring-cyan-100
                    "
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Code */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Verification Code
                </label>

                <input
                  type="text"
                  value={code}
                  maxLength={6}
                  inputMode="numeric"
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, ""))
                  }
                  className="
                    w-full
                    h-14
                    px-4
                    text-center
                    text-2xl
                    font-bold
                    tracking-[0.45em]
                    border border-gray-300
                    rounded-lg
                    outline-none
                    bg-gray-50
                    transition-all
                    focus:bg-white
                    focus:border-cyan-600
                    focus:ring-2
                    focus:ring-cyan-100
                  "
                  placeholder="000000"
                />

                <p className="text-xs text-gray-400 mt-2">
                  Enter the 6-digit code sent to your email.
                </p>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  h-12
                  rounded-lg
                  bg-cyan-700
                  hover:bg-cyan-800
                  text-white
                  font-semibold
                  shadow-sm
                  hover:shadow-md
                  transition-all
                  duration-200
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                {loading ? "Verifying..." : "Verify Email"}
              </button>
            </form>

            {/* Resend */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                Didn't receive the code?
              </p>

              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="
                  mt-2
                  text-sm
                  font-semibold
                  text-cyan-700
                  hover:text-cyan-900
                  transition-colors
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                Resend verification code
              </button>
            </div>

            {/* Login */}
            <div className="border-t border-gray-100 mt-7 pt-6 text-center">
              <p className="text-sm text-gray-500">
                Already verified?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-cyan-700 hover:text-cyan-900 transition-colors"
                >
                  Login
                </Link>
              </p>
            </div>

          </div>

          <p className="text-center text-xs text-gray-400 mt-5">
            Secure email verification
          </p>

        </div>
      </div>
    </div>
  );
};