const TypingIndicator = ({ mode }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--app-border-strong)] bg-[var(--subtle-bg)] text-[11px] font-semibold text-[var(--app-text)]">
        A
      </div>
      <div className="max-w-md px-1 py-2">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--app-text-soft)] [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--app-text-soft)] [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--app-text-soft)]" />
          </div>
          <span className="text-sm text-slate-300">
            {mode === "image" ? "Generating image..." : "Thinking..."}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
