import { useMemo, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/apiBaseUrl";
import { useAppContext } from "../context/AppContext";

const groupChats = (chats) => {
  const groups = {
    Today: [],
    Yesterday: [],
    "Previous 7 Days": [],
    Earlier: [],
  };

  chats.forEach((chat) => {
    const updatedAt = moment(chat.updatedAt);
    if (updatedAt.isSame(moment(), "day")) {
      groups.Today.push(chat);
    } else if (updatedAt.isSame(moment().subtract(1, "day"), "day")) {
      groups.Yesterday.push(chat);
    } else if (updatedAt.isAfter(moment().subtract(7, "days"))) {
      groups["Previous 7 Days"].push(chat);
    } else {
      groups.Earlier.push(chat);
    }
  });

  return Object.entries(groups).filter(([, items]) => items.length > 0);
};

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const navigate = useNavigate();
  const {
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    theme,
    setTheme,
    user,
    createNewChat,
    logout,
  } = useAppContext();

  const [search, setSearch] = useState("");

  const filteredChats = useMemo(
    () => chats.filter((chat) => chat.chatname?.toLowerCase().includes(search.toLowerCase())),
    [chats, search]
  );

  const groupedChats = useMemo(() => groupChats(filteredChats), [filteredChats]);

  const closeSidebar = () => setIsMenuOpen(false);

  const handleMenuClick = (path) => {
    navigate(path);
    closeSidebar();
  };

  const deleteChat = async (chatId) => {
    if (!chatId) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/chats/${chatId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!data.success) return;

      setChats((prev) => prev.filter((chat) => chat._id !== chatId));
      if (selectedChat?._id === chatId) {
        setSelectedChat(null);
      }
    } catch (error) {
      console.error("Delete chat failed", error);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/40 transition md:hidden ${
          isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeSidebar}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-[280px] flex-col border-r border-[var(--app-border)] bg-[var(--sidebar-bg)] transition md:static md:inset-auto ${
          isMenuOpen ? "translate-x-0" : "-translate-x-[110%] md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[var(--app-border)] p-3">
          <button type="button" onClick={() => handleMenuClick("/")} className="text-left text-base font-medium text-[var(--app-text)]">
            AskGPT
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-xl border border-[var(--app-border)] px-3 py-1 text-sm text-[var(--app-text)]"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>

            <button
              type="button"
              onClick={closeSidebar}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--app-border)] text-[var(--app-text)] md:hidden"
              aria-label="Close sidebar"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5" stroke="currentColor">
                <path d="M6 6l12 12M18 6 6 18" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={async () => {
            await createNewChat();
            navigate("/");
            closeSidebar();
          }}
          className="m-3 rounded-xl bg-[var(--app-primary)] px-3 py-2 text-left text-sm text-[var(--app-primary-text)]"
        >
          New Chat
        </button>

        <div className="px-3 pb-3">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-[var(--app-border)] bg-transparent px-3 py-2 text-sm text-[var(--app-text)] outline-none placeholder:text-[var(--app-text-soft)]"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-3">
          {groupedChats.length > 0 ? (
            groupedChats.map(([label, items]) => (
              <div key={label} className="mb-4">
                <p className="mb-2 text-xs text-[var(--app-text-soft)]">{label}</p>
                <div className="space-y-1">
                  {items.map((chat) => {
                    const isActive = selectedChat?._id === chat._id;

                    return (
                      <div key={chat._id} className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedChat(chat);
                            navigate("/");
                            closeSidebar();
                          }}
                          className={`min-w-0 flex-1 rounded-xl border px-3 py-2 text-left text-sm text-[var(--app-text)] ${
                            isActive
                              ? "border-[var(--app-border-strong)] bg-[var(--active-bg)]"
                              : "border-transparent hover:border-[var(--app-border)] hover:bg-[var(--subtle-bg)]"
                          }`}
                        >
                          <span className="block truncate">{chat.chatname || "New Chat"}</span>
                          <span className="mt-1 block text-xs text-[var(--app-text-soft)]">
                            {moment(chat.updatedAt).fromNow()}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteChat(chat._id)}
                          className="rounded-xl border border-[var(--app-border)] px-3 py-2 text-xs text-[var(--app-text-soft)] hover:bg-[var(--subtle-bg)]"
                          aria-label="Delete conversation"
                        >
                          Delete
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-[var(--app-text-soft)]">No chats yet.</p>
          )}
        </div>

        <div className="border-t border-[var(--app-border)] p-3">
          <p className="truncate text-sm text-[var(--app-text)]">{user?.name}</p>
          <p className="mb-3 truncate text-xs text-[var(--app-text-soft)]">{user?.email}</p>
          <button
            type="button"
            onClick={logout}
            className="w-full rounded-xl border border-[var(--app-border)] px-3 py-2 text-sm text-[var(--app-text)] hover:bg-[var(--subtle-bg)]"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
