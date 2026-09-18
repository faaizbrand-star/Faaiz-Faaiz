import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  children: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, children }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-2.5 rounded-lg border border-slate-300 dark:border-white/15 overflow-hidden bg-slate-900 dark:bg-black/60 shadow-inner">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/80 dark:bg-white/[0.04] border-b border-slate-700 dark:border-white/10 text-[11px] font-spacemono text-slate-300 dark:text-gray-400">
        <span className="uppercase text-amber-400 dark:text-[#F2D231]/80 tracking-wider font-bold">
          {language || 'code'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-slate-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
          title="Copy code snippet"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 text-[10px]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span className="text-[10px]">Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-3 overflow-x-auto font-mono text-xs text-emerald-400 dark:text-emerald-300 leading-relaxed scrollbar-thin scrollbar-thumb-slate-700 dark:scrollbar-thumb-white/20">
        <pre>
          <code>{children}</code>
        </pre>
      </div>
    </div>
  );
};

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={`markdown-content leading-relaxed text-[13px] sm:text-sm font-inter text-slate-800 dark:text-gray-200 ${className}`}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const contentStr = String(children);
            const isMultiline = contentStr.includes('\n');

            if (!match && !isMultiline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-slate-200 text-amber-800 dark:bg-black/60 dark:text-[#F2D231] font-mono text-[12px] border border-slate-300 dark:border-white/10"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock language={match ? match[1] : undefined}>
                {contentStr.replace(/\n$/, '')}
              </CodeBlock>
            );
          },
          pre({ children }) {
            return <>{children}</>;
          },
          strong({ children }) {
            return <strong className="font-bold text-slate-900 dark:text-white dark:text-[#F2D231]">{children}</strong>;
          },
          b({ children }) {
            return <strong className="font-bold text-slate-900 dark:text-white dark:text-[#F2D231]">{children}</strong>;
          },
          ul({ children }) {
            return <ul className="list-disc list-outside ml-4 my-2 space-y-1 marker:text-amber-600 dark:marker:text-[#F2D231]">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal list-outside ml-4 my-2 space-y-1 marker:text-amber-600 dark:marker:text-[#F2D231]">{children}</ol>;
          },
          li({ children }) {
            return <li className="pl-0.5 leading-relaxed text-slate-800 dark:text-gray-200">{children}</li>;
          },
          h1({ children }) {
            return <h2 className="text-base font-bold font-syne text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-1 mt-3 mb-2">{children}</h2>;
          },
          h2({ children }) {
            return <h3 className="text-sm sm:text-base font-bold font-syne text-slate-900 dark:text-white mt-2.5 mb-1.5">{children}</h3>;
          },
          h3({ children }) {
            return <h4 className="text-xs sm:text-sm font-bold font-syne text-amber-700 dark:text-[#F2D231] mt-2 mb-1">{children}</h4>;
          },
          p({ children }) {
            return <p className="leading-relaxed my-1.5 text-slate-800 dark:text-gray-200 first:mt-0 last:mb-0">{children}</p>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-2 border-amber-500 dark:border-[#F2D231] pl-3 py-1 my-2 text-slate-700 dark:text-gray-300 italic bg-slate-100 dark:bg-black/20 rounded-r">
                {children}
              </blockquote>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-2.5 rounded border border-slate-200 dark:border-white/10">
                <table className="min-w-full text-xs border-collapse divide-y divide-slate-200 dark:divide-white/10">
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="bg-slate-100 dark:bg-black/50 px-2.5 py-1.5 text-left font-spacemono font-semibold text-slate-900 dark:text-[#F2D231]">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="px-2.5 py-1.5 text-slate-800 dark:text-gray-300 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-black/20">
                {children}
              </td>
            );
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-amber-600 dark:text-[#F2D231] hover:underline underline-offset-2 font-medium"
              >
                {children}
              </a>
            );
          }
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};
