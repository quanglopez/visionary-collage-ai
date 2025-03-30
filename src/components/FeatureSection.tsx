
import React from 'react';
import { Upload, Target, PenTool, Layout, Bell, UserCircle } from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col gap-4 p-6 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-vision-lightPurple text-vision-purple">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const FeatureSection: React.FC = () => {
  const features = [
    {
      icon: <Upload size={24} />,
      title: "Upload Photos",
      description: "Upload your personal photos with support for PNG, JPEG, and cropping tools for perfect fit."
    },
    {
      icon: <Target size={24} />,
      title: "Enter Goals",
      description: "Simply type your goals and our system automatically categorizes them for better visualization."
    },
    {
      icon: <PenTool size={24} />,
      title: "Generate Images",
      description: "AI creates realistic images integrating your face in scenarios representing your goals."
    },
    {
      icon: <Layout size={24} />,
      title: "Create Vision Board",
      description: "Customize layouts, backgrounds, and spacing to create a perfect 1080p vision board."
    },
    {
      icon: <Bell size={24} />,
      title: "Regular Reminders",
      description: "Subscribe for periodic email reminders with motivational messages to stay focused."
    },
    {
      icon: <UserCircle size={24} />,
      title: "User-friendly Interface",
      description: "Step-by-step wizard guides you through the entire process with previews at each stage."
    },
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Features</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to transform your goals into visual inspiration
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
