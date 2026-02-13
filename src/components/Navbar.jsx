import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate()

  return (
    <nav className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-xl border-b border-white/10 text-white z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-pink-400 flex items-center justify-center font-bold text-black text-lg shadow-lg group-hover:scale-110 transition">
              S
            </div>
            <h1 className="font-bold text-xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                Skill
              </span>
              <span className="text-white">Connect</span>
            </h1>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="relative group">
              <span className="hover:text-yellow-400 transition">Home</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#skills" className="relative group">
              <span className="hover:text-yellow-400 transition">Quick Skills</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#projects" className="relative group">
              <span className="hover:text-yellow-400 transition">Projects</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="community" className="relative group">
              <span className="hover:text-yellow-400 transition flex items-center gap-1">
                Community
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-green-400 to-cyan-400 text-black rounded-full">
                  NEW
                </span>
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#about" className="relative group">
              <span className="hover:text-yellow-400 transition">About Us</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
            </a>


            {/* Notifications */}
            <button className="relative p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

          {/* Register Button */}
            <button onClick={()=> navigate("/register")} className="px-6 py-2 rounded-full font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 text-black hover:scale-105 transition shadow-lg">
              Register
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 border-t border-white/10 pt-4">
            <a href="#" className="block px-4 py-3 rounded-xl hover:bg-white/5 transition">Home</a>
            <a href="#skills" className="block px-4 py-3 rounded-xl hover:bg-white/5 transition">Quick Skills</a>
            <a href="#projects" className="block px-4 py-3 rounded-xl hover:bg-white/5 transition">Projects</a>
            <a href="#community" className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 transition">
              <span>Community</span>
              <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-green-400 to-cyan-400 text-black rounded-full">
                NEW
              </span>
            </a>
            <a href="#about" className="block px-4 py-3 rounded-xl hover:bg-white/5 transition">About Us</a>
            <div className="pt-2 space-y-2">
              <a href="#profile" className="block px-4 py-3 rounded-xl hover:bg-white/5 transition text-slate-300">
                My Profile
              </a>
              <button className="w-full px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 text-black hover:scale-105 transition shadow-lg">
                Register
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}