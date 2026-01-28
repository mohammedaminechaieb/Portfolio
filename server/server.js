import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { authMiddleware } from './middleware.js';
import {
  User, Project, Skill, Design, Event, Certificate,
  Club, Contact, Achievement, Settings
} from './models.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://mohammedaminechaieb_db_user:badwolf123@cluster0.z2cv2ej.mongodb.net/')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// ============================================
// AUTHENTICATION ROUTES
// ============================================

// Register Admin (First time setup)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if admin already exists
    const existingUser = await User.findOne();
    if (existingUser) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// PROJECTS ROUTES
// ============================================

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      technologies: JSON.parse(req.body.technologies || '[]'),
      image: req.file ? `${process.env.BACKEND_URL}/uploads/${req.file.filename}` : null
    };
    const project = new Project(projectData);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/projects/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      technologies: req.body.technologies ? JSON.parse(req.body.technologies) : undefined
    };
    if (req.file) {
      updateData.image = `${process.env.BACKEND_URL}/uploads/${req.file.filename}`;
    }
    const project = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/projects/:id', authMiddleware, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// SKILLS ROUTES
// ============================================

app.get('/api/skills', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/skills', authMiddleware, async (req, res) => {
  try {
    const skill = new Skill(req.body);
    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/skills/:id', authMiddleware, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(skill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/skills/:id', authMiddleware, async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Skill deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// DESIGNS ROUTES
// ============================================

app.get('/api/designs', async (req, res) => {
  try {
    const designs = await Design.find().sort({ order: 1, createdAt: -1 });
    res.json(designs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/designs', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const designData = {
      ...req.body,
      tools: JSON.parse(req.body.tools || '[]'),
      image: req.file ? `${process.env.BACKEND_URL}/uploads/${req.file.filename}` : null
    };
    const design = new Design(designData);
    await design.save();
    res.status(201).json(design);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/designs/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      tools: req.body.tools ? JSON.parse(req.body.tools) : undefined
    };
    if (req.file) {
      updateData.image = `${process.env.BACKEND_URL}/uploads/${req.file.filename}`;
    }
    const design = await Design.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(design);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/designs/:id', authMiddleware, async (req, res) => {
  try {
    await Design.findByIdAndDelete(req.params.id);
    res.json({ message: 'Design deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// EVENTS ROUTES
// ============================================

app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/events', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      image: req.file ? `${process.env.BACKEND_URL}/uploads/${req.file.filename}` : null
    };
    const event = new Event(eventData);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/events/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = `${process.env.BACKEND_URL}/uploads/${req.file.filename}`;
    }
    const event = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/events/:id', authMiddleware, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// CERTIFICATES ROUTES
// ============================================

app.get('/api/certificates', async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ date: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/certificates', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const certData = {
      ...req.body,
      image: req.file ? `${process.env.BACKEND_URL}/uploads/${req.file.filename}` : null
    };
    const certificate = new Certificate(certData);
    await certificate.save();
    res.status(201).json(certificate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/certificates/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = `${process.env.BACKEND_URL}/uploads/${req.file.filename}`;
    }
    const certificate = await Certificate.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(certificate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/certificates/:id', authMiddleware, async (req, res) => {
  try {
    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Certificate deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// CLUBS ROUTES
// ============================================

app.get('/api/clubs', async (req, res) => {
  try {
    const clubs = await Club.find().sort({ order: 1 });
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/clubs', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const clubData = {
      ...req.body,
      achievements: JSON.parse(req.body.achievements || '[]'),
      image: req.file ? `/uploads/${req.file.filename}` : null
    };
    const club = new Club(clubData);
    await club.save();
    res.status(201).json(club);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/clubs/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      achievements: req.body.achievements ? JSON.parse(req.body.achievements) : undefined
    };
    if (req.file) {
      updateData.image = `${process.env.BACKEND_URL}/uploads/${req.file.filename}`;
    }
    const club = await Club.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(club);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/clubs/:id', authMiddleware, async (req, res) => {
  try {
    await Club.findByIdAndDelete(req.params.id);
    res.json({ message: 'Club deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// CONTACT ROUTES
// ============================================

app.get('/api/contacts', authMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/contacts/:id/read', authMiddleware, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/contacts/:id', authMiddleware, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// SETTINGS ROUTES
// ============================================

app.get('/api/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/settings', authMiddleware, upload.single('avatar'), async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      socialLinks: req.body.socialLinks ? JSON.parse(req.body.socialLinks) : undefined,
      theme: req.body.theme ? JSON.parse(req.body.theme) : undefined
    };
    if (req.file) {
      updateData.avatar = `${process.env.BACKEND_URL}/uploads/${req.file.filename}`;
    }
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(updateData);
    } else {
      Object.assign(settings, updateData);
    }
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// UPLOAD ROUTE (Generic)
// ============================================

app.post('/api/upload', authMiddleware, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ url: `/uploads/${req.file.filename}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// STATS/DASHBOARD ROUTE
// ============================================

app.get('/api/stats', authMiddleware, async (req, res) => {
  try {
    const stats = {
      projects: await Project.countDocuments(),
      skills: await Skill.countDocuments(),
      designs: await Design.countDocuments(),
      events: await Event.countDocuments(),
      certificates: await Certificate.countDocuments(),
      clubs: await Club.countDocuments(),
      messages: await Contact.countDocuments({ read: false })
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
