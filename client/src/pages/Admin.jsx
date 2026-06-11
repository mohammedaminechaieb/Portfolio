import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FaProjectDiagram, FaBrain, FaPalette, FaTrophy,
  FaCertificate, FaUsers, FaEnvelope, FaCog, FaPlus,
  FaEdit, FaTrash, FaSave, FaTimes
} from 'react-icons/fa';
import {
  projectsAPI, skillsAPI, designsAPI, eventsAPI,
  certificatesAPI, clubsAPI, contactAPI, settingsAPI, statsAPI
} from '../utils/api';

// ─── Reusable DataSection ────────────────────────────────────────────────────
const DataSection = ({ title, data, onAdd, onEdit, onDelete, showForm, setShowForm, formData, setFormData, onSubmit, loading, fields }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">{title}</h2>
      <button onClick={onAdd} className="btn-primary flex items-center gap-2">
        <FaPlus /> Add New
      </button>
    </div>

    {showForm && (
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glow-card rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{formData._id ? 'Edit' : 'Add New'} {title.slice(0, -1)}</h3>
          <button onClick={() => setShowForm(false)}><FaTimes className="text-xl hover:text-red-400" /></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
              <label className="block text-sm font-medium mb-2">
                {field.label}{field.required && <span className="text-red-400">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-primary-500 outline-none"
                  rows="4" required={field.required}
                />
              ) : field.type === 'file' ? (
                <input type="file"
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.files[0] })}
                  accept={field.accept}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20"
                />
              ) : field.type === 'checkbox' ? (
                <input type="checkbox"
                  checked={formData[field.name] || false}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.checked })}
                  className="w-5 h-5"
                />
              ) : field.type === 'select' ? (
                <select
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-white/20 focus:border-primary-500 outline-none"
                  required={field.required}
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-primary-500 outline-none"
                  required={field.required} min={field.min} max={field.max}
                  placeholder={field.placeholder || ''}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onSubmit} disabled={loading} className="btn-primary flex items-center gap-2">
            <FaSave />{loading ? 'Saving...' : 'Save'}
          </button>
          <button onClick={() => setShowForm(false)} className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20">Cancel</button>
        </div>
      </motion.div>
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((item) => (
        <div key={item._id} className="glow-card rounded-lg p-4">
          {item.image && (
            <img src={item.image} alt={item.title || item.name} className="w-full h-32 object-cover rounded-lg mb-3" />
          )}
          <h3 className="font-bold text-lg mb-1">{item.title || item.name}</h3>
          {item.issuer && <p className="text-sm text-accent-400 mb-1">{item.issuer}</p>}
          {item.category && <p className="text-xs text-gray-500 mb-1">{item.category}</p>}
          {item.role && <p className="text-sm text-primary-400 mb-1">{item.role}</p>}
          {item.level !== undefined && (
            <p className="text-xs text-gray-400 mb-1">Level: {item.level}%</p>
          )}
          <p className="text-sm text-gray-400 mb-3 line-clamp-2">{item.description}</p>
          <div className="flex gap-2">
            <button onClick={() => onEdit(item)} className="flex-1 px-3 py-2 rounded bg-primary-500/20 text-primary-300 hover:bg-primary-500/30 flex items-center justify-center gap-2">
              <FaEdit /> Edit
            </button>
            <button onClick={() => onDelete(item._id)} className="flex-1 px-3 py-2 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 flex items-center justify-center gap-2">
              <FaTrash /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>

    {data.length === 0 && !showForm && (
      <p className="text-center text-gray-400 py-12">No {title.toLowerCase()} yet. Click "Add New" to get started!</p>
    )}
  </div>
);

// ─── Settings Panel ──────────────────────────────────────────────────────────
const SettingsPanel = ({ settings, onSave, loading }) => {
  const [form, setForm] = useState({
    siteName: '', tagline: '', bio: '', resumeUrl: '',
    github: '', linkedin: '', twitter: '', email: '', instagram: '',
    primaryColor: '#6366f1', accentColor: '#ec4899',
  });

  useEffect(() => {
    if (settings) {
      setForm({
        siteName: settings.siteName || '',
        tagline: settings.tagline || '',
        bio: settings.bio || '',
        resumeUrl: settings.resumeUrl || '',
        github: settings.socialLinks?.github || '',
        linkedin: settings.socialLinks?.linkedin || '',
        twitter: settings.socialLinks?.twitter || '',
        email: settings.socialLinks?.email || '',
        instagram: settings.socialLinks?.instagram || '',
        primaryColor: settings.theme?.primaryColor || '#6366f1',
        accentColor: settings.theme?.accentColor || '#ec4899',
      });
    }
  }, [settings]);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('siteName', form.siteName);
    formData.append('tagline', form.tagline);
    formData.append('bio', form.bio);
    formData.append('resumeUrl', form.resumeUrl);
    formData.append('socialLinks', JSON.stringify({
      github: form.github, linkedin: form.linkedin,
      twitter: form.twitter, email: form.email, instagram: form.instagram,
    }));
    formData.append('theme', JSON.stringify({
      primaryColor: form.primaryColor, accentColor: form.accentColor,
    }));
    onSave(formData);
  };

  const field = (label, key, type = 'text', placeholder = '') => (
    <div key={key}>
      <label className="block text-sm font-medium mb-2">{label}</label>
      {type === 'textarea' ? (
        <textarea value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
          className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-primary-500 outline-none" rows="4" placeholder={placeholder} />
      ) : (
        <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
          className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-primary-500 outline-none" placeholder={placeholder} />
      )}
    </div>
  );

  return (
    <div className="glow-card rounded-2xl p-8 space-y-8">
      <h2 className="text-2xl font-bold">Site Settings</h2>

      <section>
        <h3 className="text-lg font-semibold mb-4 text-primary-400">General</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('Site Name', 'siteName', 'text', 'Amine Chaieb')}
          {field('Tagline', 'tagline', 'text', 'Computer Engineering Student...')}
          {field('Resume URL', 'resumeUrl', 'url', 'https://...')}
        </div>
        <div className="mt-4">{field('Bio', 'bio', 'textarea', 'Tell your story...')}</div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-4 text-primary-400">Social Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('GitHub URL', 'github', 'url')}
          {field('LinkedIn URL', 'linkedin', 'url')}
          {field('Twitter URL', 'twitter', 'url')}
          {field('Email', 'email', 'email')}
          {field('Instagram URL', 'instagram', 'url')}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-4 text-primary-400">Avatar</h3>
        <input type="file" accept="image/*"
          onChange={e => setForm({ ...form, avatar: e.target.files[0] })}
          className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20" />
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-4 text-primary-400">Theme Colors</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Primary Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={form.primaryColor} onChange={e => setForm({ ...form, primaryColor: e.target.value })} className="w-12 h-12 rounded cursor-pointer bg-transparent border-0" />
              <span className="text-gray-400 font-mono text-sm">{form.primaryColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Accent Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={form.accentColor} onChange={e => setForm({ ...form, accentColor: e.target.value })} className="w-12 h-12 rounded cursor-pointer bg-transparent border-0" />
              <span className="text-gray-400 font-mono text-sm">{form.accentColor}</span>
            </div>
          </div>
        </div>
      </section>

      <button onClick={handleSubmit} disabled={loading} className="btn-primary flex items-center gap-2">
        <FaSave />{loading ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
};

// ─── Main Admin Component ────────────────────────────────────────────────────
const Admin = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [events, setEvents] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [settings, setSettings] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); }
    else { fetchStats(); fetchAllData(); }
  }, [isAuthenticated, navigate]);

  const fetchStats = async () => {
    try { const r = await statsAPI.get(); setStats(r.data); } catch (e) { console.error(e); }
  };

  const fetchAllData = async () => {
    try {
      const [pR, sR, dR, eR, cR, clR, coR, stR] = await Promise.all([
        projectsAPI.getAll(), skillsAPI.getAll(), designsAPI.getAll(), eventsAPI.getAll(),
        certificatesAPI.getAll(), clubsAPI.getAll(), contactAPI.getAll(), settingsAPI.get(),
      ]);
      setProjects(pR.data); setSkills(sR.data); setDesigns(dR.data); setEvents(eR.data);
      setCertificates(cR.data); setClubs(clR.data); setContacts(coR.data); setSettings(stR.data);
    } catch (e) { console.error(e); }
  };

  const tabs = [
    { id: 'dashboard',    label: 'Dashboard',    icon: FaCog },
    { id: 'projects',     label: 'Projects',     icon: FaProjectDiagram, count: stats.projects },
    { id: 'skills',       label: 'Skills',       icon: FaBrain,          count: stats.skills },
    { id: 'designs',      label: 'Designs',      icon: FaPalette,        count: stats.designs },
    { id: 'events',       label: 'Events',       icon: FaTrophy,         count: stats.events },
    { id: 'certificates', label: 'Certificates', icon: FaCertificate,    count: stats.certificates },
    { id: 'clubs',        label: 'Clubs',        icon: FaUsers,          count: stats.clubs },
    { id: 'messages',     label: 'Messages',     icon: FaEnvelope,       count: stats.messages },
    { id: 'settings',     label: 'Settings',     icon: FaCog },
  ];

  const handleAdd = () => { setEditingItem(null); setFormData({}); setShowForm(true); };
  const handleEdit = (item) => { setEditingItem(item); setFormData({ ...item }); setShowForm(true); };

  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure?')) return;
    try {
      setLoading(true);
      const apis = { projects: projectsAPI, skills: skillsAPI, designs: designsAPI, events: eventsAPI, certificates: certificatesAPI, clubs: clubsAPI, messages: contactAPI };
      await apis[type].delete(id);
      toast.success('Deleted successfully!');
      fetchAllData(); fetchStats();
    } catch { toast.error('Error deleting'); } finally { setLoading(false); }
  };

  const handleSubmit = async (type) => {
    try {
      setLoading(true);
      const fd = new FormData();
      // Fields that the form collects as comma-separated strings but the API expects as JSON arrays
      const arrayFields = ['technologies', 'tools', 'achievements'];
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          if (formData[key] instanceof File) {
            fd.append(key, formData[key]);
          } else if (arrayFields.includes(key)) {
            // Split comma-separated string into an array, trim whitespace
            const arr = typeof formData[key] === 'string'
              ? formData[key].split(',').map(s => s.trim()).filter(Boolean)
              : formData[key];
            fd.append(key, JSON.stringify(arr));
          } else if (Array.isArray(formData[key])) {
            fd.append(key, JSON.stringify(formData[key]));
          } else {
            fd.append(key, formData[key]);
          }
        }
      });
      const apis = { projects: projectsAPI, skills: skillsAPI, designs: designsAPI, events: eventsAPI, certificates: certificatesAPI, clubs: clubsAPI };
      if (editingItem) { await apis[type].update(editingItem._id, fd); toast.success('Updated!'); }
      else { await apis[type].create(fd); toast.success('Created!'); }
      setShowForm(false); setFormData({}); setEditingItem(null);
      fetchAllData(); fetchStats();
    } catch { toast.error('Error saving'); } finally { setLoading(false); }
  };

  const handleSaveSettings = async (fd) => {
    try {
      setLoading(true);
      await settingsAPI.update(fd);
      toast.success('Settings saved!');
      fetchAllData();
    } catch { toast.error('Error saving settings'); } finally { setLoading(false); }
  };

  // Tab-specific field definitions
  const tabFields = {
    projects: [
      { name: 'title',        label: 'Title',                           type: 'text',     required: true },
      { name: 'description',  label: 'Description',                     type: 'textarea', required: true },
      { name: 'technologies', label: 'Technologies (comma separated)',   type: 'text',     placeholder: 'React, Node.js, MongoDB' },
      { name: 'liveUrl',      label: 'Live URL',                        type: 'url' },
      { name: 'githubUrl',    label: 'GitHub URL',                      type: 'url' },
      { name: 'image',        label: 'Image',                           type: 'file',     accept: 'image/*' },
      { name: 'featured',     label: 'Featured',                        type: 'checkbox' },
    ],
    skills: [
      { name: 'name',     label: 'Skill Name',                      type: 'text',   required: true },
      { name: 'category', label: 'Category (Frontend, Backend...)', type: 'text',   required: true },
      { name: 'level',    label: 'Level (0-100)',                   type: 'number', min: 0, max: 100 },
      { name: 'icon',     label: 'Icon URL',                        type: 'url' },
    ],
    designs: [
      { name: 'title',       label: 'Title',                      type: 'text',     required: true },
      { name: 'description', label: 'Description',                type: 'textarea' },
      { name: 'category',    label: 'Category (UI/UX, Poster...)', type: 'text',   required: true },
      { name: 'tools',       label: 'Tools (comma separated)',     type: 'text',   placeholder: 'Figma, Photoshop, Canva' },
      { name: 'image',       label: 'Image',                      type: 'file',    accept: 'image/*', required: true },
    ],
    events: [
      { name: 'title',       label: 'Title',                         type: 'text',     required: true },
      { name: 'description', label: 'Description',                   type: 'textarea' },
      { name: 'date',        label: 'Date',                          type: 'date' },
      { name: 'type',        label: 'Type',                          type: 'select',
        options: ['Hackathon', 'Competition', 'Workshop', 'Forum', 'Conference', 'Other'] },
      { name: 'achievement', label: 'Achievement / Role',            type: 'text',     placeholder: 'e.g. Ranked 3rd, Organizer' },
      { name: 'image',       label: 'Image',                         type: 'file',     accept: 'image/*' },
    ],
    certificates: [
      { name: 'title',         label: 'Certificate Title',    type: 'text',   required: true },
      { name: 'issuer',        label: 'Issuer',               type: 'text',   required: true },
      { name: 'date',          label: 'Issue Date',           type: 'date' },
      { name: 'category',      label: 'Category',             type: 'select',
        options: ['AI/ML', 'Cybersecurity', 'Programming', 'Data Science', 'Web', 'Language', 'Other'] },
      { name: 'credentialUrl', label: 'Credential URL',       type: 'url' },
      { name: 'image',         label: 'Certificate Image',    type: 'file',   accept: 'image/*' },
    ],
    clubs: [
      { name: 'name',         label: 'Club / Org Name',         type: 'text',     required: true },
      { name: 'role',         label: 'Your Role',               type: 'text',     required: true },
      { name: 'period',       label: 'Period (e.g. Sep 2024 – Present)', type: 'text' },
      { name: 'description',  label: 'Description',             type: 'textarea' },
      { name: 'achievements', label: 'Achievements (comma separated)', type: 'text', placeholder: 'Organized X event, Won Y...' },
      { name: 'image',        label: 'Logo / Image',            type: 'file',     accept: 'image/*' },
    ],
  };

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-display font-bold gradient-text mb-12">
          Admin Dashboard
        </motion.h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setShowForm(false); setFormData({}); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === tab.id ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}>
                <Icon />
                <span>{tab.label}</span>
                {tab.count !== undefined && <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{tab.count}</span>}
              </button>
            );
          })}
        </div>

        {/* ── Dashboard ── */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Projects',     count: stats.projects,     icon: FaProjectDiagram, color: 'from-blue-500 to-cyan-500' },
              { label: 'Skills',       count: stats.skills,       icon: FaBrain,          color: 'from-purple-500 to-pink-500' },
              { label: 'Designs',      count: stats.designs,      icon: FaPalette,        color: 'from-green-500 to-teal-500' },
              { label: 'Events',       count: stats.events,       icon: FaTrophy,         color: 'from-yellow-500 to-orange-500' },
              { label: 'Certificates', count: stats.certificates, icon: FaCertificate,    color: 'from-red-500 to-pink-500' },
              { label: 'Clubs',        count: stats.clubs,        icon: FaUsers,          color: 'from-indigo-500 to-purple-500' },
              { label: 'Messages',     count: stats.messages,     icon: FaEnvelope,       color: 'from-pink-500 to-rose-500' },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}
                  className={`glow-card rounded-2xl p-6 bg-gradient-to-br ${stat.color} cursor-pointer`}
                  onClick={() => setActiveTab(stat.label.toLowerCase())}>
                  <Icon className="text-4xl mb-3 text-white/80" />
                  <h3 className="text-3xl font-bold text-white mb-1">{stat.count || 0}</h3>
                  <p className="text-white/80">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ── Projects ── */}
        {activeTab === 'projects' && (
          <DataSection title="Projects" data={projects}
            onAdd={handleAdd} onEdit={handleEdit} onDelete={(id) => handleDelete('projects', id)}
            showForm={showForm} setShowForm={setShowForm} formData={formData} setFormData={setFormData}
            onSubmit={() => handleSubmit('projects')} loading={loading} fields={tabFields.projects} />
        )}

        {/* ── Skills ── */}
        {activeTab === 'skills' && (
          <DataSection title="Skills" data={skills}
            onAdd={handleAdd} onEdit={handleEdit} onDelete={(id) => handleDelete('skills', id)}
            showForm={showForm} setShowForm={setShowForm} formData={formData} setFormData={setFormData}
            onSubmit={() => handleSubmit('skills')} loading={loading} fields={tabFields.skills} />
        )}

        {/* ── Designs ── */}
        {activeTab === 'designs' && (
          <DataSection title="Designs" data={designs}
            onAdd={handleAdd} onEdit={handleEdit} onDelete={(id) => handleDelete('designs', id)}
            showForm={showForm} setShowForm={setShowForm} formData={formData} setFormData={setFormData}
            onSubmit={() => handleSubmit('designs')} loading={loading} fields={tabFields.designs} />
        )}

        {/* ── Events ── */}
        {activeTab === 'events' && (
          <DataSection title="Events" data={events}
            onAdd={handleAdd} onEdit={handleEdit} onDelete={(id) => handleDelete('events', id)}
            showForm={showForm} setShowForm={setShowForm} formData={formData} setFormData={setFormData}
            onSubmit={() => handleSubmit('events')} loading={loading} fields={tabFields.events} />
        )}

        {/* ── Certificates ── */}
        {activeTab === 'certificates' && (
          <DataSection title="Certificates" data={certificates}
            onAdd={handleAdd} onEdit={handleEdit} onDelete={(id) => handleDelete('certificates', id)}
            showForm={showForm} setShowForm={setShowForm} formData={formData} setFormData={setFormData}
            onSubmit={() => handleSubmit('certificates')} loading={loading} fields={tabFields.certificates} />
        )}

        {/* ── Clubs ── */}
        {activeTab === 'clubs' && (
          <DataSection title="Clubs" data={clubs}
            onAdd={handleAdd} onEdit={handleEdit} onDelete={(id) => handleDelete('clubs', id)}
            showForm={showForm} setShowForm={setShowForm} formData={formData} setFormData={setFormData}
            onSubmit={() => handleSubmit('clubs')} loading={loading} fields={tabFields.clubs} />
        )}

        {/* ── Messages ── */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Contact Messages</h2>
            {contacts.length === 0 ? (
              <p className="text-gray-400">No messages yet</p>
            ) : (
              contacts.map((contact) => (
                <div key={contact._id} className={`glow-card rounded-lg p-6 ${contact.read ? 'opacity-60' : ''}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold">{contact.name}</h3>
                      <p className="text-sm text-gray-400">{contact.email}</p>
                    </div>
                    <button onClick={() => handleDelete('messages', contact._id)} className="text-red-400 hover:text-red-300"><FaTrash /></button>
                  </div>
                  {contact.subject && <p className="font-semibold mb-2">{contact.subject}</p>}
                  <p className="text-gray-300">{contact.message}</p>
                  <p className="text-xs text-gray-500 mt-3">{new Date(contact.createdAt).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Settings ── */}
        {activeTab === 'settings' && (
          <SettingsPanel settings={settings} onSave={handleSaveSettings} loading={loading} />
        )}
      </div>
    </div>
  );
};

export default Admin;
