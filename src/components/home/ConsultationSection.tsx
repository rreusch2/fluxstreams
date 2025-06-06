import React from 'react';
import { motion, useInView } from 'framer-motion';
import Button from '../common/Button';
import { CheckCircle, FileText, Database, ArrowRight } from 'lucide-react';

interface ConsultationSectionProps {
  navigateTo: (page: string) => void;
}

const ConsultationSection: React.FC<ConsultationSectionProps> = ({ navigateTo }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });

  const features = [
    {
      icon: <CheckCircle className="h-6 w-6 text-teal-500" />,
      text: 'Custom business needs assessment and AI opportunity identification'
    },
    {
      icon: <FileText className="h-6 w-6 text-teal-500" />,
      text: 'Detailed report with actionable insights and implementation guidance'
    },
    {
      icon: <Database className="h-6 w-6 text-teal-500" />,
      text: 'AI tool recommendations from our database of 50+ specialized solutions'
    }
  ];

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

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, rotateY: -15 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const iconSpinVariants = {
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
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 to-indigo-900 text-white" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
              variants={itemVariants}
            >
              <span className="bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">
                Discover Your AI Potential
              </span>
              <span className="block mt-4 text-white">
                Start with a Free Consultation
              </span>
            </motion.h2>
          
            <motion.p 
              className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed"
              variants={itemVariants}
            >
              Our <span className="font-bold text-cyan-400">free AI consultation</span> uncovers your business's biggest opportunities and pinpoints exactly where AI can drive measurable impact.
            </motion.p>
            
            <motion.div 
              className="space-y-4 mb-8"
              variants={containerVariants}
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-start group"
                  variants={featureVariants}
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <div className="flex-shrink-0 mr-3 mt-1">
                    <motion.div 
                      variants={iconSpinVariants}
                      whileHover="hover"
                      className="transform transition-transform duration-200"
                    >
                      {feature.icon}
                    </motion.div>
                  </div>
                  <p className="text-lg md:text-xl text-slate-300 leading-relaxed group-hover:text-white transition-colors duration-200">{feature.text}</p>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => navigateTo('contact')}
                pulse={true}
                className="group"
              >
                Schedule Your Free Consultation
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
          
          {/* Right Column - Illustration */}
          <motion.div 
            className="relative flex justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            <div className="relative w-full max-w-lg">
              {/* Decorative Elements */}
              <motion.div 
                className="absolute -top-4 -left-4 w-24 h-24 bg-teal-500/20 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              ></motion.div>
              <motion.div 
                className="absolute -bottom-8 -right-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.4, 0.8, 0.4]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              ></motion.div>
              
              {/* Card with enhanced animation */}
              <motion.div 
                className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 shadow-xl relative z-10 overflow-hidden"
                variants={cardVariants}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)"
                }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                {/* Animated gradient border */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-teal-400 via-blue-400 to-purple-500 opacity-0 rounded-xl"
                  whileHover={{ opacity: 0.1 }}
                  transition={{ duration: 0.3 }}
                />
                
                <div className="text-center mb-6 relative z-10">
                  <motion.div 
                    className="inline-block p-3 bg-teal-500/20 rounded-full mb-4"
                    whileHover={{ 
                      scale: 1.1,
                      backgroundColor: "rgba(20, 184, 166, 0.3)"
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <FileText className="h-10 w-10 text-teal-400" />
                  </motion.div>
                  <h3 className="text-2xl md:text-3xl font-semibold mb-3 tracking-tight">Your Free AI Assessment</h3>
                  <p className="text-slate-300 text-lg md:text-xl">Comprehensive analysis delivered within 48 hours</p>
                </div>
                
                <div className="space-y-5 relative z-10">
                  {[
                    'Business Process Analysis',
                    'AI Opportunity Mapping',
                    'ROI Projections',
                    'Tool Recommendations',
                    'Implementation Roadmap'
                  ].map((item, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center"
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                      transition={{ 
                        duration: 0.4, 
                        ease: "easeOut",
                        delay: 0.6 + (index * 0.1)
                      }}
                      whileHover={{ x: 5 }}
                    >
                      <motion.div 
                        className="h-3 w-3 rounded-full bg-teal-400 mr-4"
                        whileHover={{ scale: 1.3, backgroundColor: "#06b6d4" }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      ></motion.div>
                      <span className="text-lg md:text-xl text-slate-200">{item}</span>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div 
                  className="mt-10 pt-8 border-t border-white/10 relative z-10"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <p className="text-center text-teal-300 text-lg md:text-xl font-semibold tracking-tight">
                    Value: $500 • Your Cost: $0
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ConsultationSection;