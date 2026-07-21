const TypingIndicator = ({ mode }) => {
  return (
    <div className="py-2 text-sm text-[var(--app-text-soft)]">
      <div className="flex items-center gap-2">
        <div className="flex gap-1.5">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--app-text-soft)] [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--app-text-soft)] [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--app-text-soft)]" />
        </div>
        <span>{mode === "image" ? "Generating image..." : "Thinking..."}</span>
      </div>
    </div>
  );
};

export default TypingIndicator;
