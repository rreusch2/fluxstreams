import React from 'react';

const BenefitsCard: React.FC = () => {
  const benefits = [
    "Personalized AI opportunity assessment",
    "Custom report with actionable insights",
    "AI tool recommendations tailored to your business",
    "Implementation guidance from industry experts"
  ];

  return (
    <div className="bg-slate-800/70 backdrop-blur-md rounded-xl shadow-2xl border border-slate-700 p-6 md:p-8 h-full">
      <h3 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent mb-8">
        Free Consultation Benefits
      </h3>
      <ul className="space-y-6 text-[1.375rem] text-slate-100">
        {benefits.map((benefit, idx) => (
          <li key={idx} className="flex items-start">
            <span className="text-teal-400 mr-3 shrink-0 pt-1">✓</span>
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BenefitsCard; 