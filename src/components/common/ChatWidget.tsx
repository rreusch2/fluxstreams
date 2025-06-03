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
    // Basic validation (can be expanded)
    if (!contactFormFields.name || !contactFormFields.contactDetails || !contactFormFields.message) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Please fill out all required fields: Name, Contact Details, and Message.",
        timestamp: new Date(),
      }]);
      setIsTyping(false);
      return;
    }

    // console.log("Contact Form Submitted: ", contactFormFields); // Replace with actual submission logic

    // Simulate API call for form submission
    // await new Promise(resolve => setTimeout(resolve, 1500));

    // Actual N8N Webhook Submission
    const n8nWebhookUrl = 'https://rreusch2.app.n8n.cloud/webhook/62851cb6-e2f5-4e47-8cf8-c9a88a3ad270';
    try {
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactFormFields),
      });

      if (!response.ok) {
        // Attempt to get more error info from n8n if possible
        const errorData = await response.json().catch(() => null); 
        console.error('n8n webhook submission failed:', response.status, response.statusText, errorData);
        throw new Error(`Webhook submission failed with status: ${response.status}`);
      }
      
      // If response.ok, assume n8n processed it. n8n usually returns a success message.
      const n8nResponse = await response.json(); 
      console.log("N8N Webhook Response:", n8nResponse);

      // Now, generate an AI confirmation message
      // setIsTyping(true); // isTyping is already true from the start of handleContactFormSubmit
      try {
        const aiPromptForConfirmation = 
          `You are Otto, a helpful and friendly AI assistant for Fluxstream.
          A user named "${contactFormFields.name}" has just submitted a message for Reid.
          Their message summary is: "${contactFormFields.message.substring(0, 100)}${contactFormFields.message.length > 100 ? '...' : ''}"
          (Their full contact method is ${contactFormFields.contactMethod} at ${contactFormFields.contactDetails})

          Please craft a reassuring and slightly personalized confirmation message for "${contactFormFields.name}".
          Acknowledge their message has been sent to Reid.
          You can be a little witty, smart, or professional, adapting your tone.
          Conclude by assuring them Reid will get the message. For example, "I\'ll make sure he gets this right away!" or "Consider it delivered to Reid\'s priority inbox!".`;

        const confirmationPayload: ChatbotPayload = {
          message: aiPromptForConfirmation,
          conversation_history: messages.slice(-3).map(msg => ({ // Send last few messages for context
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
          const errorData = await aiResponse.json().catch(() => ({ error: "AI confirmation generation failed" }));
          throw new Error(errorData.error || `AI confirmation HTTP error! status: ${aiResponse.status}`);
        }

        const aiData = await aiResponse.json();
        
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: aiData.response, // Use AI's generated response
          timestamp: new Date(),
        }]);

      } catch (aiError) {
        console.error('Error generating AI confirmation:', aiError);
        // Fallback to a simpler, hardcoded confirmation if AI fails
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Thanks, ${contactFormFields.name}! Your message has been successfully sent to Reid. I'll make sure he sees it!`, // Refined fallback
          timestamp: new Date(),
        }]);
      } finally {
        setIsContactFormActive(false);
        setContactFormSubmitted(true); 
        setContactFormFields({ name: '', contactMethod: 'email', contactDetails: '', message: '' }); 
        setIsTyping(false); // Ensure typing is stopped
      }

    } catch (error) { // This is the catch for the n8n webhook submission
      console.error('Error sending message to n8n webhook:', error); // Clarified error source
      setMessages(prev => [...prev, { role: 'assistant', content: `Sorry, ${contactFormFields.name}, there was an issue sending your message through our system. Please try again shortly. (${error instanceof Error ? error.message : 'Unknown error'})`, timestamp: new Date() }]);
      setIsTyping(false); // Ensure typing is stopped here too
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
            "Hey! I\'m Otto, the AI assistant for Fluxstream. I can chat about AI, explain our services, or get you in touch with our experts, Reid and Jake. They are the ones who built me – and they can create smart AI solutions like me for your business too! So, what\'s on your mind?",
          
            // Professional & Helpful
            "Hello there! Otto here, your guide to Fluxstream. Curious about how AI can streamline your operations, or need to connect with Reid and Jake, our founders? I\'m ready to assist!",
            "Greetings! I\'m Otto, from Fluxstream. My goal is to help you explore the potential of AI for your business. Ask me about our services, or let me know if you\'d like to chat with Reid and Jake.",
            "Welcome to Fluxstream! I\'m Otto, your AI-powered assistant. I can provide information on our custom automation solutions, discuss AI trends, or connect you with our experts, Reid and Jake. How can I help you today?",
          
            // Friendly & Casual (with a touch of humor/personality)
            "Otto at your service! Think of me as the friendly AI face of Fluxstream. I know a bit about AI, a lot about what our team does, and I\'m pretty good at fetching our experts if you need them. What can I do for you?",
            "Alright, let\'s talk AI! I\'m Otto, and I work with our founders, Reid and Jake, at Fluxstream to help businesses like yours. They\'re the human experts; I\'m the charming AI. Ask me anything, or I can put you in touch with highly skilled experts!",
            "You\'ve found Otto, Fluxstream\'s very own AI helper! I\'m here to answer your questions about our services, the magic of AI, or even to pass a message to our team. What adventure shall we start with?",
            "Hacking into your computer... just kidding! I\'m Otto, a sophisticated AI from Fluxstream. Our team programmed me to be super helpful. Want to talk AI, learn about our services, or get a message to the bosses? Lay it on me!",
          
            // Emphasizing Reid\'s Role
            "Hi, I\'m Otto! I assist Reid and Jake, the co-founders of Fluxstream, in connecting with businesses looking for AI solutions. I can tell you about what we offer or help you schedule a chat with them. What are you looking for today?",
            "Good day! Otto speaking, on behalf of Fluxstream. Reid and Jake, my creators and our lead AI consultants, have equipped me to answer your initial questions about our services or help you reach out to our team directly. How can I direct your inquiry?",
          
            // Shorter & Punchier
            "Otto here, from Fluxstream! Ready to dive into AI solutions or connect with our experts? Let\'s go!",
            "Welcome! I\'m Otto. Ask about Fluxstream\'s services or AI, or let me send a message our experts for you. What\'s up?",
          
            // Focusing on Value
            "Considering AI for your business? I\'m Otto, and I can show you how Fluxstream makes it happen. Ask me about streamlining tasks, boosting efficiency, or I can help you get in contact with our team!",
            "Looking to automate and innovate? I\'m Otto, your first stop at Fluxstream. I can explain our AI services or connect you with our experts, Reid and Jake. How can we help you succeed today?"
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

    if (starter.submitText.toLowerCase().includes("message reid")) {
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
      // Directly call handleSubmit for other starters, passing the submitText as an override
      const mockEvent = { preventDefault: () => {} } as React.FormEvent;
      handleSubmit(mockEvent, starter.submitText);
    }
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

    // Check for contact intent
    const exactMatchPhrase = "i'd like to send a message to reid, please.";
    if (currentInput.toLowerCase() === exactMatchPhrase || 
        currentInput.toLowerCase().includes("contact reid")) {
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
      // Only proceed with API call if not activating contact form
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
        
        setMessages(prev => [...prev, { role: 'assistant', content: data.response, timestamp: new Date() }]);

      } catch (error) {
        console.error('Error sending message:', error);
        setMessages(prev => [...prev, { role: 'assistant', content: `Sorry, I encountered an issue. Please try again. (${error instanceof Error ? error.message : 'Unknown error'})`, timestamp: new Date() }]);
      } finally {
        setIsTyping(false);
      }
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
          <span>Otto</span>
        </h3>
      </div>

      {/* Messages Area - Pass isTyping prop to MessageList */}
      {/* The MessageList component will need to be updated to render the form when message.isForm is true */}
      <MessageList 
        messages={messages} 
        isTyping={isTyping}
        // Pass form-related props
        isContactFormActive={isContactFormActive}
        contactFormFields={contactFormFields}
        handleFormFieldChange={handleFormFieldChange}
        handleContactFormSubmit={handleContactFormSubmit}
      /> 
      
      {/* Conversation Starters (conditionally rendered) */}
      {/* Logic: Show if the initial greeting has been sent and there are few messages, implying it's early in the conversation. */}
      {messages.length > 0 && messages.length < 4 && !isTyping && !isContactFormActive && (
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

      {/* Input Area or Contact Form Placeholder */}
      {/* The actual form rendering will be handled by MessageList based on message.isForm */}
      {!isContactFormActive ? (
        <InputArea
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isTyping={isTyping} 
        />
      ) : (
        // When contact form is active, MessageList handles rendering it, so no separate InputArea here.
        null 
      )}
    </div>
  );
};

export default ChatWidget;