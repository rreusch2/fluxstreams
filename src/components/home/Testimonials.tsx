import React, { useState, useEffect } from 'react';
import TestimonialCard from '../common/TestimonialCard';

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = [
    {
      quote: "The free AI consultation was incredibly valuable. The Fluxstream team identified automation opportunities we hadn't even considered, with projected savings of over $50,000 annually.",
      author: "Sarah J.",
      role: "Operations Director",
      company: "Global Logistics Inc."
    },
    {
      quote: "Their custom chatbot solution transformed our customer service. Response times dropped from hours to seconds, and our team now focuses on complex issues rather than repetitive queries.",
      author: "Michael T.",
      role: "CTO",
      company: "TechSolutions Co."
    },
    {
      quote: "The Excel integration automation they built saves our accounting team 20+ hours every week. The implementation was smooth and the ROI was evident within the first month.",
      author: "David L.",
      role: "Finance Manager",
      company: "Meridian Services"
    }
  ];
  
  useEffect(() => {
    // Auto-rotate testimonials every 5 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);
  
  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };
  
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight" data-aos="fade-up">
            What Our Clients Are <span className="bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent">Saying</span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed" data-aos="fade-up" data-aos-delay="100">
            Real results from businesses that have transformed their operations with our AI solutions.
          </p>
        </div>
        
        {/* Desktop & Tablet View */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              data-aos-duration="1000"
            >
              <TestimonialCard
                quote={testimonial.quote}
                author={testimonial.author}
                role={testimonial.role}
                company={testimonial.company}
                index={index}
              />
            </div>
          ))}
        </div>
        
        {/* Mobile View - Carousel */}
        <div className="md:hidden">
          <div className="relative overflow-hidden">
            <div className="transition-all duration-500 transform" 
                 style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              <TestimonialCard
                quote={testimonials[currentIndex].quote}
                author={testimonials[currentIndex].author}
                role={testimonials[currentIndex].role}
                company={testimonials[currentIndex].company}
                index={currentIndex}
              />
            </div>
            
            {/* Dots Navigation */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    currentIndex === index ? 'bg-teal-500' : 'bg-slate-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;