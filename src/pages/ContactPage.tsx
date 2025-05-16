import React from 'react';
import ContactForm from '../components/common/ContactForm';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const ContactPage: React.FC = () => {
  const contactItems = [
    {
      icon: <Mail className="h-5 w-5 text-teal-500" />,
      title: 'Email',
      content: 'info@reuschai.com',
      link: 'mailto:info@reuschai.com'
    },
    {
      icon: <Phone className="h-5 w-5 text-teal-500" />,
      title: 'Phone',
      content: '(555) 123-4567',
      link: 'tel:+15551234567'
    },
    {
      icon: <MapPin className="h-5 w-5 text-teal-500" />,
      title: 'Address',
      content: '123 AI Boulevard, Tech District, CA 94103',
      link: 'https://maps.google.com'
    },
    {
      icon: <Clock className="h-5 w-5 text-teal-500" />,
      title: 'Hours',
      content: 'Monday - Friday: 9AM - 5PM PST',
      link: null
    }
  ];
  
  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      {/* Page Header */}
      <div className="bg-slate-900 py-16 mb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Let's Start Your <span className="bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">AI Journey</span>
          </h1>
          <p className="text-slate-300 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
            Whether you're interested in our free consultation or a custom AI build, 
            we're excited to hear from you and explore how we can help transform your business.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Get in Touch
              </h2>
              <ContactForm />
            </div>
          </div>
          
          {/* Contact Information */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                Contact Information
              </h2>
              
              <div className="space-y-4">
                {contactItems.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-1 mr-3">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">
                        {item.title}
                      </h3>
                      {item.link ? (
                        <a 
                          href={item.link}
                          className="text-slate-600 hover:text-teal-500 transition-colors"
                        >
                          {item.content}
                        </a>
                      ) : (
                        <p className="text-base md:text-lg text-slate-600">{item.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-100">
              <h3 className="font-semibold text-indigo-800 mb-3">
                Free Consultation Benefits
              </h3>
              <ul className="space-y-3 text-base md:text-lg">
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">✓</span>
                  <span className="text-slate-700">Personalized AI opportunity assessment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">✓</span>
                  <span className="text-slate-700">Custom report with actionable insights</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">✓</span>
                  <span className="text-slate-700">AI tool recommendations tailored to your business</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">✓</span>
                  <span className="text-slate-700">Implementation guidance from industry experts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;