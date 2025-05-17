import React from 'react';
import { Cpu, Linkedin, Twitter, Mail } from 'lucide-react';

interface FooterProps {
  navigateTo: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ navigateTo }) => {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Cpu className="h-6 w-6 mr-2 text-teal-400" />
              <span className="font-bold text-xl bg-gradient-to-r from-teal-400 to-indigo-500 bg-clip-text text-transparent">
                Reusch Automate
              </span>
            </div>
            <p className="text-slate-300 text-base md:text-lg mb-4 leading-relaxed">
              Transforming businesses through intelligent AI automation and custom solutions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-300 hover:text-teal-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-300 hover:text-teal-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-300 hover:text-teal-400 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigateTo('home')}
                  className="text-slate-300 hover:text-teal-400 transition-colors text-sm"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="text-slate-300 hover:text-teal-400 transition-colors text-sm"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="not-italic text-sm text-slate-300 space-y-2">
              <p>Reid Reusch</p>
              <p>info@reuschai.com</p>
              <p>(270) 724-2404</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Reusch Automate. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 text-sm text-slate-400">
            <a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a>
            <span className="mx-2">|</span>
            <a href="#" className="hover:text-teal-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;