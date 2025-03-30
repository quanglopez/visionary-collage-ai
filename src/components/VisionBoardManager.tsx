
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout, Star, Users, Settings } from 'lucide-react';
import SaveVisionBoardDialog from './SaveVisionBoardDialog';

const VisionBoardManager: React.FC = () => {
  return (
    <Card className="p-6">
      <Tabs defaultValue="layout">
        <TabsList className="mb-6">
          <TabsTrigger value="layout">
            <Layout className="mr-2 h-4 w-4" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Star className="mr-2 h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="sharing">
            <Users className="mr-2 h-4 w-4" />
            Sharing
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="layout">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Current Board</h2>
              <p className="text-muted-foreground mb-4">
                Save your current vision board or view your previous boards
              </p>
              
              <div className="flex flex-wrap gap-3">
                <SaveVisionBoardDialog />
                
                <Button variant="outline" asChild>
                  <Link to="/my-boards">My Vision Boards</Link>
                </Button>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-2">Layout Options</h2>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto py-4 flex flex-col">
                  <div className="grid grid-cols-2 gap-1 mb-2">
                    <div className="bg-muted rounded aspect-square"></div>
                    <div className="bg-muted rounded aspect-square"></div>
                    <div className="bg-muted rounded aspect-square"></div>
                    <div className="bg-muted rounded aspect-square"></div>
                  </div>
                  <span>Grid</span>
                </Button>
                
                <Button variant="outline" className="h-auto py-4 flex flex-col">
                  <div className="flex flex-wrap gap-1 mb-2">
                    <div className="bg-muted rounded w-1/3 aspect-square"></div>
                    <div className="bg-muted rounded w-1/2 aspect-video"></div>
                    <div className="bg-muted rounded w-1/4 aspect-square"></div>
                    <div className="bg-muted rounded w-2/5 aspect-video"></div>
                  </div>
                  <span>Freestyle</span>
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="templates">
          <div>
            <h2 className="text-xl font-bold mb-2">Vision Board Templates</h2>
            <p className="text-muted-foreground mb-4">
              Choose from professionally designed templates
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="relative aspect-video bg-muted rounded-lg overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="sm">Use Template</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="sharing">
          <div>
            <h2 className="text-xl font-bold mb-2">Share Your Vision Board</h2>
            <p className="text-muted-foreground mb-4">
              Share your vision board with others or keep it private
            </p>
            
            <div className="space-y-4">
              <SaveVisionBoardDialog />
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-1">Privacy Options</h3>
                <p className="text-sm text-muted-foreground">
                  When you save your board, you can choose whether to make it public or private.
                  Public boards can be shared via a link.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Board Settings</h2>
              <p className="text-muted-foreground mb-4">
                Customize how your vision board looks and functions
              </p>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-1">Download Options</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Choose how to export your vision board
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Download PNG</Button>
                    <Button variant="outline" size="sm">Download PDF</Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-1">Account Settings</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Manage your account preferences
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/my-boards">
                      My Vision Boards
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default VisionBoardManager;
