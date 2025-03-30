
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useVisionBoard } from '@/contexts/VisionBoardContext';
import { Share, Save, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SaveVisionBoardDialogProps {
  trigger?: React.ReactNode;
}

const SaveVisionBoardDialog: React.FC<SaveVisionBoardDialogProps> = ({ trigger }) => {
  const { state, saveBoard, shareBoard } = useVisionBoard();
  const { toast } = useToast();
  const [name, setName] = useState(state.name || '');
  const [description, setDescription] = useState(state.description || '');
  const [isPublic, setIsPublic] = useState(state.isPublic || false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState(state.shareUrl || '');
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for your vision board.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      await saveBoard(name, description, isPublic);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      const url = await shareBoard(30); // Share for 30 days
      if (url) {
        setShareUrl(url);
      }
    } finally {
      setIsSharing(false);
    }
  };
  
  const copyShareUrl = () => {
    if (!shareUrl) return;
    
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    
    toast({
      title: "Link copied",
      description: "Share link copied to clipboard.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="flex items-center gap-2">
            <Save size={16} />
            <span>Save</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Vision Board</DialogTitle>
          <DialogDescription>
            Save your vision board to access it later or share it with others.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="My Vision Board"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="My goals for 2023..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="public">Make public</Label>
              <p className="text-sm text-muted-foreground">
                Allow others to view your vision board with a link
              </p>
            </div>
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>
          
          {shareUrl && (
            <div className="grid gap-2">
              <Label>Share Link</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={shareUrl}
                  className="flex-1"
                />
                <Button 
                  size="icon" 
                  variant="outline" 
                  onClick={copyShareUrl}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </Button>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            className="sm:w-full"
            disabled={isSharing || !state.id}
            onClick={handleShare}
          >
            {isSharing ? (
              <>Sharing...</>
            ) : (
              <>
                <Share size={16} className="mr-2" />
                {shareUrl ? 'Update Share Link' : 'Create Share Link'}
              </>
            )}
          </Button>
          <Button 
            className="bg-vision-purple hover:bg-vision-darkPurple sm:w-full"
            disabled={isSaving}
            onClick={handleSave}
          >
            {isSaving ? 'Saving...' : 'Save Vision Board'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveVisionBoardDialog;
