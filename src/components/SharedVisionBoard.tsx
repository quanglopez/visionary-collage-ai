import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VisionBoard } from '@/lib/visionBoard';

interface SharedVisionBoardProps {
  board: VisionBoard;
}

const SharedVisionBoard: React.FC<SharedVisionBoardProps> = ({ board }) => {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{board.name}</h1>
        <p className="text-muted-foreground">{board.description}</p>
        <div className="flex flex-wrap gap-2">
          {board.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {board.collages.map((collage) => (
          <Card key={collage.id}>
            <CardHeader>
              <CardTitle>{collage.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-square">
                {collage.cells.map((cell) => (
                  <div
                    key={cell.id}
                    style={{
                      position: 'absolute',
                      left: `${cell.x}%`,
                      top: `${cell.y}%`,
                      width: `${cell.width}%`,
                      height: `${cell.height}%`,
                      padding: '4px',
                    }}
                  >
                    {cell.imageId && (
                      <img
                        src={cell.imageId} // In a real app, this would be the image URL
                        alt=""
                        className="w-full h-full object-cover rounded-md"
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Created with Visionary Collage AI
      </div>
    </div>
  );
};

export default SharedVisionBoard;
