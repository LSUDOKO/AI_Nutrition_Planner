import { GoogleGenerativeAI } from '@google/generative';

// Handle API key validation
const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey || apiKey.includes('YOUR_API_KEY')) {
  // Fallback to using Unsplash if no valid API key is configured
  return handleUnsplashFallback(foodName, description, res);
}

try {
  // Initialize the Gemini API
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Use Gemini to generate a detailed food description
  const descriptionModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const detailedPrompt = `Generate a detailed visual description of ${foodName}${description ? ` (${description})` : ''}. Focus on its appearance, colors, textures, garnishes, and presentation. Make it suitable for a professional food photographer.`;
  
  const descriptionResult = await descriptionModel.generateContent(detailedPrompt);
  const detailedDescription = descriptionResult.response.text();
  
  // Now use the detailed description to generate an image URL via Unsplash
  return handleUnsplashFallback(foodName, detailedDescription, res);
} catch (error) { // Catch errors from Gemini text generation
  console.error("Error with Gemini API (text generation):", error);
  // Fallback to Unsplash with the original description if Gemini text generation fails
  return handleUnsplashFallback(foodName, description, res); 
} catch (error) { // This is the outer catch for the main try block
  console.error("API error:", error);
}