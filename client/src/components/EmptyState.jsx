const suggestions = [
  "Explain React hooks with examples",
  "Debug this JavaScript function",
  "Create a portfolio landing page",
  "Write a professional resume summary",
  "Design a REST API structure",
  "Generate a cinematic image prompt",
];

const EmptyState = ({ onSelectSuggestion }) => {
  return (
    <div className="mx-auto flex h-full w-full max-w-4xl flex-col items-center justify-center px-4 py-10 text-center">
      <span className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-slate-300">
        AskGPT Workspace
      </span>
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        How can I help today?
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
        Ask questions, explore ideas, generate code, or create images with a workspace designed
        to feel calm, fast, and focused.
      </p>

      <div className="mt-10 grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSelectSuggestion(suggestion)}
            className="app-card rounded-[22px] px-5 py-5 text-left transition duration-200 hover:-translate-y-1 hover:border-white/20 hover:bg-slate-800/90"
          >
            <div className="mb-4 h-10 w-10 rounded-2xl bg-blue-500/12 p-2 text-blue-300">
              <svg viewBox="0 0 24 24" fill="none" className="h-full w-full" stroke="currentColor">
                <path
                  d="M12 5v14M5 12h14"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-100">{suggestion}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;
