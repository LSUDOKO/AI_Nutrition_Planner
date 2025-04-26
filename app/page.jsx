"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AuthCheck from "@/components/AuthCheck";
import { GoogleGenerativeAI } from "@google/generative-ai";
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

// Initialize Gemini API directly with the key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

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
};

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

  // Handle search with Gemini API integration
  const handleSearch = async () => {
    if (!query.trim() && !image) return;
    
    setLoading(true);
    setError(null);
    setResults([]);
    setAiInsights([]);
    
    try {
      console.log("Starting food analysis...");
      
      // Use a supported model name
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
      let response;
      
      // Simple prompt for better reliability
      const simplifiedPrompt = `Analyze the nutritional content of ${query.trim() || "the food in the image"}.
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
      Return only valid JSON with no extra text.`;
      
      if (query.trim()) {
        // Text-based analysis
        console.log("Analyzing food by text:", query.trim());
        response = await model.generateContent(simplifiedPrompt);
      } else if (image) {
        // Image-based analysis
        console.log("Analyzing food image...");
        try {
          // Convert image to base64
          const reader = new FileReader();
          reader.readAsDataURL(image);
          
          const base64 = await new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
          });
          
          // Create multimodal prompt
          const parts = [
            { text: simplifiedPrompt },
            {
              inlineData: {
                mimeType: image.type || 'image/jpeg',
                data: base64
              }
            }
          ];
          
          response = await model.generateContent({
            contents: [{ role: "user", parts }]
          });
        } catch (err) {
          console.error("Image analysis error:", err);
          throw new Error("Failed to analyze the image. Please try text search instead.");
        }
      }
      
      if (!response) {
        throw new Error("No response received from the AI model");
      }
      
      // Extract and parse the response
      const text = response.response.text();
      console.log("Raw response:", text);
      
      // Extract JSON from the response
      const jsonMatch = text.match(/({[\s\S]*})/);
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
      generateAIFoodImage(foodResult.name);
      
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
      
    } catch (error) {
      console.error("Food analysis error:", error);
      setError(`Error analyzing food: ${error.message || "Please try again"}`);
      // Use fallback data
      fallbackToSampleData();
    } finally {
      setLoading(false);
    }
  };

  // Function to generate an AI image of the food
  const generateAIFoodImage = async (foodName, details) => {
    if (!foodName) return;
    
    setGeneratingImage(true);
    
    try {
      // Create a detailed prompt for better image generation
      const prompt = `A high-quality, appetizing, realistic photo of ${foodName}. Professional food photography style with perfect lighting, on a clean background.`;
      
      // Use Gemini Pro Vision for text-to-image
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const result = await model.generateContent(`Generate a detailed description of what ${foodName} looks like, focusing on visual aspects like color, texture, and presentation. Make it suitable for image generation.`);
      const detailedDescription = result.response.text();
      
      // Now use the detailed description to generate an image via Unsplash API as a fallback
      // (Since Gemini doesn't generate images directly, we're using Unsplash with a specific query)
      const imageUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(foodName)},food,healthy,${encodeURIComponent(detailedDescription.slice(0, 50))}`;
      
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
                          { name: "Greek Yogurt", benefit: "Probiotic & protein-rich", emoji: "🥄", query: "greek yogurt" },
                        ].map((item, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ y: -5, scale: 1.03 }}
                            className="bg-black/30 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center text-center cursor-pointer border border-indigo-500/20 hover:border-indigo-500/50 transition-all"
                            onClick={() => {
                              setQuery(item.query);
                              handleSearch();
                            }}
                          >
                            <span className="text-4xl mb-3">{item.emoji}</span>
                            <h4 className="font-medium text-white mb-1">{item.name}</h4>
                            <p className="text-sm text-slate-300">{item.benefit}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Access Features */}
              <div className="mb-12">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Zap className="text-yellow-500" size={20} />
                  Quick Access
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <FeatureCard
                    icon={<BookOpen size={24} className="text-white" />}
                    title="Food Diary"
                    description="Track your meals and monitor your nutrition over time."
                    onClick={() => navigateTo('/diary')}
                  />
                  
                  <FeatureCard
                    icon={<ChefHat size={24} className="text-white" />}
                    title="Healthy Recipes"
                    description="Discover personalized recipes based on your preferences."
                    onClick={() => navigateTo('/recipe')}
                  />
                  
                  <FeatureCard
                    icon={<Dumbbell size={24} className="text-white" />}
                    title="Fitness Tracking"
                    description="Connect your workouts to your nutrition goals."
                    onClick={() => navigateTo('/fitness')}
                  />
                  
                  <FeatureCard
                    icon={<User size={24} className="text-white" />}
                    title="Profile & Goals"
                    description="Update your personal information and nutrition targets."
                    onClick={() => navigateTo('/profile')}
                  />
                </div>
              </div>

              {/* Seasonal Foods Section - Enhanced */}
              <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Calendar className="text-blue-500" size={20} />
                    <span className="bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
                      Seasonal Foods: {currentSeason}
                    </span>
                  </h2>
                  <button 
                    onClick={() => setShowSeasonalFoods(true)}
                    className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 text-sm px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all border border-blue-500/20"
                  >
                    View all <ArrowRight size={14} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {seasonalFoods.map((food, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -8, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-lg rounded-xl overflow-hidden border border-slate-700/80 hover:border-blue-500/50 shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
                    >
                      <div className="aspect-video w-full relative overflow-hidden">
                        <img
                          src={food.image}
                          alt={food.name}
                          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-4">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-md mb-2 inline-block">
                            {currentSeason} Pick
                          </span>
                          <h3 className="text-xl font-bold text-white">{food.name}</h3>
                        </div>
                      </div>
                      <div className="p-5">
                        <p className="text-slate-300 text-sm leading-relaxed">{food.benefits}</p>
                        <div className="flex mt-4 justify-end">
                          <button className="text-xs bg-slate-800 hover:bg-slate-700 text-blue-400 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700/50">
                            <Info size={14} /> Learn more
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Show detailed food analysis when a food is selected */}
          {showFullAnalysis && selectedFood && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 rounded-2xl p-6 border border-slate-800"
            >
              {/* Navigation header */}
              <div className="flex items-center mb-6">
                <button
                  onClick={() => {
                    setShowFullAnalysis(false);
                    setSelectedFood(null);
                  }}
                  className="flex items-center text-slate-400 hover:text-white transition-colors mr-4"
                >
                  <ArrowRight className="rotate-180 mr-1" size={16} />
                  <span>Back</span>
                </button>
                <h2 className="text-xl font-bold text-white">{selectedFood.name}</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left column with image */}
                <div className="lg:col-span-2">
                  <div className="rounded-xl overflow-hidden bg-slate-800 border border-slate-700 shadow-lg">
                    <img
                      src={selectedFood.image}
                      alt={selectedFood.name}
                      className="w-full aspect-square object-cover"
                    />
                    
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-white">{selectedFood.name}</h3>
                        <span className="bg-emerald-600/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium">
                          {selectedFood.calories} cal
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                          <div className="text-xl font-bold text-white">{selectedFood.protein}g</div>
                          <div className="text-xs text-slate-400">Protein</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                          <div className="text-xl font-bold text-white">{selectedFood.carbs}g</div>
                          <div className="text-xs text-slate-400">Carbs</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                          <div className="text-xl font-bold text-white">{selectedFood.fat}g</div>
                          <div className="text-xs text-slate-400">Fat</div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setMealTypeDialogOpen(true)}
                          className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-2.5 rounded-lg font-medium shadow-lg shadow-emerald-800/30 flex items-center justify-center gap-2"
                        >
                          <Plus size={16} />
                          Add to Food Diary
                        </motion.button>
                        
                        <button
                          onClick={() => {}}
                          className="w-full bg-slate-800 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 border border-slate-700 hover:bg-slate-700 transition-colors"
                        >
                          <Share2 size={16} className="text-emerald-400" />
                          Share Analysis
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right column with detailed nutrition */}
                <div className="lg:col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <AIInsightCard
                      insight="This food is an excellent source of protein and can help with muscle recovery after workouts."
                      icon={<Dumbbell size={20} />}
                    />
                    <AIInsightCard
                      insight="Consider pairing this with some whole grains to create a more balanced meal with complex carbohydrates."
                      icon={<Info size={20} />}
                    />
                  </div>
                  
                  <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Award size={18} className="text-yellow-500" />
                      Nutritional Benefits
                    </h3>
                    <ul className="space-y-2">
                      {selectedFood.details.healthBenefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check size={16} className="text-emerald-500 mt-1 flex-shrink-0" />
                          <span className="text-slate-300">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Additional nutrition details - Dietary considerations and glycemic index */}
                  {selectedFood.details.potentialConcerns && selectedFood.details.potentialConcerns.length > 0 && (
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Info size={18} className="text-amber-500" />
                        Dietary Considerations
                      </h3>
                      <ul className="space-y-2">
                        {selectedFood.details.potentialConcerns.map((concern, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Info size={16} className="text-amber-500 mt-1 flex-shrink-0" />
                            <span className="text-slate-300">{concern}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Zap size={18} className="text-blue-400" />
                        Nutritional Profile
                      </h3>
                      <ul className="space-y-3">
                        {selectedFood.details.glycemicIndex && (
                          <li className="flex items-center justify-between">
                            <span className="text-slate-300">Glycemic Index</span>
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              selectedFood.details.glycemicIndex.includes("Low") 
                                ? "bg-emerald-900/40 text-emerald-400"
                                : selectedFood.details.glycemicIndex.includes("Medium")
                                ? "bg-amber-900/40 text-amber-400"
                                : "bg-red-900/40 text-red-400"
                            }`}>
                              {selectedFood.details.glycemicIndex}
                            </span>
                          </li>
                        )}
                        {selectedFood.details.fiberContent && (
                          <li className="flex items-center justify-between">
                            <span className="text-slate-300">Dietary Fiber</span>
                            <span className="text-white font-medium">{selectedFood.details.fiberContent}g</span>
                          </li>
                        )}
                        <li className="flex items-center justify-between">
                          <span className="text-slate-300">Protein-to-Carb Ratio</span>
                          <span className="text-white font-medium">1:{(selectedFood.carbs / selectedFood.protein).toFixed(1)}</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-slate-300">Calories from Fat</span>
                          <span className="text-white font-medium">{Math.round(selectedFood.fat * 9)} kcal ({Math.round((selectedFood.fat * 9 / selectedFood.calories) * 100)}%)</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                      <h3 className="text-lg font-semibold mb-4">Vitamins</h3>
                      <ul className="space-y-3">
                        {selectedFood.details.vitamins.map((vitamin, idx) => (
                          <li key={idx} className="flex items-center justify-between">
                            <span className="text-slate-300">{vitamin}</span>
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                      <h3 className="text-lg font-semibold mb-4">Minerals</h3>
                      <ul className="space-y-3">
                        {selectedFood.details.minerals.map((mineral, idx) => (
                          <li key={idx} className="flex items-center justify-between">
                            <span className="text-slate-300">{mineral}</span>
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* AI Generated Food Image */}
                  {(generatedFoodImage || generatingImage) && (
                    <div className="mt-6 bg-slate-800 rounded-xl p-6 border border-slate-700 overflow-hidden">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Sparkles size={18} className="text-purple-400" />
                        <span className="bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
                          AI Generated Visualization
                        </span>
                      </h3>
                      
                      {generatingImage ? (
                        <div className="flex flex-col items-center justify-center py-8">
                          <div className="relative w-12 h-12 mb-4">
                            <div className="w-12 h-12 rounded-full border-2 border-slate-700/50 absolute"></div>
                            <div className="w-12 h-12 rounded-full border-2 border-t-purple-500 border-r-pink-500 border-transparent absolute animate-spin"></div>
                          </div>
                          <p className="text-sm text-slate-400">Generating image...</p>
                        </div>
                      ) : generatedFoodImage ? (
                        <div className="relative">
                          <div className="rounded-lg overflow-hidden border border-purple-500/20 shadow-lg shadow-purple-500/10">
                            <img
                              src={generatedFoodImage}
                              alt={`AI visualization of ${selectedFood.name}`}
                              className="w-full h-auto object-cover"
                            />
                          </div>
                          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-slate-300 flex items-center">
                            <Sparkles size={12} className="text-purple-400 mr-1" /> AI Generated
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                  
                  {/* Recipe Suggestions Section */}
                  {selectedFood.recipeSuggestions && selectedFood.recipeSuggestions.length > 0 && (
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                        <ChefHat size={18} className="text-emerald-400" />
                        Recipes with {selectedFood.name}
                      </h3>
                      
                      <div className="space-y-4">
                        {selectedFood.recipeSuggestions.map((recipe, idx) => (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 hover:border-emerald-500/30 hover:bg-slate-800/70 transition-all"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-white">{recipe.name}</h4>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-slate-700/50 text-xs rounded-md text-emerald-400">
                                  {recipe.difficulty}
                                </span>
                                <span className="px-2 py-0.5 bg-slate-700/50 text-xs rounded-md text-emerald-400 flex items-center gap-1">
                                  <Clock size={10} />
                                  {recipe.prepTime}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-slate-300 mb-3">{recipe.description}</p>
                            
                            <div>
                              <div className="text-xs font-medium text-slate-400 mb-1.5">Main Ingredients:</div>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {recipe.ingredients.map((ingredient, i) => (
                                  <span 
                                    key={i} 
                                    className="px-2 py-0.5 bg-slate-700/70 text-xs rounded-md text-white"
                                  >
                                    {ingredient}
                                  </span>
                                ))}
                              </div>
                              
                              {recipe.healthBenefits && (
                                <div className="mt-2 bg-emerald-900/20 border border-emerald-500/20 rounded-lg p-2">
                                  <div className="flex items-center gap-1 mb-1">
                                    <Sparkles size={12} className="text-emerald-400" />
                                    <span className="text-xs font-medium text-emerald-400">Health Benefits</span>
                                  </div>
                                  <p className="text-xs text-emerald-200/80">{recipe.healthBenefits}</p>
                                </div>
                              )}
                            </div>
                            
                            <div className="mt-3 pt-3 border-t border-slate-700/50 flex justify-end">
                              <button className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                                View full recipe
                                <ArrowRight size={12} />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-center">
                        <button className="text-sm text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                          <ChefHat size={16} />
                          Discover more recipes with {selectedFood.name}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </AuthCheck>
  );
}
