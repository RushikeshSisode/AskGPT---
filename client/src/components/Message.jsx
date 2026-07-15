import { useEffect, useState } from "react";
import moment from "moment";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

Prism.manual = true;

const CodeBlock = ({ inline, className, children, ...props }) => {
  const [copied, setCopied] = useState(false);
  const codeText = String(children).replace(/\n$/, "");
  const match = /language-(\w+)/.exec(className || "");
  const language = match?.[1] || "code";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  if (inline) {
    return (
      <code className="rounded-full border border-white/10 bg-slate-950/70 px-2 py-1 text-[13px] text-blue-200">
        {children}
      </code>
    );
  }

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-[var(--app-border)] bg-[#0d0d0d]">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2.5">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 transition hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-sm text-slate-100">
        <code className={match ? `language-${language}` : className} {...props}>
          {codeText}
        </code>
      </pre>
    </div>
  );
};

const Message = ({ message }) => {
  const isUser = message.role === "user";
  const userInitial = message.role === "user" ? "U" : "AI";

  useEffect(() => {
    Prism.highlightAll();
  }, [message.content]);

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--app-border-strong)] bg-[var(--subtle-bg)] text-[11px] font-semibold text-[var(--app-text)]">
          A
        </div>
      )}

      <div
        className={`max-w-[min(88%,820px)] text-[var(--app-text)] ${
          isUser
            ? "rounded-[20px] bg-[var(--user-message-bg)] px-4 py-2.5"
            : "min-w-0 flex-1 px-1 py-1"
        }`}
      >
        {message.isImage ? (
          <img
            src={message.content}
            className="max-h-[26rem] w-full rounded-[18px] border border-white/10 object-cover"
            alt="Generated output"
          />
        ) : (
          <div className="markdown-body text-[15px] leading-7">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: CodeBlock,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {isUser && <div className="mt-1 text-right text-[10px] text-[var(--app-text-soft)]">{moment(message.timestamp).fromNow()}</div>}
      </div>

    </div>
  );
};

export default Message;
