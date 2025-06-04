import React, { useState, useEffect, useRef } from 'react';
import MessageList from './MessageList';
import InputArea from './InputArea';
// TypingIndicator will now be passed to MessageList if you want it inside the scrollable area
// import TypingIndicator from './TypingIndicator'; // Keep if you render it separately, but better inside MessageList
import { MessageSquare, Send } from 'lucide-react';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  isForm?: boolean; // New property to identify form messages
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
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // REMOVED: leadCaptureMode and leadData states, as the new form handles this directly.
  // const [leadCaptureMode, setLeadCaptureMode] = useState(false);
  // const [leadData, setLeadData] = useState<Record<string, string>>({});

  // New states for contact form
  const [isContactFormActive, setIsContactFormActive] = useState(false);
  const [contactFormFields, setContactFormFields] = useState({
    name: '',
    contactMethod: 'email', // Still needed for frontend logic (to switch input type and for n8n conditional logic)
    contactDetails: '',
    message: '',
  });
  const [contactFormSubmitted, setContactFormSubmitted] = useState(false);

  const handleFormFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactFormFields(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContactFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTyping(true);
    
    if (!contactFormFields.name || !contactFormFields.contactDetails || !contactFormFields.message) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Please fill out all required fields: Name, Contact Details, and Message.",
        timestamp: new Date(),
      }]);
      setIsTyping(false);
      return;
    }

    try {
      const n8nWebhookUrl = 'https://rreusch2.app.n8n.cloud/webhook/62851cb6-e2f5-4e47-8cf8-c9a88a3ad270';
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactFormFields),
      });

      if (!response.ok) {
        throw new Error(`Webhook submission failed with status: ${response.status}`);
      }

      const aiPromptForConfirmation = 
        `You are Flux, a helpful and friendly AI assistant for Fluxstream.
        A user named "${contactFormFields.name}" has just submitted a message for Reid.
        Their message summary is: "${contactFormFields.message.substring(0, 100)}${contactFormFields.message.length > 100 ? '...' : ''}"
        (Their full contact method is ${contactFormFields.contactMethod} at ${contactFormFields.contactDetails})

        Please craft a reassuring and slightly personalized confirmation message for "${contactFormFields.name}".
        Acknowledge their message has been sent to Reid.
        You can be a little witty, smart, or professional, adapting your tone.
        Conclude by assuring them Reid will get the message.`;

      const confirmationPayload = {
        message: aiPromptForConfirmation,
        conversation_history: messages.slice(-3).map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
      };

      const aiResponse = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(confirmationPayload),
      });

      if (!aiResponse.ok) {
        throw new Error('Failed to generate AI confirmation');
      }

      const aiData = await aiResponse.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiData.response,
        timestamp: new Date(),
      }]);

    } catch (error) {
      console.error('Error processing form:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Sorry, ${contactFormFields.name}, there was an issue sending your message. Please try again shortly.`,
        timestamp: new Date(),
      }]);
    } finally {
      setIsContactFormActive(false);
      setContactFormFields({ name: '', contactMethod: 'email', contactDetails: '', message: '' });
      setIsTyping(false);
    }
  };

  // Initial Greeting
  useEffect(() => {
    const fetchGreeting = async () => {
      if (messages.length === 0) {
        setIsTyping(true);
        try {
          const greetings = [
            // Your Favorite (Slightly refined for brand consistency)
            "Hey! I\'m Flux, the AI assistant for Fluxstream. I can chat about AI, explain our services, or get you in touch with our experts, Reid and Jake. They are the ones who built me – and they can create smart AI solutions like me for your business too! So, what\'s on your mind?",
          
            // Professional & Helpful
            "Hello there! Flux here, your guide to Fluxstream. Curious about how AI can streamline your operations, or need to connect with Reid and Jake, our founders? I\'m ready to assist!",
            "Greetings! I\'m Flux, from Fluxstream. My goal is to help you explore the potential of AI for your business. Ask me about our services, or let me know if you\'d like to chat with Reid and Jake.",
            "Welcome to Fluxstream! I\'m Flux, your AI-powered assistant. I can provide information on our custom automation solutions, discuss AI trends, or connect you with our experts, Reid and Jake. How can I help you today?",
          
            // Friendly & Casual (with a touch of humor/personality)
            "Flux at your service! Think of me as the friendly AI face of Fluxstream. I know a bit about AI, a lot about what our team does, and I\'m pretty good at fetching our experts if you need them. What can I do for you?",
            "Alright, let\'s talk AI! I\'m Flux, and I work with our founders, Reid and Jake, at Fluxstream to help businesses like yours. They\'re the human experts; I\'m the charming AI. Ask me anything, or I can put you in touch with highly skilled experts!",
            "You\'ve found Flux, Fluxstream\'s very own AI helper! I\'m here to answer your questions about our services, the magic of AI, or even to pass a message to our team. What adventure shall we start with?",
            "Hacking into your computer... just kidding! I\'m Flux, a sophisticated AI from Fluxstream. Our team programmed me to be super helpful. Want to talk AI, learn about our services, or get a message to the bosses? Lay it on me!",
          
            // Emphasizing Reid\'s Role
            "Hi, I\'m Flux! I assist Reid and Jake, the co-founders of Fluxstream, in connecting with businesses looking for AI solutions. I can tell you about what we offer or help you schedule a chat with them. What are you looking for today?",
            "Good day! Flux speaking, on behalf of Fluxstream. Reid and Jake, my creators and our lead AI consultants, have equipped me to answer your initial questions about our services or help you reach out to our team directly. How can I direct your inquiry?",
          
            // Shorter & Punchier
            "Flux here, from Fluxstream! Ready to dive into AI solutions or connect with our experts? Let\'s go!",
            "Welcome! I\'m Flux. Ask about Fluxstream\'s services or AI, or let me send a message our experts for you. What\'s up?",
          
            // Focusing on Value
            "Considering AI for your business? I\'m Flux, and I can show you how Fluxstream makes it happen. Ask me about streamlining tasks, boosting efficiency, or I can help you get in contact with our team!",
            "Looking to automate and innovate? I\'m Flux, your first stop at Fluxstream. I can explain our AI services or connect you with our experts, Reid and Jake. How can we help you succeed today?"
          ];
          const randomIndex = Math.floor(Math.random() * greetings.length);
          const greetingMessage = greetings[randomIndex];
          
          // Simulate a slight delay as if fetching, to make the typing indicator briefly visible
          await new Promise(resolve => setTimeout(resolve, 500)); 

          setMessages([{ role: 'assistant', content: greetingMessage, timestamp: new Date() }]);
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
    const newUserMessage: Message = { role: 'user', content: starter.submitText, timestamp: new Date() };
    setMessages(prev => [...prev, newUserMessage]);
    setInput(''); // Clear input after clicking starter
    setShowQuickPrompts(false); // Hide quick prompts after clicking

    if (starter.submitText.toLowerCase().includes("message reid") || 
        starter.submitText.toLowerCase() === "i'd like to send a message, please.") {
      setIsTyping(true);
      // Simulate assistant thinking then presenting the form
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Got it! I'd be happy to help you get in touch with Reid. Please fill out the details below:",
        timestamp: new Date()
      }, {
        role: 'assistant', // This message will render the form
        content: '', // Content isn't text, but signals to render the form
        isForm: true,
        timestamp: new Date()
      }]);
      setIsContactFormActive(true); // Activate form mode
      setIsTyping(false);
    } else {
      // Modified: Instead of calling handleSubmit, call the API directly
      // to avoid adding another user message
      fetchAIResponse(starter.submitText);
    }
  };

  // New helper function to fetch AI response without adding a duplicate user message
  const fetchAIResponse = async (message: string) => {
    setIsTyping(true);
    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          conversation_history: conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response, timestamp: new Date() }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Sorry, I encountered an issue. Please try again.`,
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, messageOverride?: string) => {
    e.preventDefault();
    const currentInput = (messageOverride || input).trim();
    if (!currentInput) return;
    
    // Check if this is a duplicate of "I'd like to send a message, please."
    const isContactRequest = 
      currentInput.toLowerCase().includes("message reid") || 
      currentInput.toLowerCase().includes("contact reid") ||
      currentInput.toLowerCase() === "i'd like to send a message, please.";
    
    // Only add user message if contact form isn't already active
    if (!isContactFormActive) {
      const newUserMessage: Message = { role: 'user', content: currentInput, timestamp: new Date() };
      setMessages(prev => [...prev, newUserMessage]);
    }
    
    setInput('');
    setIsTyping(true);

    // Check for contact intent
    if (isContactRequest && !isContactFormActive) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Got it! I'd be happy to help you get in touch with Reid. Please fill out the details below:",
        timestamp: new Date()
      }, {
        role: 'assistant',
        content: '',
        isForm: true,
        timestamp: new Date()
      }]);
      setIsContactFormActive(true);
      setIsTyping(false);
      return;
    } else if (isContactFormActive) {
      // Don't process new messages while contact form is active
      setIsTyping(false);
      return;
    }

    // Use fetchAIResponse for consistency
    await fetchAIResponse(currentInput);
  };

  const conversationStarters: ConversationStarter[] = [
    {
      displayText: "Message Our Experts",
      submitText: "I'd like to send a message, please."
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

  const handleQuickPrompt = async (prompt: string) => {
    setInput(prompt);
    setShowQuickPrompts(false);
    
    // Add user message
    const newUserMessage: Message = { role: 'user', content: prompt, timestamp: new Date() };
    setMessages(prev => [...prev, newUserMessage]);
    
    // Fetch response directly without calling handleSubmit
    await fetchAIResponse(prompt);
  };

  return (
    <div className="flex flex-col h-full bg-slate-800/70 backdrop-blur-md rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
      {/* Messages Container - Use MessageList component */}
      <div className="flex-1 overflow-y-auto !overflow-y-auto min-h-0">
        <MessageList 
          messages={messages}
          isTyping={isTyping}
          isContactFormActive={isContactFormActive}
          contactFormFields={contactFormFields}
          handleFormFieldChange={handleFormFieldChange}
          handleContactFormSubmit={handleContactFormSubmit}
        />
      </div>

      {/* Quick Prompts */}
      {showQuickPrompts && messages.length <= 1 && (
        <div className="p-2.5 border-t border-slate-700 bg-slate-800/50">
          <div className="grid grid-cols-1 gap-1.5">
            {conversationStarters.map((prompt, index) => (
              <button
                key={index}
                onClick={() => {
                  setShowQuickPrompts(false);
                  handleConversationStarterClick(prompt);
                }}
                className="text-left px-3 py-2.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-white transition-colors text-sm"
              >
                {prompt.displayText}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-slate-700 bg-slate-800/50">
        <form onSubmit={handleSubmit} className="flex space-x-2 p-2.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-slate-700/50 text-white placeholder-slate-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            disabled={isTyping || isContactFormActive}
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim() || isContactFormActive}
            className={`px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium text-sm transition-all ${
              isTyping || !input.trim() || isContactFormActive
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:shadow-lg hover:shadow-cyan-500/25'
            }`}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWidget;