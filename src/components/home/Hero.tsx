import React from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import ThreeBackground from './ThreeBackground';

interface HeroProps {
  navigateTo: (page: string) => void;
}

const Hero: React.FC<HeroProps> = ({ navigateTo }) => {
  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center text-white overflow-hidden py-16 bg-gradient-to-b from-slate-900 via-indigo-900 to-slate-900">
      {/* Three.js Background */}
      <ThreeBackground />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Centered Hero Content */}
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Heading with enhanced gradient and spacing */}
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight leading-tight"
            variants={textVariants}
          >
            <motion.span 
              className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent inline-block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            >
              Transform Your Business
            </motion.span>
            <br />
            <motion.span 
              className="text-white inline-block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
            >
              With Intelligent AI Automation
            </motion.span>
          </motion.h1>
            
          {/* Subtitle with bold highlights and improved animation */}
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-14 leading-relaxed max-w-3xl mx-auto"
            variants={textVariants}
            transition={{ delay: 0.4 }}
          >
            We partner with organizations of all sizes to{' '}
            <motion.span 
              className="font-bold text-cyan-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              streamline operations
            </motion.span>,{' '}
            <motion.span 
              className="font-bold text-cyan-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
            >
              boost efficiency
            </motion.span>, and{' '}
            <motion.span 
              className="font-bold text-cyan-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.5 }}
            >
              secure a competitive edge
            </motion.span>{' '}
            in the digital future, through custom AI solutions.
          </motion.p>
            
          {/* Call-to-Action Buttons with enhanced styling */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-5 justify-center items-center max-w-xl mx-auto"
            variants={containerVariants}
            transition={{ delay: 0.6 }}
          >
            <motion.div variants={buttonVariants}>
              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => navigateTo('contact')}
                pulse={true}
                className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-semibold shadow-xl hover:shadow-cyan-500/25 py-4 px-8 text-lg rounded-xl w-full sm:w-auto"
              >
                Book Your Free AI Consultation →
              </Button>
            </motion.div>
              
            <motion.div variants={buttonVariants}>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-slate-300 text-slate-300 hover:bg-slate-700/50 hover:text-white hover:border-slate-400 transition-all duration-300 py-4 px-8 text-lg rounded-xl backdrop-blur-sm w-full sm:w-auto group"
                onClick={() => {
                  const servicesSection = document.getElementById('services');
                  servicesSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Our Services
                <span className="inline-block transition-transform group-hover:translate-x-1 ml-1">→</span>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;