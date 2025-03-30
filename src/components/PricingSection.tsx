
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface PricingPlanProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}

const PricingPlan: React.FC<PricingPlanProps> = ({ title, price, description, features, popular }) => {
  return (
    <div className={`flex flex-col p-6 rounded-xl shadow-sm ${popular 
      ? 'border-2 border-vision-purple bg-card relative' 
      : 'border bg-card/80'}`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-vision-purple text-white px-4 py-1 rounded-full text-sm font-medium">
          Popular Choice
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <div className="flex items-end gap-1">
          <span className="text-3xl font-bold">{price}</span>
        </div>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>
      
      <div className="flex flex-col gap-3 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="text-vision-purple">
              <Check size={18} />
            </div>
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-auto">
        <Button className={`w-full ${popular 
          ? 'bg-gradient-to-r from-vision-purple to-vision-darkPurple hover:opacity-90 transition-opacity' 
          : 'bg-secondary hover:bg-secondary/80 text-foreground'}`}>
          Choose Plan
        </Button>
      </div>
    </div>
  );
};

const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="py-20">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the plan that best suits your needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <PricingPlan 
            title="Basic Vision Board"
            price="$29"
            description="One-time payment for a single personalized vision board"
            features={[
              "Upload personal photos",
              "Set and categorize goals",
              "AI-generated realistic images",
              "Custom vision board layout",
              "High-resolution download (1080p)",
              "Save vision board online"
            ]}
          />
          
          <PricingPlan 
            title="Premium Reminder"
            price="$50/year"
            description="Everything in Basic plus motivation reminders"
            features={[
              "All Basic Vision Board features",
              "Regular email reminders",
              "Customizable reminder frequency",
              "Motivational messages",
              "Multiple vision boards",
              "Priority support"
            ]}
            popular
          />
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
