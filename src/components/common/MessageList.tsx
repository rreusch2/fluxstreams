import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator'; // Import TypingIndicator
import { Message } from './ChatWidget'; // Assuming Message type is exported from ChatWidget

interface MessageListProps {
  messages: Message[];
  isTyping: boolean; // New prop
}

const MessageList: React.FC<MessageListProps> = ({ messages, isTyping }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]); // Also scroll when typing indicator appears/disappears

  return (
    <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-900/50 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50">
      {messages.map((msg, index) => (
        <MessageItem key={index} message={msg} />
      ))}
      {isTyping && <TypingIndicator />} {/* Render TypingIndicator here */}
      <div ref={messagesEndRef} /> {/* This empty div is the target for scrolling */}
    </div>
  );
};

export default MessageList;