import { clerkClient } from '@clerk/nextjs/server';
import { connectToDatabase } from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { clerkId, name, email, username, profileImage } = req.body;

  if (!clerkId || !email) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Check if user with this clerkId or email already exists
    let user = await User.findOne({
      $or: [{ clerkId }, { email }]
    });

    // If user exists, update their information
    if (user) {
      user.clerkId = clerkId;
      user.name = name || user.name;
      user.email = email;
      user.username = username || user.username;
      
      // Only update profile image if one was provided
      if (profileImage) {
        user.profileImage = profileImage;
      }

      await user.save();
    } else {
      // Create a new user
      user = await User.create({
        clerkId,
        name,
        email,
        username,
        profileImage,
        createdAt: new Date(),
        // Set default values for a new user
        bio: `Hello, I'm ${name}. Just started my nutrition and fitness journey with AnnaData!`,
        theme: "primary",
        location: "",
        settings: {
          emailNotifications: true,
          pushNotifications: true,
          weeklyReports: true,
          darkMode: true,
          language: "english",
          unitSystem: "metric",
          privacyMode: "friends",
        },
        stats: {
          totalRecipes: 0,
          totalWorkouts: 0,
          daysTracked: 1,
          goalsMet: 0,
          streakDays: 1,
          caloriesBurned: 0,
          nutritionScore: 50,
        },
        achievements: [],
        goals: []
      });
    }

    // Return user without sensitive data
    const userResponse = user.toObject();
    delete userResponse.password; // Remove password if it exists

    return res.status(200).json({ user: userResponse });
  } catch (error) {
    console.error('Error syncing user:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}