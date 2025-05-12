import { connectToDatabase } from '../../../lib/mongodb';
import User from '../../../models/User';
import ProfileData from '../../../models/ProfileData';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET requests allowed' });
  }

  try {
    await connectToDatabase();
    
    // For demo purposes, using default health data
    // In production, fetch this from the user's actual profile
    const healthData = {
      age: 30,
      weight: 70, // kg
      height: 170, // cm
      gender: 'not specified',
      activityLevel: 'moderate',
      fitnessGoals: ['general fitness'],
      medicalConditions: [],
      currentFitnessLevel: 'intermediate',
      preferredWorkoutType: 'mixed',
      workoutFrequency: 3, // times per week
      timeAvailable: 45, // minutes per session
    };

    // Generate workout recommendations based on health data
    const recommendations = generateWorkoutRecommendations(healthData);

    return res.status(200).json({ 
      recommendations,
      userData: healthData
    });
  } catch (error) {
    console.error('Error generating fitness recommendations:', error);
    return res.status(500).json({ 
      message: 'Failed to generate fitness recommendations', 
      error: error.message 
    });
  }
}

function generateWorkoutRecommendations(healthData) {
  const recommendations = {
    workoutPlan: [],
    tips: [],
    warnings: []
  };

  // Calculate BMI for intensity recommendations
  const heightInMeters = healthData.height / 100;
  const bmi = (healthData.weight / (heightInMeters * heightInMeters));

  // Basic workout templates
  const cardioExercises = [
    { name: "Walking", intensity: "low", caloriesBurn: "150-200 per 30 mins" },
    { name: "Jogging", intensity: "moderate", caloriesBurn: "250-300 per 30 mins" },
    { name: "Running", intensity: "high", caloriesBurn: "300-400 per 30 mins" },
    { name: "Swimming", intensity: "moderate", caloriesBurn: "200-300 per 30 mins" },
    { name: "Cycling", intensity: "moderate", caloriesBurn: "200-300 per 30 mins" },
    { name: "Jump Rope", intensity: "high", caloriesBurn: "300-400 per 30 mins" }
  ];

  const strengthExercises = [
    { name: "Push-ups", intensity: "moderate", target: "upper body" },
    { name: "Squats", intensity: "moderate", target: "lower body" },
    { name: "Planks", intensity: "moderate", target: "core" },
    { name: "Lunges", intensity: "moderate", target: "lower body" },
    { name: "Dumbbell Rows", intensity: "moderate", target: "upper body" },
    { name: "Wall Sits", intensity: "low", target: "lower body" }
  ];

  const flexibilityExercises = [
    { name: "Yoga", intensity: "low", focus: "full body flexibility" },
    { name: "Stretching Routine", intensity: "low", focus: "mobility" },
    { name: "Pilates", intensity: "moderate", focus: "core and flexibility" }
  ];

  // Generate personalized workout plan
  let workoutPlan = [];
  
  // Consider fitness level and goals
  if (healthData.currentFitnessLevel === 'beginner') {
    workoutPlan = generateBeginnerPlan(cardioExercises, strengthExercises, healthData.timeAvailable);
  } else if (healthData.currentFitnessLevel === 'intermediate') {
    workoutPlan = generateIntermediatePlan(cardioExercises, strengthExercises, flexibilityExercises, healthData.timeAvailable);
  } else {
    workoutPlan = generateAdvancedPlan(cardioExercises, strengthExercises, flexibilityExercises, healthData.timeAvailable);
  }

  recommendations.workoutPlan = workoutPlan;

  // Add general tips based on user's profile
  recommendations.tips = generateWorkoutTips(healthData);

  // Add any necessary warnings
  recommendations.warnings = generateWarnings(healthData);

  return recommendations;
}

function generateBeginnerPlan(cardio, strength, timeAvailable) {
  return [
    {
      day: "Day 1",
      focus: "Full Body + Light Cardio",
      exercises: [
        { ...cardio.find(e => e.intensity === "low"), duration: "15 minutes" },
        { ...strength.find(e => e.name === "Push-ups"), reps: "5-10 reps, 2 sets" },
        { ...strength.find(e => e.name === "Squats"), reps: "10 reps, 2 sets" },
        { ...strength.find(e => e.name === "Planks"), duration: "20 seconds, 2 sets" }
      ]
    },
    {
      day: "Day 2",
      focus: "Rest and Light Activity",
      exercises: [
        { name: "Walking", duration: "20 minutes", intensity: "low" },
        { name: "Basic Stretching", duration: "10 minutes", intensity: "low" }
      ]
    },
    {
      day: "Day 3",
      focus: "Full Body + Light Cardio",
      exercises: [
        { ...cardio.find(e => e.intensity === "low"), duration: "15 minutes" },
        { ...strength.find(e => e.name === "Wall Sits"), duration: "20 seconds, 2 sets" },
        { ...strength.find(e => e.name === "Push-ups"), reps: "5-10 reps, 2 sets" },
        { name: "Stretching", duration: "10 minutes", intensity: "low" }
      ]
    }
  ];
}

function generateIntermediatePlan(cardio, strength, flexibility, timeAvailable) {
  return [
    {
      day: "Day 1",
      focus: "Upper Body + Cardio",
      exercises: [
        { ...cardio.find(e => e.intensity === "moderate"), duration: "20 minutes" },
        { ...strength.find(e => e.name === "Push-ups"), reps: "12-15 reps, 3 sets" },
        { ...strength.find(e => e.name === "Dumbbell Rows"), reps: "12 reps, 3 sets" },
        { ...strength.find(e => e.name === "Planks"), duration: "45 seconds, 3 sets" }
      ]
    },
    {
      day: "Day 2",
      focus: "Lower Body + Flexibility",
      exercises: [
        { ...strength.find(e => e.name === "Squats"), reps: "15 reps, 3 sets" },
        { ...strength.find(e => e.name === "Lunges"), reps: "12 reps each leg, 3 sets" },
        { ...flexibility[0], duration: "20 minutes" }
      ]
    },
    {
      day: "Day 3",
      focus: "Full Body + HIIT",
      exercises: [
        { name: "HIIT Circuit", duration: "20 minutes", intensity: "high" },
        { ...strength.find(e => e.name === "Push-ups"), reps: "12-15 reps, 3 sets" },
        { ...strength.find(e => e.name === "Squats"), reps: "15 reps, 3 sets" },
        { ...flexibility[1], duration: "10 minutes" }
      ]
    }
  ];
}

function generateAdvancedPlan(cardio, strength, flexibility, timeAvailable) {
  return [
    {
      day: "Day 1",
      focus: "Intense Upper Body + HIIT",
      exercises: [
        { ...cardio.find(e => e.intensity === "high"), duration: "25 minutes" },
        { ...strength.find(e => e.name === "Push-ups"), reps: "20 reps, 4 sets" },
        { ...strength.find(e => e.name === "Dumbbell Rows"), reps: "15 reps, 4 sets" },
        { ...strength.find(e => e.name === "Planks"), duration: "60 seconds, 4 sets" }
      ]
    },
    {
      day: "Day 2",
      focus: "Intense Lower Body + Cardio",
      exercises: [
        { ...cardio.find(e => e.name === "Jump Rope"), duration: "20 minutes" },
        { ...strength.find(e => e.name === "Squats"), reps: "20 reps, 4 sets" },
        { ...strength.find(e => e.name === "Lunges"), reps: "15 reps each leg, 4 sets" },
        { ...flexibility[2], duration: "20 minutes" }
      ]
    },
    {
      day: "Day 3",
      focus: "Full Body + Advanced HIIT",
      exercises: [
        { name: "Advanced HIIT Circuit", duration: "30 minutes", intensity: "very high" },
        { ...strength.find(e => e.name === "Push-ups"), reps: "20 reps, 4 sets" },
        { ...strength.find(e => e.name === "Squats"), reps: "20 reps, 4 sets" },
        { ...flexibility[1], duration: "15 minutes" }
      ]
    }
  ];
}

function generateWorkoutTips(healthData) {
  const tips = [
    "Stay hydrated - drink water before, during, and after workouts",
    "Warm up properly before each workout session",
    "Cool down and stretch after your workout",
    "Listen to your body and rest when needed"
  ];

  if (healthData.currentFitnessLevel === 'beginner') {
    tips.push(
      "Start slowly and gradually increase intensity",
      "Focus on proper form rather than speed or weight",
      "Take breaks between exercises as needed"
    );
  }

  if (healthData.timeAvailable < 30) {
    tips.push(
      "Try to split your workout throughout the day if possible",
      "Focus on compound exercises to maximize limited time",
      "Maintain higher intensity for shorter duration"
    );
  }

  return tips;
}

function generateWarnings(healthData) {
  const warnings = [];

  if (healthData.medicalConditions && healthData.medicalConditions.length > 0) {
    warnings.push("Consult with your healthcare provider before starting this workout plan");
  }

  if (healthData.age > 50) {
    warnings.push("Consider a thorough medical check-up before starting intense workouts");
  }

  if (healthData.bmi > 30) {
    warnings.push("Start with low-impact exercises and gradually increase intensity");
  }

  return warnings;
}
