import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { fetchMe } from '../api/user.api';
import { User } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [myData, setMyData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    setIsLoggedIn(true);

    const fetchMyData = async () => {
      try {
        const res = await fetchMe();
        setMyData(res.data.user);
      } catch (error) {
        console.error(error);
        setIsLoggedIn(false);
        setMyData(null);
        localStorage.removeItem("accessToken");
      }
    };

    fetchMyData();
  }, []);

  const handleProfileClick = () => {
    const nextState = !isProfileOpen;
    setIsProfileOpen(nextState);

    if (nextState) {
      const event = new CustomEvent('profileMenuOpened');
      window.dispatchEvent(event);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) =>
    location.pathname === path || location.hash === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/quickskills', label: 'Quick Skills' },
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/community', label: 'Community' },
    { path: '/career', label: 'Career' },
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setMyData(null);
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
      ? 'bg-blue-950 border-b border-amber-400 shadow-[0_4px_0_0_#FBBF24]'
      : 'bg-blue-950 border-b border-blue-800'
      }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 sm:h-22" style={{ height: '72px' }}>

          <Link to="/" className="flex items-center gap-3 group">
      
      {/* Icon Container */}
      <div className="w-14 h-14 rounded-xl bg-blue-950 flex items-center justify-center shadow-md group-hover:scale-105 transition">
        <svg
          viewBox="0 0 100 100"
          className="w-10 h-10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Graduation Cap Top */}
          <polygon
            points="50,15 85,35 50,55 15,35"
            fill="#fbbf24"
          />

          {/* Cap Base */}
          <rect
            x="35"
            y="55"
            width="30"
            height="8"
            rx="4"
            fill="#fbbf24"
          />

          {/* Tassel Line */}
          <line
            x1="70"
            y1="35"
            x2="78"
            y2="60"
            stroke="#fbbf24"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Chain Link (Tassel End) */}
          <ellipse
            cx="78"
            cy="68"
            rx="8"
            ry="6"
            stroke="#fbbf24"
            strokeWidth="3"
          />
        </svg>
      </div>

      {/* Text */}
      <h1 className="font-black text-2xl sm:text-3xl tracking-tight">
        <span className="text-blue-50">Skill</span>
        <span className="text-amber-400">Connect</span>
      </h1>
    </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`relative px-5 py-2.5 text-base font-bold transition-all duration-200 rounded-md ${isActive(path)
                  ? 'text-amber-400 bg-amber-400/10 border border-amber-400/40'
                  : 'text-blue-200 hover:text-blue-50 hover:bg-blue-800'
                  }`}
              >
                {label}
              </Link>
            ))}

            {/* CONDITIONAL LOGIN / PROFILE */}
            {!isLoggedIn ? (
              <Link
                to="/login"
                className="px-5 py-2.5 text-base font-bold text-blue-950 bg-amber-400 hover:bg-amber-300 transition-colors duration-200 rounded-md ml-2"
              >
                Login
              </Link>
            ) : (
              <div className="relative ml-4" ref={profileRef}>
                <button
                  onClick={handleProfileClick}
                  className="flex items-center gap-3 pl-6 ml-4 border-l-2 border-blue-700 group"
                >
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-blue-800 border-2 border-blue-600 flex items-center justify-center group-hover:border-amber-400 transition-colors duration-200">
                      {myData?.coverImage ? (
                        <img
                          src={myData.coverImage}
                          alt="profile"
                          className="w-full h-full object-cover"
                        />
                      ) : myData?.name ? (
                        <span className="text-sm font-black text-amber-400">
                          {getInitials(myData.name)}
                        </span>
                      ) : (
                        <User className="w-5 h-5 text-blue-400" />
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-blue-950 rounded-full"></div>
                  </div>

                  <div className="hidden lg:flex flex-col items-start -space-y-0.5">
                    <span className="text-sm font-bold text-blue-50">{myData?.name}</span>
                    <span className="text-xs text-blue-400 font-semibold uppercase tracking-wide">
                      {myData?.role}
                    </span>
                  </div>

                  <svg
                    className={`w-4 h-4 text-blue-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180 text-amber-400' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 9l-7 7-7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-56 py-2 bg-blue-900 border border-blue-700 rounded-xl shadow-2xl shadow-black/60">
                    <div className="px-4 py-3 border-b border-blue-800 mb-1">
                      <p className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-0.5">
                        Signed in as
                      </p>
                      <p className="text-base font-bold text-blue-50 truncate">
                        {myData?.name}
                      </p>
                    </div>

                    {/* ROLE BASED DASHBOARD LINK */}
                    {myData?.role?.toLowerCase() === 'admin' ? (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-base text-blue-200 hover:bg-blue-800 hover:text-amber-400 transition-colors font-bold uppercase tracking-wider"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-base text-blue-200 hover:bg-blue-800 hover:text-amber-400 transition-colors font-semibold"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Student Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-base text-red-400 hover:bg-red-500/10 transition-colors mt-1 border-t border-blue-800 font-semibold"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2.5 text-blue-400 hover:text-blue-50 hover:bg-blue-800 transition-colors rounded-lg border border-blue-700 relative z-[60]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2.5" strokeLinecap="round" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Mobile Sidebar Menu */}
        <div className={`fixed top-0 left-0 h-full w-[280px] bg-blue-950 border-r border-blue-800 z-[58] transform transition-transform duration-300 ease-in-out md:hidden shadow-2xl ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex flex-col h-full pt-20 px-4 space-y-1.5 overflow-y-auto">
              {navLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center justify-between py-3.5 px-4 text-base font-bold rounded-lg transition-colors ${isActive(path)
                    ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30'
                    : 'text-blue-200 hover:bg-blue-800 hover:text-blue-50 border border-transparent'
                    }`}
                >
                  <span>{label}</span>
                </Link>
              ))}

              <div className="pt-6 mt-6 border-t border-blue-800">
                {!isLoggedIn ? (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center justify-center py-3.5 px-4 bg-amber-400 text-blue-950 rounded-lg text-base font-bold hover:bg-amber-300 transition-colors"
                  >
                    Login
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-4 py-3 bg-blue-900/50 rounded-lg border border-blue-800 mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-800 border-2 border-blue-600 flex items-center justify-center">
                            {myData?.name ? <span className="text-xs font-black text-amber-400">{getInitials(myData.name)}</span> : <User size={18}/>}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-blue-50 truncate w-32">{myData?.name}</span>
                            <span className="text-[10px] text-blue-400 font-bold uppercase">{myData?.role}</span>
                        </div>
                    </div>

                    {myData?.role?.toLowerCase() === 'admin' ? (
                      <Link
                        to="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full flex items-center justify-center py-3 px-4 bg-blue-800 text-amber-400 rounded-lg text-base font-bold border border-amber-400/30"
                      >
                        ADMIN DASHBOARD
                      </Link>
                    ) : (
                      <Link
                        to="/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full flex items-center justify-center py-3 px-4 bg-blue-800 text-blue-50 rounded-lg text-base font-bold border border-blue-700"
                      >
                        STUDENT DASHBOARD
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center py-3.5 px-4 bg-red-500/10 text-red-400 rounded-lg text-base font-bold border border-red-500/30 hover:bg-red-500/20 transition-colors"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
        </div>
      </div>
    </nav>
  );
}