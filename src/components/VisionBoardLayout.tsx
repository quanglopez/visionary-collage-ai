
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GeneratedImage } from '@/contexts/VisionBoardContext';
import { Grid, Layout as LayoutIcon, Download } from 'lucide-react';

interface VisionBoardLayoutProps {
  selectedImages: GeneratedImage[];
  layout: 'grid' | 'freestyle';
  backgroundColor: string;
  onLayoutChange: (layout: 'grid' | 'freestyle') => void;
  onBackgroundColorChange: (color: string) => void;
}

const VisionBoardLayout: React.FC<VisionBoardLayoutProps> = ({
  selectedImages,
  layout,
  backgroundColor,
  onLayoutChange,
  onBackgroundColorChange,
}) => {
  const handleDownload = () => {
    // In a real app, we would generate and download the vision board
    alert('In a real application, this would download your vision board.');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Customize Your Vision Board</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Layout Style</label>
            <div className="flex gap-2">
              <Button
                variant={layout === 'grid' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => onLayoutChange('grid')}
              >
                <Grid className="mr-2 h-4 w-4" /> Grid
              </Button>
              <Button
                variant={layout === 'freestyle' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => onLayoutChange('freestyle')}
              >
                <LayoutIcon className="mr-2 h-4 w-4" /> Freestyle
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Background Color</label>
            <div className="flex gap-2 items-center">
              <div 
                className="w-10 h-10 rounded-md border border-input" 
                style={{ backgroundColor }}
              />
              <Input
                type="color"
                value={backgroundColor}
                onChange={(e) => onBackgroundColorChange(e.target.value)}
                className="w-full h-10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden shadow-md">
        <div 
          className="p-3"
          style={{ backgroundColor }}
        >
          <div className={`grid ${layout === 'grid' ? 'grid-cols-2 gap-3' : 'grid-cols-1 gap-4'}`}>
            {selectedImages.length > 0 ? (
              selectedImages.map((image) => (
                <div 
                  key={image.id} 
                  className={`
                    ${layout === 'grid' 
                      ? 'aspect-square' 
                      : 'aspect-video mx-auto max-w-sm'
                    }
                    bg-white rounded-lg overflow-hidden shadow
                  `}
                >
                  <img 
                    src={image.url} 
                    alt="Vision board item" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="col-span-2 flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <LayoutIcon className="h-12 w-12 mb-2" />
                <p>Select images from the previous step to create your vision board</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Button
        className="w-full bg-vision-purple hover:bg-vision-darkPurple"
        disabled={selectedImages.length === 0}
        onClick={handleDownload}
      >
        <Download className="mr-2 h-4 w-4" /> Download Vision Board
      </Button>
    </div>
  );
};

export default VisionBoardLayout;
