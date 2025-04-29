// API to fetch food images from an external food image service
export default async function handler(req, res) {
  const { food } = req.query;

  if (!food) {
    return res.status(400).json({ message: 'Food name is required' });
  }

  try {
    // Unsplash is a reliable free source for high-quality food images
    // We're using their API to get relevant food images based on the query
    const imageUrl = await getFoodImageFromUnsplash(food);
    
    return res.status(200).json({
      success: true,
      imageUrl
    });
  } catch (error) {
    console.error('Error fetching food image:', error);
    return res.status(500).json({ 
      message: 'Error fetching food image', 
      error: error.message 
    });
  }
}

// Function to get food image from Unsplash
async function getFoodImageFromUnsplash(foodName) {
  // Clean the food name for better search results
  const query = foodName.trim().toLowerCase().replace(/[^\w\s]/g, '');
  
  // Add "food" to the search query to get better results
  const searchQuery = `${query},food,dish,meal,cuisine,cooking`;
  
  // Create a URL for Unsplash source
  // This is a special URL format that Unsplash provides for direct image embedding
  // It doesn't require an API key and is perfect for development purposes
  const imageUrl = `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(searchQuery)}`;
  
  // We're returning the URL directly rather than fetching the image
  // This is more efficient as the client will load the image directly from Unsplash
  return imageUrl;
}