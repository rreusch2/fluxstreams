import React from 'react';
import { Message } from './ChatWidget'; // Assuming Message type is exported from ChatWidget
import ReactMarkdown from 'react-markdown'

interface MessageItemProps {
  message: Message;
}

// Type definition for component props in ReactMarkdown
type MarkdownComponentProps = {
  children?: React.ReactNode;
  [key: string]: any;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const alignmentClass = isUser ? 'self-end' : 'self-start';
  const bubbleColorClass = isUser 
    ? 'bg-teal-600 text-white' 
    : 'bg-slate-700 text-slate-100';
  const borderRadiusClass = isUser 
    ? 'rounded-tr-lg rounded-bl-lg rounded-tl-lg' 
    : 'rounded-tl-lg rounded-br-lg rounded-tr-lg';

  // Define Markdown components with proper TypeScript types
  const markdownComponents = {
    p: ({ children }: MarkdownComponentProps) => (
      <p className="mb-1.5 last:mb-0 text-sm md:text-base">{children}</p>
    ),
    strong: ({ children }: MarkdownComponentProps) => (
      <span className="font-bold text-teal-300">{children}</span>
    ),
    em: ({ children }: MarkdownComponentProps) => (
      <span className="italic text-slate-200">{children}</span>
    ),
    h1: ({ children }: MarkdownComponentProps) => (
      <h1 className="text-lg font-bold mb-1.5 text-teal-300">{children}</h1>
    ),
    h2: ({ children }: MarkdownComponentProps) => (
      <h2 className="text-base font-bold mb-1 text-teal-300">{children}</h2>
    ),
    h3: ({ children }: MarkdownComponentProps) => (
      <h3 className="text-sm font-semibold mb-1 text-teal-300">{children}</h3>
    ),
    ul: ({ children }: MarkdownComponentProps) => (
      <ul className="list-disc ml-4 mb-1.5 space-y-0.5 text-sm md:text-base">{children}</ul>
    ),
    ol: ({ children }: MarkdownComponentProps) => (
      <ol className="list-decimal ml-4 mb-1.5 space-y-0.5 text-sm md:text-base">{children}</ol>
    ),
    li: ({ children }: MarkdownComponentProps) => (
      <li className="text-slate-100">{children}</li>
    ),
    a: ({ href, children }: MarkdownComponentProps & { href?: string }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-teal-400 hover:text-teal-300 underline"
      >
        {children}
      </a>
    ),
    code: ({ inline, className, children, ...props }: MarkdownComponentProps & { inline?: boolean }) => {
      return inline ? (
        <code className="bg-slate-800 px-1 py-0.5 rounded text-teal-200 font-mono text-xs md:text-sm" {...props}>
          {children}
        </code>
      ) : (
        <code className="block bg-slate-800/50 p-2 rounded-lg my-1.5 overflow-x-auto font-mono text-xs md:text-sm text-teal-200" {...props}>
        {children}
      </code>
      );
    },
    pre: ({ children }: MarkdownComponentProps) => (
      <pre className="bg-slate-800/50 p-2 rounded-lg my-1.5 overflow-x-auto text-sm">
        {children}
      </pre>
    ),
    blockquote: ({ children }: MarkdownComponentProps) => (
      <blockquote className="border-l-2 border-teal-400 pl-2 my-1.5 text-slate-300 italic text-sm">
        {children}
      </blockquote>
    ),
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[85%] md:max-w-[80%] p-3 rounded-xl shadow-md ${
          isUser
            ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white'
            : 'bg-slate-700/50 text-slate-100'
        }`}
      >
        {message.content && (
        <ReactMarkdown components={markdownComponents}>
          {message.content}
        </ReactMarkdown>
        )}
        {!message.content && message.isForm && (
          <div className="text-slate-300 italic">
            [Contact form will appear here]
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem; 