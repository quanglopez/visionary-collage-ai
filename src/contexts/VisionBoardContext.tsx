
import React, { createContext, useContext, useState } from 'react';
import { saveVisionBoard, getVisionBoards, getVisionBoard, updateVisionBoard, shareVisionBoard, deleteVisionBoard } from '@/lib/api/visionboard';
import { useToast } from '@/hooks/use-toast';

export type Goal = {
  id: string;
  text: string;
  category?: string;
};

export type GeneratedImage = {
  id: string;
  goalId: string;
  url: string;
  selected: boolean;
};

export type VisionBoardState = {
  id?: string;
  name?: string;
  description?: string;
  userPhoto: string | null;
  goals: Goal[];
  generatedImages: GeneratedImage[];
  selectedLayout: 'grid' | 'freestyle';
  backgroundColor: string;
  isPublic?: boolean;
  shareUrl?: string;
};

type VisionBoardContextType = {
  state: VisionBoardState;
  uploadPhoto: (photoUrl: string) => void;
  addGoal: (goalText: string, category?: string) => void;
  removeGoal: (goalId: string) => void;
  updateGoal: (goalId: string, updates: Partial<Omit<Goal, 'id'>>) => void;
  addGeneratedImage: (goalId: string, imageUrl: string) => void;
  toggleImageSelection: (imageId: string) => void;
  setLayout: (layout: 'grid' | 'freestyle') => void;
  setBackgroundColor: (color: string) => void;
  clearBoard: () => void;
  saveBoard: (name: string, description?: string, isPublic?: boolean, tags?: string[]) => Promise<string | null>;
  loadBoard: (id: string, shareId?: string) => Promise<boolean>;
  loadMyBoards: () => Promise<Array<{ id: string; name: string; description?: string; updatedAt: string }>>;
  shareBoard: (expiresInDays?: number) => Promise<string | null>;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setIsPublic: (isPublic: boolean) => void;
};

const defaultState: VisionBoardState = {
  userPhoto: null,
  goals: [],
  generatedImages: [],
  selectedLayout: 'grid',
  backgroundColor: '#ffffff',
};

export const VisionBoardContext = createContext<VisionBoardContextType | undefined>(undefined);

export const VisionBoardProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [state, setState] = useState<VisionBoardState>(defaultState);
  const { toast } = useToast();

  const uploadPhoto = (photoUrl: string) => {
    setState((prev) => ({
      ...prev,
      userPhoto: photoUrl,
    }));
  };

  const addGoal = (goalText: string, category?: string) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      text: goalText,
      category,
    };

    setState((prev) => ({
      ...prev,
      goals: [...prev.goals, newGoal],
    }));
  };

  const removeGoal = (goalId: string) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.filter((goal) => goal.id !== goalId),
    }));
  };

  const updateGoal = (goalId: string, updates: Partial<Omit<Goal, 'id'>>) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((goal) =>
        goal.id === goalId ? { ...goal, ...updates } : goal
      ),
    }));
  };

  const addGeneratedImage = (goalId: string, imageUrl: string) => {
    const newImage: GeneratedImage = {
      id: Date.now().toString(),
      goalId,
      url: imageUrl,
      selected: false,
    };

    setState((prev) => ({
      ...prev,
      generatedImages: [...prev.generatedImages, newImage],
    }));
  };

  const toggleImageSelection = (imageId: string) => {
    setState((prev) => ({
      ...prev,
      generatedImages: prev.generatedImages.map((img) =>
        img.id === imageId ? { ...img, selected: !img.selected } : img
      ),
    }));
  };

  const setLayout = (layout: 'grid' | 'freestyle') => {
    setState((prev) => ({
      ...prev,
      selectedLayout: layout,
    }));
  };

  const setBackgroundColor = (color: string) => {
    setState((prev) => ({
      ...prev,
      backgroundColor: color,
    }));
  };

  const setName = (name: string) => {
    setState((prev) => ({
      ...prev,
      name,
    }));
  };
  
  const setDescription = (description: string) => {
    setState((prev) => ({
      ...prev,
      description,
    }));
  };
  
  const setIsPublic = (isPublic: boolean) => {
    setState((prev) => ({
      ...prev,
      isPublic,
    }));
  };

  const clearBoard = () => {
    setState(defaultState);
  };
  
  // New functions for saving, loading, and sharing
  const saveBoard = async (name: string, description?: string, isPublic = false, tags?: string[]): Promise<string | null> => {
    try {
      const boardData = { ...state, name, description, isPublic };
      
      let response;
      if (state.id) {
        // Update existing board
        response = await updateVisionBoard(state.id, {
          name,
          description,
          boardData,
          isPublic,
          tags
        });
        
        toast({
          title: "Vision board updated",
          description: "Your vision board has been updated successfully.",
        });
      } else {
        // Create new board
        response = await saveVisionBoard({
          name,
          description,
          boardData,
          isPublic,
          tags
        });
        
        toast({
          title: "Vision board saved",
          description: "Your vision board has been saved successfully.",
        });
      }
      
      // Update state with returned data
      setState((prev) => ({
        ...prev,
        id: response.id,
        name: response.name,
        description: response.description,
        isPublic: response.isPublic,
        shareUrl: response.shareUrl,
      }));
      
      return response.id;
    } catch (error) {
      console.error("Error saving vision board:", error);
      toast({
        title: "Error saving vision board",
        description: "There was a problem saving your vision board.",
        variant: "destructive",
      });
      return null;
    }
  };
  
  const loadBoard = async (id: string, shareId?: string): Promise<boolean> => {
    try {
      const board = await getVisionBoard(id, shareId);
      
      if (!board) {
        toast({
          title: "Board not found",
          description: "The vision board you're looking for doesn't exist or you don't have access to it.",
          variant: "destructive",
        });
        return false;
      }
      
      // Load board data into state
      setState({
        ...board.boardData,
        id: board.id,
        name: board.name,
        description: board.description,
        isPublic: board.isPublic,
        shareUrl: board.shareUrl,
      });
      
      toast({
        title: "Vision board loaded",
        description: "The vision board has been loaded successfully.",
      });
      
      return true;
    } catch (error) {
      console.error("Error loading vision board:", error);
      toast({
        title: "Error loading vision board",
        description: "There was a problem loading the vision board.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const loadMyBoards = async () => {
    try {
      const boards = await getVisionBoards();
      
      return boards.map(board => ({
        id: board.id,
        name: board.name,
        description: board.description,
        updatedAt: board.updatedAt,
      }));
    } catch (error) {
      console.error("Error loading vision boards:", error);
      toast({
        title: "Error loading vision boards",
        description: "There was a problem loading your vision boards.",
        variant: "destructive",
      });
      return [];
    }
  };
  
  const shareBoard = async (expiresInDays?: number): Promise<string | null> => {
    try {
      if (!state.id) {
        toast({
          title: "Save board first",
          description: "Please save your board before sharing it.",
          variant: "destructive",
        });
        return null;
      }
      
      const response = await shareVisionBoard(state.id, expiresInDays);
      
      setState((prev) => ({
        ...prev,
        shareUrl: response.shareUrl,
      }));
      
      toast({
        title: "Vision board shared",
        description: "Your vision board can now be shared with others.",
      });
      
      return response.shareUrl;
    } catch (error) {
      console.error("Error sharing vision board:", error);
      toast({
        title: "Error sharing vision board",
        description: "There was a problem sharing your vision board.",
        variant: "destructive",
      });
      return null;
    }
  };

  return (
    <VisionBoardContext.Provider
      value={{
        state,
        uploadPhoto,
        addGoal,
        removeGoal,
        updateGoal,
        addGeneratedImage,
        toggleImageSelection,
        setLayout,
        setBackgroundColor,
        clearBoard,
        saveBoard,
        loadBoard,
        loadMyBoards,
        shareBoard,
        setName,
        setDescription,
        setIsPublic,
      }}
    >
      {children}
    </VisionBoardContext.Provider>
  );
};

export const useVisionBoard = () => {
  const context = useContext(VisionBoardContext);
  if (context === undefined) {
    throw new Error('useVisionBoard must be used within a VisionBoardProvider');
  }
  return context;
};
