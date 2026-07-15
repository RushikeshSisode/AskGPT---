import { useEffect, useRef } from "react";

const iconButtonClass =
  "flex h-9 w-9 items-center justify-center rounded-full text-[var(--app-text-soft)] transition hover:bg-[var(--subtle-bg)] hover:text-[var(--app-text)]";

const ChatInput = ({
  value,
  onChange,
  onSubmit,
  disabled,
  mode,
  setMode,
  isPublished,
  setIsPublished,
}) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "0px";
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 220)}px`;
  }, [value]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit(event);
    }
  };

  return (
    <div>
      <div className="composer overflow-hidden rounded-[26px] border border-[var(--app-border-strong)] bg-[var(--composer-bg)] shadow-lg">
      <div className="flex flex-wrap items-center gap-1 px-3 pt-2">
        <button
          type="button"
          onClick={() => setMode("text")}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
            mode === "text" ? "bg-[var(--active-bg)] text-[var(--app-text)]" : "text-[var(--app-text-soft)] hover:bg-[var(--subtle-bg)]"
          }`}
        >
          Text
        </button>
        <button
          type="button"
          onClick={() => setMode("image")}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
            mode === "image" ? "bg-[var(--active-bg)] text-[var(--app-text)]" : "text-[var(--app-text-soft)] hover:bg-[var(--subtle-bg)]"
          }`}
        >
          Image
        </button>

        {mode === "image" && (
          <label className="ml-auto inline-flex items-center gap-2 px-2 text-xs text-[var(--app-text-soft)]">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(event) => setIsPublished(event.target.checked)}
              className="h-4 w-4 rounded border-white/10 bg-slate-900"
            />
            Publish to community
          </label>
        )}
      </div>

      <div className="px-3 pb-2">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={mode === "image" ? "Describe the image you want..." : "Message AskGPT..."}
          className="min-h-[46px] w-full bg-transparent px-1 py-3 text-[15px] leading-6 text-[var(--app-text)] outline-none placeholder:text-[var(--app-text-soft)]"
          aria-label={mode === "image" ? "Image prompt input" : "Chat message input"}
        />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button type="button" className={iconButtonClass} aria-label="Attach file">
              <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5" stroke="currentColor">
                <path d="M12 5v14M5 12h14" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
            <button type="button" className={iconButtonClass} aria-label="Upload image">
              <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5" stroke="currentColor">
                <path
                  d="M4 16.5V7.8A1.8 1.8 0 015.8 6h12.4A1.8 1.8 0 0120 7.8v8.4A1.8 1.8 0 0118.2 18H5.8A1.8 1.8 0 014 16.2Z"
                  strokeWidth="1.6"
                />
                <path d="m8 14 2.5-2.5L14 15l2-2 2 2" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="9" cy="9.5" r="1.1" fill="currentColor" stroke="none" />
              </svg>
            </button>
            <button type="button" className={iconButtonClass} aria-label="Voice input">
              <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5" stroke="currentColor">
                <path
                  d="M12 4a2.5 2.5 0 0 1 2.5 2.5v5a2.5 2.5 0 0 1-5 0v-5A2.5 2.5 0 0 1 12 4Z"
                  strokeWidth="1.6"
                />
                <path d="M7.5 10.5a4.5 4.5 0 1 0 9 0M12 15v5M9 20h6" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <button
            type="submit"
            disabled={disabled || !value.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--app-text)] text-[var(--chat-bg)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label={mode === "image" ? "Generate image" : "Send message"}
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor">
              <path d="M12 19V5M6.5 10.5 12 5l5.5 5.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      </div>

      <p className="mt-2 text-center text-[11px] text-[var(--app-text-soft)]">
        AskGPT can make mistakes. Check important information.
      </p>
    </div>
  );
};

export default ChatInput;
