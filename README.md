# AnnaData: Your Personal Nutrition Intelligence Platform

![AnnaData Banner](./imagesanna/banner.png)

[![GitHub stars](https://img.shields.io/github/stars/NiladriHazra/AnnaData?style=social)](https://github.com/NiladriHazra/AnnaData/stargazers)
[![Twitter Follow](https://img.shields.io/twitter/follow/PixelNiladri?style=social)](https://twitter.com/PixelNiladri)
[![GitHub license](https://img.shields.io/github/license/NiladriHazra/AnnaData?color=blue)](https://github.com/NiladriHazra/AnnaData/blob/main/LICENSE)
[![Version](https://img.shields.io/badge/version-2.5.0-indigo)](https://github.com/NiladriHazra/AnnaData)
[![JavaScript](https://img.shields.io/badge/JavaScript-99.9%25-yellow)](https://github.com/NiladriHazra/AnnaData)
[![Next.js](https://img.shields.io/badge/Next.js-13.4+-black)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Ready-green)](https://www.mongodb.com/)

<div align="center">
  <h3>🍽️ Discover the nutrition behind your food with AI-powered insights 🍎</h3>
  <h4><em>Your all-in-one companion for nutrition tracking, meal planning, and health insights</em></h4>
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Live Demo](#-live-demo)
- [Screenshots](#-screenshots)
- [Technologies Used](#-technologies-used)
- [Installation & Setup](#️-installation-and-setup)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [API Integration](#-api-integration)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact & Support](#-contact--support)

---

## 🌟 Overview

**AnnaData** (अन्ना - Data) is a cutting-edge nutrition intelligence platform that empowers users to make informed dietary choices through advanced AI analysis, comprehensive tracking, and personalized insights. By combining beautiful, intuitive design with powerful data analytics, AnnaData transforms the way you understand and interact with your nutrition and fitness journey.

Built with modern web technologies and designed with user experience at its core, AnnaData helps you:

- **Understand** what's truly in your food
- **Track** your nutritional intake with precision
- **Visualize** your progress through comprehensive dashboards
- **Plan** balanced meals tailored to your personal goals
- **Improve** your health through data-driven insights

## ✨ Key Features

### 🍽️ Food Intelligence
- **AI-Powered Food Recognition**: Instantly identify and analyze foods through images
- **Comprehensive Nutrition Database**: Access detailed nutritional information for thousands of foods
- **Smart Recipe Analysis**: Break down recipes into their nutritional components
- **Seasonal Food Insights**: Learn about seasonal foods and their nutritional benefits

### 📊 Personal Dashboard
- **Customizable Overview**: At-a-glance visualization of your nutritional intake and goals
- **Progress Tracking**: Monitor your nutrition and fitness journey with beautiful charts
- **Achievement System**: Earn achievements and track progress toward health milestones
- **Daily and Weekly Reports**: Get detailed summaries of your nutritional intake

### 🏋️ Fitness Integration
- **Workout Tracking**: Log and analyze your fitness activities
- **Body Metrics**: Track weight, BMI, body measurements, and other health metrics over time
- **Goal Setting**: Set and monitor personalized fitness and nutrition goals
- **Exercise Recommendations**: Receive custom workout suggestions based on your goals

### 🧠 AI-Powered Insights
- **Personalized Recommendations**: Receive tailored nutrition and fitness suggestions
- **Trend Analysis**: Understand patterns in your eating and exercise habits
- **Smart Meal Planning**: Get AI-generated meal plans based on your dietary preferences and goals
- **Nutritional Gap Detection**: Identify potential deficiencies in your diet

### 👤 Profile Management
- **Customizable User Profile**: Personalize your experience with themes and preferences
- **Data Visualization**: Beautiful charts and graphs to visualize your health journey
- **Social Sharing**: Connect with friends and share your achievements (optional)
- **Data Export**: Export your nutrition and fitness data in various formats

## 🔗 Live Demo

Experience AnnaData live at: [https://annaData-nutrition.vercel.app](https://annaData-nutrition.vercel.app) (Coming Soon)

## 📱 Screenshots

<div align="center">
  <img src="./imagesanna/home.png" width="45%" alt="Home Dashboard">
  <img src="./imagesanna/fitness.png" width="45%" alt="Fitness Tracking">
</div>

<div align="center">
  <img src="./imagesanna/profile.png" width="45%" alt="User Profile">
  <img src="./imagesanna/recipie.png" width="45%" alt="Recipe Analysis">
</div>

<div align="center">
  <img src="./imagesanna/spring_asparagus.png" width="45%" alt="Seasonal Foods">
  <img src="./imagesanna/spring_strawberries.png" width="45%" alt="Nutritional Insights">
</div>

## 🚀 Technologies Used

AnnaData is built using modern web technologies to ensure a smooth, responsive experience:

### Frontend
- **Framework**: [Next.js 13](https://nextjs.org/) with App Router
- **UI Library**: [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom theming
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Forms**: React Hook Form with Zod validation

### Backend
- **API Routes**: Next.js API Routes
- **Database**: [MongoDB](https://www.mongodb.com/) with Mongoose ODM
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) with multiple providers
- **Image Processing**: [Sharp](https://sharp.pixelplumbing.com/)

### AI/ML Integration
- **Food Recognition**: Custom API integration
- **Nutritional Analysis**: Combined database lookup and ML models
- **Personalization**: User preference learning algorithms

### DevOps
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel
- **Monitoring**: Vercel Analytics

## 🛠️ Installation and Setup

Follow these steps to get AnnaData running on your local machine:

```bash
# Clone the repository
git clone https://github.com/YourUsername/AnnaData.git

# Navigate to the project directory
cd AnnaData

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
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# API Keys for Food Recognition
FOOD_API_KEY=your_food_api_key

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

## 📂 Project Structure

```
AnnaData/
├── app/                  # Next.js App Router structure
│   ├── diary/            # Food diary pages
│   ├── fitness/          # Fitness tracking pages
│   ├── login/            # Authentication pages
│   ├── profile/          # User profile pages
│   └── recipe/           # Recipe analysis pages
├── components/           # Reusable React components
├── lib/                  # Utility functions and shared code
├── models/               # MongoDB models
├── pages/api/            # API routes
│   ├── auth/             # Authentication endpoints
│   ├── diary/            # Food diary endpoints
│   └── profile/          # Profile endpoints
├── public/               # Static files
└── imagesanna/           # Project images and assets
```

## 🚢 Deployment

### Vercel (Recommended)

The easiest way to deploy AnnaData is to use the [Vercel Platform](https://vercel.com):

1. Push your code to a GitHub repository
2. Import the project into Vercel
3. Add environment variables in the Vercel dashboard
4. Deploy

### Self-hosting

You can also deploy AnnaData on your own server:

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 🔌 API Integration

AnnaData provides several API endpoints for integrating with other services:

- `/api/searchFood`: Search for foods in the database
- `/api/recognizeFood`: Analyze food images and get nutritional data
- `/api/diary/add`: Add food entries to the diary
- `/api/profile/generateInsights`: Generate personalized insights

Full API documentation is available in the `/docs` directory.

## 👥 Contributing

We welcome contributions to AnnaData! Here's how you can help:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

- **Website**: [annaData-nutrition.com](https://annaData-nutrition.com) (Coming Soon)
- **Email**: support@annaData-nutrition.com
- **Twitter**: [@PixelNiladri](https://twitter.com/PixelNiladri)
- **GitHub Issues**: [Report a bug](https://github.com/NiladriHazra/AnnaData/issues)

---

<div align="center">
  <p>Made with 💚 by the AnnaData Team</p>
  <p>© 2025 AnnaData. All rights reserved.</p>
</div>