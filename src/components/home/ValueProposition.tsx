import React from 'react';
import { Clock, Workflow, MessageSquare, LineChart } from 'lucide-react';

const ValueProposition: React.FC = () => {
  const benefits = [
    {
      icon: <Clock className="h-10 w-10 text-teal-500" />,
      title: 'Boost Efficiency',
      description: <>Eliminate repetitive tasks and automate complex workflows, <span className="font-bold text-cyan-500">freeing your team</span> for higher-value, strategic work.</>
    },
    {
      icon: <Workflow className="h-10 w-10 text-indigo-500" />,
      title: 'Optimize Operations',
      description: <>Transform disjointed processes into seamless, <span className="font-bold text-cyan-500">intelligent workflows</span> that reduce errors and maximize productivity.</>
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-purple-500" />,
      title: 'Elevate Customer Experience',
      description: <>Deploy <span className="font-bold text-cyan-500">AI-powered solutions</span> that provide instant, personalized support around the clock, enhancing satisfaction.</>
    },
    {
      icon: <LineChart className="h-10 w-10 text-blue-500" />,
      title: 'Drive Strategic Growth',
      description: <>Leverage <span className="font-bold text-cyan-500">data-driven insights</span> and <span className="font-bold text-cyan-500">predictive AI</span> to identify new revenue streams and unlock untapped opportunities.</>
    }
  ];
  
  return (
    <section id="services" className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            How Our Team Helps You <span className="bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent">Thrive</span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
          Our intelligent AI solutions tackle your toughest challenges, turning them into lasting competitive advantages.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-8 border-t-4 border-t-teal-500 hover:-translate-y-0.5"
            >
              <div className="flex justify-center mb-4">
                <div className="transform hover:scale-105 transition-transform duration-200">
                  {benefit.icon}
                </div>
              </div>
              <h3 className="text-2xl md:text-2xl font-semibold text-slate-900 mb-4 text-center tracking-tight">
                {benefit.title}
              </h3>
              <p className="text-lg md:text-xl text-slate-600 text-center leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;