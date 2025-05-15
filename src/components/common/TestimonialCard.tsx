import React from 'react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  index: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  quote, 
  author, 
  role, 
  company,
  index
}) => {
  // Different background colors based on index for variety
  const bgColors = [
    'bg-gradient-to-br from-teal-50 to-indigo-50 border-l-teal-400',
    'bg-gradient-to-br from-indigo-50 to-purple-50 border-l-indigo-400',
    'bg-gradient-to-br from-purple-50 to-teal-50 border-l-purple-400'
  ];
  
  const bgColor = bgColors[index % bgColors.length];
  
  return (
    <div 
      className={`${bgColor} border-l-4 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col`}
    >
      <div className="mb-4">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-teal-500 opacity-50">
          <path d="M9.59003 15.9L5.07003 15.9C4.65186 15.9 4.27003 15.5182 4.27003 15.1L4.27003 10.1C4.27003 6.2603 7.38033 3.15 11.22 3.15L11.72 3.15C12.1382 3.15 12.52 3.53184 12.52 3.95L12.52 9.15C12.52 9.56817 12.1382 9.95 11.72 9.95L9.59003 9.95L9.59003 15.9Z" fill="currentColor"/>
          <path d="M19.42 15.9L14.9 15.9C14.4818 15.9 14.1 15.5182 14.1 15.1L14.1 10.1C14.1 6.2603 17.2103 3.15 21.05 3.15L21.55 3.15C21.9682 3.15 22.35 3.53184 22.35 3.95L22.35 9.15C22.35 9.56817 21.9682 9.95 21.55 9.95L19.42 9.95L19.42 15.9Z" fill="currentColor"/>
        </svg>
      </div>
      
      <p className="italic text-slate-700 mb-4 flex-grow">{quote}</p>
      
      <div>
        <p className="font-semibold text-slate-900">{author}</p>
        <p className="text-sm text-slate-600">{role}, {company}</p>
      </div>
    </div>
  );
};

export default TestimonialCard;