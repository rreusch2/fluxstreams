import React from 'react';
import Button from '../common/Button';
import { CheckCircle, FileText, Database, ArrowRight } from 'lucide-react';

interface ConsultationSectionProps {
  navigateTo: (page: string) => void;
}

const ConsultationSection: React.FC<ConsultationSectionProps> = ({ navigateTo }) => {
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
  
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">
                Discover Your AI Potential
              </span>
              <span className="block mt-4 text-white">
                Start with a Free Consultation
              </span>
            </h2>
          
            
            <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
              Our <span className="font-bold text-cyan-400">complimentary AI Opportunity Consultation</span> is designed to reveal your business's untapped potential. We'll pinpoint exactly where AI can make the biggest, most measurable impact on your operations.
            </p>
            
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-start"
                >
                  <div className="flex-shrink-0 mr-3 mt-1">
                    <div className="transform hover:scale-110 transition-transform duration-200">
                      {feature.icon}
                    </div>
                  </div>
                  <p className="text-lg md:text-xl text-slate-300 leading-relaxed">{feature.text}</p>
                </div>
              ))}
            </div>
            
            <Button 
              variant="primary" 
              size="lg" 
              onClick={() => navigateTo('contact')}
              className="group"
            >
              Schedule Your Free Consultation
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          
          {/* Right Column - Illustration */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-lg">
              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-teal-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-xl"></div>
              
              {/* Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 shadow-xl relative z-10">
                <div className="text-center mb-6">
                  <div className="inline-block p-3 bg-teal-500/20 rounded-full mb-4">
                    <FileText className="h-10 w-10 text-teal-400" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-semibold mb-3 tracking-tight">Your Free AI Assessment</h3>
                  <p className="text-slate-300 text-lg md:text-xl">Comprehensive analysis delivered within 48 hours</p>
                </div>
                
                <div className="space-y-5">
                  {[
                    'Business Process Analysis',
                    'AI Opportunity Mapping',
                    'ROI Projections',
                    'Tool Recommendations',
                    'Implementation Roadmap'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-teal-400 mr-4"></div>
                      <span className="text-lg md:text-xl text-slate-200">{item}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-10 pt-8 border-t border-white/10">
                  <p className="text-center text-teal-300 text-lg md:text-xl font-semibold tracking-tight">
                    Value: $500 • Your Cost: $0
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultationSection;