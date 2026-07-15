import { useEffect, useRef } from "react";

const iconButtonClass =
  "app-button app-button-secondary h-10 w-10 rounded-2xl border border-white/10 text-slate-300 hover:text-white";

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
    <div className="glass-panel rounded-[28px] p-3 sm:p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setMode("text")}
          className={`app-button rounded-full px-4 py-2 text-sm font-medium ${
            mode === "text" ? "app-button-primary" : "app-button-secondary"
          }`}
        >
          Text
        </button>
        <button
          type="button"
          onClick={() => setMode("image")}
          className={`app-button rounded-full px-4 py-2 text-sm font-medium ${
            mode === "image" ? "app-button-primary" : "app-button-secondary"
          }`}
        >
          Image
        </button>

        {mode === "image" && (
          <label className="ml-auto inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
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

      <div className="rounded-[24px] border border-white/8 bg-slate-950/60 px-3 py-3">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={mode === "image" ? "Describe the image you want..." : "Message AskGPT..."}
          className="min-h-[54px] w-full bg-transparent px-2 py-2 text-[15px] leading-7 text-slate-100 outline-none placeholder:text-slate-500"
          aria-label={mode === "image" ? "Image prompt input" : "Chat message input"}
        />

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
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
            className="app-button app-button-primary min-w-[132px] rounded-2xl px-5 py-3 text-sm font-semibold"
          >
            {disabled ? "Working..." : mode === "image" ? "Generate" : "Send"}
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor">
              <path d="M4 12h14M13 5l7 7-7 7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <p className="mt-3 px-1 text-xs text-slate-500">
        Press <span className="rounded bg-white/5 px-1.5 py-0.5 text-slate-300">Enter</span> to
        send and <span className="rounded bg-white/5 px-1.5 py-0.5 text-slate-300">Shift + Enter</span> for a new line.
      </p>
    </div>
  );
};

export default ChatInput;
