import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center self-start px-4 py-2 mb-2">
      <div className="flex items-center space-x-1.5 bg-slate-700 p-3 rounded-lg shadow">
        <span className="text-sm text-slate-300 mr-1 italic">AI is typing</span>
        <span className="h-2 w-2 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="h-2 w-2 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="h-2 w-2 bg-teal-400 rounded-full animate-bounce"></span>
      </div>
    </div>
  );
};

export default TypingIndicator; 