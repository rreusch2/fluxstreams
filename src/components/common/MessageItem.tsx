import React from 'react';
import { Message } from './ChatWidget'; // Assuming Message type is exported from ChatWidget

interface MessageItemProps {
  message: Message;
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

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full`}>
      <div 
        className={`max-w-[80%] md:max-w-[70%] p-3 md:p-3.5 text-sm md:text-base leading-relaxed ${alignmentClass} ${bubbleColorClass} ${borderRadiusClass} shadow-md break-words`}
      >
        {message.content}
      </div>
    </div>
  );
};

export default MessageItem; 