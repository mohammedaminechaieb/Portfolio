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

const Admin = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  // Data states
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [events, setEvents] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [settings, setSettings] = useState(null);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchStats();
      fetchAllData();
    }
  }, [isAuthenticated, navigate]);

  const fetchStats = async () => {
    try {
      const response = await statsAPI.get();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchAllData = async () => {
    try {
      const [projectsRes, skillsRes, designsRes, eventsRes, certRes, clubsRes, contactsRes, settingsRes] = await Promise.all([
        projectsAPI.getAll(),
        skillsAPI.getAll(),
        designsAPI.getAll(),
        eventsAPI.getAll(),
        certificatesAPI.getAll(),
        clubsAPI.getAll(),
        contactAPI.getAll(),
        settingsAPI.get(),
      ]);

      setProjects(projectsRes.data);
      setSkills(skillsRes.data);
      setDesigns(designsRes.data);
      setEvents(eventsRes.data);
      setCertificates(certRes.data);
      setClubs(clubsRes.data);
      setContacts(contactsRes.data);
      setSettings(settingsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FaCog },
    { id: 'projects', label: 'Projects', icon: FaProjectDiagram, count: stats.projects },
    { id: 'skills', label: 'Skills', icon: FaBrain, count: stats.skills },
    { id: 'designs', label: 'Designs', icon: FaPalette, count: stats.designs },
    { id: 'events', label: 'Events', icon: FaTrophy, count: stats.events },
    { id: 'certificates', label: 'Certificates', icon: FaCertificate, count: stats.certificates },
    { id: 'clubs', label: 'Clubs', icon: FaUsers, count: stats.clubs },
    { id: 'messages', label: 'Messages', icon: FaEnvelope, count: stats.messages },
    { id: 'settings', label: 'Settings', icon: FaCog },
  ];

  const handleAdd = (type) => {
    setEditingItem(null);
    setFormData({});
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      setLoading(true);
      
      const apis = {
        projects: projectsAPI,
        skills: skillsAPI,
        designs: designsAPI,
        events: eventsAPI,
        certificates: certificatesAPI,
        clubs: clubsAPI,
        messages: contactAPI,
      };

      await apis[type].delete(id);
      toast.success('Item deleted successfully!');
      fetchAllData();
      fetchStats();
    } catch (error) {
      toast.error('Error deleting item');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (type) => {
    try {
      setLoading(true);
      const formDataObj = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          if (Array.isArray(formData[key])) {
            formDataObj.append(key, JSON.stringify(formData[key]));
          } else {
            formDataObj.append(key, formData[key]);
          }
        }
      });

      const apis = {
        projects: projectsAPI,
        skills: skillsAPI,
        designs: designsAPI,
        events: eventsAPI,
        certificates: certificatesAPI,
        clubs: clubsAPI,
      };

      if (editingItem) {
        await apis[type].update(editingItem._id, formDataObj);
        toast.success('Item updated successfully!');
      } else {
        await apis[type].create(formDataObj);
        toast.success('Item created successfully!');
      }

      setShowForm(false);
      setFormData({});
      setEditingItem(null);
      fetchAllData();
      fetchStats();
    } catch (error) {
      toast.error('Error saving item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-display font-bold gradient-text mb-12"
        >
          Admin Dashboard
        </motion.h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <Icon />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Projects', count: stats.projects, icon: FaProjectDiagram, color: 'from-blue-500 to-cyan-500' },
              { label: 'Skills', count: stats.skills, icon: FaBrain, color: 'from-purple-500 to-pink-500' },
              { label: 'Designs', count: stats.designs, icon: FaPalette, color: 'from-green-500 to-teal-500' },
              { label: 'Events', count: stats.events, icon: FaTrophy, color: 'from-yellow-500 to-orange-500' },
              { label: 'Certificates', count: stats.certificates, icon: FaCertificate, color: 'from-red-500 to-pink-500' },
              { label: 'Clubs', count: stats.clubs, icon: FaUsers, color: 'from-indigo-500 to-purple-500' },
              { label: 'Messages', count: stats.messages, icon: FaEnvelope, color: 'from-pink-500 to-rose-500' },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`glow-card rounded-2xl p-6 bg-gradient-to-br ${stat.color}`}
                >
                  <Icon className="text-4xl mb-3 text-white/80" />
                  <h3 className="text-3xl font-bold text-white mb-1">{stat.count || 0}</h3>
                  <p className="text-white/80">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <DataSection
            title="Projects"
            data={projects}
            onAdd={() => handleAdd('projects')}
            onEdit={handleEdit}
            onDelete={(id) => handleDelete('projects', id)}
            showForm={showForm}
            setShowForm={setShowForm}
            formData={formData}
            setFormData={setFormData}
            onSubmit={() => handleSubmit('projects')}
            loading={loading}
            fields={[
              { name: 'title', label: 'Title', type: 'text', required: true },
              { name: 'description', label: 'Description', type: 'textarea', required: true },
              { name: 'technologies', label: 'Technologies (comma separated)', type: 'text' },
              { name: 'liveUrl', label: 'Live URL', type: 'url' },
              { name: 'githubUrl', label: 'GitHub URL', type: 'url' },
              { name: 'image', label: 'Image', type: 'file', accept: 'image/*' },
              { name: 'featured', label: 'Featured', type: 'checkbox' },
            ]}
          />
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <DataSection
            title="Skills"
            data={skills}
            onAdd={() => handleAdd('skills')}
            onEdit={handleEdit}
            onDelete={(id) => handleDelete('skills', id)}
            showForm={showForm}
            setShowForm={setShowForm}
            formData={formData}
            setFormData={setFormData}
            onSubmit={() => handleSubmit('skills')}
            loading={loading}
            fields={[
              { name: 'name', label: 'Skill Name', type: 'text', required: true },
              { name: 'category', label: 'Category', type: 'text', required: true },
              { name: 'level', label: 'Level (0-100)', type: 'number', min: 0, max: 100 },
              { name: 'icon', label: 'Icon URL', type: 'text' },
            ]}
          />
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Contact Messages</h2>
            {contacts.length === 0 ? (
              <p className="text-gray-400">No messages yet</p>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact._id}
                  className={`glow-card rounded-lg p-6 ${contact.read ? 'opacity-60' : ''}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold">{contact.name}</h3>
                      <p className="text-sm text-gray-400">{contact.email}</p>
                    </div>
                    <button
                      onClick={() => handleDelete('messages', contact._id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  {contact.subject && (
                    <p className="font-semibold mb-2">{contact.subject}</p>
                  )}
                  <p className="text-gray-300">{contact.message}</p>
                  <p className="text-xs text-gray-500 mt-3">
                    {new Date(contact.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Add similar sections for other tabs... */}
      </div>
    </div>
  );
};

// Reusable Data Section Component
const DataSection = ({
  title,
  data,
  onAdd,
  onEdit,
  onDelete,
  showForm,
  setShowForm,
  formData,
  setFormData,
  onSubmit,
  loading,
  fields
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        <button
          onClick={onAdd}
          className="btn-primary flex items-center gap-2"
        >
          <FaPlus />
          Add New
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glow-card rounded-lg p-6 mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">
              {formData._id ? 'Edit' : 'Add New'} {title.slice(0, -1)}
            </h3>
            <button onClick={() => setShowForm(false)}>
              <FaTimes className="text-xl hover:text-red-400" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-medium mb-2">
                  {field.label}
                  {field.required && <span className="text-red-400">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-primary-500 outline-none"
                    rows="4"
                    required={field.required}
                  />
                ) : field.type === 'file' ? (
                  <input
                    type="file"
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.files[0] })}
                    accept={field.accept}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20"
                  />
                ) : field.type === 'checkbox' ? (
                  <input
                    type="checkbox"
                    checked={formData[field.name] || false}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.checked })}
                    className="w-5 h-5"
                  />
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-primary-500 outline-none"
                    required={field.required}
                    min={field.min}
                    max={field.max}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onSubmit}
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              <FaSave />
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item) => (
          <div key={item._id} className="glow-card rounded-lg p-4">
            {item.image && (
              <img
                src={item.image}
                alt={item.title || item.name}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
            )}
            <h3 className="font-bold text-lg mb-2">{item.title || item.name}</h3>
            <p className="text-sm text-gray-400 mb-4 line-clamp-2">
              {item.description}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(item)}
                className="flex-1 px-3 py-2 rounded bg-primary-500/20 text-primary-300 hover:bg-primary-500/30 flex items-center justify-center gap-2"
              >
                <FaEdit />
                Edit
              </button>
              <button
                onClick={() => onDelete(item._id)}
                className="flex-1 px-3 py-2 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 flex items-center justify-center gap-2"
              >
                <FaTrash />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && !showForm && (
        <p className="text-center text-gray-400 py-12">
          No {title.toLowerCase()} yet. Click "Add New" to get started!
        </p>
      )}
    </div>
  );
};

export default Admin;