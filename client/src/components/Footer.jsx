import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();

  const links = [
    { path: '/projects',     label: 'Projects' },
    { path: '/skills',       label: 'Skills' },
    { path: '/designs',      label: 'Designs' },
    { path: '/events',       label: 'Events' },
    { path: '/certificates', label: 'Certificates' },
    { path: '/clubs',        label: 'Clubs' },
    { path: '/contact',      label: 'Contact' },
  ];

  return (
    <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-lg mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <Link to="/" className="text-2xl font-display font-bold gradient-text">
              PORTFOLIO
            </Link>
            <p className="text-gray-400 mt-3 text-sm leading-relaxed">
              Computer Engineering Student passionate about building intelligent,
              impactful digital experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.path}>
                  <Link
                    to={l.path}
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Get In Touch</h4>
            <p className="text-gray-400 text-sm mb-4">
              Open to collaboration and new opportunities.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-500/30 transition-all text-gray-400 hover:text-white"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-500/30 transition-all text-gray-400 hover:text-white"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-500/30 transition-all text-gray-400 hover:text-white"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="mailto:chaiebamine741@gmail.com"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-500/30 transition-all text-gray-400 hover:text-white"
                aria-label="Email"
              >
                <FaEnvelope />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">
            © {year} Amine Chaieb. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            Built with <FaHeart className="text-accent-500 mx-1" /> using React &amp; Node.js
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
