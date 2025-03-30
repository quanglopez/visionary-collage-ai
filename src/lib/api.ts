
import OpenAI from 'openai';

// Create OpenAI instance with a check for API key
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'dummy-key-for-development',
  dangerouslyAllowBrowser: true
});

export interface ImageGenerationParams {
  prompt: string;
  n?: number;
  size?: '256x256' | '512x512' | '1024x1024';
  style?: 'vivid' | 'natural';
}

export interface ControlNetParams extends ImageGenerationParams {
  image: File;
  mask?: File;
}

export const generateImage = async ({
  prompt,
  n = 1,
  size = '1024x1024',
  style = 'vivid'
}: ImageGenerationParams) => {
  try {
    // For development, return mock data if no API key
    if (!import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY === 'dummy-key-for-development') {
      console.log('Using mock data for image generation - no API key provided');
      return getMockImageData(n);
    }
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n,
      size,
      style,
    });
    return response.data;
  } catch (error) {
    console.error('Error generating image:', error);
    return getMockImageData(n);
  }
};

export const generateControlNetImage = async ({
  prompt,
  image,
  mask,
  n = 1,
  size = '1024x1024',
}: ControlNetParams) => {
  try {
    // For development, return mock data if no API key
    if (!import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY === 'dummy-key-for-development') {
      console.log('Using mock data for ControlNet image - no API key provided');
      return getMockImageData(n);
    }
    
    // Convert image to base64
    const imageBase64 = await fileToBase64(image);
    const maskBase64 = mask ? await fileToBase64(mask) : undefined;

    const response = await openai.images.edit({
      image: imageBase64,
      mask: maskBase64,
      prompt,
      n,
      size,
    });
    return response.data;
  } catch (error) {
    console.error('Error generating ControlNet image:', error);
    return getMockImageData(n);
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
};

// Generate mock image data for development without an API key
const getMockImageData = (n: number) => {
  const mockImages = [
    {
      url: "https://picsum.photos/seed/vision1/1024",
      revised_prompt: "A beautiful landscape with mountains and lakes"
    },
    {
      url: "https://picsum.photos/seed/vision2/1024",
      revised_prompt: "A modern city skyline at sunset"
    },
    {
      url: "https://picsum.photos/seed/vision3/1024",
      revised_prompt: "A person achieving success on a mountain top"
    },
    {
      url: "https://picsum.photos/seed/vision4/1024",
      revised_prompt: "A healthy meal preparation scene in a modern kitchen"
    }
  ];
  
  return mockImages.slice(0, n);
};
