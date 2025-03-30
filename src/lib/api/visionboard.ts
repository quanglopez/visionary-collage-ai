
import axios from 'axios';
import { VisionBoardState } from '@/contexts/VisionBoardContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Add auth token to all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface SaveVisionBoardParams {
  name: string;
  description?: string;
  boardData: VisionBoardState;
  isPublic?: boolean;
  tags?: string[];
}

export interface VisionBoardResponse {
  id: string;
  name: string;
  description?: string;
  boardData: VisionBoardState;
  isPublic: boolean;
  shareUrl?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  tags: string[];
}

export const saveVisionBoard = async (params: SaveVisionBoardParams): Promise<VisionBoardResponse> => {
  try {
    const response = await axios.post(`${API_URL}/boards`, params);
    return response.data;
  } catch (error) {
    console.error('Error saving vision board:', error);
    throw error;
  }
};

export const getVisionBoards = async (): Promise<VisionBoardResponse[]> => {
  try {
    const response = await axios.get(`${API_URL}/boards`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vision boards:', error);
    return [];
  }
};

export const getVisionBoard = async (id: string, shareId?: string): Promise<VisionBoardResponse | null> => {
  try {
    const response = await axios.get(`${API_URL}/boards/${id}`, {
      params: { shareId },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching vision board ${id}:`, error);
    return null;
  }
};

export const updateVisionBoard = async (
  id: string,
  params: Partial<SaveVisionBoardParams>
): Promise<VisionBoardResponse> => {
  try {
    const response = await axios.put(`${API_URL}/boards/${id}`, params);
    return response.data;
  } catch (error) {
    console.error(`Error updating vision board ${id}:`, error);
    throw error;
  }
};

export const deleteVisionBoard = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/boards/${id}`);
  } catch (error) {
    console.error(`Error deleting vision board ${id}:`, error);
    throw error;
  }
};

export interface ShareResponse {
  shareUrl: string;
  expiresAt?: string;
}

export const shareVisionBoard = async (
  id: string,
  expiresInDays?: number
): Promise<ShareResponse> => {
  try {
    const response = await axios.post(`${API_URL}/boards/${id}/share`, {
      expiresInDays,
    });
    return response.data;
  } catch (error) {
    console.error(`Error sharing vision board ${id}:`, error);
    throw error;
  }
};
