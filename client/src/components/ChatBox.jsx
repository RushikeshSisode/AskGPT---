import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import ChatInput from "./ChatInput";
import EmptyState from "./EmptyState";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";
import API_BASE_URL from "../config/apiBaseUrl";

const ChatBox = () => {
  const { selectedChat, setSelectedChat, setChats, createNewChat, user } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("text");
  const [inputText, setInputText] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages || []);
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSuggestion = (suggestion) => {
    setInputText(suggestion);
  };

  const handleSend = async (event) => {
    event.preventDefault();
    if (!inputText.trim()) return;

    if (!selectedChat) {
      await createNewChat();
      return;
    }

    const token = localStorage.getItem("token");
    const userPrompt = inputText;
    const userMessage = {
      role: "user",
      content: userPrompt,
      timestamp: Date.now(),
      isImage: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    try {
      const url =
        mode === "image"
          ? `${API_BASE_URL}/api/chats/${selectedChat._id}/image`
          : `${API_BASE_URL}/api/chats/${selectedChat._id}/message`;

      const payload = mode === "image" ? { prompt: userPrompt, isPublished } : { prompt: userPrompt };

      const response = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const reply = response.data.reply;
        setMessages((prev) => [...prev, reply]);

        if (selectedChat.chatname === "New Chat" && selectedChat.messages?.length === 0) {
          const newTitle = userPrompt.split(" ").slice(0, 6).join(" ").slice(0, 30);
          const updatedChat = {
            ...selectedChat,
            chatname: newTitle,
            messages: [userMessage, reply],
          };

          setSelectedChat(updatedChat);
          setChats((prev) =>
            prev.map((chat) => (chat._id === selectedChat._id ? { ...chat, chatname: newTitle } : chat))
          );
        }
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        (mode === "image"
          ? "Image generation failed. Please try again."
          : "Text reply failed. Please try again.");

      setMessages((prev) => prev.filter((message) => message.timestamp !== userMessage.timestamp));
      toast.error(errorMessage);
      console.error("Message Send Error:", error?.response?.data || error.message);
    } finally {
      setLoading(false);
      setIsPublished(false);
    }
  };

  return (
    <div className="flex h-full flex-col px-3 pb-3 pt-3 md:px-4 md:pb-4 md:pt-4">
      <div className="glass-panel flex min-h-0 flex-1 flex-col overflow-hidden rounded-[32px]">
        <div className="border-b border-white/8 px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
                Workspace
              </p>
              <h2 className="mt-1 text-xl font-semibold text-white">
                {selectedChat?.chatname || "New conversation"}
              </h2>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.04] px-3 py-2 text-xs text-slate-400">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              {loading ? "Generating response" : `Signed in as ${user?.name || "User"}`}
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          {messages.length === 0 ? (
            <EmptyState onSelectSuggestion={handleSuggestion} />
          ) : (
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
              {messages.map((message, index) => (
                <Message key={`${message.timestamp}-${index}`} message={message} />
              ))}
              {loading && <TypingIndicator mode={mode} />}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-white/8 bg-slate-950/40 px-4 py-4 sm:px-6">
          <div className="mx-auto w-full max-w-4xl">
            <form onSubmit={handleSend}>
              <ChatInput
                value={inputText}
                onChange={setInputText}
                onSubmit={handleSend}
                disabled={loading}
                mode={mode}
                setMode={setMode}
                isPublished={isPublished}
                setIsPublished={setIsPublished}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
