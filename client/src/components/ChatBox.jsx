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
    <div className="flex h-full min-w-0 flex-col bg-[var(--chat-bg)]">
      <div className="mx-4 mt-4 flex h-14 shrink-0 items-center justify-between rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] px-4 shadow-[var(--surface-shadow)] md:mx-6 md:px-6">
        <h2 className="truncate pl-11 text-sm font-medium text-[var(--app-text)] md:pl-0">
          {selectedChat?.chatname || "New Chat"}
        </h2>

        <span className="rounded-full bg-[var(--subtle-bg)] px-2.5 py-1 text-xs text-[var(--app-text-soft)]">
          {user?.name || "User"}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        {messages.length === 0 ? (
          <EmptyState onSelectSuggestion={handleSuggestion} />
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-7 py-2">
            {messages.map((message, index) => (
              <Message key={`${message.timestamp}-${index}`} message={message} />
            ))}
            {loading && <TypingIndicator mode={mode} />}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-[var(--app-border)] px-4 py-5 sm:px-6">
        <div className="mx-auto w-full max-w-3xl">
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
  );
};

export default ChatBox;
