
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useVisionBoard } from '@/contexts/VisionBoardContext';
import { PlusCircle, Search, Eye, Share2, Trash2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { deleteVisionBoard, shareVisionBoard } from '@/lib/api/visionboard';

interface BoardItemProps {
  id: string;
  name: string;
  description?: string;
  updatedAt: string;
  onDelete: () => void;
  onShare: () => Promise<string | null>;
}

const BoardItem: React.FC<BoardItemProps> = ({ 
  id, name, description, updatedAt, onDelete, onShare 
}) => {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();
  
  const handleShare = async () => {
    if (isSharing) return;
    
    setIsSharing(true);
    try {
      const url = await onShare();
      if (url) {
        setShareUrl(url);
        navigator.clipboard.writeText(url);
        
        toast({
          title: "Link copied!",
          description: "Share link copied to clipboard.",
        });
      }
    } finally {
      setIsSharing(false);
    }
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold truncate">{name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {description || "No description"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock size={14} className="mr-1" /> 
          Updated {format(new Date(updatedAt), 'MMM d, yyyy')}
        </div>
      </CardContent>
      <CardFooter className="pt-4 flex justify-between gap-2 flex-wrap">
        <Button asChild variant="outline" size="sm">
          <Link to={`/board/${id}`}>
            <Eye size={16} className="mr-1" /> View
          </Link>
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            disabled={isSharing}
          >
            <Share2 size={16} className="mr-1" /> {isSharing ? "Sharing..." : "Share"}
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Trash2 size={16} className="mr-1 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Vision Board</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-destructive">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
};

const MyBoards: React.FC = () => {
  const [boards, setBoards] = useState<Array<{
    id: string;
    name: string;
    description?: string;
    updatedAt: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { loadMyBoards } = useVisionBoard();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchBoards = async () => {
      setIsLoading(true);
      try {
        const boardList = await loadMyBoards();
        setBoards(boardList);
      } catch (error) {
        console.error('Error loading boards:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBoards();
  }, [loadMyBoards]);
  
  const filteredBoards = searchQuery
    ? boards.filter(board => 
        board.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (board.description && board.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : boards;
    
  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteVisionBoard(id);
      
      setBoards(prevBoards => prevBoards.filter(board => board.id !== id));
      
      toast({
        title: "Vision board deleted",
        description: `"${name}" has been deleted.`,
      });
    } catch (error) {
      console.error('Error deleting board:', error);
      toast({
        title: "Error deleting vision board",
        description: "There was a problem deleting your vision board.",
        variant: "destructive",
      });
    }
  };
  
  const handleShare = async (id: string) => {
    try {
      const result = await shareVisionBoard(id, 30);
      return result.shareUrl;
    } catch (error) {
      console.error('Error sharing board:', error);
      toast({
        title: "Error sharing vision board",
        description: "There was a problem creating a share link.",
        variant: "destructive",
      });
      return null;
    }
  };
  
  return (
    <>
      <Header />
      <main className="container px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Vision Boards</h1>
              <p className="text-muted-foreground">
                Manage and view all your saved vision boards
              </p>
            </div>
            
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search boards..."
                  className="pl-10 w-full md:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button className="bg-vision-purple hover:bg-vision-darkPurple" asChild>
                <Link to="/">
                  <PlusCircle size={18} className="mr-2" />
                  New Board
                </Link>
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="h-[200px]">
                  <CardHeader>
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-9 w-[100px]" />
                    <div className="ml-auto flex gap-2">
                      <Skeleton className="h-9 w-[40px]" />
                      <Skeleton className="h-9 w-[40px]" />
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredBoards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBoards.map((board) => (
                <BoardItem
                  key={board.id}
                  id={board.id}
                  name={board.name}
                  description={board.description}
                  updatedAt={board.updatedAt}
                  onDelete={() => handleDelete(board.id, board.name)}
                  onShare={() => handleShare(board.id)}
                />
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-12">
              <p className="text-xl font-medium mb-2">No matching boards found</p>
              <p className="text-muted-foreground mb-6">
                Try a different search term
              </p>
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl font-medium mb-2">You don't have any vision boards yet</p>
              <p className="text-muted-foreground mb-6">
                Create your first vision board to visualize your goals
              </p>
              <Button 
                className="bg-vision-purple hover:bg-vision-darkPurple"
                asChild
              >
                <Link to="/">
                  <PlusCircle size={18} className="mr-2" />
                  Create Vision Board
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MyBoards;
