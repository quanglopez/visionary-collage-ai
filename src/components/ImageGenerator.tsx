import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { Goal, GeneratedImage } from '@/contexts/VisionBoardContext';
import { useToast } from '@/hooks/use-toast';
import { generateImage, generateControlNetImage } from '@/lib/api';

interface ImageGeneratorProps {
  goals: Goal[];
  userPhoto: string | null;
  generatedImages: GeneratedImage[];
  onGenerateImage: (goalId: string, imageUrl: string) => void;
  onToggleSelection: (imageId: string) => void;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({
  goals,
  userPhoto,
  generatedImages,
  onGenerateImage,
  onToggleSelection,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateImages = async () => {
    if (!userPhoto) {
      toast({
        title: "No photo uploaded",
        description: "Please upload your photo first.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedGoal) {
      toast({
        title: "No goal selected",
        description: "Please select a goal to generate images for.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // First generate base images using DALL-E
      const baseImages = await generateImage({
        prompt: goals.find(g => g.id === selectedGoal)?.text || '',
        n: 2,
        size: '1024x1024',
        style: 'vivid'
      });

      // For each base image, apply ControlNet with user's photo
      const userPhotoFile = await fetch(userPhoto).then(res => res.blob()).then(blob => new File([blob], 'user-photo.jpg'));
      
      for (const baseImage of baseImages) {
        const baseImageFile = await fetch(baseImage.url).then(res => res.blob()).then(blob => new File([blob], 'base-image.jpg'));
        
        const controlNetResult = await generateControlNetImage({
          prompt: goals.find(g => g.id === selectedGoal)?.text || '',
          image: baseImageFile,
          mask: userPhotoFile
        });

        controlNetResult.forEach(img => {
          onGenerateImage(selectedGoal!, img.url);
        });
      }

      toast({
        title: "Images generated",
        description: "We've created personalized images based on your goal and photo.",
      });
    } catch (error) {
      console.error('Error generating images:', error);
      toast({
        title: "Error generating images",
        description: "An error occurred while generating images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Get images for the selected goal
  const goalImages = selectedGoal
    ? generatedImages.filter((img) => img.goalId === selectedGoal)
    : [];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Select a Goal to Visualize</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {goals.map((goal) => (
            <Button
              key={goal.id}
              variant={selectedGoal === goal.id ? "default" : "outline"}
              className="justify-start overflow-hidden"
              onClick={() => setSelectedGoal(goal.id)}
            >
              <span className="truncate">{goal.text}</span>
            </Button>
          ))}
        </div>
      </div>

      {selectedGoal && (
        <>
          <Button
            className="w-full bg-vision-purple hover:bg-vision-darkPurple"
            disabled={isGenerating || !userPhoto}
            onClick={handleGenerateImages}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : goalImages.length > 0 ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate Images
              </>
            ) : (
              'Generate Images'
            )}
          </Button>

          <div className="grid grid-cols-2 gap-3">
            {isGenerating
              ? Array(4)
                  .fill(0)
                  .map((_, idx) => (
                    <div
                      key={`loading-${idx}`}
                      className="relative border rounded-lg overflow-hidden aspect-square bg-muted/30"
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full border-4 border-t-vision-purple border-muted animate-spin" />
                      </div>
                    </div>
                  ))
              : goalImages.map((image) => (
                  <div
                    key={image.id}
                    className="relative border rounded-lg overflow-hidden aspect-square group"
                    onClick={() => onToggleSelection(image.id)}
                  >
                    <img
                      src={image.url}
                      alt="Generated vision"
                      className="w-full h-full object-cover"
                    />
                    <div
                      className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                        image.selected
                          ? 'bg-black/60'
                          : 'bg-black/30 opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <Button
                        variant={image.selected ? "default" : "secondary"}
                        size="sm"
                      >
                        {image.selected ? 'Selected' : 'Select'}
                      </Button>
                    </div>
                  </div>
                ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageGenerator;
