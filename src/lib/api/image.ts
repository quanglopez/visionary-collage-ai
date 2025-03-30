import axios from 'axios';
import { ImageData } from '@/lib/storage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const uploadImage = async (file: File): Promise<ImageData> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await axios.post(`${API_URL}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getUserImages = async (): Promise<ImageData[]> => {
  const response = await axios.get(`${API_URL}/images`);
  return response.data;
};

export const deleteImage = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/images/${id}`);
};
