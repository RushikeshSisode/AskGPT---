import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const Login = () => {
  const { loginUser, registerUser } = useAppContext();
  const [state, setState] = useState("login");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let result;
    if (state === "login") {
      result = await loginUser(formData.email, formData.password);
    } else {
      result = await registerUser(formData.name, formData.email, formData.password);
    }
    setLoading(false);
    if (!result.success) {
      toast.error(result.message || "Something went wrong");
    } else {
      toast.success(state === "login" ? "Welcome back!" : "Account created!");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 px-4">

      {/* Stacked cards wrapper */}
      <div className="relative w-full max-w-[380px]">

        {/* Back card 2 — furthest, most tilted */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl rotate-6 translate-x-2 translate-y-2 shadow-lg" />

        {/* Back card 1 */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-2xl rotate-3 translate-x-1 translate-y-1 shadow-md" />

        {/* Main white card */}
        <div className="relative bg-white rounded-2xl shadow-xl px-10 py-10 z-10">

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-8">
            {state === "login" ? "Login" : "Sign Up"}
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Name — register only */}
            {state !== "login" && (
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border-b border-gray-300 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-cyan-500 transition-colors bg-transparent"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border-b border-gray-300 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-cyan-500 transition-colors bg-transparent"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border-b border-gray-300 py-2.5 pr-10 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-cyan-500 transition-colors bg-transparent"
              />

              {/* Eye toggle — only visible after typing */}
              {formData.password && (
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    /* Eye-off icon */
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                      <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    /* Eye icon */
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-28 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-sm font-semibold rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Wait...
                </span>
              ) : (
                "Submit"
              )}
            </button>
          </form>

          {/* Switch login/register */}
          <p className="text-center text-gray-500 text-xs mt-8">
            {state === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setState((s) => (s === "login" ? "register" : "login"))}
              className="text-cyan-500 font-semibold hover:underline"
            >
              {state === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;