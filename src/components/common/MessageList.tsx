import React from 'react';
import MessageItem from './MessageItem';
import { Message } from './ChatWidget'; // Assuming Message type is exported from ChatWidget

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-900/50 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50">
      {messages.map((msg, index) => (
        <MessageItem key={index} message={msg} />
      ))}
      {/* Typing indicator and scroll ref are handled in ChatWidget.tsx */}
    </div>
  );
};

export default MessageList; 