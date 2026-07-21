const TypingIndicator = ({ mode }) => {
  return (
    <div className="py-2 text-sm text-[var(--app-text-soft)]">
      <div className="inline-flex items-center gap-3 rounded-full border border-[var(--app-border)] bg-[var(--app-card)] px-4 py-2 shadow-[var(--surface-shadow)]">
        <div className="flex gap-1.5">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--app-text-soft)] [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--app-text-soft)] [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--app-text-soft)]" />
        </div>
        <span className="text-sm">{mode === "image" ? "Generating image..." : "Thinking..."}</span>
      </div>
    </div>
  );
};

export default TypingIndicator;
