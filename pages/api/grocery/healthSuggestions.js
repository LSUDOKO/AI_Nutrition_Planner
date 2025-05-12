import { connectToDatabase } from '../../../lib/mongodb';
import User from '../../../models/User';
import ProfileData from '../../../models/ProfileData';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET requests allowed' });
  }

  try {
    await connectToDatabase();
    
    // Get user email from cookie or session
    const userEmail = req.cookies.userEmail || (req.session?.user?.email);
    
    if (!userEmail) {
      return res.status(401).json({ message: 'Unauthorized - User not logged in' });
    }

    // Find the user and their profile data
    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profileData = await ProfileData.findOne({ userId: user._id });
    
    if (!profileData) {
      return res.status(404).json({ message: 'Profile data not found' });
    }

    // Extract user's health data
    const healthData = {
      weight: profileData.healthData?.weight?.[profileData.healthData.weight.length - 1]?.value || 70,
      height: profileData.settings?.height || 170,
      activityLevel: profileData.settings?.activityLevel || 'moderate',
      dietaryRestrictions: profileData.settings?.dietaryRestrictions || [],
      healthGoals: profileData.goals?.map(g => g.name) || ['general health'],
      healthData: profileData.healthData || {}
    };

    // Calculate BMI if height and weight are available
    if (healthData.height && healthData.weight) {
      const heightInMeters = healthData.height / 100;
      healthData.bmi = (healthData.weight / (heightInMeters * heightInMeters)).toFixed(1);
    }

    // Generate suggestions based on health data
    const suggestions = generateHealthBasedSuggestions(healthData);

    return res.status(200).json({ 
      success: true,
      suggestions,
      userData: healthData
    });
  } catch (error) {
    console.error('Error generating health-based suggestions:', error);
    return res.status(500).json({ 
      message: 'Failed to generate health-based suggestions', 
      error: error.message 
    });
  }
}

function generateHealthBasedSuggestions(healthData) {
  let suggestions = [];
  
  // BMI-based suggestions
  if (healthData.bmi) {
    const bmi = parseFloat(healthData.bmi);
    
    if (bmi > 25) {
      suggestions.push(
        { name: "Leafy Greens", reason: "Low-calorie and nutrient-dense for weight management" },
        { name: "Lean Chicken", reason: "High-quality protein with less fat" },
        { name: "Quinoa", reason: "Whole grain with protein and fiber for satiety" }
      );
    } else if (bmi < 18.5) {
      suggestions.push(
        { name: "Nut Butter", reason: "Calorie-dense source of healthy fats" },
        { name: "Avocados", reason: "Good source of healthy fats and calories" },
        { name: "Protein Powder", reason: "Convenient way to increase protein intake" }
      );
    } else {
      suggestions.push(
        { name: "Mixed Berries", reason: "Rich in antioxidants and vitamins" },
        { name: "Greek Yogurt", reason: "Good source of protein and probiotics" }
      );
    }
  }

  // Check macronutrient balance from health data
  if (healthData.healthData?.macros?.length > 0) {
    const proteins = healthData.healthData.macros.find(m => m.name === "Protein")?.value || 0;
    const carbs = healthData.healthData.macros.find(m => m.name === "Carbs")?.value || 0;
    const fats = healthData.healthData.macros.find(m => m.name === "Fat")?.value || 0;

    if (proteins < 25) {
      suggestions.push(
        { name: "Chicken Breast", reason: "Excellent source of lean protein" },
        { name: "Fish", reason: "High-quality protein and healthy fats" }
      );
    }
    if (carbs < 45) {
      suggestions.push(
        { name: "Sweet Potatoes", reason: "Complex carbs for sustained energy" },
        { name: "Oatmeal", reason: "Healthy whole grain carbohydrates" }
      );
    }
    if (fats < 20) {
      suggestions.push(
        { name: "Nuts and Seeds", reason: "Healthy fats and protein" },
        { name: "Olive Oil", reason: "Heart-healthy monounsaturated fats" }
      );
    }
  }
  
  // Activity level suggestions
  if (healthData.activityLevel === 'high' || (healthData.healthData?.workoutMinutes?.length > 0 && 
      healthData.healthData.workoutMinutes[healthData.healthData.workoutMinutes.length - 1]?.value > 30)) {
    suggestions.push(
      { name: "Bananas", reason: "Quick energy source with potassium for muscle function" },
      { name: "Sports Drinks", reason: "Replenishes electrolytes during intense activity" }
    );
  }

  // Check dietary restrictions
  if (healthData.dietaryRestrictions) {
    if (healthData.dietaryRestrictions.includes('vegetarian')) {
      suggestions = suggestions.filter(s => !['Chicken Breast', 'Fish'].includes(s.name));
      suggestions.push(
        { name: "Tofu", reason: "Plant-based protein source" },
        { name: "Lentils", reason: "Rich in protein and fiber" }
      );
    }
    if (healthData.dietaryRestrictions.includes('vegan')) {
      suggestions = suggestions.filter(s => !['Chicken Breast', 'Fish', 'Greek Yogurt'].includes(s.name));
      suggestions.push(
        { name: "Plant-Based Milk", reason: "Good source of calcium and vitamins" },
        { name: "Tempeh", reason: "Fermented plant protein" }
      );
    }
  }
  
  // Health goals suggestions
  if (healthData.healthGoals) {
    if (healthData.healthGoals.includes('muscle gain')) {
      suggestions.push(
        { name: "Eggs", reason: "Complete protein for muscle recovery" },
        { name: "Brown Rice", reason: "Complex carbs for energy" }
      );
    }
    if (healthData.healthGoals.includes('weight loss')) {
      suggestions.push(
        { name: "Cauliflower", reason: "Low-calorie vegetable substitute" },
        { name: "Cottage Cheese", reason: "High protein, low calorie dairy option" }
      );
    }
  }
  
  // If we have too few suggestions, add some general healthy options
  if (suggestions.length < 5) {
    const generalSuggestions = [
      { name: "Spinach", reason: "Rich in iron and vitamins" },
      { name: "Blueberries", reason: "High in antioxidants" },
      { name: "Walnuts", reason: "Brain-boosting healthy fats" },
      { name: "Green Tea", reason: "Antioxidants and metabolism support" },
      { name: "Ginger", reason: "Natural anti-inflammatory properties" }
    ];
    
    suggestions = [...suggestions, ...generalSuggestions];
  }
  
  // Shuffle and limit to 5 suggestions
  return shuffleArray(suggestions).slice(0, 5);
}

// Utility function to shuffle an array
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
