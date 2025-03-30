import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { VisionBoard, getSharedBoard } from '@/lib/visionBoard';
import SharedVisionBoard from '@/components/SharedVisionBoard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Share: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [board, setBoard] = useState<VisionBoard | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (shareId) {
      const sharedBoard = getSharedBoard(shareId);
      if (sharedBoard) {
        setBoard(sharedBoard);
      } else {
        toast({
          title: 'Board not found',
          description: 'This vision board may have expired or been deleted.',
          variant: 'destructive',
        });
      }
      setLoading(false);
    }
  }, [shareId, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <h1 className="text-2xl font-bold">Vision Board Not Found</h1>
        <p className="text-muted-foreground">
          This vision board may have expired or been deleted.
        </p>
        <Button onClick={() => window.location.href = '/'}>
          Go to Homepage
        </Button>
      </div>
    );
  }

  return <SharedVisionBoard board={board} />;
};

export default Share;
