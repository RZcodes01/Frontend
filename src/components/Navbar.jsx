import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { fetchMe } from '../api/user.api';
import { User } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [myData, setMyData] = useState([])
  const [isLoggedIn, setisLoggedIn] = useState(false)

  const user = {
    name: 'Alex Dev',
  };

  const getInitials = (name) => {
    if (!name) return "U";

    const parts = name.trim().split(" ");
    if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }

    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        const res = await fetchMe();
        console.log(res.data)
        setMyData(res.data.user)
      } catch (error) {
        console.error(error)
      }
    }
    fetchMyData()
  }, [])

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

    localStorage.removeItem("accessToken");

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
            <div className="w-11 h-11 rounded-lg bg-cyan-500 flex items-center justify-center font-black text-slate-950 text-2xl shadow-none group-hover:bg-cyan-400 transition-colors duration-200">
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

            {/* Login Button */}
            <Link
              to="/login"
              className="px-5 py-2.5 text-base font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors duration-200 rounded-md ml-2"
            >
              Login
            </Link>

            {/* Desktop Profile Button & Dropdown */}
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
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wide">{myData.role}</span>
                </div>
                <svg
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180 text-cyan-400' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Desktop Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 py-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl shadow-black/60">
                  <div className="px-4 py-3 border-b border-slate-800 mb-1">
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mb-0.5">Signed in as</p>
                    <p className="text-base font-bold text-white truncate">{myData.name}</p>
                  </div>

                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-base text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors font-semibold"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Go to Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-base text-red-400 hover:bg-red-500/10 transition-colors mt-1 border-t border-slate-800 font-semibold"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors rounded-lg border border-slate-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2.5" strokeLinecap="round" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Content */}
        {isMenuOpen && (
          <div className="md:hidden pb-6 space-y-4 border-t border-slate-800 mt-1">
            <div className="pt-4 pb-4">
              <button
                onClick={() => {
                  handleProfileClick();
                  navigate('/dashboard');
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 mb-4 p-4 bg-slate-900 rounded-xl border border-slate-700 hover:bg-slate-800 hover:border-cyan-500/50 transition-all text-left"
              >
                <div className="w-13 h-13 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center" style={{ width: '52px', height: '52px' }}>
                  <span className="text-base font-black text-cyan-400">AD</span>
                </div>
                <div>
                  <p className="text-white font-bold text-lg">{user.name}</p>
                  <p className="text-sm text-slate-400 font-semibold">View Student Dashboard</p>
                </div>
              </button>
            </div>

            <div className="space-y-1.5">
              {navLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center justify-between py-3.5 px-4 text-base font-bold rounded-lg transition-colors ${isActive(path)
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white border border-transparent'
                    }`}
                >
                  <span>{label}</span>
                </Link>
              ))}

              {/* Mobile Login Button */}
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-cyan-400 text-slate-950 rounded-lg text-base font-bold mt-2 hover:bg-cyan-300 transition-colors"
              >
                Login
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-red-500/10 text-red-400 rounded-lg text-base font-bold border border-red-500/30 mt-2 hover:bg-red-500/20 transition-colors"
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