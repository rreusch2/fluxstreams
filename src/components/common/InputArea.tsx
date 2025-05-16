import React from 'react';
import { Send } from 'lucide-react';

interface InputAreaProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isTyping: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ input, setInput, handleSubmit, isTyping }) => {
  return (
    <form 
      className="p-3 md:p-4 border-t border-slate-700 bg-slate-800/50 flex items-center gap-2"
      onSubmit={handleSubmit}
    >
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message to Reusch AI Assistant..."
        disabled={isTyping}
        className="flex-grow p-2.5 bg-slate-700/80 text-slate-100 rounded-lg border border-slate-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors placeholder-slate-400 text-sm md:text-base resize-none"
        rows={1}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent);
          }
        }}
      />
      <button 
        type="submit" 
        disabled={isTyping || !input.trim()}
        className="p-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-800"
        aria-label="Send message"
      >
        <Send size={20} />
      </button>
    </form>
  );
};

export default InputArea; 