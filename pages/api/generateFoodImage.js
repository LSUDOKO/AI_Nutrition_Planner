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
      
      const detailedPrompt = `Generate a detailed visual description of ${foodName}${description ? ` (${description})` : ''}. 
      Focus on its appearance, colors, textures, garnishes, and presentation. Make it suitable for a professional food photographer.`;
      
      const descriptionResult = await descriptionModel.generateContent(detailedPrompt);
      const detailedDescription = descriptionResult.response.text();
      
      // Now use the detailed description to generate an image URL via Unsplash
      return handleUnsplashFallback(foodName, detailedDescription, res);
    } catch (error) {
      console.error("Error with Gemini API:", error);
      return handleUnsplashFallback(foodName, description, res);
    }
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ message: 'Error generating image', error: error.message });
  }
}

// Function to handle Unsplash fallback
async function handleUnsplashFallback(foodName, description, res) {
  try {
    // Format the query for best results
    const queryTerms = [
      encodeURIComponent(foodName),
      'food',
      'professional',
      'photography'
    ];
    
    // Add descriptive terms if available
    if (description) {
      // Extract key visual terms from the description
      const descriptionWords = description.split(' ')
        .filter(word => word.length > 3)
        .slice(0, 5)
        .map(word => encodeURIComponent(word));
      
      queryTerms.push(...descriptionWords);
    }
    
    // Create the Unsplash URL
    const imageUrl = `https://source.unsplash.com/featured/?${queryTerms.join(',')}`;
    
    // Return the image URL
    return res.status(200).json({ 
      imageUrl,
      source: 'unsplash',
      foodName,
      description: description?.substring(0, 100) || null
    });
  } catch (error) {
    console.error("Unsplash fallback error:", error);
    return res.status(500).json({ message: 'Error generating image via fallback method' });
  }
}
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