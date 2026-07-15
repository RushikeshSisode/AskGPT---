import { useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import ChatBox from "./components/ChatBox";
import Credits from "./pages/Credits";
import Community from "./pages/Community";
import Login from "./pages/Login";
import Loading from "./pages/Loading";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAppContext } from "./context/AppContext";
import "./assets/prism.css";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { user } = useAppContext();

  if (pathname === "/loading") {
    return <Loading />;
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111827",
            color: "#F9FAFB",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "18px",
          },
        }}
      />

      {!isMenuOpen && user && (
        <button
          type="button"
          aria-label="Open menu"
          className="fixed left-4 top-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/8 bg-slate-900/85 text-slate-200 shadow-lg backdrop-blur md:hidden"
          onClick={() => setIsMenuOpen(true)}
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor">
            <path d="M4 7h16M4 12h16M4 17h10" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      )}

      <div className="app-shell min-h-screen w-screen text-white">
        <div className="flex h-screen w-full overflow-hidden p-3 md:p-4">
          {user && <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />}

          <main className="min-w-0 flex-1 overflow-hidden">
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <ChatBox />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
              <Route path="/loading" element={<Loading />} />
              <Route
                path="/credits"
                element={
                  <ProtectedRoute>
                    <Credits />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/community"
                element={
                  <ProtectedRoute>
                    <Community />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
};

export default App;
