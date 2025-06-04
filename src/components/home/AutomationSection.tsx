import React from 'react';
import Button from '../common/Button';
import { ArrowRight, Bot, Zap, Bot as BotIcon, Lightbulb, Database, RefreshCw, LucideArrowRight, MessageSquare, Webhook, BrainCircuit, LineChart } from 'lucide-react';

interface AutomationSectionProps {
  navigateTo: (page: string) => void;
}

const AutomationSection: React.FC<AutomationSectionProps> = ({ navigateTo }) => {
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section className="py-12 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            AI Solutions For <span className="bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">Everyone</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            We create custom AI systems for businesses of all sizes, startups, and individuals looking to leverage AI technology.
          </p>
        </div>
        
        {/* What We Offer Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg mb-4 flex items-center justify-center">
                <Lightbulb className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Education & Strategy</h3>
              <p className="text-slate-600 mb-4">
                New to AI? We'll help you understand what's possible and develop a roadmap tailored to your unique needs, whether you're an individual, startup, or established organization.
              </p>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-start">
                  <span className="h-4 w-4 text-teal-500 mr-2">✓</span>
                  <span>Personalized AI consultations</span>
                </li>
                <li className="flex items-start">
                  <span className="h-4 w-4 text-teal-500 mr-2">✓</span>
                  <span>AI opportunity assessment</span>
                </li>
                <li className="flex items-start">
                  <span className="h-4 w-4 text-teal-500 mr-2">✓</span>
                  <span>Implementation roadmap</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-teal-100 rounded-lg mb-4 flex items-center justify-center">
                <Bot className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Custom AI Assistants</h3>
              <p className="text-slate-600 mb-4">
                We build intelligent assistants that can handle customer support, automate workflows, process documents, and integrate with your existing systems.
              </p>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-start">
                  <span className="h-4 w-4 text-teal-500 mr-2">✓</span>
                  <span>24/7 customer support</span>
                </li>
                <li className="flex items-start">
                  <span className="h-4 w-4 text-teal-500 mr-2">✓</span>
                  <span>Seamless system integration</span>
                </li>
                <li className="flex items-start">
                  <span className="h-4 w-4 text-teal-500 mr-2">✓</span>
                  <span>Data-driven insights</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-100 rounded-lg mb-4 flex items-center justify-center">
                <Webhook className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Intelligent Workflows</h3>
              <p className="text-slate-600 mb-4">
                Connect your tools and automate repetitive tasks with smart workflows that learn and improve over time, saving hours of manual work.
              </p>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-start">
                  <span className="h-4 w-4 text-teal-500 mr-2">✓</span>
                  <span>Custom automation pipelines</span>
                </li>
                <li className="flex items-start">
                  <span className="h-4 w-4 text-teal-500 mr-2">✓</span>
                  <span>Cross-platform integration</span>
                </li>
                <li className="flex items-start">
                  <span className="h-4 w-4 text-teal-500 mr-2">✓</span>
                  <span>Adaptive learning systems</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Live Demo Section - Flux */}
        <div className="py-20 bg-gradient-to-b from-slate-900 to-indigo-900 text-white rounded-2xl my-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <div className="inline-block px-4 py-1 rounded-full bg-indigo-600/30 text-indigo-300 text-sm font-medium mb-4">
                LIVE DEMONSTRATION
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Meet Flux, Your AI Assistant</h3>
              <p className="text-slate-300 text-lg">
                Flux is a working example of what we can build for you. Try it yourself by clicking the chat icon in the bottom right corner of this page.
                </p>
                  </div>
                  
            <div className="grid md:grid-cols-3 gap-8">
              {/* Benefit 1 */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-xl">
                <div className="bg-indigo-600/20 p-3 rounded-lg inline-block mb-4">
                  <MessageSquare className="h-6 w-6 text-indigo-400" />
                      </div>
                <h4 className="text-xl font-semibold mb-3">Natural Conversations</h4>
                <p className="text-slate-300">Flux seamlessly interacts with visitors using natural language processing.</p>
                  </div>
                  
              {/* Benefit 2 */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-xl">
                <div className="bg-indigo-600/20 p-3 rounded-lg inline-block mb-4">
                  <BrainCircuit className="h-6 w-6 text-indigo-400" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Intelligent Responses</h4>
                <p className="text-slate-300">When visitors want to connect, Flux collects their details through an intuitive form.</p>
              </div>
              
              {/* Benefit 3 */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-xl">
                <div className="bg-indigo-600/20 p-3 rounded-lg inline-block mb-4">
                  <LineChart className="h-6 w-6 text-indigo-400" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Lead Capture</h4>
                <p className="text-slate-300">Flux can collect and organize visitor information in your systems.</p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <button 
                onClick={() => {
                  // Find the chat widget element at the bottom of the page
                  const chatElement = document.querySelector('[aria-label="Open chat"]');
                  if (chatElement) {
                    (chatElement as HTMLElement).click();
                  } else {
                    // Scroll to bottom as fallback
                    window.scrollTo({
                      top: document.body.scrollHeight,
                      behavior: 'smooth'
                    });
                  }
                }}
                className="inline-flex items-center px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 text-lg"
              >
                Try Flux Now
                <ArrowRight className="ml-2 h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Who We Help Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Who We Help</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm text-center hover:shadow-md transition-shadow">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h4 className="font-semibold text-lg mb-2">Businesses</h4>
              <p className="text-slate-600 text-sm">From small businesses to enterprises looking to streamline operations and enhance customer experience.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm text-center hover:shadow-md transition-shadow">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-lg mb-2">Startups</h4>
              <p className="text-slate-600 text-sm">Early-stage companies looking to build innovative AI solutions that give them a competitive advantage.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm text-center hover:shadow-md transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-lg mb-2">Individuals</h4>
              <p className="text-slate-600 text-sm">Professionals, creators, and entrepreneurs wanting to leverage AI for personal projects or skill development.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm text-center hover:shadow-md transition-shadow">
              <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h4 className="font-semibold text-lg mb-2">Non-Profits</h4>
              <p className="text-slate-600 text-sm">Organizations with a mission to make a difference, seeking cost-effective ways to amplify their impact.</p>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to explore what AI can do for you?</h3>
          <p className="text-slate-600 max-w-2xl mx-auto mb-8">
            Let's discuss your goals and discover how custom AI solutions can help you achieve them.
          </p>
          <Button 
            variant="primary" 
            size="lg" 
            onClick={() => navigateTo('contact')}
            className="group"
          >
            Schedule a Free Consultation
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>

      {/* Flux Chat Widget */}
      <div className="fixed bottom-4 right-4 z-50">
        {/* Chat bubble will be rendered by FloatingChat component */}
      </div>
    </section>
  );
};

export default AutomationSection;