import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageData, uploadImage, deleteImage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Upload } from 'lucide-react';

interface ImageManagerProps {
  images: ImageData[];
  onImagesChange: (images: ImageData[]) => void;
}

const ImageManager: React.FC<ImageManagerProps> = ({ images, onImagesChange }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => uploadImage(file));
      const newImages = await Promise.all(uploadPromises);
      
      onImagesChange([...images, ...newImages]);
      
      toast({
        title: 'Images uploaded',
        description: `Successfully uploaded ${files.length} image${files.length > 1 ? 's' : ''}.`,
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload one or more images.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = useCallback((imageId: string) => {
    deleteImage(imageId);
    onImagesChange(images.filter(img => img.id !== imageId));
    
    toast({
      title: 'Image deleted',
      description: 'The image has been removed from your library.',
    });
  }, [images, onImagesChange, toast]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="images">Upload Images</Label>
        <div className="flex items-center gap-4">
          <Input
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
          <Button
            asChild
            variant="outline"
            className="w-full"
            disabled={isUploading}
          >
            <label htmlFor="images" className="cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Select Images'}
            </label>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="group relative aspect-square rounded-lg overflow-hidden border"
          >
            <img
              src={image.url}
              alt={image.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => handleDelete(image.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageManager;
