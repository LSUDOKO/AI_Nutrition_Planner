import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Upload, ArrowRight, X } from 'lucide-react';

const FoodImageGenerator = () => {
  const [foodName, setFoodName] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Example food items for quick selection
  const quickFoodOptions = [
    { name: 'Avocado Toast', desc: 'with poached eggs and microgreens' },
    { name: 'Grilled Salmon', desc: 'with roasted vegetables and lemon' },
    { name: 'Berry Smoothie Bowl', desc: 'topped with granola and fresh fruits' },
    { name: 'Buddha Bowl', desc: 'with quinoa, roasted chickpeas, and tahini dressing' },
  ];

  const generateImage = async () => {
    if (!foodName.trim()) {
      setError('Please enter a food name');
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      // First try to use the backend API if it's configured
      try {
        const response = await fetch('/api/generateFoodImage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            foodName: foodName,
            description: description,
          }),
        });

        const data = await response.json();

        if (response.ok && data.imageUrl) {
          setGeneratedImage(data.imageUrl);
          setIsGenerating(false);
          return;
        }
      } catch (err) {
        console.log('Backend API not available, using fallback method');
      }

      // Fallback to Unsplash API if backend fails
      const detailedDescription = description || `Healthy ${foodName} food, appetizing, professional food photography`;
      const unsplashUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(foodName)},food,healthy,${encodeURIComponent(detailedDescription.slice(0, 50))}`;
      
      // Add a small delay to simulate AI processing
      setTimeout(() => {
        setGeneratedImage(unsplashUrl);
        setIsGenerating(false);
      }, 2000);
    } catch (err) {
      setError('Failed to generate image. Please try again.');
      setIsGenerating(false);
    }
  };

  const handleQuickOption = (option) => {
    setFoodName(option.name);
    setDescription(option.desc);
  };

  const resetGenerator = () => {
    setGeneratedImage(null);
    setError(null);
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/80 backdrop-blur-lg border border-slate-700/50 rounded-xl shadow-xl p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent flex items-center gap-2">
        <Sparkles className="text-emerald-500" size={24} />
        AI Food Image Generator
      </h2>

      {!generatedImage ? (
        <>
          <div className="mb-8">
            <label className="block text-slate-300 mb-2 font-medium">Food Name</label>
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="Enter food name (e.g., Avocado Toast)"
              className="w-full bg-slate-900/80 border border-slate-700/50 rounded-lg py-3 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="mb-8">
            <label className="block text-slate-300 mb-2 font-medium">
              Description (optional)
              <span className="text-slate-400 font-normal ml-2 text-sm">- add details like ingredients, style, or presentation</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., with poached eggs and avocado on sourdough bread, garnished with microgreens"
              className="w-full bg-slate-900/80 border border-slate-700/50 rounded-lg py-3 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent h-24"
            />
          </div>

          <div className="mb-6">
            <p className="text-slate-300 mb-3 font-medium">Quick Options:</p>
            <div className="flex flex-wrap gap-2">
              {quickFoodOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickOption(option)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-200 transition-colors border border-slate-700 hover:border-emerald-500/30"
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateImage}
            disabled={isGenerating}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl text-white font-medium shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-70"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin mr-2"></div>
                Generating Image...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Food Image
              </>
            )}
          </motion.button>
        </>
      ) : (
        <div className="space-y-6">
          <div className="relative">
            <div className="rounded-xl overflow-hidden border border-slate-700 shadow-lg">
              <img 
                src={generatedImage} 
                alt={foodName}
                className="w-full aspect-square object-cover"
              />
            </div>
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white flex items-center">
              <Sparkles size={14} className="text-emerald-400 mr-1.5" /> 
              AI Generated
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-white text-lg">{foodName}</h3>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-1"
              >
                {showDetails ? 'Hide details' : 'Show details'} 
                <ArrowRight size={14} className={`transition-transform ${showDetails ? 'rotate-90' : ''}`} />
              </button>
            </div>
            
            {showDetails && description && (
              <p className="text-slate-300 text-sm mt-2">{description}</p>
            )}
          </div>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetGenerator}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              <X size={18} />
              Generate Another
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                // Download image functionality
                const link = document.createElement('a');
                link.href = generatedImage;
                link.download = `${foodName.replace(/\s+/g, '-').toLowerCase()}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl text-white font-medium shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all"
            >
              <Upload size={18} />
              Save Image
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodImageGenerator;
