import React from 'react';

interface ContactItem {
  icon: JSX.Element;
  title: string;
  content: string;
  link: string | null;
}

interface ContactInfoCardProps {
  contactItems: ContactItem[];
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({ contactItems }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-xl border border-slate-700 h-full">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent mb-6">
        Contact Information
      </h2>
      <div className="space-y-5">
        {contactItems.map((item, index) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0 mt-1 mr-4 text-teal-400">
              {item.icon}
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">
                {item.title}
              </h3>
              {item.link ? (
                <a 
                  href={item.link}
                  className="text-slate-300 hover:text-teal-400 transition-colors"
                >
                  {item.content}
                </a>
              ) : (
                <p className="text-slate-300">{item.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactInfoCard; 