import React from 'react';
import Button from '../common/Button';
import { MessageCircle, Database, ArrowRight, Bot, Sparkles } from 'lucide-react';

interface AutomationSectionProps {
  navigateTo: (page: string) => void;
}

const AutomationSection: React.FC<AutomationSectionProps> = ({ navigateTo }) => {
  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 md:mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight" data-aos="fade-up">
            Custom AI Solutions, <span className="bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent">Built For You</span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We design and build AI automations and intelligent workflows tailored to your specific business challenges.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Column - Automation Diagram */}
          <div className="relative bg-white rounded-xl shadow-xl p-8 md:p-10 overflow-hidden order-2 lg:order-1" data-aos="fade-right">
            {/* Decorative background elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-100 rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-teal-100 rounded-full"></div>
            
            <div className="relative">
              <h3 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-8 tracking-tight">
                Case Study Example: AI-Powered Customer Support Chatbot
              </h3>
              
              {/* Chatbot Flow Diagram */}
              <div className="relative flex flex-col items-center mb-8">
                {/* Bot Icon */}
                <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                  <Bot className="h-10 w-10 text-indigo-600" />
                </div>
                
                {/* Connector Line */}
                <div className="w-1 h-8 bg-slate-200"></div>
                
                {/* Processing Block */}
                <div className="w-full max-w-md bg-slate-100 rounded-lg p-4 mb-4 relative">
                  <Sparkles className="h-8 w-8 text-teal-500 absolute -top-4 -right-4" />
                  <h4 className="text-xl font-medium text-slate-900 mb-3">Intelligent Processing</h4>
                  <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                    Natural language understanding and context-aware response generation using latest AI models
                  </p>
                </div>
                
                {/* Connector Line */}
                <div className="w-1 h-8 bg-slate-200"></div>
                
                {/* Two Branches */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                  {/* Left Branch - Excel Data */}
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-teal-100 rounded-lg mb-4">
                      <Database className="h-8 w-8 text-teal-600" />
                    </div>
                    <div className="bg-teal-50 rounded-lg p-4 text-center">
                      <h5 className="font-medium text-teal-800 text-base md:text-lg mb-2">Excel Integration</h5>
                      <p className="text-sm md:text-base text-teal-700 leading-relaxed">Secure access to company data</p>
                    </div>
                  </div>
                  
                  {/* Right Branch - Customer Interaction */}
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-lg mb-4">
                      <MessageCircle className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-4 text-center">
                      <h5 className="font-medium text-indigo-800 text-base md:text-lg mb-2">Lead Capture</h5>
                      <p className="text-sm md:text-base text-indigo-700 leading-relaxed">Automated data entry to CRM</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <h4 className="text-xl font-medium text-slate-900 mb-4">Key Integration Points:</h4>
                <ul className="text-base md:text-lg text-slate-600 space-y-3">
                  <li className="flex items-start">
                    <span className="h-5 w-5 text-teal-500 mr-2">✓</span>
                    Microsoft Excel & Office 365
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 text-teal-500 mr-2">✓</span>
                    Google Workspace (Gmail, Sheets, Drive)
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 text-teal-500 mr-2">✓</span>
                    CRM Systems (Salesforce, HubSpot, etc.)
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 text-teal-500 mr-2">✓</span>
                    LinkedIn & Social Media Platforms
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Right Column - Text Content */}
          <div className="order-1 lg:order-2" data-aos="fade-left">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
              Seamless Integration With Your Existing Systems
            </h3>
            
            <p className="text-lg md:text-xl text-slate-600 mb-12 leading-relaxed">
              Our custom AI solutions seamlessly integrate with hundreds of platforms and services 
              you already use, creating intelligent workflows that enhance productivity and reduce manual tasks.
            </p>
            
            <div className="mb-12 bg-white p-8 md:p-10 rounded-lg shadow-lg border-l-4 border-teal-500 hover:shadow-xl transition-shadow">
              <h4 className="text-xl md:text-2xl font-semibold text-slate-900 mb-4 tracking-tight">
                Intelligent Responses
              </h4>
              <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                We developed a chatbot for a client that accessed a secure Excel file containing company 
                information, product specifications, and internal documents to provide accurate and 
                context-aware answers to user inquiries in real-time.
              </p>
            </div>
            
            <div className="mb-12 bg-white p-8 md:p-10 rounded-lg shadow-lg border-l-4 border-indigo-500 hover:shadow-xl transition-shadow">
              <h4 className="text-xl md:text-2xl font-semibold text-slate-900 mb-4 tracking-tight">
                Automated Lead Capture & Data Entry
              </h4>
              <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                The same chatbot was also connected to a separate Excel spreadsheet. When a user expressed 
                interest in a product or needed human follow-up, the chatbot automatically recorded their 
                contact information and other relevant details directly into this sheet.
              </p>
            </div>
            
            <div className="mt-16 flex justify-center lg:justify-start">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => navigateTo('contact')}
                className="group"
              >
                Discuss Your Automation Project
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AutomationSection;