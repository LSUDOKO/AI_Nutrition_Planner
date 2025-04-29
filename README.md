# AI Nutrition Planner: Your Personal Nutrition Intelligence Platform

[![Next.js](https://img.shields.io/badge/Next.js-13.4+-black)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Ready-green)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0+-blue)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI-purple)](https://ai.google.dev/)
[![Version](https://img.shields.io/badge/version-1.0.0-indigo)](https://github.com/YourUsername/AI_Nutrition_Planner)

<div align="center">
  <h3>🍽️ Transform your nutrition journey with AI-powered insights 🍎</h3>
  <h4><em>Your all-in-one companion for nutrition tracking, recipe discovery, and health optimization</em></h4>
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technologies Used](#-technologies-used)
- [Installation & Setup](#️-installation-and-setup)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [API Integration](#-api-integration)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**AI Nutrition Planner** is a cutting-edge nutrition intelligence platform that empowers users to make informed dietary choices through advanced AI analysis, comprehensive food tracking, and personalized insights. By combining intuitive design with powerful AI capabilities, AI Nutrition Planner transforms the way you understand and interact with your nutrition journey.

Built with modern web technologies and designed with user experience at its core, AI Nutrition Planner helps you:

- **Discover** delicious and nutritious recipes tailored to your preferences
- **Track** your daily food intake with precision through an intuitive food diary
- **Visualize** your nutritional data through comprehensive dashboards
- **Analyze** recipes with detailed nutritional breakdowns
- **Improve** your health through data-driven insights and AI recommendations

## ✨ Key Features

### 🍽️ Recipe Intelligence
- **AI-Powered Recipe Discovery**: Find recipes based on your dietary preferences and restrictions
- **Visual Recipe Display**: See beautiful images of dishes with complete ingredient lists and instructions
- **Comprehensive Nutrition Analysis**: View detailed macronutrient and micronutrient breakdowns
- **Image Recognition**: Upload food images to identify dishes and get nutritional information

### 📊 Food Diary
- **Daily Food Tracking**: Log your meals and snacks throughout the day
- **Meal Categorization**: Organize food entries by breakfast, lunch, dinner, and snacks
- **Nutritional Summaries**: See daily and weekly totals of your nutritional intake
- **Progress Visualization**: Track your nutrition patterns over time

### 🤖 Anna AI Cook Assistant
- **Intelligent Chat Interface**: Ask questions about recipes, ingredients, and cooking techniques
- **Recipe Modifications**: Get suggestions for ingredient substitutions and dietary adaptations
- **Cooking Tips**: Receive expert advice for preparing and cooking your meals
- **Nutrition Questions**: Learn about the nutritional aspects of different foods

### 🏋️ Fitness Integration
- **Workout Tracking**: Log and analyze your fitness activities
- **Body Metrics**: Track weight, BMI, and other health metrics over time
- **Goal Setting**: Set and monitor personalized fitness and nutrition goals
- **Activity Recommendations**: Receive custom workout suggestions based on your goals

### 👤 Profile Management
- **Customizable User Profile**: Personalize your experience with preferences
- **Data Visualization**: View charts and graphs to visualize your health journey
- **Achievement System**: Track your progress toward nutrition and fitness goals
- **User Authentication**: Secure login and account management

## 🚀 Technologies Used

AI Nutrition Planner is built using modern web technologies to ensure a smooth, responsive experience:

### Frontend
- **Framework**: [Next.js 13](https://nextjs.org/) with App Router
- **UI Library**: [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom theming
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: React Context API and custom hooks

### Backend
- **API Routes**: Next.js API Routes
- **Database**: [MongoDB](https://www.mongodb.com/) with Mongoose ODM
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) with multiple providers
- **Image Processing**: Server-side image handling

### AI Integration
- **Recipe Generation**: [Google Gemini](https://ai.google.dev/) for intelligent recipe creation
- **Food Recognition**: Custom API for food image analysis
- **Chat Assistant**: AI-powered conversational interface for cooking assistance
- **Nutritional Analysis**: Combined database lookup and AI models

### External APIs
- **Food Database**: Integration with nutrition data providers
- **Image Search**: API for recipe and food images
- **YouTube**: Integration for cooking tutorial videos

## 🛠️ Installation and Setup

Follow these steps to get AI Nutrition Planner running on your local machine:

```bash
# Clone the repository
git clone https://github.com/YourUsername/AI_Nutrition_Planner.git

# Navigate to the project directory
cd AI_Nutrition_Planner

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Set up environment variables (see Environment Variables section)
cp .env.example .env.local

# Run the development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application running.

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Google Gemini API
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# Food Recognition API
FOOD_API_KEY=your_food_api_key

# Optional: YouTube API (for recipe videos)
YOUTUBE_API_KEY=your_youtube_api_key
```

## 📂 Project Structure

```
AI_Nutrition_Planner/
├── app/                  # Next.js App Router structure
│   ├── diary/            # Food diary pages
│   ├── fitness/          # Fitness tracking pages
│   ├── login/            # Authentication pages
│   ├── profile/          # User profile pages
│   └── recipe/           # Recipe analysis pages
├── components/           # Reusable React components
├── lib/                  # Utility functions and shared code
├── models/               # MongoDB models
│   ├── FoodDiary.js      # Food diary data model
│   ├── ProfileData.js    # User profile data model
│   └── User.js           # User authentication model
├── pages/api/            # API routes
│   ├── auth/             # Authentication endpoints
│   ├── diary/            # Food diary endpoints
│   ├── generateFoodImage.js  # AI image generation
│   ├── getFoodImage.js   # Food image retrieval
│   ├── recognizeFood.js  # Food recognition
│   ├── register.js       # User registration
│   └── searchFood.js     # Food search functionality
├── public/               # Static files
└── imagesanna/           # Project images and assets
```

## 🔌 API Integration

AI Nutrition Planner provides several API endpoints for core functionality:

- `/api/searchFood`: Search for foods in the database
- `/api/recognizeFood`: Analyze food images and get nutritional data
- `/api/generateFoodImage`: Generate AI images of food based on descriptions
- `/api/getFoodImage`: Retrieve food images for recipes
- `/api/diary/add`: Add food entries to the diary
- `/api/profile/generateInsights`: Generate personalized insights
- `/api/profile/getUser`: Retrieve user profile data
- `/api/profile/saveHealthData`: Save user health metrics

## 👥 Contributing

We welcome contributions to AI Nutrition Planner! Here's how you can help:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  <p>Made with 💚 by the AI Nutrition Planner Team</p>
</div>