import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Mock User Data - Replace with your Auth Context
  const user = {
    name: 'Alex Dev',
    communitiesJoined: 4,
    coursesCompleted: 12,
    projectsCompleted: 8,
    certificatesEarned: 5
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
    { path: '/', label: 'Home', type: 'route' },
    { path: '#skills', label: 'Quick Skills', type: 'hash' },
    { path: '/project', label: 'Projects', type: 'route' },
    { path: '/community', label: 'Community', badge: 'NEW', type: 'route' },
  ];

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logged out");
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 shadow-2xl' 
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-cyan-500 flex items-center justify-center font-bold text-black text-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] group-hover:scale-105 transition-transform">
              S
            </div>
            <h1 className="font-bold text-xl text-white tracking-tight">
              Skill<span className="text-cyan-500">Connect</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ path, label, badge }) => (
              <Link 
                key={path}
                to={path} 
                className={`relative text-sm font-medium transition-colors ${
                  isActive(path) ? 'text-cyan-400' : 'text-slate-300 hover:text-white'
                }`}
              >
                {label}
                {badge && <span className="ml-2 px-1.5 py-0.5 text-[8px] bg-emerald-500 text-black rounded font-bold animate-pulse uppercase">{badge}</span>}
              </Link>
            ))}

            {/* Profile Dropdown Section */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 pl-4 border-l border-slate-800 group"
              >
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden group-hover:border-cyan-500/50 transition-colors">
                  <span className="text-xs font-bold text-cyan-500">AD</span>
                </div>
                <svg className={`w-4 h-4 text-slate-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-4 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className="pb-4 border-b border-slate-800 mb-4">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Student Profile</p>
                    <p className="text-white font-bold">{user.name}</p>
                  </div>

                  {/* LMS Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Communities</p>
                      <p className="text-lg font-bold text-cyan-500">{user.coursesCompleted}</p>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Projects</p>
                      <p className="text-lg font-bold text-emerald-400">{user.projectsCompleted}</p>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Certificates</p>
                      <p className="text-lg font-bold text-white">{user.certificatesEarned}</p>
                    </div>
                  </div>

                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all font-semibold text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}/></svg>
          </button>
        </div>

        {/* Mobile Menu (with Stats integrated) */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-6 space-y-4 animate-in slide-in-from-top duration-300">
             <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-800">
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <p className="text-[8px] text-slate-500 font-bold uppercase">Learning</p>
                  <p className="text-sm font-bold text-white">{user.coursesCompleted} Courses</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <p className="text-[8px] text-slate-500 font-bold uppercase">Experience</p>
                  <p className="text-sm font-bold text-white">{user.projectsCompleted} Projects</p>
                </div>
             </div>
             <div className="space-y-1">
                {navLinks.map(({ path, label }) => (
                  <Link key={path} to={path} className="block py-3 text-slate-300 font-medium border-b border-slate-900">{label}</Link>
                ))}
                <button onClick={handleLogout} className="w-full text-left py-3 text-red-500 font-medium">Logout</button>
             </div>
          </div>
        )}
      </div>
    </nav>
  );
}