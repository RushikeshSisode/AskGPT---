import { useEffect, useRef } from "react";

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
      <div className="border border-[var(--app-border)] bg-[var(--composer-bg)]">
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--app-border)] px-3 py-2">
          <button
            type="button"
            onClick={() => setMode("text")}
            className={`border px-3 py-1 text-xs ${
              mode === "text"
                ? "border-[var(--app-border-strong)] bg-[var(--active-bg)] text-[var(--app-text)]"
                : "border-[var(--app-border)] text-[var(--app-text-soft)]"
            }`}
          >
            Text
          </button>
          <button
            type="button"
            onClick={() => setMode("image")}
            className={`border px-3 py-1 text-xs ${
              mode === "image"
                ? "border-[var(--app-border-strong)] bg-[var(--active-bg)] text-[var(--app-text)]"
                : "border-[var(--app-border)] text-[var(--app-text-soft)]"
            }`}
          >
            Image
          </button>

          {mode === "image" && (
            <label className="ml-auto inline-flex items-center gap-2 text-xs text-[var(--app-text-soft)]">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(event) => setIsPublished(event.target.checked)}
                className="h-4 w-4"
              />
              Publish
            </label>
          )}
        </div>

        <div className="p-3">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={mode === "image" ? "Describe the image you want..." : "Message AskGPT..."}
          className="min-h-[46px] w-full bg-transparent py-2 text-[15px] leading-6 text-[var(--app-text)] outline-none placeholder:text-[var(--app-text-soft)]"
          aria-label={mode === "image" ? "Image prompt input" : "Chat message input"}
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={disabled || !value.trim()}
            className="bg-[var(--app-primary)] px-4 py-2 text-sm text-[var(--app-primary-text)] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={mode === "image" ? "Generate image" : "Send message"}
          >
            {mode === "image" ? "Generate" : "Send"}
          </button>
        </div>
      </div>
      </div>

      <p className="mt-2 text-xs text-[var(--app-text-soft)]">Responses can be incorrect.</p>
    </div>
  );
};

export default ChatInput;
