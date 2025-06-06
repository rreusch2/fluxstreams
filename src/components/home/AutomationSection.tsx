import React from 'react';
import { motion, useInView } from 'framer-motion';
import Button from '../common/Button';
import { ArrowRight, Bot, Zap, Bot as BotIcon, Lightbulb, Database, RefreshCw, LucideArrowRight, MessageSquare, Webhook, BrainCircuit, LineChart } from 'lucide-react';

interface AutomationSectionProps {
  navigateTo: (page: string) => void;
}

const AutomationSection: React.FC<AutomationSectionProps> = ({ navigateTo }) => {
  const ref = React.useRef(null);
  const whoWeHelpRef = React.useRef(null);
  const ctaRef = React.useRef(null);
  
  const isInView = useInView(ref, { once: true, threshold: 0.1 });
  const whoWeHelpInView = useInView(whoWeHelpRef, { once: true, threshold: 0.1 });
  const ctaInView = useInView(ctaRef, { once: true, threshold: 0.1 });

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.6
      }
    }
  };

  const iconVariants = {
    hover: {
      rotate: [0, -5, 5, 0],
      scale: [1, 1.1, 1],
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  return (
    <>
      {/* Main AI Solutions Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" ref={ref}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                     <motion.div 
             className="mb-16 text-center"
             initial={{ opacity: 0, y: 30 }}
             animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
             transition={{ duration: 0.6, ease: "easeOut" }}
           >
             <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
               Our Custom AI Solutions: Built For Your <span className="bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">Success</span>
             </h2>
             <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
               Following your AI Opportunity Consultation, we design and build bespoke AI automations and intelligent workflows tailored to your unique business challenges and goals.
             </p>
             <p className="text-lg text-slate-500 max-w-3xl mx-auto mt-4 font-medium">
               Here are some ways we can transform your operations:
             </p>
           </motion.div>
          
          {/* What We Offer Section */}
          <motion.div 
            className="mb-20"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            {/* Intelligent Automation & Workflow Design */}
               <motion.div 
                 className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/50 hover:shadow-2xl transition-all duration-300 group"
                 variants={cardVariants}
                 whileHover={{
                   scale: 1.05,
                   y: -5,
                   transition: { type: "spring", stiffness: 300, damping: 20 }
                 }}
               >
                 <motion.div 
                   className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl mb-6 flex items-center justify-center shadow-lg"
                   variants={iconVariants}
                   whileHover="hover"
                 >
                   <Webhook className="h-7 w-7 text-white" />
                 </motion.div>
                 <h3 className="text-2xl font-bold mb-4 text-slate-900 group-hover:text-purple-600 transition-colors">Intelligent Automation & Workflow Design</h3>
                 <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                   Connect your existing tools and automate repetitive tasks with smart, adaptive workflows that learn and improve, saving countless hours and reducing errors.
                 </p>
                 <ul className="space-y-3 mb-6">
                   {[
                     'Custom automation pipelines',
                     'Cross-platform integration', 
                     'Adaptive learning systems',
                     'ROI tracking & optimization'
                   ].map((item, index) => (
                     <motion.li 
                       key={index}
                       className="flex items-start"
                       initial={{ opacity: 0, x: -10 }}
                       animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                       transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                     >
                       <motion.span 
                         className="h-5 w-5 text-teal-500 mr-3 mt-0.5"
                         whileHover={{ scale: 1.2 }}
                       >✓</motion.span>
                       <span className="text-slate-700 text-lg">{item}</span>
                     </motion.li>
                   ))}
                 </ul>
               </motion.div>
              
                             {/* Custom AI Assistants */}
                              <motion.div 
                 className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/50 hover:shadow-2xl transition-all duration-300 group relative"
                 variants={cardVariants}
                 whileHover={{
                   scale: 1.05,
                   y: -5,
                   transition: { type: "spring", stiffness: 300, damping: 20 }
                 }}
               >
                 {/* Popular Badge */}
                 <div className="absolute -top-3 right-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                   Most Popular
                 </div>
                 
                 <motion.div 
                   className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl mb-6 flex items-center justify-center shadow-lg"
                   variants={iconVariants}
                   whileHover="hover"
                 >
                   <Bot className="h-7 w-7 text-white" />
                 </motion.div>
                                 <h3 className="text-2xl font-bold mb-4 text-slate-900 group-hover:text-teal-600 transition-colors">Custom AI Assistant Development</h3>
                 <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                   Deploy powerful AI assistants capable of enhancing customer support, automating internal processes, processing documents, and seamlessly integrating with your current systems.
                 </p>
                 <ul className="space-y-3 mb-6">
                   {[
                     '24/7 AI-powered support',
                     'Secure system integration',
                     'Data-driven insights & analytics',
                     'Custom training & optimization'
                   ].map((item, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                    >
                      <motion.span 
                        className="h-5 w-5 text-teal-500 mr-3 mt-0.5"
                        whileHover={{ scale: 1.2 }}
                      >✓</motion.span>
                      <span className="text-slate-700 text-lg">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              
                                            {/* AI Strategy & Implementation Partnerships */}
               <motion.div 
                 className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/50 hover:shadow-2xl transition-all duration-300 group"
                 variants={cardVariants}
                 whileHover={{
                   scale: 1.05,
                   y: -5,
                   transition: { type: "spring", stiffness: 300, damping: 20 }
                 }}
               >
                 <motion.div 
                   className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl mb-6 flex items-center justify-center shadow-lg"
                   variants={iconVariants}
                   whileHover="hover"
                 >
                   <Lightbulb className="h-7 w-7 text-white" />
                 </motion.div>
                 <h3 className="text-2xl font-bold mb-4 text-slate-900 group-hover:text-indigo-600 transition-colors">AI Strategy & Implementation Partnerships</h3>
                 <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                   For organizations new to AI, we provide tailored guidance, develop comprehensive roadmaps, and partner with you through the entire implementation journey to ensure measurable ROI.
                 </p>
                 <ul className="space-y-3 mb-6">
                   {[
                     'Strategic AI roadmap development',
                     'Technology stack recommendations',
                     'Phased implementation plans'
                   ].map((item, index) => (
                     <motion.li 
                       key={index}
                       className="flex items-start"
                       initial={{ opacity: 0, x: -10 }}
                       animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                       transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                     >
                       <motion.span 
                         className="h-5 w-5 text-teal-500 mr-3 mt-0.5"
                         whileHover={{ scale: 1.2 }}
                       >✓</motion.span>
                       <span className="text-slate-700 text-lg">{item}</span>
                     </motion.li>
                   ))}
                 </ul>
               </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Demo Section - Flux */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <motion.div 
            className="max-w-4xl mx-auto text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600/30 to-cyan-600/30 text-cyan-300 text-sm font-medium mb-6 border border-cyan-500/20">
              LIVE DEMONSTRATION
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">Meet Flux, Your AI Assistant</h3>
            <p className="text-slate-300 text-xl leading-relaxed max-w-3xl mx-auto">
              Flux is a working example of what we can build for you. Try it yourself by clicking the chat icon in the bottom right corner of this page.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-8 mb-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { icon: MessageSquare, title: 'Natural Conversations', desc: 'Flux seamlessly interacts with visitors using natural language processing.' },
              { icon: BrainCircuit, title: 'Intelligent Responses', desc: 'When visitors want to connect, Flux collects their details through an intuitive form.' },
              { icon: LineChart, title: 'Lead Capture', desc: 'Flux can collect and organize visitor information in your systems.' }
            ].map((benefit, index) => (
              <motion.div 
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50 shadow-xl group"
                variants={cardVariants}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
              >
                <motion.div 
                  className="bg-gradient-to-br from-indigo-600/20 to-cyan-600/20 p-4 rounded-xl inline-block mb-6 border border-indigo-500/20"
                  variants={iconVariants}
                  whileHover="hover"
                >
                  <benefit.icon className="h-7 w-7 text-cyan-400" />
                </motion.div>
                <h4 className="text-xl font-semibold mb-4 text-white group-hover:text-cyan-300 transition-colors">{benefit.title}</h4>
                <p className="text-slate-300 text-lg leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button
              variant="primary"
              size="lg"
              pulse={true}
              onClick={() => {
                const chatElement = document.querySelector('[aria-label="Open chat"]');
                if (chatElement) {
                  (chatElement as HTMLElement).click();
                } else {
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                  });
                }
              }}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold shadow-xl hover:shadow-cyan-500/25 py-4 px-8 text-lg group"
            >
              Try Flux Now
              <motion.div
                className="ml-2 inline-block"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight className="h-6 w-6" />
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Who We Help Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50" ref={whoWeHelpRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={whoWeHelpInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Who We <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Help</span>
            </h3>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={whoWeHelpInView ? "visible" : "hidden"}
          >
                         {[
               { 
                 gradientClasses: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
                 hoverTextClass: 'group-hover:text-indigo-600',
                 title: 'Businesses', 
                 desc: 'From small businesses to enterprises looking to streamline operations and enhance customer experience.',
                 path: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
               },
               { 
                 gradientClasses: 'bg-gradient-to-br from-teal-500 to-teal-600',
                 hoverTextClass: 'group-hover:text-teal-600',
                 title: 'Startups', 
                 desc: 'Early-stage companies looking to build innovative AI solutions that give them a competitive advantage.',
                 path: "M13 10V3L4 14h7v7l9-11h-7z"
               },
               { 
                 gradientClasses: 'bg-gradient-to-br from-purple-500 to-purple-600',
                 hoverTextClass: 'group-hover:text-purple-600',
                 title: 'Individuals', 
                 desc: 'Professionals, creators, and entrepreneurs wanting to leverage AI for personal projects or skill development.',
                 path: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
               },
               { 
                 gradientClasses: 'bg-gradient-to-br from-amber-500 to-orange-600',
                 hoverTextClass: 'group-hover:text-amber-600',
                 title: 'Non-Profits', 
                 desc: 'Organizations with a mission to make a difference, seeking cost-effective ways to amplify their impact.',
                 path: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9 3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 919-9"
               }
             ].map((item, index) => (
                             <motion.div 
                 key={index}
                 className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/50 text-center hover:shadow-2xl transition-all duration-300 group"
                 variants={cardVariants}
                 whileHover={{
                   scale: 1.05,
                   y: -5,
                   transition: { type: "spring", stiffness: 300, damping: 20 }
                 }}
              >
                                 <motion.div 
                   className={`${item.gradientClasses} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}
                   variants={iconVariants}
                   whileHover="hover"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.path} />
                   </svg>
                 </motion.div>
                 <h4 className={`font-bold text-xl mb-4 text-slate-900 ${item.hoverTextClass} transition-colors`}>{item.title}</h4>
                <p className="text-slate-600 text-lg leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Enhanced CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900" ref={ctaRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div 
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
          >
                         <motion.h3 
               className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight"
               variants={cardVariants}
             >
               Ready to build{' '}
               <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">smarter solutions?</span>
             </motion.h3>
             <motion.p 
               className="text-slate-300 text-xl md:text-2xl max-w-3xl mx-auto mb-10 leading-relaxed"
               variants={cardVariants}
             >
               Let's discuss your automation project and transform your operations with custom AI solutions.
             </motion.p>
             <motion.div variants={cardVariants}>
               <Button 
                 variant="primary" 
                 size="lg" 
                 onClick={() => navigateTo('contact')}
                 pulse={true}
                 className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-semibold shadow-xl hover:shadow-cyan-500/25 py-4 px-8 text-lg group"
               >
                 Discuss Your Automation Project
                 <motion.div
                   className="ml-2 inline-block"
                   animate={{ x: [0, 5, 0] }}
                   transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                 >
                   <ArrowRight className="h-5 w-5" />
                 </motion.div>
               </Button>
             </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AutomationSection;