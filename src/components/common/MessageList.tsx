import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';
import { Message } from './ChatWidget';

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-grow overflow-y-auto !overflow-y-auto p-3 md:p-4 space-y-2">
      {messages.map((msg, index) => {
        if (msg.isForm && isContactFormActive) {
          return (
            <div key={`form-${index}`} className="flex justify-start">
              <div className="bg-slate-700/80 backdrop-blur-sm rounded-lg shadow-lg border border-slate-600 p-3 max-w-[90%] md:max-w-[80%] w-full">
            <form
              onSubmit={handleContactFormSubmit}
                  className="space-y-3"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-200 mb-1">
                  Your Name*
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={contactFormFields.name}
                  onChange={handleFormFieldChange}
                      className="w-full p-2 bg-slate-800 border border-slate-600 rounded-md text-slate-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-slate-400 text-sm"
                  placeholder="e.g., Jane Doe"
                  required
                />
              </div>

              <div>
                <label htmlFor="contactMethod" className="block text-sm font-medium text-slate-200 mb-1">
                  How to contact you?*
                </label>
                <select
                  name="contactMethod"
                  id="contactMethod"
                  value={contactFormFields.contactMethod}
                  onChange={handleFormFieldChange}
                      className="w-full p-2 bg-slate-800 border border-slate-600 rounded-md text-slate-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                </select>
              </div>

              <div>
                <label htmlFor="contactDetails" className="block text-sm font-medium text-slate-200 mb-1">
                  {contactFormFields.contactMethod === 'email' ? 'Email Address*' : 'Phone Number*'}
                </label>
                <input
                  type={contactFormFields.contactMethod === 'email' ? 'email' : 'tel'}
                  name="contactDetails"
                  id="contactDetails"
                  value={contactFormFields.contactDetails}
                  onChange={handleFormFieldChange}
                      className="w-full p-2 bg-slate-800 border border-slate-600 rounded-md text-slate-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-slate-400 text-sm"
                  placeholder={contactFormFields.contactMethod === 'email' ? 'you@example.com' : '(555) 123-4567'}
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-200 mb-1">
                  Your Message*
                </label>
                <textarea
                  name="message"
                  id="message"
                      rows={3}
                  value={contactFormFields.message}
                  onChange={handleFormFieldChange}
                      className="w-full p-2 bg-slate-800 border border-slate-600 rounded-md text-slate-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-slate-400 text-sm"
                  placeholder="What would you like to discuss with Reid?"
                  required
                />
              </div>

              <button
                type="submit"
                    className="w-full px-3 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-md shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-700 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-cyan-500/25 text-sm"
              >
                Send Message to Reid
              </button>
            </form>
              </div>
            </div>
          );
        }
        return <MessageItem key={index} message={msg} />;
      })}
      
      {isTyping && !isContactFormActive && (
        <div className="flex justify-start">
          <div className="bg-slate-700/50 rounded-2xl px-3 py-2 max-w-[85%] md:max-w-[75%]">
            <div className="flex space-x-1.5">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;