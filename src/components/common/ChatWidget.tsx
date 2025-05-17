import React, { useState, useEffect } from 'react'; // Removed useRef
import MessageList from './MessageList';
import InputArea from './InputArea';
// TypingIndicator will now be passed to MessageList if you want it inside the scrollable area
// import TypingIndicator from './TypingIndicator'; // Keep if you render it separately, but better inside MessageList
import { MessageSquare } from 'lucide-react';

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

interface ConversationStarter {
  displayText: string;
  submitText: string;
}

const ChatWidget: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [leadCaptureMode, setLeadCaptureMode] = useState(false);
  const [leadData, setLeadData] = useState<Record<string, string>>({});

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
          // REMOVED: setTimeout that added "Here are a few things you can ask:" as a message

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

  const handleConversationStarterClick = (starter: ConversationStarter) => {
    // Set the input to the submitText, so it appears in the chat history as what was "sent"
    setInput(starter.submitText); 
    // Directly call handleSubmit, passing the submitText as an override
    const mockEvent = { preventDefault: () => {} } as React.FormEvent;
    handleSubmit(mockEvent, starter.submitText);
  };

  const handleSubmit = async (e: React.FormEvent, messageOverride?: string) => {
    e.preventDefault();
    const currentInput = (messageOverride || input).trim();
    if (!currentInput) return;
    
    const newUserMessage: Message = { role: 'user', content: currentInput, timestamp: new Date() };
    // Optimistically update messages
    const updatedMessagesOnSubmit = [...messages, newUserMessage];
    setMessages(updatedMessagesOnSubmit);
    setInput('');
    setIsTyping(true);
    
    try {
      const conversationHistory = updatedMessagesOnSubmit // Use the version with the new user message
        .slice(0, -1) // Exclude the current user message for history
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
      
      // Replace with your actual API call
      const response = await fetch('/api/chatbot', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown server error" }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // REMOVED: Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 1500)); 
      // const data = { response: `Simulated AI response to: "${currentInput}"`, lead_capture_mode: false, lead_data: {} };
      
      if (typeof data.lead_capture_mode === 'boolean') {
        setLeadCaptureMode(data.lead_capture_mode);
      }
      if (typeof data.lead_data === 'object' && data.lead_data !== null) {
        setLeadData(data.lead_data as Record<string, string>);
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.response, timestamp: new Date() }]);

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: `Sorry, I encountered an issue. Please try again. (${error instanceof Error ? error.message : 'Unknown error'})`, timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const conversationStarters: ConversationStarter[] = [
    {
      displayText: "Message Reid",
      submitText: "I'd like to send a message to Reid, please."
    },
    {
      displayText: "Automate Business Tasks",
      submitText: "Tell me more about how AI can automate business tasks."
    },
    {
      displayText: "Free Consultation Info",
      submitText: "Can you give me more information about the free AI consultation you offer?"
    }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-h-[700px] bg-slate-800/70 backdrop-blur-md rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700"> {/* Increased padding for header */}
        <h3 className="flex items-center text-xl font-bold bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent"> {/* Adjusted size for balance */}
          <MessageSquare size={24} className="mr-3 text-teal-400 flex-shrink-0" /> {/* Slightly larger icon */}
          <span>Reusch AI Assistant</span>
        </h3>
      </div>

      {/* Messages Area - Pass isTyping prop to MessageList */}
      <MessageList messages={messages} isTyping={isTyping} /> 
      
      {/* Conversation Starters (conditionally rendered) */}
      {/* Logic: Show if the initial greeting has been sent and there are few messages, implying it's early in the conversation. */}
      {messages.length > 0 && messages.length < 4 && !isTyping && (
         <div className="p-3 border-t border-slate-700">
           <div className="flex flex-wrap justify-center gap-2"> {/* Centered starters */}
             {conversationStarters.map((starter, index) => (
               <button 
                 key={index}
                 onClick={() => handleConversationStarterClick(starter)}
                 className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-teal-600 text-slate-200 hover:text-white rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
               >
                 {starter.displayText}
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
        isTyping={isTyping} // Pass isTyping to disable input if needed
      />
    </div>
  );
};

export default ChatWidget;