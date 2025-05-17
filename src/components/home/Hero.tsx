import React, { useEffect, useRef } from 'react';
import Button from '../common/Button';
import ChatWidget from '../common/ChatWidget';

interface HeroProps {
  navigateTo: (page: string) => void;
}

const Hero: React.FC<HeroProps> = ({ navigateTo }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Make canvas responsive
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Create particles
    const particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
    }[] = [];
    
    const colors = ['#06b6d4', '#818cf8', '#6366f1', '#0ea5e9'];
    
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    
    // Animation function
    const animate = () => {
      // Create a semi-transparent layer for fade effect
      ctx.fillStyle = 'rgba(15, 23, 42, 0.05)'; // slate-900 with opacity
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = -particle.speedX;
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = -particle.speedY;
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Connect particles with lines if they're close enough
        particles.forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 116, 139, ${0.15 * (1 - distance / 100)})`; // slate-500 with dynamic opacity, slightly more visible
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <section className="relative min-h-screen flex items-center text-white overflow-hidden py-20">
      {/* Background canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full bg-slate-900 -z-10"
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