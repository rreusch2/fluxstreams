import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator'; // Import TypingIndicator
import { Message } from './ChatWidget'; // Assuming Message type is exported from ChatWidget

interface MessageListProps {
  messages: Message[];
  isTyping: boolean; // New prop
  // Props for contact form
  isContactFormActive: boolean;
  contactFormFields: {
    name: string;
    contactMethod: string;
    contactDetails: string;
    message: string;
  };
  handleFormFieldChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleContactFormSubmit: (e: React.FormEvent) => Promise<void>;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isTyping,
  isContactFormActive,
  contactFormFields,
  handleFormFieldChange,
  handleContactFormSubmit
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]); // Also scroll when typing indicator appears/disappears

  return (
    <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-900/50 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50">
      {messages.map((msg, index) => {
        if (msg.isForm && isContactFormActive) {
          return (
            // Render the contact form here
            <form key={`form-${index}`} onSubmit={handleContactFormSubmit} className="p-4 space-y-3 bg-slate-700/80 backdrop-blur-sm rounded-lg my-2 shadow-lg border border-slate-600">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-200 mb-1">Your Name*</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={contactFormFields.name}
                  onChange={handleFormFieldChange}
                  className="w-full p-2.5 bg-slate-800 border border-slate-600 rounded-md text-slate-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-slate-400"
                  placeholder="e.g., Jane Doe"
                  required
                />
              </div>
              <div>
                <label htmlFor="contactMethod" className="block text-sm font-medium text-slate-200 mb-1">How to contact you?*</label>
                <select
                  name="contactMethod"
                  id="contactMethod"
                  value={contactFormFields.contactMethod}
                  onChange={handleFormFieldChange}
                  className="w-full p-2.5 bg-slate-800 border border-slate-600 rounded-md text-slate-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                </select>
              </div>
              <div>
                <label htmlFor="contactDetails" className="block text-sm font-medium text-slate-200 mb-1">
                  Your {contactFormFields.contactMethod === 'email' ? 'Email Address' : 'Phone Number'}*
                </label>
                <input
                  type={contactFormFields.contactMethod === 'email' ? 'email' : 'tel'}
                  name="contactDetails"
                  id="contactDetails"
                  value={contactFormFields.contactDetails}
                  onChange={handleFormFieldChange}
                  className="w-full p-2.5 bg-slate-800 border border-slate-600 rounded-md text-slate-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-slate-400"
                  placeholder={contactFormFields.contactMethod === 'email' ? 'you@example.com' : 'e.g., (555) 123-4567'}
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-200 mb-1">Your Message*</label>
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  value={contactFormFields.message}
                  onChange={handleFormFieldChange}
                  className="w-full p-2.5 bg-slate-800 border border-slate-600 rounded-md text-slate-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-slate-400"
                  placeholder="What would you like to discuss with Reid?"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-700 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isTyping}
              >
                {isTyping ? 'Sending...' : 'Send Message to Reid'}
              </button>
            </form>
          );
        }
        return <MessageItem key={index} message={msg} />;
      })}
      {isTyping && !isContactFormActive && <TypingIndicator />} {/* Render TypingIndicator only if not in form mode or if form typing is handled differently */}
      <div ref={messagesEndRef} /> {/* This empty div is the target for scrolling */}
    </div>
  );
};

export default MessageList;