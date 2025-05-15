import React from 'react';
import { Clock, Workflow, MessageSquare, LineChart } from 'lucide-react';

const ValueProposition: React.FC = () => {
  const benefits = [
    {
      icon: <Clock className="h-10 w-10 text-teal-500" />,
      title: 'Save Time',
      description: 'Eliminate repetitive tasks and automate complex workflows, freeing up your team to focus on high-value activities that drive growth.'
    },
    {
      icon: <Workflow className="h-10 w-10 text-indigo-500" />,
      title: 'Streamline Processes',
      description: 'Transform disjointed processes into seamless, intelligent workflows that reduce errors and boost operational efficiency.'
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-purple-500" />,
      title: 'Enhance Customer Support',
      description: 'Deploy AI-powered solutions that provide instant, personalized customer service and support around the clock.'
    },
    {
      icon: <LineChart className="h-10 w-10 text-blue-500" />,
      title: 'Unlock Growth Opportunities',
      description: 'Leverage data-driven insights and predictive analytics to identify new revenue streams and strategic opportunities.'
    }
  ];
  
  return (
    <section id="services" className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            How We Help Businesses <span className="bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent">Thrive</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Our AI solutions address your most pressing challenges and transform them into competitive advantages.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border-t-4 border-t-teal-500"
            >
              <div className="flex justify-center mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3 text-center">
                {benefit.title}
              </h3>
              <p className="text-slate-600 text-center">
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