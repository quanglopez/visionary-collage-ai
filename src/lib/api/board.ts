import axios from 'axios';
import { VisionBoard } from '@/lib/visionBoard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Add auth token to all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface CreateBoardData {
  name: string;
  description?: string;
  tags?: string[];
}

export interface UpdateBoardData extends CreateBoardData {
  isPublic?: boolean;
}

export const createBoard = async (data: CreateBoardData): Promise<VisionBoard> => {
  const response = await axios.post(`${API_URL}/boards`, data);
  return response.data;
};

export const getBoards = async (): Promise<VisionBoard[]> => {
  const response = await axios.get(`${API_URL}/boards`);
  return response.data;
};

export const getBoard = async (id: string, shareId?: string): Promise<VisionBoard> => {
  const response = await axios.get(`${API_URL}/boards/${id}`, {
    params: { shareId },
  });
  return response.data;
};

export const updateBoard = async (
  id: string,
  data: UpdateBoardData
): Promise<VisionBoard> => {
  const response = await axios.put(`${API_URL}/boards/${id}`, data);
  return response.data;
};

export const deleteBoard = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/boards/${id}`);
};

export interface ShareResponse {
  shareUrl: string;
  expiresAt?: string;
}

export const shareBoard = async (
  id: string,
  expiresInDays?: number
): Promise<ShareResponse> => {
  const response = await axios.post(`${API_URL}/boards/${id}/share`, {
    expiresInDays,
  });
  return response.data;
};
