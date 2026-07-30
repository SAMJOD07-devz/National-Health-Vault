import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API with the key from Vite environment variables
// Make sure to add VITE_GEMMA_API_KEY to your .env.local file
const apiKey = import.meta.env.VITE_GEMMA_API_KEY;

if (!apiKey) {
  console.warn("VITE_GEMMA_API_KEY is not set in the environment variables.");
}

export const genAI = new GoogleGenerativeAI(apiKey || '');

/**
 * Returns a configured Gemma 4 instance.
 * For the hackathon, we are defaulting to the model name requested by the user.
 * Note: If 'gemma-4-27b-it' throws an API error for not existing in the AI Studio backend, 
 * you may need to update this string to 'gemini-1.5-flash' or 'gemma-2-27b-it'.
 */
export const getGemmaModel = () => {
  return genAI.getGenerativeModel({
    model: 'gemma-4-27b-it', // Using the exact requested model name
  });
};
