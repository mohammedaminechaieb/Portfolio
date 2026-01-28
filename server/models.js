import mongoose from 'mongoose';

// User/Admin Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' }
}, { timestamps: true });

// Project Schema
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [String],
  image: String,
  liveUrl: String,
  githubUrl: String,
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Skill Schema
const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // Frontend, Backend, Tools, etc.
  level: { type: Number, min: 0, max: 100 },
  icon: String,
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Design Schema
const designSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, required: true }, // UI/UX, Poster, Logo, etc.
  image: { type: String, required: true },
  tools: [String],
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Event Schema
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: Date,
  type: String, // Hackathon, Competition, Workshop, etc.
  achievement: String,
  image: String,
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Certificate Schema
const certificateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  date: Date,
  credentialUrl: String,
  image: String,
  category: String,
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Club Schema
const clubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  description: String,
  period: String,
  image: String,
  achievements: [String],
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Contact Message Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: String,
  message: { type: String, required: true },
  read: { type: Boolean, default: false }
}, { timestamps: true });

// Achievement/Gamification Schema
const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  icon: String,
  trigger: String, // easter-egg, scroll-depth, time-spent, etc.
  unlocked: { type: Boolean, default: false }
}, { timestamps: true });

// Site Settings Schema
const settingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'My Portfolio' },
  tagline: String,
  bio: String,
  avatar: String,
  resumeUrl: String,
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    email: String,
    instagram: String
  },
  theme: {
    primaryColor: { type: String, default: '#6366f1' },
    accentColor: { type: String, default: '#ec4899' }
  },
  gamificationEnabled: { type: Boolean, default: true }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export const Project = mongoose.model('Project', projectSchema);
export const Skill = mongoose.model('Skill', skillSchema);
export const Design = mongoose.model('Design', designSchema);
export const Event = mongoose.model('Event', eventSchema);
export const Certificate = mongoose.model('Certificate', certificateSchema);
export const Club = mongoose.model('Club', clubSchema);
export const Contact = mongoose.model('Contact', contactSchema);
export const Achievement = mongoose.model('Achievement', achievementSchema);
export const Settings = mongoose.model('Settings', settingsSchema);