const suggestions = [
  "Explain React hooks with examples",
  "Debug this JavaScript function",
  "Create a portfolio landing page",
  "Write a professional resume summary",
];

const EmptyState = ({ onSelectSuggestion }) => {
  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center px-4 py-10 text-center">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--app-border-strong)] bg-[var(--subtle-bg)] text-sm font-semibold text-[var(--app-text)]">A</div>
      <h1 className="max-w-2xl text-2xl font-semibold tracking-[-0.02em] text-[var(--app-text)] sm:text-3xl">
        What can I help with?
      </h1>

      <div className="mt-8 grid w-full max-w-2xl gap-2 sm:grid-cols-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSelectSuggestion(suggestion)}
            className="rounded-xl border border-[var(--app-border)] bg-transparent px-4 py-3 text-left transition hover:bg-[var(--subtle-bg)]"
          >
            <p className="text-sm text-[var(--app-text-soft)]">{suggestion}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;
