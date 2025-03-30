import { v4 as uuidv4 } from 'uuid';

// In a real app, this would be stored in a database
let imageStore: ImageData[] = [];

export interface ImageData {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
  createdAt: Date;
  boardId?: string;
}

export const uploadImage = async (file: File): Promise<ImageData> => {
  // In production, this would upload to a cloud storage service
  const imageUrl = await fileToDataUrl(file);
  
  const imageData: ImageData = {
    id: uuidv4(),
    url: imageUrl,
    name: file.name,
    type: file.type,
    size: file.size,
    createdAt: new Date(),
  };

  imageStore.push(imageData);
  return imageData;
};

export const getImages = (boardId?: string): ImageData[] => {
  return boardId 
    ? imageStore.filter(img => img.boardId === boardId)
    : imageStore;
};

export const deleteImage = (imageId: string): void => {
  imageStore = imageStore.filter(img => img.id !== imageId);
};

export const assignImageToBoard = (imageId: string, boardId: string): void => {
  const image = imageStore.find(img => img.id === imageId);
  if (image) {
    image.boardId = boardId;
  }
};

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to data URL'));
      }
    };
    reader.onerror = error => reject(error);
  });
};
