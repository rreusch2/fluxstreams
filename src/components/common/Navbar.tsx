import React, { useState, useEffect } from 'react';
import { AlignJustify, X, Cpu } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  navigateTo: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, navigateTo }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (page: string) => {
    navigateTo(page);
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-slate-900/95 shadow-lg backdrop-blur-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <button 
              onClick={() => handleNavigation('home')}
              className="flex items-center text-white font-bold text-2xl md:text-3xl"
            >
              <Cpu className="h-8 w-8 md:h-9 md:w-9 mr-3 text-teal-400" />
              <span className="bg-gradient-to-r from-teal-400 to-indigo-500 bg-clip-text text-transparent font-semibold font-['Ancizar Sans'] text-3xl md:text-4xl">
                Reusch AI Solutions
              </span>
            </button>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:block">
            <ul className="flex space-x-12">
              <li>
                <button
                  onClick={() => handleNavigation('home')}
                  className={`text-base md:text-lg font-medium transition-colors hover:text-teal-400 ${
                    currentPage === 'home' ? 'text-teal-400' : 'text-white'
                  }`}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('contact')}
                  className={`text-base md:text-lg font-medium transition-colors hover:text-teal-400 ${
                    currentPage === 'contact' ? 'text-teal-400' : 'text-white'
                  }`}
                >
                  Contact
                </button>
              </li>
            </ul>
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white p-1 hover:text-teal-400 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <AlignJustify className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900 shadow-xl">
          <ul className="px-2 pt-2 pb-3 space-y-1">
            <li>
              <button
                onClick={() => handleNavigation('home')}
                className={`block w-full text-left px-3 py-3 rounded-md text-lg font-medium ${
                  currentPage === 'home'
                    ? 'text-teal-400 bg-slate-800'
                    : 'text-white hover:bg-slate-800 hover:text-teal-400'
                }`}
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('contact')}
                className={`block w-full text-left px-3 py-3 rounded-md text-lg font-medium ${
                  currentPage === 'contact'
                    ? 'text-teal-400 bg-slate-800'
                    : 'text-white hover:bg-slate-800 hover:text-teal-400'
                }`}
              >
                Contact
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;