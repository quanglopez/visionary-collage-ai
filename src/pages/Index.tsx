
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';
import WizardSection from '@/components/WizardSection';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <FeatureSection />
        <WizardSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
