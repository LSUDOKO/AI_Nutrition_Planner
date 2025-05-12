"use client";

import React from 'react';
import FoodImageGenerator from '@/components/FoodImageGenerator';
import { motion } from 'framer-motion';
import { Utensils, ArrowLeft, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FoodImageGeneratorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center text-slate-400 hover:text-white transition-colors mr-4"
          >
            <ArrowLeft className="mr-1" size={16} />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent flex items-center gap-2">
            <Utensils className="text-emerald-500" size={28} />
            Food Analysis Image Generator
          </h1>
        </div>

        {/* Info Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-xl mb-8"
        >
          <div className="flex items-start gap-3">
            <div className="bg-emerald-500/20 rounded-full p-2 mt-0.5">
              <Info className="text-emerald-400" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-medium text-white mb-2">AI-Powered Food Visualization</h2>
              <p className="text-slate-300">
                This tool generates high-quality, realistic images of food items for your nutritional analysis. 
                Enter a food name and optional description to create professional-looking food photography.
                These images can be used in your presentations, reports, or nutrition tracking.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Generator Component */}
        <FoodImageGenerator />

        {/* Tips Section */}
        <div className="mt-12 bg-slate-800/30 border border-slate-700/30 rounded-xl p-6">
          <h3 className="text-xl font-medium text-white mb-4">Tips for Better Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <h4 className="font-medium text-emerald-400 mb-2">Be Specific with Food Names</h4>
              <p className="text-slate-300 text-sm">
                Instead of "salad", try "Mediterranean quinoa salad" or "Kale Caesar salad" for more accurate results.
              </p>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <h4 className="font-medium text-emerald-400 mb-2">Add Descriptive Details</h4>
              <p className="text-slate-300 text-sm">
                Include cooking methods, garnishes, and presentation details like "topped with fresh berries and mint leaves".
              </p>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <h4 className="font-medium text-emerald-400 mb-2">Mention Visual Elements</h4>
              <p className="text-slate-300 text-sm">
                Describe colors, textures, and arrangement: "vibrant green smoothie bowl with colorful toppings".
              </p>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <h4 className="font-medium text-emerald-400 mb-2">Use Professional Terms</h4>
              <p className="text-slate-300 text-sm">
                Include terms like "plated", "garnished", "drizzled" or "food photography style" for professional results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
