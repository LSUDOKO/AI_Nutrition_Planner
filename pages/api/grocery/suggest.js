export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { currentDiet, existingList } = req.body;

  if (!currentDiet && (!existingList || existingList.length === 0)) {
    return res.status(400).json({ message: 'Please provide current diet information or an existing grocery list.' });
  }

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Generate mock suggestions based on currentDiet and existingList
  const suggestions = generateSuggestions(currentDiet, existingList);

  res.status(200).json({ suggestions });
}

// Function to generate mock suggestions based on diet preferences and existing items
function generateSuggestions(diet, existingList) {
  const existingItemNames = existingList ? existingList.map(item => item.name.toLowerCase()) : [];
  
  const fruitSuggestions = ['Apples', 'Bananas', 'Oranges', 'Strawberries', 'Blueberries', 'Grapes', 'Kiwi', 'Pineapple', 'Watermelon', 'Peaches'];
  const vegetableSuggestions = ['Spinach', 'Broccoli', 'Carrots', 'Bell Peppers', 'Tomatoes', 'Cucumbers', 'Zucchini', 'Sweet Potatoes', 'Avocados', 'Kale'];
  const proteinSuggestions = ['Chicken Breast', 'Ground Turkey', 'Salmon', 'Eggs', 'Tofu', 'Greek Yogurt', 'Cottage Cheese', 'Black Beans', 'Lentils', 'Quinoa'];
  const dairySuggestions = ['Milk', 'Cheese', 'Yogurt', 'Butter', 'Sour Cream', 'Cream Cheese', 'Almond Milk', 'Oat Milk', 'Coconut Milk'];
  const grainSuggestions = ['Brown Rice', 'Whole Wheat Pasta', 'Oats', 'Bread', 'Tortillas', 'Cereal', 'Quinoa', 'Barley', 'Bulgur'];
  const snackSuggestions = ['Almonds', 'Walnuts', 'Hummus', 'Crackers', 'Popcorn', 'Dark Chocolate', 'Granola Bars', 'Rice Cakes', 'Trail Mix'];
  
  // Diet-specific suggestions
  let dietSpecificSuggestions = [];
  
  if (diet) {
    const dietLower = diet.toLowerCase();
    
    if (dietLower.includes('vegan') || dietLower.includes('vegetarian')) {
      dietSpecificSuggestions = [
        'Nutritional Yeast', 'Tempeh', 'Seitan', 'Chia Seeds', 'Flaxseeds', 
        'Plant-based Protein Powder', 'Cashews', 'Hemp Seeds', 'Coconut Yogurt'
      ];
    } else if (dietLower.includes('keto') || dietLower.includes('low carb')) {
      dietSpecificSuggestions = [
        'Avocado Oil', 'Coconut Oil', 'Bacon', 'Heavy Cream', 'Macadamia Nuts',
        'Pork Rinds', 'Almond Flour', 'Beef Jerky', 'Full-fat Cream Cheese'
      ];
    } else if (dietLower.includes('gluten free')) {
      dietSpecificSuggestions = [
        'Gluten-free Bread', 'Rice Pasta', 'Gluten-free Flour', 'Quinoa Pasta',
        'Corn Tortillas', 'Gluten-free Oats', 'Rice Cakes', 'Buckwheat'
      ];
    } else if (dietLower.includes('high protein')) {
      dietSpecificSuggestions = [
        'Protein Powder', 'Beef Jerky', 'Tuna', 'Protein Bars', 'Peanut Butter',
        'Edamame', 'Turkey Slices', 'Cottage Cheese', 'Hemp Seeds'
      ];
    }
  }
  
  // Combine all suggestion lists
  let allSuggestions = [
    ...fruitSuggestions,
    ...vegetableSuggestions, 
    ...proteinSuggestions,
    ...dairySuggestions,
    ...grainSuggestions,
    ...snackSuggestions,
    ...dietSpecificSuggestions
  ];
  
  // Filter out items that are already in the existing list
  allSuggestions = allSuggestions.filter(item => 
    !existingItemNames.includes(item.toLowerCase()));
  
  // Shuffle the array
  allSuggestions = allSuggestions.sort(() => 0.5 - Math.random());
  
  // Return 5-7 suggestions
  const numSuggestions = Math.floor(Math.random() * 3) + 5; // 5 to 7
  return allSuggestions.slice(0, numSuggestions);
}
