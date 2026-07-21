const suggestions = [
  "Explain React hooks with examples",
  "Debug this JavaScript function",
  "Create a portfolio landing page",
  "Write a professional resume summary",
];

const EmptyState = ({ onSelectSuggestion }) => {
  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center px-4 py-10 text-center">
      <h1 className="text-2xl font-medium text-[var(--app-text)]">AskGPT</h1>

      <div className="mt-8 grid w-full max-w-2xl gap-2 sm:grid-cols-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSelectSuggestion(suggestion)}
            className="border border-[var(--app-border)] bg-transparent px-4 py-3 text-left transition hover:bg-[var(--subtle-bg)]"
          >
            <p className="text-sm text-[var(--app-text)]">{suggestion}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;
