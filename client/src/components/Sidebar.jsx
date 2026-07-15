import { useMemo, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/apiBaseUrl";
import { useAppContext } from "../context/AppContext";

const navItems = [
  {
    label: "Community",
    path: "/community",
    icon: (
      <path
        d="M4 7.8A1.8 1.8 0 0 1 5.8 6h12.4A1.8 1.8 0 0 1 20 7.8v8.4a1.8 1.8 0 0 1-1.8 1.8H5.8A1.8 1.8 0 0 1 4 16.2Z M8 14l2.5-2.5L14 15l2-2 2 2"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "Upgrade",
    path: "/credits",
    icon: (
      <path
        d="M8 6h8l4 5-8 7-8-7 4-5Z M8 6l4 12L16 6"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

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
  const [isCollapsed, setIsCollapsed] = useState(false);

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
        className={`fixed inset-0 z-30 bg-slate-950/55 backdrop-blur-sm transition md:hidden ${
          isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeSidebar}
      />

      <aside
        className={`chat-sidebar fixed inset-y-0 left-0 z-40 flex h-screen flex-col border-r border-[var(--app-border)] bg-[var(--sidebar-bg)] px-2 py-2 transition-all duration-200 md:static md:inset-auto ${
          isCollapsed ? "w-[68px]" : "w-[260px]"
        } ${isMenuOpen ? "translate-x-0" : "-translate-x-[110%] md:translate-x-0"}`}
      >
        <div className="mb-2 flex items-center justify-between gap-1 p-1">
          <button
            type="button"
            onClick={() => handleMenuClick("/")}
            className={`flex items-center gap-3 rounded-[18px] px-2 py-2 text-left transition hover:bg-white/5 ${
              isCollapsed ? "w-full justify-center" : ""
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--app-text)] text-[var(--sidebar-bg)]">
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor">
                <path d="M12 3.75A8.25 8.25 0 1 0 20.25 12" strokeWidth="1.8" strokeLinecap="round" />
                <path
                  d="M14.7 6.6a3.9 3.9 0 0 1 3.6 3.9c0 2.6-1.9 4.2-4.1 5.5l-2.2 1.2a3.4 3.4 0 0 1-4.9-3.1c0-1.7.9-3.1 2.4-3.9l2.1-1.2a2.1 2.1 0 0 0 1.1-1.9c0-.9.7-1.6 1.6-1.6h.4Z"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {!isCollapsed && (
              <div>
                <p className="text-sm font-semibold text-[var(--app-text)]">AskGPT</p>
              </div>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCollapsed((value) => !value)}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden h-9 w-9 items-center justify-center rounded-lg text-[var(--app-text-soft)] transition hover:bg-[var(--subtle-bg)] hover:text-[var(--app-text)] md:flex"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5" stroke="currentColor">
                <path d="M15 6l-6 6 6 6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              type="button"
              onClick={closeSidebar}
              className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/8 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white md:hidden"
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
          className={`mb-3 flex items-center gap-2 rounded-lg border border-[var(--app-border-strong)] px-3 py-2.5 text-sm font-medium text-[var(--app-text)] transition hover:bg-[var(--subtle-bg)] ${
            isCollapsed ? "justify-center px-0" : "w-full"
          }`}
        >
          <span className="text-base">+</span>
          {!isCollapsed && "New Chat"}
        </button>

        {!isCollapsed && (
          <div className="mb-4">
            <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-[var(--app-text-soft)] hover:bg-[var(--subtle-bg)]">
              <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5 text-slate-500" stroke="currentColor">
                <path
                  d="m21 21-4.35-4.35M10.75 18a7.25 7.25 0 1 1 0-14.5 7.25 7.25 0 0 1 0 14.5Z"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="text"
                placeholder="Search conversations"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto pr-1">
          {!isCollapsed ? (
            groupedChats.length > 0 ? (
              groupedChats.map(([label, items]) => (
                <div key={label} className="mb-5">
                  <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                    {label}
                  </p>
                  <div className="space-y-2">
                    {items.map((chat) => {
                      const isActive = selectedChat?._id === chat._id;
                      return (
                        <button
                          key={chat._id}
                          type="button"
                          onClick={() => {
                            setSelectedChat(chat);
                            navigate("/");
                            closeSidebar();
                          }}
                          className={`group flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left transition ${
                            isActive
                              ? "bg-[var(--active-bg)]"
                              : "hover:bg-[var(--subtle-bg)]"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-normal text-[var(--app-text)]">
                              {chat.chatname || "New Chat"}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              deleteChat(chat._id);
                            }}
                            className="mt-1 hidden rounded-xl border border-white/8 bg-white/5 p-2 text-slate-500 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300 group-hover:block"
                            aria-label="Delete conversation"
                          >
                            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor">
                              <path
                                d="M4 7h16M10 11v5M14 11v5M6.5 7l1 11A2 2 0 0 0 9.5 20h5a2 2 0 0 0 2-2l1-11M9 7V4.8A.8.8 0 0 1 9.8 4h4.4a.8.8 0 0 1 .8.8V7"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.03] px-4 py-5 text-sm text-slate-500">
                No conversations yet. Start a new chat to build your history.
              </div>
            )
          ) : (
            <div className="flex flex-col gap-2">
              {filteredChats.slice(0, 8).map((chat) => (
                <button
                  key={chat._id}
                  type="button"
                  onClick={() => {
                    setSelectedChat(chat);
                    navigate("/");
                    closeSidebar();
                  }}
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-xs font-medium transition ${
                    selectedChat?._id === chat._id
                      ? "border-blue-400/35 bg-blue-500/15 text-blue-100"
                      : "border-white/8 bg-white/[0.03] text-slate-400 hover:bg-white/[0.07]"
                  }`}
                  title={chat.chatname}
                >
                  {chat.chatname?.slice(0, 1)?.toUpperCase() || "N"}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-3 space-y-2 border-t border-white/8 pt-3">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleMenuClick(item.path)}
              className={`group flex w-full items-center gap-3 rounded-[20px] px-3 py-3 text-sm text-slate-300 transition hover:bg-white/[0.05] hover:text-white ${
                isCollapsed ? "justify-center px-0" : ""
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" stroke="currentColor">
                {item.icon}
              </svg>
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`group flex w-full items-center gap-3 rounded-[20px] px-3 py-3 text-sm text-slate-300 transition hover:bg-white/[0.05] hover:text-white ${
              isCollapsed ? "justify-center px-0" : ""
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" stroke="currentColor">
              <path
                d="M12 3v2.5M12 18.5V21M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M3 12h2.5M18.5 12H21M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <circle cx="12" cy="12" r="3.2" strokeWidth="1.6" />
            </svg>
            {!isCollapsed && <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>}
          </button>
        </div>

        <div className={`mt-3 rounded-[22px] border border-white/8 bg-white/[0.04] p-3 ${isCollapsed ? "px-2" : ""}`}>
          {isCollapsed ? (
            <button
              type="button"
              onClick={logout}
              className="flex h-10 w-full items-center justify-center rounded-2xl bg-slate-950/70 text-slate-300 transition hover:bg-slate-900"
              aria-label="Log out"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5" stroke="currentColor">
                <path d="M15 17l5-5-5-5M20 12H9M11 19H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15 text-sm font-semibold text-blue-100">
                {user?.name?.slice(0, 1)?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{user?.name}</p>
                <p className="truncate text-xs text-slate-500">{user?.email || "Starter plan"}</p>
              </div>
              <button
                type="button"
                onClick={logout}
                className="rounded-2xl border border-white/8 bg-slate-950/70 p-2.5 text-slate-400 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300"
                aria-label="Log out"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5" stroke="currentColor">
                  <path d="M15 17l5-5-5-5M20 12H9M11 19H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
