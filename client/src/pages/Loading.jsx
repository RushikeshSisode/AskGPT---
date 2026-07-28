import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Loading = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate(user ? "/" : "/login");
    }, 1200);

    return () => clearTimeout(timeout);
  }, [navigate, user]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--app-bg)] px-6">
      <div className="surface-card w-full max-w-sm rounded-2xl px-8 py-10 text-center">
        <div className="mx-auto h-12 w-12 animate-pulse rounded-2xl bg-[var(--subtle-bg)]" />
        <p className="mt-5 text-sm font-medium text-[var(--app-text)]">Preparing your workspace</p>
        <p className="mt-2 text-sm text-[var(--app-text-soft)]">
          Loading chats, credits, and recent activity.
        </p>
        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-[var(--subtle-bg)]">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-[var(--app-primary)]" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
