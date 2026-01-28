import express from 'express';
const router = express.Router();

// Example endpoints
let skills = [
  { id: 1, name: 'React', level: 'Advanced' },
  { id: 2, name: 'Node.js', level: 'Intermediate' },
];

let projects = [
  { id: 1, title: 'Portfolio Website', status: 'Completed' },
  { id: 2, title: 'Blog App', status: 'In Progress' },
];

// Skills API
router.get('/skills', (req, res) => res.json(skills));
router.post('/skills', (req, res) => {
  const skill = { id: skills.length + 1, ...req.body };
  skills.push(skill);
  res.json(skill);
});

// Projects API
router.get('/projects', (req, res) => res.json(projects));
router.post('/projects', (req, res) => {
  const project = { id: projects.length + 1, ...req.body };
  projects.push(project);
  res.json(project);
});

export default router;
