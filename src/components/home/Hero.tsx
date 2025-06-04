import React from 'react';
import Button from '../common/Button';
import ThreeBackground from './ThreeBackground';

interface HeroProps {
  navigateTo: (page: string) => void;
}

const Hero: React.FC<HeroProps> = ({ navigateTo }) => {
  return (
    <section className="relative min-h-screen flex items-center text-white overflow-hidden py-16 bg-gradient-to-b from-slate-900 via-indigo-900 to-slate-900">
      {/* Three.js Background */}
      <ThreeBackground />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Centered Hero Content */}
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading with enhanced gradient and spacing */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              Transform Your Business
            </span>
            <br />
            <span className="text-white">
              With Intelligent AI Automation
            </span>
          </h1>
            
          {/* Subtitle with bold highlights and improved animation */}
          <p className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-14 leading-relaxed max-w-3xl mx-auto opacity-0 animate-[fadeIn_0.6s_ease-out_0.3s_forwards]">
            We partner with organizations of all sizes to{' '}
            <span className="font-bold text-cyan-300">streamline operations</span>,{' '}
            <span className="font-bold text-cyan-300">boost efficiency</span>, and{' '}
            <span className="font-bold text-cyan-300">secure a competitive edge</span>{' '}
            in the digital future, through custom AI solutions.
          </p>
            
          {/* Call-to-Action Buttons with enhanced styling */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center max-w-xl mx-auto opacity-0 animate-[fadeIn_0.6s_ease-out_0.6s_forwards]">
            <Button 
              variant="primary" 
              size="lg" 
              onClick={() => navigateTo('contact')}
              className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-semibold shadow-xl hover:shadow-cyan-500/25 transform hover:scale-[1.02] transition-all duration-300 ease-in-out py-4 px-8 text-lg rounded-xl w-full sm:w-auto"
            >
              Book Your Free AI Consultation →
            </Button>
              
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;