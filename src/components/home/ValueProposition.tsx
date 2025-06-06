import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, Workflow, MessageSquare, LineChart } from 'lucide-react';

const ValueProposition: React.FC = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });

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
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
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
      rotate: [0, -10, 10, -10, 0],
      scale: [1, 1.1, 1.1, 1.1, 1],
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };
  
  return (
    <section id="services" className="py-16 md:py-24 bg-slate-50" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            How Our Team Helps You <span className="bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent">Thrive</span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
          Our intelligent AI solutions tackle your toughest challenges, turning them into lasting competitive advantages.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {benefits.map((benefit, index) => (
            <motion.div 
              key={index}
              variants={cardVariants}
              whileHover={{
                scale: 1.05,
                y: -10,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 p-8 border-t-4 border-t-teal-500 cursor-pointer group"
            >
              <div className="flex justify-center mb-4">
                <motion.div
                  variants={iconVariants}
                  whileHover="hover"
                  className="transition-transform duration-200"
                >
                  {benefit.icon}
                </motion.div>
              </div>
              <motion.h3 
                className="text-2xl md:text-2xl font-semibold text-slate-900 mb-4 text-center tracking-tight"
                whileHover={{
                  color: "#0891b2",
                  transition: { duration: 0.2 }
                }}
              >
                {benefit.title}
              </motion.h3>
              <p className="text-lg md:text-xl text-slate-600 text-center leading-relaxed group-hover:text-slate-700 transition-colors duration-200">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ValueProposition;