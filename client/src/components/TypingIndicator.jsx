const TypingIndicator = ({ mode }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/80 text-xs font-semibold text-slate-200">
        AI
      </div>
      <div className="app-card max-w-md rounded-[22px] rounded-tl-md px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.3s]" />
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.15s]" />
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-blue-400" />
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
