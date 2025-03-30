import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
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
    throw error;
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
    throw error;
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
