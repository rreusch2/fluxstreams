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
    strong: ({children, ...props}: MarkdownComponentProps) => 
      <span className="font-bold text-teal-300" {...props}>{children}</span>,
    em: ({children, ...props}: MarkdownComponentProps) => 
      <span className="italic text-slate-200" {...props}>{children}</span>,
    li: ({children, ...props}: MarkdownComponentProps) => 
      <li className="ml-4 mb-1.5" {...props}>{children}</li>,
    ol: ({children, ...props}: MarkdownComponentProps) => 
      <ol className="list-decimal ml-4 my-2.5 pl-1" {...props}>{children}</ol>,
    ul: ({children, ...props}: MarkdownComponentProps) => 
      <ul className="list-disc ml-4 my-2.5 pl-1" {...props}>{children}</ul>,
    p: ({children, ...props}: MarkdownComponentProps) => 
      <p className="mb-3 last:mb-0" {...props}>{children}</p>,
    h3: ({children, ...props}: MarkdownComponentProps) => 
      <h3 className="text-lg font-semibold mb-2 mt-3 text-teal-300" {...props}>{children}</h3>,
    h4: ({children, ...props}: MarkdownComponentProps) => 
      <h4 className="text-base font-semibold mb-2 mt-2 text-teal-200" {...props}>{children}</h4>,
    a: ({children, href, ...props}: MarkdownComponentProps & {href?: string}) => 
      <a href={href} className="text-teal-300 underline hover:text-teal-200" target="_blank" rel="noopener noreferrer" {...props}>{children}</a>,
    code: ({children, ...props}: MarkdownComponentProps) => 
      <code className="bg-slate-800 px-1.5 py-0.5 rounded text-teal-200 font-mono text-sm" {...props}>{children}</code>,
    blockquote: ({children, ...props}: MarkdownComponentProps) => 
      <blockquote className="border-l-2 border-teal-400 pl-3 py-0.5 my-2 text-slate-300 italic" {...props}>{children}</blockquote>,
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full mb-4`}>
      <div 
        className={`max-w-[80%] md:max-w-[70%] p-3 md:p-4 text-sm md:text-base leading-relaxed ${alignmentClass} ${bubbleColorClass} ${borderRadiusClass} shadow-md break-words`}
      >
        <div className="markdown-content leading-relaxed">
          <ReactMarkdown components={markdownComponents}>
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default MessageItem; 