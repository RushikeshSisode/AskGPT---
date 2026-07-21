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
      <code className="rounded border border-[var(--app-border)] bg-[var(--subtle-bg)] px-2 py-0.5 text-[13px] text-[var(--app-text)]">
        {children}
      </code>
    );
  }

  return (
    <div className="my-4 overflow-hidden border border-[var(--app-border)] bg-[var(--subtle-bg)]">
      <div className="flex items-center justify-between border-b border-[var(--app-border)] px-4 py-2.5">
        <span className="text-xs uppercase text-[var(--app-text-soft)]">
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="border border-[var(--app-border)] px-3 py-1 text-xs text-[var(--app-text)] transition hover:bg-[var(--active-bg)]"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-sm text-[var(--app-text)]">
        <code className={match ? `language-${language}` : className} {...props}>
          {codeText}
        </code>
      </pre>
    </div>
  );
};

const Message = ({ message }) => {
  const isUser = message.role === "user";

  useEffect(() => {
    Prism.highlightAll();
  }, [message.content]);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[min(88%,820px)] text-[var(--app-text)] ${
          isUser
            ? "rounded-2xl border border-[var(--app-border)] bg-[var(--user-message-bg)] px-4 py-3"
            : "min-w-0 flex-1 rounded-2xl px-0 py-0"
        }`}
      >
        {message.isImage ? (
          <img
            src={message.content}
            className="max-h-[26rem] w-full rounded-2xl border border-[var(--app-border)] object-cover"
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

        <div className={`mt-2 text-[10px] text-[var(--app-text-soft)] ${isUser ? "text-right" : "text-left"}`}>
          {moment(message.timestamp).fromNow()}
        </div>
      </div>
    </div>
  );
};

export default Message;
