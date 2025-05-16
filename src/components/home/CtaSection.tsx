import React from 'react';
import Button from '../common/Button';
import { Zap } from 'lucide-react';

interface CtaSectionProps {
  navigateTo: (page: string) => void;
}

const CtaSection: React.FC<CtaSectionProps> = ({ navigateTo }) => {
  return (
    <section className="py-16 bg-gradient-to-r from-indigo-600 to-teal-500 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 motion-safe:animate-subtle-float">
        <div className="absolute top-0 left-0 w-full h-full" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               backgroundSize: '30px 30px'
             }}
        ></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center" data-aos="zoom-in-up">
          <Zap className="h-12 w-12 mx-auto mb-6 text-yellow-300" />
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Business with AI?
          </h2>
          
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Book your free AI consultation today and discover how custom AI solutions can 
            streamline your operations, enhance customer experience, and drive growth.
          </p>
          
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigateTo('contact')}
            className="bg-white text-indigo-600 hover:bg-white/90 hover:text-indigo-700"
          >
            Book Your Free Consultation
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;