import { useEffect, useState } from "react";
import moment from "moment";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import { assets } from "../assets/assets";

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
    <div className="my-4 overflow-hidden rounded-[20px] border border-white/10 bg-[#111827]">
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

  useEffect(() => {
    Prism.highlightAll();
  }, [message.content]);

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/90 text-xs font-semibold text-slate-200">
          AI
        </div>
      )}

      <div
        className={`max-w-[min(88%,820px)] rounded-[24px] px-4 py-4 shadow-sm transition-all sm:px-5 ${
          isUser
            ? "rounded-tr-md bg-blue-500 text-white shadow-blue-500/10"
            : "app-card rounded-tl-md text-slate-100"
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

        <div className={`mt-3 flex items-center gap-2 text-xs ${isUser ? "text-blue-100/80" : "text-slate-400"}`}>
          {!isUser && <img src={assets.logo} alt="" className="h-4 w-4 rounded" />}
          <span>{moment(message.timestamp).fromNow()}</span>
        </div>
      </div>

      {isUser && (
        <img
          src={assets.user_icon}
          className="mt-1 h-10 w-10 shrink-0 rounded-2xl border border-white/10 bg-slate-900/90 p-1.5"
          alt="User avatar"
        />
      )}
    </div>
  );
};

export default Message;
