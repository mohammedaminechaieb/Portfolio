import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { clubsAPI } from '../utils/api';
import { FaUsers } from 'react-icons/fa';

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await clubsAPI.getAll();
      setClubs(response.data);
    } catch (error) {
      console.error('Error fetching clubs:', error);
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
            Clubs & Communities
          </h1>
          <p className="text-xl text-gray-400">
            Organizations and communities I'm part of
          </p>
        </motion.div>

        {clubs.length === 0 ? (
          <div className="text-center text-gray-400 text-xl">
            No clubs yet. Add your community involvement! 👥
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {clubs.map((club, index) => (
              <motion.div
                key={club._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glow-card rounded-2xl p-6"
              >
                <div className="flex items-start gap-4 mb-4">
                  {club.image ? (
                    <img
                      src={club.image}
                      alt={club.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                      <FaUsers className="text-3xl" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-1">{club.name}</h3>
                    <p className="text-accent-400 font-semibold">{club.role}</p>
                    <p className="text-sm text-gray-500">{club.period}</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">{club.description}</p>
                {club.achievements && club.achievements.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-gray-400">
                      Achievements:
                    </h4>
                    <ul className="space-y-1">
                      {club.achievements.map((achievement, i) => (
                        <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-primary-500">•</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Clubs;