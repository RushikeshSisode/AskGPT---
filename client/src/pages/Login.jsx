import { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const Login = () => {
  const { loginUser, registerUser } = useAppContext();
  const [state, setState] = useState("login");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const result =
      state === "login"
        ? await loginUser(formData.email, formData.password)
        : await registerUser(formData.name, formData.email, formData.password);

    setLoading(false);
    if (!result.success) {
      toast.error(result.message || "Something went wrong");
    } else {
      toast.success(state === "login" ? "Welcome back!" : "Account created!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel hidden rounded-[36px] p-8 lg:flex lg:flex-col lg:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-slate-300">
              AskGPT
            </span>
            <h1 className="mt-8 max-w-lg text-5xl font-semibold tracking-tight text-white">
              AI conversations built for focused work.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-400">
              Write, research, generate images, and manage your chat history in a workspace that feels calm and production ready.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              "Modern workspace for text and image generation",
              "Clean chat history and responsive premium interface",
              "Secure login, payments, and Markdown rendering",
              "Built for shipping, not just demos",
            ].map((item) => (
              <div key={item} className="app-card rounded-[24px] px-5 py-4 text-sm leading-7 text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-[36px] px-6 py-8 sm:px-10 sm:py-10">
          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
              {state === "login" ? "Welcome back" : "Create account"}
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              {state === "login" ? "Sign in to continue" : "Join AskGPT"}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Access your chat workspace, credits, and image generation tools.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {state !== "login" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Full name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="app-input w-full rounded-2xl px-4 py-3.5 text-sm"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="app-input w-full rounded-2xl px-4 py-3.5 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="app-input w-full rounded-2xl px-4 py-3.5 pr-12 text-sm"
                />

                {formData.password && (
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-white/5 hover:text-white"
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                        <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="app-button app-button-primary mt-3 w-full rounded-2xl px-4 py-3.5 text-sm font-semibold"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Please wait...
                </span>
              ) : state === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            {state === "login" ? "Don’t have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setState((prev) => (prev === "login" ? "register" : "login"))}
              className="font-semibold text-blue-300 transition hover:text-blue-200"
            >
              {state === "login" ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
