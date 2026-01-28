import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { certificatesAPI } from '../utils/api';
import { FaCertificate, FaExternalLinkAlt } from 'react-icons/fa';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await certificatesAPI.getAll();
      setCertificates(response.data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
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
            Certifications
          </h1>
          <p className="text-xl text-gray-400">
            Professional credentials and achievements
          </p>
        </motion.div>

        {certificates.length === 0 ? (
          <div className="text-center text-gray-400 text-xl">
            No certificates yet. Add your credentials! 📜
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glow-card rounded-2xl p-6"
              >
                {cert.image && (
                  <div className="mb-4 rounded-xl overflow-hidden">
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
                <div className="flex items-start gap-3 mb-3">
                  <FaCertificate className="text-accent-500 text-2xl mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{cert.title}</h3>
                    <p className="text-gray-400 mb-2">{cert.issuer}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(cert.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500/20 text-primary-300 hover:bg-primary-500/30 transition-all text-sm mt-3"
                  >
                    <FaExternalLinkAlt />
                    View Credential
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates;