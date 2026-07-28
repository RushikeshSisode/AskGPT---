import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const Login = () => {
  const { loginUser, registerUser } = useAppContext();
  const [state, setState] = useState("login");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const isLogin = state === "login";

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  }, []);

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
    <div className="min-h-screen bg-[#fbfbfb] px-4 py-8 text-black sm:px-6 lg:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-10 lg:grid-cols-[1fr_460px]">
        <section className="hidden lg:block lg:pr-10">
          <div className="max-w-xl">
            <p className="mb-5 text-sm uppercase tracking-[0.2em] text-[#7a7a7a]">AskGPT</p>
            <h1 className="page-title text-6xl font-normal leading-[1.02] text-[#111111]">
              Smarter text and image conversations in one simple workspace.
            </h1>
            <p className="mt-6 text-base leading-8 text-[#666666]">
              Sign in to continue your chats, generate images, and manage credits in one place.
            </p>
          </div>
        </section>

        <div className="w-full rounded-[28px] border border-[#dddddd] bg-white px-8 py-10 shadow-[0_20px_50px_rgba(15,23,42,0.07)] sm:px-10">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.18em] text-[#8a8a8a]">Welcome</p>
            <h2 className="page-title mt-3 text-4xl font-normal text-black">
              {isLogin ? "Sign in" : "Sign up"}
            </h2>
            <p className="mt-2 text-sm text-[#666666]">
              {isLogin ? "Access your AskGPT workspace" : "Create your AskGPT account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 space-y-7">
            {!isLogin && (
              <div>
                <label className="mb-2 block text-sm text-[#666666]">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border-0 border-b border-[#d3d3d3] bg-transparent px-0 py-3 text-base text-black outline-none focus:border-[#8c8c8c]"
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm text-[#666666]">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border-0 border-b border-[#d3d3d3] bg-transparent px-0 py-3 text-base text-black outline-none focus:border-[#8c8c8c]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-[#666666]">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border-0 border-b border-[#d3d3d3] bg-transparent px-0 py-3 text-base text-black outline-none focus:border-[#8c8c8c]"
              />
            </div>

            <div className="flex items-center justify-between gap-4 pt-1">
              <label className="flex items-center gap-2 text-sm text-[#666666]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4"
                />
                Remember me
              </label>

              {isLogin && <span className="text-sm text-[#8a8a8a]">Secure access</span>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#1f1f1f] px-4 py-3.5 text-sm font-medium text-white shadow-[0_14px_28px_rgba(15,23,42,0.10)] hover:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-[#666666]">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setState(isLogin ? "register" : "login")}
              className="font-medium text-[#1f1f1f] underline underline-offset-4"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
