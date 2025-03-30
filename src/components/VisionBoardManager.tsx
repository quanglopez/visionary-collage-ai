import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Share2, Pencil, Trash2, Plus } from 'lucide-react';
import {
  VisionBoard,
  createVisionBoard,
  updateVisionBoard,
  deleteVisionBoard,
  shareVisionBoard,
} from '@/lib/visionBoard';

interface VisionBoardManagerProps {
  boards: VisionBoard[];
  userId: string;
  onBoardsChange: (boards: VisionBoard[]) => void;
  onBoardSelect: (board: VisionBoard) => void;
}

interface BoardFormData {
  name: string;
  description: string;
  tags: string;
}

const VisionBoardManager: React.FC<VisionBoardManagerProps> = ({
  boards,
  userId,
  onBoardsChange,
  onBoardSelect,
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<VisionBoard | null>(null);
  const [formData, setFormData] = useState<BoardFormData>({
    name: '',
    description: '',
    tags: '',
  });
  const { toast } = useToast();

  const handleCreateBoard = () => {
    const tags = formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
    const newBoard = createVisionBoard(
      formData.name,
      formData.description,
      userId,
      tags
    );
    onBoardsChange([...boards, newBoard]);
    setIsCreateDialogOpen(false);
    setFormData({ name: '', description: '', tags: '' });
    
    toast({
      title: 'Vision Board Created',
      description: 'Your new vision board has been created successfully.',
    });
  };

  const handleUpdateBoard = () => {
    if (!editingBoard) return;

    const tags = formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
    const updatedBoard = updateVisionBoard(editingBoard.id, {
      name: formData.name,
      description: formData.description,
      tags,
    });

    if (updatedBoard) {
      onBoardsChange(
        boards.map((board) =>
          board.id === updatedBoard.id ? updatedBoard : board
        )
      );
      setEditingBoard(null);
      setFormData({ name: '', description: '', tags: '' });
      
      toast({
        title: 'Vision Board Updated',
        description: 'Your vision board has been updated successfully.',
      });
    }
  };

  const handleDeleteBoard = (boardId: string) => {
    if (deleteVisionBoard(boardId)) {
      onBoardsChange(boards.filter((board) => board.id !== boardId));
      
      toast({
        title: 'Vision Board Deleted',
        description: 'Your vision board has been deleted successfully.',
      });
    }
  };

  const handleShareBoard = async (board: VisionBoard) => {
    const share = shareVisionBoard(board.id, 7); // Share for 7 days
    if (share) {
      // Copy share URL to clipboard
      await navigator.clipboard.writeText(share.shareUrl);
      
      toast({
        title: 'Share Link Copied',
        description: 'The share link has been copied to your clipboard.',
      });
    }
  };

  const handleEdit = (board: VisionBoard) => {
    setEditingBoard(board);
    setFormData({
      name: board.name,
      description: board.description,
      tags: board.tags.join(', '),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Vision Boards</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Vision Board
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Vision Board</DialogTitle>
              <DialogDescription>
                Create a new vision board to organize your collages and goals.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="My Vision Board"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="What's this vision board about?"
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="personal, goals, 2024"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateBoard}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boards.map((board) => (
          <Card key={board.id} className="group">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span className="truncate">{board.name}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(board)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleShareBoard(board)}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteBoard(board.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>{board.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {board.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onBoardSelect(board)}
              >
                View Board
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {editingBoard && (
        <Dialog open={true} onOpenChange={() => setEditingBoard(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Vision Board</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
                <Input
                  id="edit-tags"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingBoard(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateBoard}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default VisionBoardManager;
