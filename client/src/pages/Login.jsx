import { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const quickAccessItems = ["Google", "LinkedIn", "SSO"];

const Login = () => {
  const { loginUser, registerUser } = useAppContext();
  const [state, setState] = useState("login");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const isLogin = state === "login";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const result = isLogin
      ? await loginUser(formData.email, formData.password)
      : await registerUser(formData.name, formData.email, formData.password);

    setLoading(false);

    if (!result.success) {
      toast.error(result.message || "Something went wrong");
      return;
    }

    if (!rememberMe) {
      sessionStorage.setItem("temp-auth", "1");
    }

    toast.success(isLogin ? "Signed in" : "Account created");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--app-bg)] px-4 py-10">
      <div className="w-full max-w-md border border-[var(--app-border)] bg-[var(--app-card)] px-8 py-10 sm:px-10">
        <div className="text-center">
          <h1 className="text-4xl font-normal text-[var(--app-text)]">
            {isLogin ? "Sign in" : "Sign up"}
          </h1>
          <p className="mt-2 text-sm text-[var(--app-text-soft)]">
            {isLogin ? "Sign in to continue" : "Sign up to continue"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          {!isLogin && (
            <div>
              <label className="mb-2 block text-sm text-[var(--app-text-soft)]">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border-0 border-b border-[var(--app-border-strong)] bg-transparent px-0 py-2 text-base text-[var(--app-text)] outline-none"
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm text-[var(--app-text-soft)]">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border-0 border-b border-[var(--app-border-strong)] bg-transparent px-0 py-2 text-base text-[var(--app-text)] outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-[var(--app-text-soft)]">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border-0 border-b border-[var(--app-border-strong)] bg-transparent px-0 py-2 text-base text-[var(--app-text)] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--app-primary)] px-4 py-3 text-sm font-medium text-[var(--app-primary-text)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Please wait..." : isLogin ? "Sign in" : "Sign up"}
          </button>

          <label className="flex items-center gap-2 text-sm text-[var(--app-text-soft)]">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="h-4 w-4"
            />
            Remember me
          </label>

          <div className="pt-1">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-[var(--app-border)]" />
              <span className="text-[11px] uppercase text-[var(--app-text-soft)]">
                Access Quickly
              </span>
              <div className="h-px flex-1 bg-[var(--app-border)]" />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {quickAccessItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="border border-[var(--app-border)] px-2 py-2 text-xs text-[var(--app-primary)]"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-[var(--app-text-soft)]">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setState(isLogin ? "register" : "login")}
            className="text-[var(--app-primary)] underline"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
