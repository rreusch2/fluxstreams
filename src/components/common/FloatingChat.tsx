import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import ChatWidget from './ChatWidget';

const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Bubble Trigger */}
      {!isOpen && (
        <div 
          className="fixed bottom-6 right-6 z-50 cursor-pointer group"
          onClick={toggleChat}
        >
          <div className="relative">
            {/* Main chat bubble */}
            <div className="bg-gradient-to-r from-cyan-500 to-teal-600 rounded-full p-4 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-110">
              <MessageCircle className="h-7 w-7 text-white" />
            </div>
            
            {/* Notification dot */}
            <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
              <div className="bg-red-500 rounded-full w-2 h-2 animate-pulse"></div>
            </div>
            
            {/* Hover tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Chat with Otto
              <div className="absolute top-full right-4 border-4 border-transparent border-t-slate-800"></div>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 h-[700px] w-[480px] transition-all duration-300">
          <div className="bg-slate-800/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-700 h-full flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-700 bg-slate-800/90 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white font-semibold text-lg">Otto - AI Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleChat}
                  className="text-slate-400 hover:text-white transition-colors p-2 rounded hover:bg-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Chat Content - Full Height with proper flex */}
            <div className="flex-1 min-h-0">
              <ChatWidget />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChat; 