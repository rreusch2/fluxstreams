import React from 'react';
import ContactForm from '../components/common/ContactForm';
// import ChatWidget from '../components/common/ChatWidget'; // Removed ChatWidget import
import ContactInfoCard from '../components/common/ContactInfoCard';
import BenefitsCard from '../components/common/BenefitsCard';
import { Mail, Phone, MapPin, Clock, Users } from 'lucide-react';

const ContactPage: React.FC = () => {
  const contactItemsData = [
    {
      icon: <MapPin className="h-5 w-5 text-teal-400" />,
      title: 'Founder',
      content: 'Reid Reusch',
      link: 'https://www.linkedin.com/in/reid-reusch-37232b48'
    },
    {
      icon: <Users className="h-5 w-5 text-teal-400" />,
      title: 'Partner',
      content: 'Jake Hobbs',
      link: 'https://www.linkedin.com/in/jake-hobbs-a05282232/'
    },
    {
      icon: <Mail className="h-5 w-5 text-teal-400" />,
      title: 'Email',
      content: 'info@fluxstreamai.com',
      link: 'mailto:info@fluxstreamai.com'
    },
    {
      icon: <Phone className="h-5 w-5 text-teal-400" />,
      title: 'Phone',
      content: '(270) 724-2404',
      link: 'tel:+12707242404'
    },
    {
      icon: <Clock className="h-5 w-5 text-teal-400" />,
      title: 'Hours',
      content: 'Monday - Friday: 8AM - 5PM EST',
      link: null
    }
  ];
  
  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-900 via-indigo-900 to-slate-900 text-white">
      {/* Page Header */}
      <div className="py-16 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Let's Start Your <span className="bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">AI Journey</span>
          </h1>
          <p className="text-slate-300 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Whether you're interested in our free consultation or a custom AI build, 
            we're excited to hear from you and explore how we can help transform your business.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Main Two-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left Column: Contact Form */}
          <div className="lg:w-1/2">
            <div className="bg-slate-800/70 backdrop-blur-md rounded-xl shadow-2xl border border-slate-700 h-full p-6 md:p-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent mb-6">
                Send Us a Message
              </h2>
              <ContactForm />
            </div>
          </div>

          {/* Right Column: Stacked Info Cards */}
          <div className="lg:w-1/2 flex flex-col gap-8 lg:gap-12">
            {/* Contact Information Card */}
            <div> {/* Wrapper div, no specific width class needed here */}
              <ContactInfoCard contactItems={contactItemsData} />
            </div>

            {/* Free Consultation Benefits Card */}
            <div> {/* Wrapper div, no specific width class needed here */}
              <BenefitsCard />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ContactPage;