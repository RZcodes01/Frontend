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

  // 🔥 CHECK TOKEN + FETCH USER
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
    { path: '/project', label: 'Projects' },
    { path: '/community', label: 'Community' },
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
        ? 'bg-slate-950 border-b border-cyan-500 shadow-[0_4px_0_0_#06b6d4]'
        : 'bg-slate-950 border-b border-slate-800'
      }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 sm:h-22" style={{ height: '72px' }}>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-lg bg-cyan-500 flex items-center justify-center font-black text-slate-950 text-2xl">
              S
            </div>
            <div className="flex flex-col -space-y-1">
              <h1 className="font-black text-2xl sm:text-3xl text-white tracking-tight leading-none">
                Skill<span className="text-cyan-400">Connect</span>
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`relative px-5 py-2.5 text-base font-bold transition-all duration-200 rounded-md ${isActive(path)
                    ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
              >
                {label}
              </Link>
            ))}

            {/* CONDITIONAL LOGIN / PROFILE */}
            {!isLoggedIn ? (
              <Link
                to="/login"
                className="px-5 py-2.5 text-base font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors duration-200 rounded-md ml-2"
              >
                Login
              </Link>
            ) : (
              <div className="relative ml-4" ref={profileRef}>
                <button
                  onClick={handleProfileClick}
                  className="flex items-center gap-3 pl-6 ml-4 border-l-2 border-slate-700 group"
                >
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-600 flex items-center justify-center group-hover:border-cyan-500 transition-colors duration-200">
                      {myData?.coverImage ? (
                        <img
                          src={myData.coverImage}
                          alt="profile"
                          className="w-full h-full object-cover"
                        />
                      ) : myData?.name ? (
                        <span className="text-sm font-black text-cyan-400">
                          {getInitials(myData.name)}
                        </span>
                      ) : (
                        <User className="w-5 h-5 text-slate-400" />
                      )}
                    </div>

                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full"></div>
                  </div>

                  <div className="hidden lg:flex flex-col items-start -space-y-0.5">
                    <span className="text-sm font-bold text-white">{myData?.name}</span>
                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
                      {myData?.role}
                    </span>
                  </div>

                  <svg
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180 text-cyan-400' : ''
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 9l-7 7-7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-56 py-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl shadow-black/60">
                    <div className="px-4 py-3 border-b border-slate-800 mb-1">
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mb-0.5">
                        Signed in as
                      </p>
                      <p className="text-base font-bold text-white truncate">
                        {myData?.name}
                      </p>
                    </div>

                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-base text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors font-semibold"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Go to Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-base text-red-400 hover:bg-red-500/10 transition-colors mt-1 border-t border-slate-800 font-semibold"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}