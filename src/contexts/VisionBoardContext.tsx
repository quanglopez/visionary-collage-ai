
import React, { createContext, useContext, useState } from 'react';

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
  userPhoto: string | null;
  goals: Goal[];
  generatedImages: GeneratedImage[];
  selectedLayout: 'grid' | 'freestyle';
  backgroundColor: string;
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

  const clearBoard = () => {
    setState(defaultState);
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
