import { v4 as uuidv4 } from 'uuid';
import { Collage } from './collage';

export interface VisionBoard {
  id: string;
  name: string;
  description: string;
  collages: Collage[];
  isPublic: boolean;
  shareUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  tags: string[];
}

export interface VisionBoardShare {
  id: string;
  boardId: string;
  shareUrl: string;
  expiresAt?: Date;
  createdAt: Date;
}

// In a real app, this would be stored in a database
let visionBoards: VisionBoard[] = [];
let sharedBoards: VisionBoardShare[] = [];

export const createVisionBoard = (
  name: string,
  description: string,
  userId: string,
  tags: string[] = []
): VisionBoard => {
  const now = new Date();
  const board: VisionBoard = {
    id: uuidv4(),
    name,
    description,
    collages: [],
    isPublic: false,
    createdAt: now,
    updatedAt: now,
    userId,
    tags,
  };

  visionBoards.push(board);
  return board;
};

export const updateVisionBoard = (
  boardId: string,
  updates: Partial<VisionBoard>
): VisionBoard | null => {
  const index = visionBoards.findIndex((board) => board.id === boardId);
  if (index === -1) return null;

  const updatedBoard = {
    ...visionBoards[index],
    ...updates,
    updatedAt: new Date(),
  };

  visionBoards[index] = updatedBoard;
  return updatedBoard;
};

export const deleteVisionBoard = (boardId: string): boolean => {
  const initialLength = visionBoards.length;
  visionBoards = visionBoards.filter((board) => board.id !== boardId);
  // Also delete any shares
  sharedBoards = sharedBoards.filter((share) => share.boardId !== boardId);
  return visionBoards.length < initialLength;
};

export const getVisionBoard = (boardId: string): VisionBoard | null => {
  return visionBoards.find((board) => board.id === boardId) || null;
};

export const getUserBoards = (userId: string): VisionBoard[] => {
  return visionBoards.filter((board) => board.userId === userId);
};

export const addCollageToBoard = (
  boardId: string,
  collage: Collage
): VisionBoard | null => {
  const board = getVisionBoard(boardId);
  if (!board) return null;

  board.collages.push(collage);
  board.updatedAt = new Date();
  return board;
};

export const removeCollageFromBoard = (
  boardId: string,
  collageId: string
): VisionBoard | null => {
  const board = getVisionBoard(boardId);
  if (!board) return null;

  board.collages = board.collages.filter((c) => c.id !== collageId);
  board.updatedAt = new Date();
  return board;
};

export const shareVisionBoard = (
  boardId: string,
  expiresInDays?: number
): VisionBoardShare | null => {
  const board = getVisionBoard(boardId);
  if (!board) return null;

  // Create a unique share URL
  const shareId = uuidv4();
  const shareUrl = `${window.location.origin}/share/${shareId}`;
  
  const share: VisionBoardShare = {
    id: shareId,
    boardId,
    shareUrl,
    expiresAt: expiresInDays ? new Date(Date.now() + expiresInDays * 86400000) : undefined,
    createdAt: new Date(),
  };

  sharedBoards.push(share);
  
  // Update the board with the share URL
  board.isPublic = true;
  board.shareUrl = shareUrl;
  board.updatedAt = new Date();

  return share;
};

export const getSharedBoard = (shareId: string): VisionBoard | null => {
  const share = sharedBoards.find((s) => s.id === shareId);
  if (!share) return null;

  // Check if share has expired
  if (share.expiresAt && share.expiresAt < new Date()) {
    return null;
  }

  return getVisionBoard(share.boardId);
};

export const searchVisionBoards = (
  query: string,
  userId?: string
): VisionBoard[] => {
  const normalizedQuery = query.toLowerCase();
  return visionBoards.filter((board) => {
    // If userId is provided, only search user's boards
    if (userId && board.userId !== userId) return false;

    return (
      board.name.toLowerCase().includes(normalizedQuery) ||
      board.description.toLowerCase().includes(normalizedQuery) ||
      board.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
    );
  });
};
