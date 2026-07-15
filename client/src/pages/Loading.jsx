import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Loading = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate(user ? "/" : "/login");
    }, 1500);

    return () => clearTimeout(timeout);
  }, [navigate, user]);

  return (
    <div className="flex h-screen w-full items-center justify-center px-6">
      <div className="glass-panel flex w-full max-w-sm flex-col items-center rounded-[32px] px-8 py-10 text-center">
        <div className="app-skeleton h-14 w-14 rounded-3xl" />
        <div className="app-skeleton mt-6 h-4 w-28 rounded-full" />
        <div className="app-skeleton mt-3 h-3 w-44 rounded-full" />
      </div>
    </div>
  );
};

export default Loading;
