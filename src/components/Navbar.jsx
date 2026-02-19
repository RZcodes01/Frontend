import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

 
  const user = {
    name: 'Alex Dev',
  };


  const handleProfileClick = () => {

    const nextState = !isProfileOpen;
    setIsProfileOpen(nextState);

    if (nextState) {
      const event = new CustomEvent('profileMenuOpened');
      window.dispatchEvent(event);
      console.log("Navbar: Profile event dispatched!");
    }
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path || location.hash === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/quickskills', label: 'Quick Skills' },
    { path: '/project', label: 'Projects' },
    { path: '/community', label: 'Community' },
  ];

  const handleLogout = () => {
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    console.log("Logged out");
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-slate-950/98 backdrop-blur-2xl border-b border-slate-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.4)]' 
        : 'bg-gradient-to-b from-slate-950/60 to-transparent backdrop-blur-sm border-b border-slate-800/30'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group relative">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/30 rounded-lg blur-md group-hover:blur-lg transition-all duration-300"></div>
              <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg group-hover:shadow-cyan-500/50 group-hover:scale-105 transition-all duration-300">
                S
              </div>
            </div>
            <div className="flex flex-col -space-y-1">
              <h1 className="font-black text-xl sm:text-2xl text-white tracking-tight leading-none">
                Skill<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600">Connect</span>
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map(({ path, label }) => (
              <Link 
                key={path}
                to={path} 
                className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg group ${
                  isActive(path) ? 'text-cyan-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span className="relative z-10">{label}</span>
                {isActive(path) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-cyan-600 shadow-[0_0_8px_rgba(34,211,238,0.6)]"></span>
                )}
              </Link>
            ))}

            {/* Desktop Profile Button & Dropdown */}
            <div className="relative ml-4" ref={profileRef}>
              <button 
                onClick={handleProfileClick}
                className="flex items-center gap-3 pl-6 ml-4 border-l border-slate-700/50 group relative"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
                  <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 flex items-center justify-center overflow-hidden group-hover:border-cyan-500/70 group-hover:shadow-lg transition-all duration-300">
                    <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-cyan-600">AD</span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full"></div>
                </div>
                <div className="hidden lg:flex flex-col items-start -space-y-0.5">
                  <span className="text-xs font-bold text-white">{user.name}</span>
                  <span className="text-[10px] text-slate-500 font-medium">Student</span>
                </div>
                <svg className={`w-4 h-4 text-slate-400 transition-all duration-300 ${isProfileOpen ? 'rotate-180 text-cyan-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>

              {/* Desktop Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-52 py-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl animate-in fade-in zoom-in duration-200">
                  <div className="px-4 py-2 border-b border-slate-800 mb-1">
                    <p className="text-xs text-slate-500 font-medium">Signed in as</p>
                    <p className="text-sm font-bold text-white truncate">{user.name}</p>
                  </div>
                  
                  <Link 
                    to="/dashboard" 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    Go to Dashboard
                  </Link>

                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors mt-1 border-t border-slate-800/50 pt-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden relative p-2.5 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2.5" strokeLinecap="round" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}/>
            </svg>
          </button>
        </div>

        {/* Mobile Menu Content */}
        {isMenuOpen && (
          <div className="md:hidden pb-6 space-y-4 animate-in slide-in-from-top-5 duration-300">
            <div className="pt-4 pb-4 border-t border-slate-800/50">
              <button 
                onClick={() => {
                  handleProfileClick();
                  navigate('/dashboard');
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 mb-4 p-3 bg-slate-900/50 rounded-xl border border-slate-800/50 hover:bg-slate-800/80 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 flex items-center justify-center">
                  <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-cyan-600">AD</span>
                </div>
                <div>
                  <p className="text-white font-bold">{user.name}</p>
                  <p className="text-xs text-slate-400 font-medium">View Student Dashboard</p>
                </div>
              </button>
            </div>

            <div className="space-y-1">
              {navLinks.map(({ path, label }) => (
                <Link 
                  key={path} 
                  to={path} 
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center justify-between py-3.5 px-4 font-semibold rounded-lg ${
                    isActive(path) ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-300'
                  }`}
                >
                  <span>{label}</span>
                </Link>
              ))}
              
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-red-500/10 text-red-400 rounded-lg font-bold border border-red-500/20 mt-4"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}