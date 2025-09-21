
import React from 'react';
import Navigation from '@/components/Navigation';
import HeroSlider from '@/components/HeroSlider';
import AboutSection from '@/components/AboutSection';
import PropertiesSection from '@/components/PropertiesSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSlider />
      <PropertiesSection />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default Index;
