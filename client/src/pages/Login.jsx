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
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-10 text-black">
      <div className="w-full max-w-md rounded-2xl border border-[#d9d9d9] bg-white px-8 py-10 sm:px-10">
        <div className="text-center">
          <h1 className="text-4xl font-normal text-black">
            {isLogin ? "Sign in" : "Sign up"}
          </h1>
          <p className="mt-2 text-sm text-[#666666]">
            {isLogin ? "Sign in to continue" : "Sign up to continue"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          {!isLogin && (
            <div>
              <label className="mb-2 block text-sm text-[#666666]">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border-0 border-b border-[#cfcfcf] bg-transparent px-0 py-2 text-base text-black outline-none"
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
              className="w-full border-0 border-b border-[#cfcfcf] bg-transparent px-0 py-2 text-base text-black outline-none"
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
              className="w-full border-0 border-b border-[#cfcfcf] bg-transparent px-0 py-2 text-base text-black outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#1976d2] px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Please wait..." : isLogin ? "Sign in" : "Sign up"}
          </button>

          <label className="flex items-center gap-2 text-sm text-[#666666]">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="h-4 w-4"
            />
            Remember me
          </label>
        </form>

        <p className="mt-10 text-center text-sm text-[#666666]">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setState(isLogin ? "register" : "login")}
            className="text-[#1976d2] underline"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
