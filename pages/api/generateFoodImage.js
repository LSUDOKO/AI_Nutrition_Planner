import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { foodName, description } = req.body;
    
    if (!foodName) {
      return res.status(400).json({ message: 'Food name is required' });
    }

    // Initialize the Gemini API with the Pro Vision model that can generate images
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // For image generation, we need to use a model that supports it
    // Gemini 1.5 Pro is the model that supports image generation
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Craft a prompt for food image generation
    const prompt = `Generate a high-quality, realistic image of ${foodName}. ${description || ''}. 
    Make it look appetizing and professional, like a food photography shot. 
    Include appropriate garnishes and plating. Good lighting, shallow depth of field. 
    Show the food from a top-down or slightly angled perspective.`;

    // Generate the image
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "image/jpeg",
      },
    });

    const response = await result.response;
    const imageData = response.candidates[0].content.parts[0].inlineData.data;
    
    // The response will include the image as a base64-encoded string
    res.status(200).json({ 
      success: true,
      imageData: `data:image/jpeg;base64,${imageData}`
    });
    
  } catch (error) {
    console.error('Error generating food image:', error);
    
    // Provide a helpful error message if it's an API key issue
    if (error.message && error.message.includes('API key')) {
      return res.status(401).json({
        message: 'Invalid or missing Gemini API key. Make sure to set the GEMINI_API_KEY environment variable.',
        error: error.message
      });
    }
    
    res.status(500).json({ 
      message: 'Error generating food image', 
      error: error.message 
    });
  }
}