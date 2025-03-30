import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageData } from '@/lib/storage';
import {
  Collage,
  CollageCell,
  PRESET_LAYOUTS,
  createCollage,
  assignImageToCell,
  removeImageFromCell,
  updateCollageLayout,
} from '@/lib/collage';
import { useToast } from '@/hooks/use-toast';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface CollageEditorProps {
  images: ImageData[];
  onSave: (collage: Collage) => void;
  initialCollage?: Collage;
}

interface DraggableImageProps {
  image: ImageData;
}

interface DroppableCellProps {
  cell: CollageCell;
  image?: ImageData;
  onDrop: (imageId: string) => void;
  onRemove: () => void;
}

const DraggableImage: React.FC<DraggableImageProps> = ({ image }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'IMAGE',
    item: { id: image.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`relative rounded-md overflow-hidden cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <img
        src={image.url}
        alt={image.name}
        className="w-full h-24 object-cover"
      />
    </div>
  );
};

const DroppableCell: React.FC<DroppableCellProps> = ({
  cell,
  image,
  onDrop,
  onRemove,
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'IMAGE',
    drop: (item: { id: string }) => onDrop(item.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        position: 'absolute',
        left: `${cell.x}%`,
        top: `${cell.y}%`,
        width: `${cell.width}%`,
        height: `${cell.height}%`,
        padding: '4px',
      }}
    >
      <div
        className={`w-full h-full rounded-md border-2 ${
          isOver
            ? 'border-primary bg-primary/20'
            : image
            ? 'border-transparent'
            : 'border-dashed border-gray-300'
        }`}
      >
        {image && (
          <div className="relative w-full h-full group">
            <img
              src={image.url}
              alt={image.name}
              className="w-full h-full object-cover rounded-md"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onRemove}
            >
              ×
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const CollageEditor: React.FC<CollageEditorProps> = ({
  images,
  onSave,
  initialCollage,
}) => {
  const [collage, setCollage] = useState<Collage>(
    initialCollage || createCollage(PRESET_LAYOUTS[0])
  );
  const { toast } = useToast();

  const handleLayoutChange = (layoutId: string) => {
    const newLayout = PRESET_LAYOUTS.find((l) => l.id === layoutId);
    if (newLayout) {
      setCollage(updateCollageLayout(collage, newLayout));
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCollage({ ...collage, name: event.target.value });
  };

  const handleImageDrop = useCallback(
    (cellId: string, imageId: string) => {
      setCollage(assignImageToCell(collage, cellId, imageId));
    },
    [collage]
  );

  const handleImageRemove = useCallback(
    (cellId: string) => {
      setCollage(removeImageFromCell(collage, cellId));
    },
    [collage]
  );

  const handleSave = () => {
    onSave(collage);
    toast({
      title: 'Collage saved',
      description: 'Your collage has been saved successfully.',
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Collage Name</Label>
              <Input
                id="name"
                value={collage.name}
                onChange={handleNameChange}
                placeholder="Enter collage name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="layout">Layout</Label>
              <Select
                value={collage.layout.id}
                onValueChange={handleLayoutChange}
              >
                <SelectTrigger id="layout">
                  <SelectValue placeholder="Select a layout" />
                </SelectTrigger>
                <SelectContent>
                  {PRESET_LAYOUTS.map((layout) => (
                    <SelectItem key={layout.id} value={layout.id}>
                      {layout.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {images.map((image) => (
            <DraggableImage key={image.id} image={image} />
          ))}
        </div>

        <div className="relative w-full aspect-square border rounded-lg">
          {collage.cells.map((cell) => (
            <DroppableCell
              key={cell.id}
              cell={cell}
              image={images.find((img) => img.id === cell.imageId)}
              onDrop={(imageId) => handleImageDrop(cell.id, imageId)}
              onRemove={() => handleImageRemove(cell.id)}
            />
          ))}
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Collage
        </Button>
      </div>
    </DndProvider>
  );
};

export default CollageEditor;
