
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Target, PenTool, Layout } from 'lucide-react';

const WizardSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upload');

  const handleNext = (nextTab: string) => {
    setActiveTab(nextTab);
  };

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Create your personalized vision board in four simple steps
          </p>
        </div>
        
        <Card className="max-w-4xl mx-auto overflow-hidden shadow-lg">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 bg-muted">
              <TabsTrigger value="upload" className="data-[state=active]:bg-background">
                <div className="flex flex-col items-center gap-1">
                  <Upload size={18} />
                  <span className="text-xs sm:text-sm">Upload</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="goals" className="data-[state=active]:bg-background">
                <div className="flex flex-col items-center gap-1">
                  <Target size={18} />
                  <span className="text-xs sm:text-sm">Goals</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="generate" className="data-[state=active]:bg-background">
                <div className="flex flex-col items-center gap-1">
                  <PenTool size={18} />
                  <span className="text-xs sm:text-sm">Generate</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="layout" className="data-[state=active]:bg-background">
                <div className="flex flex-col items-center gap-1">
                  <Layout size={18} />
                  <span className="text-xs sm:text-sm">Layout</span>
                </div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-4">Upload Your Photo</h3>
                  <p className="text-muted-foreground mb-6">
                    Start by uploading a clear photo of yourself that will be used to create personalized images.
                  </p>
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-vision-purple text-white flex items-center justify-center text-xs">1</div>
                      <span>Choose a high-quality photo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-vision-purple text-white flex items-center justify-center text-xs">2</div>
                      <span>Make sure your face is clearly visible</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-vision-purple text-white flex items-center justify-center text-xs">3</div>
                      <span>Crop and adjust as needed</span>
                    </div>
                  </div>
                  <Button 
                    className="mt-4 bg-vision-purple hover:bg-vision-darkPurple" 
                    onClick={() => handleNext('goals')}
                  >
                    Next Step
                  </Button>
                </div>
                <div className="flex items-center justify-center bg-muted/30 rounded-lg p-4">
                  <div className="w-full aspect-square max-w-[240px] border-2 border-dashed border-muted-foreground/50 rounded-lg flex flex-col items-center justify-center p-4">
                    <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-center">
                      Drag and drop your photo here or click to browse
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="goals" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-4">Enter Your Goals</h3>
                  <p className="text-muted-foreground mb-6">
                    List the goals you want to achieve this year. We'll transform these into visual representations.
                  </p>
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-vision-purple text-white flex items-center justify-center text-xs">1</div>
                      <span>Add each goal, separated by commas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-vision-purple text-white flex items-center justify-center text-xs">2</div>
                      <span>Categorize your goals (optional)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-vision-purple text-white flex items-center justify-center text-xs">3</div>
                      <span>Be specific for better visualization</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => handleNext('upload')}>
                      Previous
                    </Button>
                    <Button 
                      className="bg-vision-purple hover:bg-vision-darkPurple" 
                      onClick={() => handleNext('generate')}
                    >
                      Next Step
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <textarea 
                    className="w-full h-40 p-4 border rounded-lg focus:ring-2 focus:ring-vision-purple focus:border-vision-purple outline-none" 
                    placeholder="Enter your goals here:
                    
Example:
- Launch my product by December (Professional)
- Lose 10kg by summer (Health)
                    "
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm" className="text-xs">Professional</Button>
                    <Button variant="outline" size="sm" className="text-xs">Health</Button>
                    <Button variant="outline" size="sm" className="text-xs">Personal</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="generate" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-4">Generate Images</h3>
                  <p className="text-muted-foreground mb-6">
                    Our AI creates realistic images based on your goals, featuring your face in inspirational scenarios.
                  </p>
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-vision-purple text-white flex items-center justify-center text-xs">1</div>
                      <span>We create prompts from your goals</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-vision-purple text-white flex items-center justify-center text-xs">2</div>
                      <span>AI generates multiple options per goal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-vision-purple text-white flex items-center justify-center text-xs">3</div>
                      <span>Select your favorite images</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => handleNext('goals')}>
                      Previous
                    </Button>
                    <Button 
                      className="bg-vision-purple hover:bg-vision-darkPurple" 
                      onClick={() => handleNext('layout')}
                    >
                      Next Step
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="relative border rounded-lg overflow-hidden aspect-square bg-muted/30 group">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full border-4 border-t-vision-purple border-muted animate-spin" />
                      </div>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/50 flex items-center justify-center transition-opacity">
                        <Button variant="secondary" size="sm">Select</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="layout" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-4">Create Vision Board</h3>
                  <p className="text-muted-foreground mb-6">
                    Choose your preferred layout and customize the final vision board.
                  </p>
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-vision-purple text-white flex items-center justify-center text-xs">1</div>
                      <span>Select layout (grid or freestyle)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-vision-purple text-white flex items-center justify-center text-xs">2</div>
                      <span>Customize background and spacing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-vision-purple text-white flex items-center justify-center text-xs">3</div>
                      <span>Download high-resolution board</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => handleNext('generate')}>
                      Previous
                    </Button>
                    <Button className="bg-vision-purple hover:bg-vision-darkPurple">
                      Create Board
                    </Button>
                  </div>
                </div>
                <div className="border rounded-lg overflow-hidden aspect-[4/3] bg-white shadow-md">
                  <div className="grid grid-cols-2 gap-2 p-2 h-full">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="bg-muted/30 rounded-lg overflow-hidden shadow-sm">
                        <div className="aspect-square" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </section>
  );
};

export default WizardSection;
