import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const isActive = (path) => location.pathname === path || location.hash === path;

  const navLinks = [
    { path: '/', label: 'Home', type: 'route' },
    { path: '#skills', label: 'Quick Skills', type: 'hash' },
    { path: '/project', label: 'Projects', type: 'route' },
    { path: '/community', label: 'Community', badge: 'NEW', type: 'route' },
    { path: '#about', label: 'About Us', type: 'hash' }
  ];

  const handleNavClick = (path, type) => {
    if (type === 'hash') {
      // Smooth scroll to section
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 w-full text-white z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-slate-950/95 backdrop-blur-xl border-b border-white/20 shadow-2xl shadow-yellow-400/5' 
          : 'bg-slate-950/80 backdrop-blur-xl border-b border-white/10'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-400 flex items-center justify-center font-bold text-black text-lg shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              S
            </div>
            <h1 className="font-bold text-xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 group-hover:from-pink-400 group-hover:to-yellow-400 transition-all duration-300">
                Skill
              </span>
              <span className="text-white">Connect</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ path, label, badge, type }) => (
              type === 'route' ? (
                <Link 
                  key={path}
                  to={path} 
                  className="relative group"
                >
                  <span className={`flex items-center gap-1.5 transition-colors duration-200 ${
                    isActive(path) 
                      ? 'text-yellow-400 font-semibold' 
                      : 'text-white/90 hover:text-yellow-400'
                  }`}>
                    {label}
                    {badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-green-400 to-cyan-400 text-black rounded-full animate-pulse">
                        {badge}
                      </span>
                    )}
                  </span>
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-yellow-400 to-pink-400 transition-all duration-300 ${
                    isActive(path) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
              ) : (
                <a 
                  key={path}
                  href={path}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(path, type);
                  }}
                  className="relative group"
                >
                  <span className={`flex items-center gap-1.5 transition-colors duration-200 ${
                    isActive(path) 
                      ? 'text-yellow-400 font-semibold' 
                      : 'text-white/90 hover:text-yellow-400'
                  }`}>
                    {label}
                    {badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-green-400 to-cyan-400 text-black rounded-full animate-pulse">
                        {badge}
                      </span>
                    )}
                  </span>
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-yellow-400 to-pink-400 transition-all duration-300 ${
                    isActive(path) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </a>
              )
            ))}

            {/* Notifications */}
            <button className="relative p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-200" aria-label="Notifications">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* Registration Button */}
            <button 
              onClick={() => navigate("/register")} 
              className="ml-2 px-6 py-2.5 rounded-full font-semibold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 text-black hover:scale-105 hover:shadow-xl hover:shadow-yellow-400/50 transition-all duration-300 active:scale-95"
            >
              Register
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 active:scale-95"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg className="w-6 h-6 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="mt-4 pb-4 space-y-2 border-t border-white/10 pt-4">
            {navLinks.map(({ path, label, badge, type }) => (
              type === 'route' ? (
                <Link 
                  key={path}
                  to={path} 
                  onClick={() => setIsMenuOpen(false)} 
                  className={`block px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive(path)
                      ? 'bg-gradient-to-r from-yellow-400/20 to-pink-400/20 border border-yellow-400/30 text-yellow-400 font-semibold'
                      : 'hover:bg-white/5 active:bg-white/10'
                  }`}
                >
                  <span className="flex items-center justify-between">
                    {label}
                    {badge && (
                      <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-green-400 to-cyan-400 text-black rounded-full">
                        {badge}
                      </span>
                    )}
                  </span>
                </Link>
              ) : (
                <a 
                  key={path}
                  href={path}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(path, type);
                  }}
                  className={`block px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive(path)
                      ? 'bg-gradient-to-r from-yellow-400/20 to-pink-400/20 border border-yellow-400/30 text-yellow-400 font-semibold'
                      : 'hover:bg-white/5 active:bg-white/10'
                  }`}
                >
                  {label}
                </a>
              )
            ))}
            
            {/* Mobile Register Button */}
            <button 
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/register");
              }}
              className="w-full mt-2 px-4 py-3 rounded-xl font-semibold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 text-black hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-lg"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}