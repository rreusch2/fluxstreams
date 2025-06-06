import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import FloatingChat from './components/common/FloatingChat';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const navigateTo = (page: string) => {
    if (page === currentPage) return;
    
    setIsTransitioning(true);
    
    // Smooth transition with loading state
    setTimeout(() => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsTransitioning(false);
    }, shouldReduceMotion ? 100 : 300);
  };



  // Page transition variants
  const pageVariants = {
    initial: { 
      opacity: shouldReduceMotion ? 1 : 0, 
      y: shouldReduceMotion ? 0 : 20 
    },
    in: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: "easeOut"
      }
    },
    out: { 
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : -20,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.4,
        ease: "easeIn"
      }
    }
  };

  return (
    <>
      {/* Main App Content */}
      <div className="flex flex-col min-h-screen relative">
        {/* Animated background */}
        <div 
          className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900"
          style={!shouldReduceMotion ? {
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
          } : {}}
        />
        
        <Navbar currentPage={currentPage} navigateTo={navigateTo} />
        
        <main className="flex-grow relative">
          {/* Page transition loading overlay */}
          <AnimatePresence>
            {isTransitioning && !shouldReduceMotion && (
              <motion.div
                className="fixed inset-0 bg-gradient-to-br from-slate-900/50 to-indigo-900/50 backdrop-blur-sm z-40 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex space-x-2">
                  {[0, 1, 2].map((index) => (
                    <motion.div
                      key={index}
                      className="w-2 h-2 rounded-full bg-cyan-400"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: index * 0.2,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Page Content with Transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
            >
              {currentPage === 'home' && <HomePage navigateTo={navigateTo} />}
              {currentPage === 'contact' && <ContactPage />}
            </motion.div>
          </AnimatePresence>
        </main>
        
        <Footer navigateTo={navigateTo} />
        
        {/* Floating Chat - Available on all pages */}
        <FloatingChat />
      </div>

      {/* Add accessibility styles to global CSS */}
      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </>
  );
}

export default App;