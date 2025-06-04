import React, { useState } from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import FloatingChat from './components/common/FloatingChat';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Animated background */}
      <div 
        className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 animate-gradient"
        style={{
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite',
        }}
      />
      
      <Navbar currentPage={currentPage} navigateTo={navigateTo} />
      
      <main className="flex-grow">
        {currentPage === 'home' && <HomePage navigateTo={navigateTo} />}
        {currentPage === 'contact' && <ContactPage />}
      </main>
      
      <Footer navigateTo={navigateTo} />
      
      {/* Floating Chat - Available on all pages */}
      <FloatingChat />
    </div>
  );
}

export default App;