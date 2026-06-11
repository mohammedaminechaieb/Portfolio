// ============================================================
// MongoDB Seed Script — Amine Chaieb Portfolio
// Usage:  node seed.js
// Run from:  Portfolio-main/server/
// ============================================================

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI ||
  'mongodb+srv://mohammedaminechaieb_db_user:badwolf123@cluster0.z2cv2ej.mongodb.net/';

// ── Minimal schemas (mirrors models.js) ─────────────────────
const projectSchema = new mongoose.Schema({
  title: String, description: String, technologies: [String],
  image: String, liveUrl: String, githubUrl: String,
  featured: { type: Boolean, default: false }, order: { type: Number, default: 0 }
}, { timestamps: true });

const skillSchema = new mongoose.Schema({
  name: String, category: String, level: Number,
  icon: String, order: { type: Number, default: 0 }
}, { timestamps: true });

const eventSchema = new mongoose.Schema({
  title: String, description: String, date: Date,
  type: String, achievement: String, image: String, order: Number
}, { timestamps: true });

const certificateSchema = new mongoose.Schema({
  title: String, issuer: String, date: Date,
  credentialUrl: String, image: String, category: String, order: Number
}, { timestamps: true });

const clubSchema = new mongoose.Schema({
  name: String, role: String, description: String,
  period: String, image: String, achievements: [String], order: Number
}, { timestamps: true });

const settingsSchema = new mongoose.Schema({
  siteName: String, tagline: String, bio: String, avatar: String,
  resumeUrl: String,
  socialLinks: { github: String, linkedin: String, twitter: String, email: String, instagram: String },
  theme: { primaryColor: String, accentColor: String },
  gamificationEnabled: Boolean
}, { timestamps: true });

const Project     = mongoose.model('Project',     projectSchema);
const Skill       = mongoose.model('Skill',       skillSchema);
const Event       = mongoose.model('Event',       eventSchema);
const Certificate = mongoose.model('Certificate', certificateSchema);
const Club        = mongoose.model('Club',        clubSchema);
const Settings    = mongoose.model('Settings',    settingsSchema);

// ── Seed Data ────────────────────────────────────────────────

const projects = [
  {
    title: 'GOB — AI Multi-Agent Voice Assistant',
    description: 'Final-year project: an embedded AI voice assistant system on a multi-agent architecture. Integrates Whisper STT, Piper TTS, Mistral-7B LLM, an intent classifier, and IoT control via ESP32 — all orchestrated through Docker and a FastAPI backend with MQTT messaging.',
    technologies: ['Python', 'FastAPI', 'Mistral-7B', 'Whisper', 'Piper TTS', 'Docker', 'ESP32', 'MQTT', 'React', 'SQLite'],
    liveUrl: '', githubUrl: '', featured: true, order: 1
  },
  {
    title: 'AESAT Website',
    description: 'A professional website for the AESAT student association built collaboratively with a team. Features a dynamic landing page, event highlights, member info, and modern responsive design.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'PHP'],
    liveUrl: '', githubUrl: '', featured: false, order: 2
  },
  {
    title: 'Task Tracker App',
    description: 'A modular task management app with a Figma-designed landing page (HTML/CSS), an Angular-based auth system, and a React-powered dashboard — showcasing cross-framework development and UI design.',
    technologies: ['React', 'Angular', 'HTML', 'CSS', 'Figma'],
    liveUrl: '', githubUrl: '', featured: false, order: 3
  },
  {
    title: 'Hospital Organization System',
    description: 'A hospital management system built using Odoo and custom Python modules. Handles patient records, doctor schedules, appointment bookings, and internal workflow automation.',
    technologies: ['Python', 'Odoo'],
    liveUrl: '', githubUrl: '', featured: false, order: 4
  },
  {
    title: 'EduSphere',
    description: 'A complete educational management system in pure C with a terminal interface. Includes authentication, role-based access, course & student tracking, and file handling.',
    technologies: ['C'],
    liveUrl: '', githubUrl: '', featured: false, order: 5
  },
  {
    title: 'Platformer Game with Pygame',
    description: 'A 2D platformer built with Python and Pygame. Sprites crafted in Aseprite, levels designed in Tiled. Features gravity mechanics, interactive platforms, and multiple levels.',
    technologies: ['Python', 'Pygame', 'Aseprite', 'Tiled'],
    liveUrl: '', githubUrl: '', featured: false, order: 6
  },
];

const skills = [
  // Frontend
  { name: 'HTML',           category: 'Frontend',   level: 95, order: 1  },
  { name: 'CSS',            category: 'Frontend',   level: 95, order: 2  },
  { name: 'JavaScript',     category: 'Frontend',   level: 90, order: 3  },
  { name: 'React',          category: 'Frontend',   level: 85, order: 4  },
  { name: 'Bootstrap',      category: 'Frontend',   level: 90, order: 5  },
  // Backend
  { name: 'PHP',            category: 'Backend',    level: 85, order: 6  },
  { name: 'Node.js',        category: 'Backend',    level: 60, order: 7  },
  { name: 'Python',         category: 'Backend',    level: 90, order: 8  },
  { name: 'FastAPI',        category: 'Backend',    level: 75, order: 9  },
  // Languages
  { name: 'C',              category: 'Languages',  level: 85, order: 10 },
  { name: 'C++',            category: 'Languages',  level: 85, order: 11 },
  { name: 'Java',           category: 'Languages',  level: 80, order: 12 },
  // Databases
  { name: 'MySQL',          category: 'Databases',  level: 85, order: 13 },
  { name: 'PostgreSQL',     category: 'Databases',  level: 90, order: 14 },
  { name: 'MongoDB',        category: 'Databases',  level: 70, order: 15 },
  // AI/ML
  { name: 'Machine Learning', category: 'AI/ML',   level: 75, order: 16 },
  { name: 'Whisper STT',    category: 'AI/ML',     level: 70, order: 17 },
  { name: 'Mistral / LLMs', category: 'AI/ML',     level: 70, order: 18 },
  // DevOps / Embedded
  { name: 'Docker',         category: 'DevOps',     level: 70, order: 19 },
  { name: 'ESP32',          category: 'Embedded',   level: 75, order: 20 },
  { name: 'MQTT',           category: 'Embedded',   level: 65, order: 21 },
  // Design
  { name: 'Photoshop',      category: 'Design',     level: 75, order: 22 },
  { name: 'Illustrator',    category: 'Design',     level: 80, order: 23 },
  { name: 'Canva',          category: 'Design',     level: 95, order: 24 },
  { name: 'Figma',          category: 'Design',     level: 80, order: 25 },
  // Tools
  { name: 'LaTeX',          category: 'Tools',      level: 90, order: 26 },
  { name: 'Power BI',       category: 'Tools',      level: 55, order: 27 },
  { name: 'Odoo',           category: 'Tools',      level: 70, order: 28 },
  { name: 'Excel',          category: 'Tools',      level: 90, order: 29 },
];

const events = [
  {
    title: 'Code & Conquer — 2nd Edition',
    description: 'Part of the sponsorship team for the 2nd edition of Code & Conquer. Responsible for reaching out to potential sponsors, pitching the event, and securing partnerships and funding.',
    date: new Date('2025-04-20'), type: 'Competition',
    achievement: 'Organizer — Sponsorship Team', order: 1
  },
  {
    title: 'TuniHack 10.0',
    description: 'Core organizer for TuniHack. Secured sponsorships, designed and set up decorations, and coordinated both event days to ensure smooth execution.',
    date: new Date('2025-01-15'), type: 'Hackathon',
    achievement: 'Organizer — Sponsorship, Logistics & Event Coordination', order: 2
  },
  {
    title: 'Forum ENSI — 19th Edition',
    description: 'Stand assistant for Focus Corporation. Welcomed the company team, guided attendees, provided information about seminars, and facilitated interactions between visitors and the company.',
    date: new Date('2025-02-01'), type: 'Forum',
    achievement: 'Organizer — Stand Assistant (Focus Corporation)', order: 3
  },
  {
    title: 'Go Data Science 4.0',
    description: '12-hour healthcare-focused data science hackathon organized by the IEEE CIS ENSI Chapter. Engaged in workshops and built a solution under time pressure.',
    date: new Date('2025-02-15'), type: 'Hackathon',
    achievement: 'Participant — Ranked 37th', order: 4
  },
  {
    title: 'ENSI Programming Contest 4.0 (EPC)',
    description: 'Flagship algorithmic competition organized by ECPC. Solved data structure and algorithm problems under time pressure, focused on logical reasoning and code optimization.',
    date: new Date('2024-12-01'), type: 'Competition',
    achievement: 'Participant', order: 5
  },
];

const certificates = [
  { title: 'Efficient LLM Customization', issuer: 'NVIDIA',          date: new Date('2024-10-01'), category: 'AI/ML',        order: 1 },
  { title: 'Ethical Hacking',             issuer: 'Programming Hub',  date: new Date('2024-10-01'), category: 'Cybersecurity', order: 2 },
  { title: 'Python Programming',          issuer: 'Programming Hero', date: new Date('2024-10-01'), category: 'Programming',   order: 3 },
  { title: 'Certificate in Statistics',   issuer: '365DataScience',   date: new Date('2024-11-01'), category: 'Data Science',  order: 4 },
  { title: 'Certificate in Linear Algebra', issuer: '365DataScience', date: new Date('2024-11-01'), category: 'Data Science', order: 5 },
  { title: 'Certificate in Probability',  issuer: '365DataScience',   date: new Date('2024-11-01'), category: 'Data Science',  order: 6 },
  { title: 'English Certificate — C1 (576/600)', issuer: 'British Council', date: new Date('2023-09-01'), category: 'Language', order: 7 },
];

const clubs = [
  {
    name: 'Open Source Software ENSI Club', role: 'Member',
    description: 'Active member contributing to collaborative open source software projects and initiatives at ENSI.',
    period: 'Sep 2024 – Present', achievements: [], order: 1
  },
  {
    name: 'ENSI Competitive Programming Club (ECPC)', role: 'Member',
    description: 'Member participating in algorithmic competitions and training sessions focused on data structures and problem solving.',
    period: 'Sep 2024 – Present', achievements: ['Participated in EPC 4.0'], order: 2
  },
  {
    name: 'ENSI Chess Club', role: 'Member',
    description: 'Active participant in club chess sessions and competitions.',
    period: 'Oct 2024 – Present', achievements: [], order: 3
  },
  {
    name: 'Citoyen Positif et Sociable', role: 'Member',
    description: 'Civic engagement association promoting positive citizenship and social responsibility.',
    period: 'Sep 2024 – Present', achievements: [], order: 4
  },
  {
    name: 'Lycée Khaireddine Ariana Youth Club', role: 'Senior Member',
    description: 'Long-standing senior member involved in organizing activities and mentoring younger members.',
    period: 'Oct 2021 – 2024', achievements: [], order: 5
  },
];

const settingsData = {
  siteName: 'Amine Chaieb',
  tagline: 'Computer Engineering Student & Full-Stack Developer',
  bio: "I'm a Computer Engineering student at ENSI (École Nationale des Sciences de l'Informatique), University of Manouba. I build full-stack web apps, explore AI and embedded systems, and enjoy competitive programming. Currently working on GOB — an AI-powered multi-agent voice assistant system.",
  resumeUrl: 'https://chaiebamine.github.io/portfolio/assets/Mohammed%20Amine%20CHAIEB.pdf',
  socialLinks: {
    github:   'https://github.com/chaiebamine',
    linkedin: 'https://www.linkedin.com/in/amine-chaieb-412972202/',
    email:    'm.amine.chaieb@gmail.com',
    twitter:  '',
    instagram: '',
  },
  theme: { primaryColor: '#6366f1', accentColor: '#ec4899' },
  gamificationEnabled: true,
};

// ── Run ──────────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    await Promise.all([
      Project.deleteMany({}),
      Skill.deleteMany({}),
      Event.deleteMany({}),
      Certificate.deleteMany({}),
      Club.deleteMany({}),
      Settings.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data\n');

    const [p, s, e, c, cl] = await Promise.all([
      Project.insertMany(projects),
      Skill.insertMany(skills),
      Event.insertMany(events),
      Certificate.insertMany(certificates),
      Club.insertMany(clubs),
    ]);
    await new Settings(settingsData).save();

    console.log(`✅ Projects      inserted: ${p.length}`);
    console.log(`✅ Skills        inserted: ${s.length}`);
    console.log(`✅ Events        inserted: ${e.length}`);
    console.log(`✅ Certificates  inserted: ${c.length}`);
    console.log(`✅ Clubs         inserted: ${cl.length}`);
    console.log(`✅ Settings      saved`);
    console.log('\n🎉 Seed complete!');
  } catch (err) {
    console.error('❌ Seed failed:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
