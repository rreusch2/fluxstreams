import React from 'react';
import Hero from '../components/home/Hero';
import ValueProposition from '../components/home/ValueProposition';
import ConsultationSection from '../components/home/ConsultationSection';
import AutomationSection from '../components/home/AutomationSection';

interface HomePageProps {
  navigateTo: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ navigateTo }) => {
  return (
    <div>
      <Hero navigateTo={navigateTo} />
      <ValueProposition />
      <ConsultationSection navigateTo={navigateTo} />
      <AutomationSection navigateTo={navigateTo} />
    </div>
  );
};

export default HomePage;