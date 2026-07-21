const suggestions = [
  "Explain React hooks with examples",
  "Debug this JavaScript function",
  "Create a portfolio landing page",
  "Write a professional resume summary",
];

const EmptyState = ({ onSelectSuggestion }) => {
  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center px-4 py-12 text-center">
      <div className="rounded-full border border-[var(--app-border)] bg-[var(--subtle-bg)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--app-text-soft)]">
        Workspace
      </div>
      <h1 className="page-title mt-5 text-3xl font-medium text-[var(--app-text)]">Start a conversation</h1>
      <p className="mt-3 max-w-lg text-sm leading-7 text-[var(--app-text-soft)]">
        Ask a question, generate an image, or use one of the suggestions below.
      </p>

      <div className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSelectSuggestion(suggestion)}
            className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] px-4 py-4 text-left shadow-[var(--surface-shadow)] transition hover:bg-[var(--subtle-bg)]"
          >
            <p className="text-sm leading-6 text-[var(--app-text)]">{suggestion}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;
