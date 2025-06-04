import React, { useEffect, useState } from 'react';
import Button from '../common/Button';
import ChatWidget from '../common/ChatWidget';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine } from '@tsparticles/engine';

interface HeroProps {
  navigateTo: (page: string) => void;
}

const Hero: React.FC<HeroProps> = ({ navigateTo }) => {
  const [particlesInitialized, setParticlesInitialized] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setParticlesInitialized(true);
    });
  }, []);

  const particleOptions = {
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'repulse',
        },
        onClick: {
          enable: true,
          mode: 'push',
        },
      },
      modes: {
        grab: { distance: 140, links: { opacity: 0.5 } },
        bubble: { distance: 200, size: 20, duration: 2, opacity: 0.8 },
        repulse: { distance: 100, duration: 0.4 },
        push: { quantity: 4 },
        remove: { quantity: 2 },
      },
    },
    particles: {
      color: { value: ['#06b6d4', '#818cf8', '#6366f1'] },
      links: {
        color: '#475569',
        distance: 150,
        enable: true,
        opacity: 0.2,
        width: 1,
      },
      collisions: { enable: true },
      move: {
        direction: 'none' as const,
        enable: true,
        outModes: { default: 'bounce' as const },
        random: false,
        speed: 0.5,
        straight: false,
      },
      number: {
        value: 80,
      },
      opacity: { value: 0.4 },
      shape: { type: 'circle' as const },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
    fullScreen: {
      enable: true,
      zIndex: -1,
    },
  };

  if (!particlesInitialized) {
    return <div className="relative min-h-screen flex items-center text-white overflow-hidden py-20 bg-slate-900"></div>;
  }
  
  return (
    <section className="relative min-h-screen flex items-center text-white overflow-hidden py-20 bg-slate-900">
      <Particles
        id="tsparticles"
        options={particleOptions}
        className="absolute top-0 left-0 w-full h-full -z-10"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column - Main Hero Content */}
          <div className="lg:col-span-7">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 animate-fadeIn tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Transform Your Business
              </span>
              <br />
              With Intelligent AI Solutions
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-12 animate-fadeInUp leading-relaxed">
              We craft AI automations to streamline your operations, 
              boost efficiency, and secure your competitive edge.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => navigateTo('contact')}
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out py-3 px-8 text-lg"
              >
                Book Your Free AI Consultation →
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-slate-300 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-400 transition-colors duration-300 py-3 px-8 text-lg"
                onClick={() => {
                  const servicesSection = document.getElementById('services');
                  servicesSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Our Services
              </Button>
            </div>
          </div>

         
         {/* Right Column - AI Assistant Showcase */}
          <div className="lg:col-span-5 mt-12 lg:mt-0">
            <div className="h-full">
              <ChatWidget />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;