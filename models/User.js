import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    sparse: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [60, 'Name cannot be more than 60 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  username: {
    type: String,
    unique: true,
    sparse: true
  },
  password: {
    type: String,
    required: false // No longer required when using Clerk
  },
  profileImage: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  theme: {
    type: String,
    default: 'primary'
  },
  settings: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    pushNotifications: {
      type: Boolean,
      default: true
    },
    weeklyReports: {
      type: Boolean,
      default: true
    },
    darkMode: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      default: 'english'
    },
    unitSystem: {
      type: String,
      default: 'metric'
    },
    privacyMode: {
      type: String,
      default: 'friends'
    }
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  achievements: [{
    type: Number
  }],
  subscriptionTier: {
    type: String,
    default: 'free'
  },
  subscriptionExpiry: {
    type: Date
  }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);