import React, { useState, useEffect, useRef } from 'react';
import MessageList from './MessageList';
import InputArea from './InputArea';
import TypingIndicator from './TypingIndicator';
// import './ChatWidget.css'; // Styles will be migrated to Tailwind
import { MessageSquare } from 'lucide-react'; // Removed unused ChevronDown, Paperclip, Smile

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

interface ChatbotPayload {
  message: string;
  conversation_history: Array<{ role: string; content: string }>;
  lead_capture_mode?: boolean;
  lead_data?: Record<string, string>;
}

const ChatWidget: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [leadCaptureMode, setLeadCaptureMode] = useState(false);
  const [leadData, setLeadData] = useState<Record<string, string>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial Greeting
  useEffect(() => {
    const fetchGreeting = async () => {
      if (messages.length === 0) {
        setIsTyping(true);
        try {
          // Simulate API call for greeting
          await new Promise(resolve => setTimeout(resolve, 1000));
          const greetingMessage = "Hi there! I'm the Reusch AI Assistant. You can ask me about AI topics, our services, or I can help you get in touch with Reid. What's on your mind?";
          
          setMessages([{ role: 'assistant', content: greetingMessage, timestamp: new Date() }]);
          // Add conversation starters after greeting
          setTimeout(() => {
            setMessages(prev => [...prev, 
              {
                role: 'assistant',
                content: 'Here are a few things you can ask:', 
                timestamp: new Date()
              },
            ]);
          }, 500); // Slight delay after main greeting

        } catch (error) {
          console.error('Error fetching greeting:', error);
          setMessages([{ role: 'assistant', content: 'Hello! How can I help you today?', timestamp: new Date() }]);
        } finally {
          setIsTyping(false);
        }
      }
    };
    
    fetchGreeting();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConversationStarterClick = (starterText: string) => {
    setInput(starterText);
    // Optionally, you can directly submit the starterText as a message
    // handleSubmit(new Event('submit') as any, starterText);
  };

  const handleSubmit = async (e: React.FormEvent, messageOverride?: string) => {
    e.preventDefault();
    const currentInput = (messageOverride || input).trim();
    if (!currentInput) return;
    
    const newUserMessage: Message = { role: 'user', content: currentInput, timestamp: new Date() };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);
    
    try {
      const conversationHistory = updatedMessages
        .slice(0, -1) 
        .map(msg => ({
          role: msg.role,
          content: msg.content
      }));
      
      const payload: ChatbotPayload = {
        message: currentInput,
        conversation_history: conversationHistory,
      };

      if (leadCaptureMode) {
        payload.lead_capture_mode = true;
        payload.lead_data = leadData;
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      // const response = await fetch('/api/chatbot', {
      //   method: 'POST', 
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // });

      // if (!response.ok) {
      //   const errorData = await response.json().catch(() => ({ error: "Unknown server error" }));
      //   throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      // }
      
      // const data = await response.json();
      const data = { response: "This is a simulated response from the AI.", lead_capture_mode: false, lead_data: {} }; // Simulated response for lead_data is an empty object
      
      if (typeof data.lead_capture_mode === 'boolean') {
        setLeadCaptureMode(data.lead_capture_mode);
      }
      if (typeof data.lead_data === 'object' && data.lead_data !== null) {
        setLeadData(data.lead_data as Record<string, string>); // Explicitly cast to satisfy TypeScript
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.response, timestamp: new Date() }]);

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: `Sorry, I encountered an issue. Please try again. (${error instanceof Error ? error.message : 'Unknown error'})`, timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const conversationStarters = [
    "What services do you offer?",
    "Tell me about AI automation.",
    "How can AI help my business?"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-h-[700px] bg-slate-800/70 backdrop-blur-md rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-2 border-b border-slate-700">
        <h3 className="flex items-center text-2xl font-bold bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">
          <MessageSquare size={20} className="mr-2 text-teal-400 flex-shrink-0" />
          <span>Reusch AI Assistant</span>
        </h3>
      </div>

      {/* Messages Area */}
      <MessageList messages={messages} />
      {isTyping && <TypingIndicator />}
      <div ref={messagesEndRef} />

      {/* Conversation Starters (conditionally rendered) */}
      {messages.length <= 3 && messages.some(m => m.content.includes('Here are a few things you can ask:')) && (
         <div className="p-3 border-t border-slate-700">
            <div className="flex flex-wrap gap-2">
              {conversationStarters.map((starter, index) => (
                <button 
                  key={index}
                  onClick={() => handleConversationStarterClick(starter)}
                  className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-teal-600 text-slate-200 hover:text-white rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
      )}

      {/* Input Area */}
      <InputArea
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isTyping={isTyping}
      />
    </div>
  );
};

export default ChatWidget; 