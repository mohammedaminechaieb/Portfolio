import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaStar } from 'react-icons/fa';

const ProjectCard = ({ project, variants }) => {
  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -10 }}
      className="glow-card rounded-2xl p-6 relative overflow-hidden group flex flex-col"
    >
      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10">
          <FaStar className="text-xs" />
          Featured
        </div>
      )}

      {/* Image */}
      {project.image && (
        <div className="mb-4 rounded-xl overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      )}

      {/* Title */}
      <h3 className="text-2xl font-bold mb-2 text-white">{project.title}</h3>

      {/* Description */}
      <p className="text-gray-400 mb-4 line-clamp-3 flex-1">{project.description}</p>

      {/* Technologies */}
      {project.technologies?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 text-xs font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* Links */}
      <div className="flex gap-3 mt-auto">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-sm"
          >
            <FaGithub />
            Code
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90 transition-all text-sm"
          >
            <FaExternalLinkAlt />
            Live Demo
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCard;
