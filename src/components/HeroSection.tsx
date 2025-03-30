
import React from 'react';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-vision-lightPurple/30 to-transparent -z-10" />
      
      <div className="container px-4 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <div className="flex flex-col gap-6 max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Transform Your Goals Into <span className="text-gradient">Visual Reality</span>
            </h1>
            
            <p className="text-lg text-muted-foreground">
              Create personalized vision boards with your face in inspiring scenarios 
              that represent your goals. Visualize your success and stay motivated.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button className="bg-gradient-to-r from-vision-purple to-vision-darkPurple hover:opacity-90 transition-opacity h-12 px-8 text-lg">
                Create Your Vision Board
              </Button>
              <Button variant="outline" className="h-12 px-8 text-lg">
                Learn More
              </Button>
            </div>
          </div>
          
          {/* Right column - Vision board preview */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-vision-lightPurple/20 border border-vision-lightPurple/50 shadow-xl animate-float">
              <div className="grid grid-cols-2 gap-2 p-2 h-full">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="bg-white/50 rounded-lg overflow-hidden shadow-md animate-pulse-light" style={{
                    animationDelay: `${item * 0.2}s`
                  }}>
                    <div className="aspect-square bg-gradient-to-br from-vision-purple/10 to-vision-blue/10" />
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-lg font-medium text-vision-darkPurple">Your Vision Board Preview</p>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -z-10 -right-10 -bottom-10 w-40 h-40 bg-vision-purple/10 rounded-full blur-3xl" />
            <div className="absolute -z-10 -left-5 -top-5 w-20 h-20 bg-vision-blue/10 rounded-full blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
