import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { eventsAPI } from '../utils/api';
import { FaTrophy, FaCalendar } from 'react-icons/fa';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAll();
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold gradient-text mb-4">
            Events & Competitions
          </h1>
          <p className="text-xl text-gray-400">
            Hackathons, contests, and achievements
          </p>
        </motion.div>

        {events.length === 0 ? (
          <div className="text-center text-gray-400 text-xl">
            No events yet. Add your achievements! 🏆
          </div>
        ) : (
          <div className="space-y-6">
            {events.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glow-card rounded-2xl p-6 md:p-8"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {event.image && (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full md:w-48 h-48 object-cover rounded-xl"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-2xl font-bold">{event.title}</h3>
                      <FaTrophy className="text-yellow-500 text-2xl" />
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 mb-3">
                      <FaCalendar />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 text-sm">
                        {event.type}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-4">{event.description}</p>
                    {event.achievement && (
                      <div className="inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
                        <span className="text-yellow-400 font-semibold">
                          🏆 {event.achievement}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;