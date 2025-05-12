"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AuthCheck from "@/components/AuthCheck";
import Image from "next/image";
import {
  Camera,
  Search,
  Upload,
  Info,
  Utensils,
  Dumbbell,
  ChefHat,
  User,
  Calendar,
  Flame,
  Heart,
  BarChart3,
  Clock,
  Bookmark,
  TrendingUp,
  Zap,
  Apple,
  Scale,
  Award,
  Sparkles,
  X,
  Home as HomeIcon,
  Check,
  LogIn,
  Bell,
  Settings,
  ArrowRight,
  Share2,
  BookOpen,
  Plus,
} from "lucide-react";

// Initialize OpenAI API
const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

// Alert if API key is not configured
if (typeof window !== 'undefined' && (!apiKey || apiKey === 'YOUR_API_KEY_HERE')) {
  console.warn('OpenAI API key is not configured. Some features may be limited.');
}

// Sample data for fallback when API fails
const sampleFoodData = {
  name: "Mixed Salad",
  calories: 120,
  protein: 3,
  carbs: 12,
  fat: 8,
  fiber: 4,
  vitamins: ["Vitamin A", "Vitamin C", "Vitamin K"],
  minerals: ["Iron", "Potassium"],
  healthBenefits: [
    "Rich in nutrients",
    "High in fiber",
    "Low in calories",
    "Good for digestion"
  ],
  servingSize: "1 bowl (100g)"
};

// Circuit breaker state
const CIRCUIT_TIMEOUT = 5 * 60 * 1000; // 5 minutes
let lastFailureTime = null;
let consecutiveFailures = 0;

// Card Components
const NutritionCard = ({ nutrient, value, color, percentage, icon }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-gradient-to-br from-slate-800/90 to-slate-900/80 backdrop-blur-lg border border-slate-700/50 p-5 rounded-xl shadow-xl transition-all hover:border-emerald-500/30 hover:shadow-emerald-500/5"
    >
      <div className="flex items-center mb-3">
        <div
          className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center shadow-lg mr-4`}
        >
          <span className="text-white text-xl">{icon}</span>
        </div>
        <h3 className="text-lg font-medium text-white">{nutrient}</h3>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold text-white">{value}</span>
        {percentage && (
          <span className="text-sm text-white/70">{percentage}%</span>
        )}
      </div>
      {percentage && (
        <div className="w-full h-2 bg-slate-700/40 rounded-full mt-2 overflow-hidden">
          <div
            className={`h-full rounded-full ${color}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      )}
    </motion.div>
  );
};

const AIInsightCard = ({ insight, icon }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-gradient-to-br from-slate-800/90 to-slate-900/80 backdrop-blur-lg border border-emerald-500/20 p-5 rounded-xl shadow-xl hover:border-emerald-500/30 hover:shadow-emerald-500/10 transition-all"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/20">
          {icon}
        </div>
        <h3 className="text-lg font-medium text-white">AI Insight</h3>
      </div>
      <p className="text-slate-300">{insight}</p>
    </motion.div>
  );
};

// Loading Spinner Component
const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="relative w-20 h-20">
        <div className="w-20 h-20 rounded-full border-4 border-slate-700/50 absolute top-0 left-0"></div>
        <div className="w-20 h-20 rounded-full border-4 border-t-emerald-500 border-r-teal-500 border-transparent absolute top-0 left-0 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse"></div>
        </div>
      </div>
      <p className="mt-5 text-slate-300 text-xl font-medium bg-gradient-to-r from-emerald-400 to-teal-300 text-transparent bg-clip-text">
        Analyzing your food...
      </p>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, onClick }) => {
  return (
    <motion.div
      whileHover={{
        y: -8,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      onClick={onClick}
      className="bg-gradient-to-br from-slate-800/90 to-slate-900/80 backdrop-blur-lg border border-slate-700/50 p-6 rounded-xl shadow-lg transition-all hover:border-emerald-500/30 hover:shadow-emerald-500/10 cursor-pointer"
    >
      <div className="bg-gradient-to-br from-emerald-600 to-teal-500 w-16 h-16 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/20">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-300">{description}</p>
      
      <div className="flex justify-end mt-4">
        <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors">
          <ArrowRight size={16} />
        </div>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const [session, setSession] = useState(null);
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("home");
  const [query, setQuery] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [useCamera, setUseCamera] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);
  const [aiInsights, setAiInsights] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [dailyNutrition, setDailyNutrition] = useState({
    calories: { consumed: 620, goal: 2000 },
    protein: { consumed: 28, goal: 80 },
    carbs: { consumed: 72, goal: 200 },
    fat: { consumed: 18, goal: 60 },
  });
  const [error, setError] = useState(null);
  const [savingToDiary, setSavingToDiary] = useState(false);
  const [diarySuccess, setDiarySuccess] = useState(false);
  const [mealTypeDialogOpen, setMealTypeDialogOpen] = useState(false);
  const [diaryData, setDiaryData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [showDiaryView, setShowDiaryView] = useState(false);
  const [diaryItems, setDiaryItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeMealFilter, setActiveMealFilter] = useState("all");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [showSeasonalFoods, setShowSeasonalFoods] = useState(false);
  const [seasonalFoods, setSeasonalFoods] = useState([]);
  const [currentSeason, setCurrentSeason] = useState("");
  const [loadingSeasonalFoods, setLoadingSeasonalFoods] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [generatedFoodImage, setGeneratedFoodImage] = useState(null);
  const [generatingImage, setGeneratingImage] = useState(false);

  // Refs for the camera
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Check if circuit breaker is tripped
  const isCircuitBreakerTripped = () => {
    if (!lastFailureTime) return false;
    if (consecutiveFailures < 3) return false;
    
    const timeSinceLastFailure = Date.now() - lastFailureTime;
    return timeSinceLastFailure < CIRCUIT_TIMEOUT;
  };

  // Reset circuit breaker
  const resetCircuitBreaker = () => {
    lastFailureTime = null;
    consecutiveFailures = 0;
  };

  // Trip circuit breaker
  const tripCircuitBreaker = () => {
    lastFailureTime = Date.now();
    consecutiveFailures++;
  };

  // Handle API failures
  const handleAPIFailure = (error) => {
    console.error("API call failed:", error);
    tripCircuitBreaker();
    
    if (isCircuitBreakerTripped()) {
      console.log("Circuit breaker tripped, using fallback data");
      setError("AI service temporarily unavailable. Using sample data for demonstration.");
      fallbackToSampleData();
      return true;
    }
    return false;
  };

  // Function to fallback to sample data when API fails
  const fallbackToSampleData = () => {
    // Convert sample data to match the UI expected format
    const foodResult = {
      name: sampleFoodData.name,
      calories: sampleFoodData.calories,
      protein: sampleFoodData.protein,
      carbs: sampleFoodData.carbs,
      fat: sampleFoodData.fat,
      image: `https://source.unsplash.com/featured/?${encodeURIComponent(sampleFoodData.name)},food,healthy`,
      details: {
        vitamins: sampleFoodData.vitamins,
        minerals: sampleFoodData.minerals,
        healthBenefits: sampleFoodData.healthBenefits,
        potentialConcerns: [],
        glycemicIndex: "Low",
        fiberContent: sampleFoodData.fiber
      },
      recipeSuggestions: []
    };

    // Set results and select the food
    setResults([foodResult]);
    selectFood(foodResult);

    // Generate sample insights
    const newInsights = [
      { text: `${foodResult.name} contains ${foodResult.protein}g of protein - a light protein source.`, icon: <Dumbbell size={20} /> },
      { text: `Only ${foodResult.calories} calories per serving, perfect for weight management.`, icon: <Flame size={20} /> },
      { text: `High in fiber with ${sampleFoodData.fiber}g per serving, great for digestive health.`, icon: <Apple size={20} /> }
    ];
    setAiInsights(newInsights);

    // Add to search history
    setSearchHistory(prev => [
      { term: "Sample: Mixed Salad", timestamp: new Date() },
      ...prev.slice(0, 4)
    ]);

    // Generate a fallback image
    setGeneratedFoodImage(`https://source.unsplash.com/featured/?mixed,salad,healthy,food`);
  };

  // Sample AI Insights
  const sampleInsights = [
    {
      text: "Based on your recent meals, consider increasing your intake of leafy greens for more fiber and micronutrients.",
      icon: <Sparkles size={20} />,
    },
    {
      text: "Your protein intake has been consistent. Great job maintaining a balanced diet!",
      icon: <Check size={20} />,
    },
    {
      text: "Try to reduce processed foods this week. Your sodium levels have been slightly elevated.",
      icon: <TrendingUp size={20} />,
    },
  ];

  // Sample seasonal foods
  useEffect(() => {
    setSeasonalFoods([
      {
        name: "Asparagus",
        benefits: "Rich in folate, vitamin K, and antioxidants",
        image: "https://t4.ftcdn.net/jpg/06/83/98/49/240_F_683984947_RZDslKJHM2cWD1HVm9NQi6dQnrZj0PxR.jpg",
      },
      {
        name: "Strawberries",
        benefits: "High in vitamin C and manganese",
        image: "https://media.istockphoto.com/id/1406145922/photo/organic-strawberries.jpg?s=612x612&w=0&k=20&c=QYNq73_g5B2183XtzTVdJMaVZKIhTwqXfxxmz3Rp_wc=",
      },
      {
        name: "Spinach",
        benefits: "Excellent source of iron and vitamin A",
        image: "https://media.istockphoto.com/id/1006196472/photo/bunch-of-spinach-leaves-on-isolated-white-background.jpg?s=612x612&w=0&k=20&c=OAIswtUC1aMNDwtMEFIaZv6fSIftsoAV-cgJZSGLJ7A=",
      },
    ]);
    setCurrentSeason("Spring");
  }, []);

  // Check API availability
  const checkAPIAvailability = async () => {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      return response.ok;
    } catch (error) {
      console.error("API availability check failed:", error);
      return false;
    }
  };

  // Handle search with OpenAI API integration
  const handleSearch = async () => {
    if (!query.trim() && !image) return;
    
    setLoading(true);
    setError(null);
    setResults([]);
    setAiInsights([]);
    
    // Quick validation of API key
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE' || apiKey.length < 20) {
      console.log("Invalid API key, using fallback data");
      setError(
        "OpenAI API key is not configured. Please add your API key to the .env.local file. " +
        "Using sample data for demonstration."
      );
      fallbackToSampleData();
      setLoading(false);
      return;
    }

    // Check API availability before proceeding
    const isAPIAvailable = await checkAPIAvailability();
    if (!isAPIAvailable) {
      console.log("API unavailable, using fallback data");
      setError("AI service currently unavailable. Using sample data for demonstration.");
      fallbackToSampleData();
      setLoading(false);
      return;
    }

    try {
      console.log("Starting food analysis...");

      let response;
      
      // Prepare the prompt for OpenAI
      const prompt = `Analyze the nutritional content of ${query.trim() || "the food in the image"}.
      Return a valid JSON object with this exact structure:
      {
        "name": "Food name",
        "calories": number,
        "protein": number in grams,
        "carbs": number in grams,
        "fat": number in grams,
        "details": {
          "vitamins": ["Vitamin A", "Vitamin C"],
          "minerals": ["Iron", "Calcium"],
          "healthBenefits": ["Benefit 1", "Benefit 2"],
          "potentialConcerns": ["Any concerns"],
          "glycemicIndex": "Low/Medium/High",
          "fiberContent": number
        },
        "insights": [
          {"text": "Insight 1", "type": "protein"},
          {"text": "Insight 2", "type": "general"}
        ],
        "recipeSuggestions": [
          {
            "name": "Recipe 1",
            "description": "Description",
            "ingredients": ["Ingredient 1", "Ingredient 2"],
            "difficulty": "Easy",
            "prepTime": "15 mins",
            "healthBenefits": "Benefits"
          }
        ]
      }
      Ensure all numbers are realistic and based on standard serving sizes. Return only valid JSON with no extra text.`;

      // Call OpenAI API
      try {
        // Reset circuit breaker if it was previously tripped
        if (!isCircuitBreakerTripped()) {
          resetCircuitBreaker();
        }

        let retryCount = 0;
        const maxRetries = 2;
        let openAIResponse;

        while (retryCount <= maxRetries) {
          try {
            openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
              },
              body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
              {
                role: "system",
                content: "You are a professional nutritionist AI that analyzes food and provides accurate nutritional information. Always return valid JSON with realistic values."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.7
          })
        });

        if (!openAIResponse.ok) {
          // Handle rate limits (429)
          if (openAIResponse.status === 429) {
            if (retryCount < maxRetries) {
              console.log(`Rate limit hit, retrying (${retryCount + 1}/${maxRetries})...`);
              retryCount++;
              // Wait with exponential backoff
              await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
              continue;
            } else {
              if (handleAPIFailure(new Error("Rate limit exceeded after retries"))) {
                return;
              }
            }
          }
          
          const error = await openAIResponse.json();
          throw new Error(error.error?.message || "Failed to analyze food");
        }
        
        // If we get here, parse the successful response
        const data = await openAIResponse.json();
        response = data.choices[0].message.content;
        break;
      } catch (err) {
        console.error("OpenAI API error:", err);
        if (handleAPIFailure(err)) return; // Handle API failure with circuit breaker
        throw err;
      }
      
      if (!response) {
        throw new Error("No response received from the AI model");
      }
      
      // Parse the response
      const jsonMatch = response.match(/({[\s\S]*})/);
      if (!jsonMatch) {
        throw new Error("Could not extract valid JSON from the response");
      }
      
      const foodData = JSON.parse(jsonMatch[0]);
      console.log("Parsed food data:", foodData);
      
      // Process the response and format it for the UI
      const foodResult = {
        name: foodData.name || query || "Unknown Food",
        calories: foodData.calories || 0,
        protein: foodData.protein || 0,
        carbs: foodData.carbs || 0,
        fat: foodData.fat || 0,
        image: image ? URL.createObjectURL(image) : `https://source.unsplash.com/random/300x200/?${encodeURIComponent(foodData.name || "food")}`,
        details: foodData.details || {
          vitamins: ["Not available"],
          minerals: ["Not available"],
          healthBenefits: ["General nutritional benefits"],
          potentialConcerns: [],
          glycemicIndex: "Not specified",
          fiberContent: null
        },
        recipeSuggestions: foodData.recipeSuggestions || []
      };
      
      // Set results and select the food automatically
      setResults([foodResult]);
      selectFood(foodResult);
      
      // Generate AI food image
      setGeneratedFoodImage(null); // Reset previous image
      generateAIFoodImage(foodResult.name); // Corrected function call
      
      // Add to search history
      setSearchHistory(prev => [
        { term: query || "Image Analysis", timestamp: new Date() },
        ...prev.slice(0, 4)
      ]);
      
      // Generate insights
      const newInsights = [];
      if (foodData.insights && Array.isArray(foodData.insights)) {
        foodData.insights.forEach(insight => {
          let icon;
          switch (insight.type) {
            case 'protein': icon = <Dumbbell size={20} />; break;
            case 'carbs': icon = <Apple size={20} />; break;
            case 'fat': icon = <Heart size={20} />; break;
            default: icon = <Info size={20} />;
          }
          newInsights.push({ text: insight.text, icon });
        });
      }
      
      // Add default insights if none were provided
      if (newInsights.length === 0) {
        newInsights.push(
          { text: `${foodResult.name} contains ${foodResult.protein}g of protein.`, icon: <Dumbbell size={20} /> },
          { text: `Contains ${foodResult.calories} calories per serving.`, icon: <Flame size={20} /> }
        );
      }
      
      setAiInsights(newInsights);
      
      // Reset circuit breaker on successful API call
      resetCircuitBreaker();
    } catch (error) {
      console.error("Food analysis error:", error);
      setSelectedFood(null); // Clear previous results
      // Handle rate limit related errors.
      if (error.message && (error.message.includes("rate limit") || error.message.includes("429"))) {
        console.log("Rate limit error caught in catch block, using fallback data");
        setError("The AI service quota has been exceeded. Please try again later. Displaying sample data.");
        fallbackToSampleData();
        return; // Exit early after using fallback data
      }
      
      // Handle other errors
      setError(`Error analyzing food: ${error.message || "Please try again"}`);
      fallbackToSampleData(); // Added semicolon
    } finally {
      setLoading(false);
    }
  };

  /**
   * Function to generate an AI image of the food
   * @param {string} foodName - The name of the food to generate an image for
   * @param {Object} details - Optional details about the food for better image generation
   */
  const generateAIFoodImage = async (foodName, details) => {
    if (!foodName) return;
    
    setGeneratingImage(true);
    
    try {
      // Create a detailed prompt for better image generation
      const prompt = `A high-quality, appetizing, realistic photo of ${foodName}. Professional food photography style with perfect lighting, on a clean background.`;
      
      // Use Unsplash API as a fallback
      const imageUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(foodName)},food,healthy`;
      
      // Simulate delay to make it feel like AI generation
      setTimeout(() => {
        setGeneratedFoodImage(imageUrl);
        setGeneratingImage(false);
      }, 2000);
      
    } catch (error) {
      console.error("Error generating food image:", error);
      setGeneratedFoodImage(`https://source.unsplash.com/featured/?${encodeURIComponent(foodName)},food`);
      setGeneratingImage(false);
    }
  };

  // Handle image upload with validation
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file is an image
      if (!file.type.match('image.*')) {
        setError("Please select an image file.");
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size too large. Please select an image under 5MB.");
        return;
      }
      
      setError(null);
      setImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Initialize camera functionality
  useEffect(() => {
    if (useCamera && videoRef.current) {
      const initCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            streamRef.current = stream;
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
          setError("Could not access camera. Please check permissions.");
          setUseCamera(false);
        }
      };
      
      initCamera();
      
      // Cleanup function
      return () => {
        if (streamRef.current) {
          const tracks = streamRef.current.getTracks();
          tracks.forEach(track => track.stop());
          streamRef.current = null;
        }
      };
    }
  }, [useCamera]);
  
  // Function to capture image from camera
  const captureImage = useCallback(() => {
    if (videoRef.current && streamRef.current) {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      // Draw the video frame to canvas
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
          setImage(file);
          setImagePreview(URL.createObjectURL(blob));
          setUseCamera(false);
        }
      }, 'image/jpeg', 0.9);
    }
  }, []);

  // Navigate to different sections of the app
  const navigateTo = (path) => {
    router.push(path);
  };

  // Reset all states to go back home
  const resetView = () => {
    setSelectedFood(null);
    setShowFullAnalysis(false);
    setResults([]);
    setShowDiaryView(false);
    setShowSeasonalFoods(false);
    setShowWelcomeMessage(true);
  };

  // Select a food for detailed view
  const selectFood = (food) => {
    setSelectedFood(food);
    setShowFullAnalysis(true);
    setShowWelcomeMessage(false);
  };

  // Close welcome message
  const closeWelcome = () => {
    setShowWelcomeMessage(false);
  };

  return (
    <AuthCheck>
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Welcome Modal */}
          <AnimatePresence>
            {showWelcomeMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
              >
                <motion.div 
                  className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-6 max-w-2xl w-full shadow-2xl"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 flex items-center justify-center">
                        <BookOpen size={24} className="text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Welcome to Nutritionist AI Agent</h2>
                    </div>
                    <button 
                      onClick={closeWelcome}
                      className="text-slate-400 hover:text-white"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <p className="text-slate-300 mb-6">
                    Your personal AI nutritionist is ready to help you make better food choices. 
                    Take a photo of your meal or search for any food to get instant nutritional insights.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                          <Camera size={16} />
                        </div>
                        <h3 className="font-medium">Food Analysis</h3>
                      </div>
                      <p className="text-sm text-slate-400">Take photos of your food for instant nutritional insights</p>
                    </div>
                    
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                          <BookOpen size={16} />
                        </div>
                        <h3 className="font-medium">Food Diary</h3>
                      </div>
                      <p className="text-sm text-slate-400">Track your meals and monitor your nutritional intake</p>
                    </div>
                    
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                          <Sparkles size={16} />
                        </div>
                        <h3 className="font-medium">Personalized Insights</h3>
                      </div>
                      <p className="text-sm text-slate-400">Receive AI-powered recommendations based on your diet</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <motion.button
                      onClick={closeWelcome}
                      className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-5 py-2.5 rounded-lg font-medium shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span>Get Started</span>
                      <ArrowRight size={18} />
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Nutritionist AI Dashboard
              </span>
            </h1>
            <p className="text-slate-400 mt-2">
              {session?.user?.name ? `Hello, ${session.user.name}! ` : ''}
              Track your nutrition, analyze foods, and get personalized insights.
            </p>
          </div>

          {/* Main Content */}
          {!showFullAnalysis && !showDiaryView && !showSeasonalFoods && (
            <div>
              {/* Daily Nutrition Summary */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Flame className="text-orange-500" size={20} />
                    Daily Nutrition Summary
                  </h2>
                  <button 
                    onClick={() => navigateTo('/diary')}
                    className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-1"
                  >
                    View full diary <ArrowRight size={14} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <NutritionCard
                    nutrient="Calories"
                    value={`${dailyNutrition.calories.consumed} / ${dailyNutrition.calories.goal}`}
                    color="bg-orange-600"
                    percentage={Math.round((dailyNutrition.calories.consumed / dailyNutrition.calories.goal) * 100)}
                    icon={<Flame size={24} />}
                  />
                  <NutritionCard
                    nutrient="Protein"
                    value={`${dailyNutrition.protein.consumed}g / ${dailyNutrition.protein.goal}g`}
                    color="bg-emerald-600"
                    percentage={Math.round((dailyNutrition.protein.consumed / dailyNutrition.protein.goal) * 100)}
                    icon={<Dumbbell size={24} />}
                  />
                  <NutritionCard
                    nutrient="Carbs"
                    value={`${dailyNutrition.carbs.consumed}g / ${dailyNutrition.carbs.goal}g`}
                    color="bg-blue-600"
                    percentage={Math.round((dailyNutrition.carbs.consumed / dailyNutrition.carbs.goal) * 100)}
                    icon={<Apple size={24} />}
                  />
                </div>
              </div>

              {/* AI Insights */}
              <div className="mb-12">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="text-emerald-500" size={20} />
                    AI-Powered Insights
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {sampleInsights.map((insight, idx) => (
                    <AIInsightCard
                      key={idx}
                      insight={insight.text}
                      icon={insight.icon}
                    />
                  ))}
                </div>
              </div>

              {/* Food Analysis Section - Adding the missing food search form */}
              <div className="mb-12">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Utensils className="text-indigo-500" size={20} />
                  Analyze Food
                </h2>

                <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/80 backdrop-blur-lg border border-slate-700/50 p-6 rounded-xl shadow-lg transition-all hover:border-indigo-500/30 hover:shadow-indigo-500/10">
                  <div className="flex flex-wrap gap-4 mb-6">
                    <button
                      className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center transition-colors ${
                        !image ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white" : "text-slate-300 hover:text-white hover:bg-slate-800/30"
                      }`}
                    >
                      <Search className="mr-2 h-5 w-5" />
                      Text Search
                    </button>
                    
                    <button
                      onClick={() => document.getElementById("food-image").click()}
                      className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center transition-colors ${
                        image ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white" : "text-slate-300 hover:text-white hover:bg-slate-800/30 transition-colors"
                      }`}
                    >
                      <Upload className="mr-2 h-5 w-5" />
                      Upload Image
                    </button>
                  </div>

                  {!image ? (
                    <div className="space-y-6">
                      <div className="relative">
                        <input
                          type="text"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                          className="w-full bg-gradient-to-br from-slate-900/80 to-black/60 border border-slate-700/50 rounded-full py-4 pl-6 pr-12 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-lg"
                          placeholder="Search for any food..."
                        />
                        <button
                          onClick={handleSearch}
                          className="absolute right-1 top-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full p-3 hover:opacity-90 shadow-lg transition-transform hover:scale-105"
                        >
                          <Search className="h-5 w-5 text-white" />
                        </button>
                      </div>

                      {/* Search History */}
                      {searchHistory.length > 0 && !selectedFood && !loading && (
                        <div className="flex flex-wrap gap-2 justify-center">
                          <span className="text-slate-400">Recent:</span>
                          {searchHistory.slice(0, 5).map((term, index) => (
                            <motion.button
                              key={index}
                              whileHover={{ y: -2, scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setQuery(typeof term === 'object' ? term.term : term);
                                handleSearch();
                              }}
                              className="px-2 py-1 bg-slate-800/60 hover:bg-slate-700/60 rounded-full text-sm text-slate-300 border border-slate-700/30 hover:border-indigo-500/50 transition-all"
                            >
                              {typeof term === 'object' ? term.term : term}
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="rounded-xl overflow-hidden border border-slate-700 relative">
                        <img
                          src={imagePreview}
                          alt="Food preview"
                          className="w-full aspect-video object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 flex items-end justify-between p-4">
                          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm text-white">
                            Ready for analysis
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setImage(null);
                              setImagePreview(null);
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-slate-800/80 to-slate-900/80 hover:from-indigo-900/40 hover:to-purple-900/40 border border-slate-700/50 hover:border-indigo-500/50 rounded-full text-white text-sm transition-all shadow-lg"
                          >
                            Remove Image
                          </motion.button>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSearch}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-xl text-white font-medium hover:opacity-90 shadow-lg transition-all"
                      >
                        Analyze Now
                      </motion.button>
                    </div>
                  )}

                  <input
                    type="file"
                    id="food-image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  
                  {/* Popular Searches */}
                  {!image && !selectedFood && !loading && (
                    <div className="mt-8">
                      <h3 className="text-lg font-medium text-white mb-4">Popular Searches</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                          { name: "Avocado", benefit: "Rich in healthy fats", emoji: "🥑", query: "avocado" },
                          { name: "Quinoa", benefit: "Complete protein source", emoji: "🌱", query: "quinoa" },
                          { name: "Blueberries", benefit: "High in antioxidants", emoji: "🫐", query: "blueberries" },
                          { name: "Salmon", benefit: "Omega-3 fatty acids", emoji: "🐟", query: "salmon" }
                        ].map((item, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setQuery(item.query);
                              handleSearch();
                            }}
                            className="bg-gradient-to-br from-slate-800/90 to-slate-900/80 backdrop-blur-lg border border-slate-700/50 p-4 rounded-xl shadow-lg transition-all hover:border-indigo-500/30 hover:shadow-indigo-500/10 cursor-pointer"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500">
                                <span className="text-2xl">{item.emoji}</span>
                              </div>
                              <h4 className="text-lg font-medium text-white">{item.name}</h4>
                            </div>
                            <p className="text-sm text-slate-400">{item.benefit}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Other Feature Cards */}
              {/* ...existing code... */}
            </div>
          )}

          {/* Full Food Analysis View */}
          <AnimatePresence>
            {selectedFood && showFullAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="my-8 p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">{selectedFood.name} - Full Analysis</h2>
                  <button onClick={() => setShowFullAnalysis(false)} className="text-slate-400 hover:text-white">
                    <X size={24} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <NutritionCard nutrient="Calories" value={selectedFood.calories} color="bg-orange-500" icon={<Flame size={20}/>} />
                  <NutritionCard nutrient="Protein" value={`${selectedFood.protein}g`} color="bg-emerald-500" icon={<Dumbbell size={20}/>} />
                  <NutritionCard nutrient="Carbs" value={`${selectedFood.carbs}g`} color="bg-blue-500" icon={<Apple size={20}/>} />
                  <NutritionCard nutrient="Fat" value={`${selectedFood.fat}g`} color="bg-yellow-500" icon={<Heart size={20}/>} />
                  {selectedFood.details?.fiberContent != null && <NutritionCard nutrient="Fiber" value={`${selectedFood.details.fiberContent}g`} color="bg-green-500" icon={<Sparkles size={20}/>} />}
                </div>
                {selectedFood.details && (
                  <div className="mt-6 space-y-4">
                    {selectedFood.details.vitamins && selectedFood.details.vitamins.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Vitamins:</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedFood.details.vitamins.map(v => <span key={v} className="px-3 py-1 bg-slate-700 text-sm rounded-full">{v}</span>)}
                        </div>
                      </div>
                    )}
                    {selectedFood.details.minerals && selectedFood.details.minerals.length > 0 && (
                       <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Minerals:</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedFood.details.minerals.map(m => <span key={m} className="px-3 py-1 bg-slate-700 text-sm rounded-full">{m}</span>)}
                        </div>
                      </div>
                    )}
                    {selectedFood.details.healthBenefits && selectedFood.details.healthBenefits.length > 0 && (
                       <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Health Benefits:</h3>
                        <ul className="list-disc list-inside text-slate-300 space-y-1">
                          {selectedFood.details.healthBenefits.map(b => <li key={b}>{b}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                {aiInsights && aiInsights.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-700">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Sparkles className="text-emerald-400" size={20} />
                      AI Insights for {selectedFood.name}
                    </h3>
                    <div className="space-y-4">
                      {aiInsights.map((insight, index) => (
                        <AIInsightCard key={index} insight={insight.text} icon={insight.icon} />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-4 right-4 p-4 bg-red-600 text-white rounded-lg shadow-xl z-50 max-w-md"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <X size={20} className="mr-2 mt-0.5" />
                </div>
                <div className="flex-grow">
                  <p className="font-semibold">An error occurred:</p>
                  <p className="text-sm">{error}</p>
                </div>
                <button onClick={() => setError(null)} className="ml-4 text-red-100 hover:text-white">
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Loading Spinner - Placed centrally if needed */}
          {loading && !selectedFood && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <LoadingSpinner />
            </div>
          )}
        </div> {/* closes max-w-7xl div */}
      </div> {/* closes min-h-screen div */}
    </AuthCheck>
  );
}
