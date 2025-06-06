import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import ChatWidget from './ChatWidget';

const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isPeeking, setIsPeeking] = useState(false);
  const [peekType, setPeekType] = useState<'curious' | 'wave' | 'blink'>('curious');
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Peek animation logic
  useEffect(() => {
    if (isOpen || hasUserInteracted) return;

    // First peek after initial load (TESTING: 3-5 seconds)
    const initialPeekTimer = setTimeout(() => {
      triggerPeek();
    }, Math.random() * 2000 + 3000); // 3-5 seconds for testing

    // Subsequent peeks every 15-30 seconds (TESTING: much more frequent)
    const peekInterval = setInterval(() => {
      if (!isOpen && !hasUserInteracted) {
        triggerPeek();
      }
    }, Math.random() * 15000 + 15000); // 15-30 seconds for testing

    return () => {
      clearTimeout(initialPeekTimer);
      clearInterval(peekInterval);
    };
  }, [isOpen, hasUserInteracted]);

  const triggerPeek = () => {
    const peekTypes: Array<'curious' | 'wave'> = ['curious', 'wave'];
    const randomPeek = peekTypes[Math.floor(Math.random() * peekTypes.length)];
    
    setPeekType(randomPeek);
    setIsPeeking(true);
    
    // Duration based on peek type
    const duration = randomPeek === 'wave' ? 3000 : 2500;
    
    setTimeout(() => {
      setIsPeeking(false);
    }, duration);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setHasUserInteracted(true); // Stop peeking once user interacts
    setIsPeeking(false); // Hide peek if currently peeking
    
    // Prevent body scroll when chat is open on mobile
    if (isMobile) {
      document.body.style.overflow = !isOpen ? 'hidden' : 'auto';
    }
  };

  // Flux AI Character Component
  const FluxCharacter = () => (
    <div 
      className={`absolute transition-all duration-700 ease-out pointer-events-none ${
        isPeeking 
          ? '-top-3 opacity-100 transform translate-y-0' 
          : '-top-7 opacity-0 transform translate-y-4'
      }`}
      style={{ 
        right: '8px',
        zIndex: 60
      }}
    >
      {/* Flux Robot - Only showing top part peeking over */}
      <div className="relative">
        {/* Robot Head - Only top portion visible */}
        <div className="w-10 h-5 bg-gradient-to-br from-purple-500 via-indigo-500 to-purple-600 rounded-t-lg border-t-2 border-l-2 border-r-2 border-white shadow-xl relative overflow-hidden">
          {/* Head highlights and details */}
          <div className="absolute inset-0">
            {/* Top highlight */}
            <div className="absolute top-0.5 left-1 right-1 h-1 bg-white/25 rounded-sm"></div>
            
            {/* Side panels */}
            <div className="absolute left-0.5 top-0.5 bottom-0 w-0.5 bg-white/30 rounded-full"></div>
            <div className="absolute right-0.5 top-0.5 bottom-0 w-0.5 bg-white/30 rounded-full"></div>
            
            {/* Eyes - positioned higher since we're only showing top */}
            <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-2">
                {/* Left Eye */}
                <div className="w-1.5 h-1.5 bg-white rounded-full shadow-inner relative">
                  {/* Eye pupils for more character */}
                  <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-slate-700 rounded-full"></div>
                </div>
                {/* Right Eye */}
                <div className="w-1.5 h-1.5 bg-white rounded-full shadow-inner relative">
                  {/* Eye pupils for more character */}
                  <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-slate-700 rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Circuit patterns on forehead */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1 left-2 w-2 h-0.5 bg-white rounded-full"></div>
              <div className="absolute top-1 right-2 w-2 h-0.5 bg-white rounded-full"></div>
              <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-3 h-0.5 bg-white rounded-full"></div>
            </div>
            
            {/* Antenna/sensor peeking over */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
              <div className="w-0.5 h-1.5 bg-purple-300 rounded-full"></div>
              <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-200 rounded-full animate-pulse shadow-lg"></div>
            </div>
          </div>
          
          {/* Head tilt for curious animation */}
          <div className={`absolute inset-0 transition-transform duration-700 ${
            peekType === 'curious' && isPeeking ? 'rotate-3' : 'rotate-0'
          }`}></div>
        </div>

        {/* Just hands grabbing the top edge of the bubble */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          {/* Left hand grabbing bubble edge */}
          <div className={`absolute -left-6 -top-0.5 transition-all duration-500 ${
            isPeeking ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
          }`}>
            {/* Hand */}
            <div className="w-2.5 h-2 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-md border border-white/50 relative">
              {/* Thumb */}
              <div className="absolute -left-0.5 top-0.5 w-0.5 h-1 bg-purple-300 rounded-full border border-white/30"></div>
              {/* Fingers gripping */}
              <div className="absolute -top-0.5 left-0.5 w-0.5 h-0.5 bg-purple-300 rounded-full"></div>
              <div className="absolute -top-0.5 left-1 w-0.5 h-0.5 bg-purple-300 rounded-full"></div>
              <div className="absolute -top-0.5 right-0.5 w-0.5 h-0.5 bg-purple-300 rounded-full"></div>
            </div>
          </div>

          {/* Right hand grabbing bubble edge */}
          <div className={`absolute -right-6 -top-0.5 transition-all duration-500 ${
            isPeeking ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
          }`}>
            {/* Hand */}
            <div className="w-2.5 h-2 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-md border border-white/50 relative">
              {/* Thumb */}
              <div className="absolute -right-0.5 top-0.5 w-0.5 h-1 bg-purple-300 rounded-full border border-white/30"></div>
              {/* Fingers gripping */}
              <div className="absolute -top-0.5 left-0.5 w-0.5 h-0.5 bg-purple-300 rounded-full"></div>
              <div className="absolute -top-0.5 left-1 w-0.5 h-0.5 bg-purple-300 rounded-full"></div>
              <div className="absolute -top-0.5 right-0.5 w-0.5 h-0.5 bg-purple-300 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Wave animation removed for cleaner look */}
      </div>
      
      {/* Speech bubble removed for now */}
    </div>
  );

  return (
    <>
      {/* Chat Bubble Trigger */}
      {!isOpen && (
        <div 
          className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-50 cursor-pointer group"
          onClick={toggleChat}
          aria-label="Open chat"
        >
          <div className="relative">
            {/* Flux Character - Only show when not on mobile to avoid clutter */}
            {!isMobile && <FluxCharacter />}
            
            {/* Main chat bubble */}
            <div className={`bg-gradient-to-r from-cyan-500 to-teal-600 rounded-full p-3 md:p-4 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-110 ${
              isPeeking && !isMobile ? 'ring-2 ring-cyan-300 ring-opacity-50' : ''
            }`}>
              <MessageCircle className="h-6 w-6 md:h-7 md:w-7 text-white" />
            </div>
            
            {/* Hover tooltip - Hidden on mobile */}
            <div className="hidden md:block absolute bottom-full right-0 mb-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Chat with Flux
              <div className="absolute top-full right-4 border-4 border-transparent border-t-slate-800"></div>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div 
          className={`fixed z-50 transition-all duration-300 ${
            isMobile
              ? 'inset-0 m-0' // Full screen on mobile
              : 'bottom-6 right-6 h-[680px] w-[400px]' // Slightly larger size
          }`}
        >
          <div 
            className={`bg-slate-800/95 backdrop-blur-md shadow-2xl border border-slate-700 h-full flex flex-col overflow-hidden ${
              isMobile ? '' : 'rounded-xl'
            }`}
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-3 border-b border-slate-700 bg-slate-800/90 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white font-semibold text-base">Flux - AI Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleChat}
                  className="text-slate-400 hover:text-white transition-colors p-1.5 rounded hover:bg-slate-700"
                  aria-label="Close chat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Chat Content - Full Height with proper flex */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <ChatWidget />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChat; 