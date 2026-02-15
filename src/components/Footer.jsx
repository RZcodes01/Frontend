export default function Footer() {
  return (
    <footer className="relative bg-slate-950 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                Skill
              </span>
              <span className="text-white">Connect</span>
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Empowering learners to build real skills, work on industry projects, and get hired faster.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition">
                <span className="text-lg">in</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition">
                <span className="text-lg">📘</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition">
                <span className="text-lg">📷</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-yellow-400 transition">Home</a></li>
              <li><a href="#skills" className="hover:text-yellow-400 transition">Quick Skills</a></li>
              <li><a href="#projects" className="hover:text-yellow-400 transition">Projects</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">About Us</a></li>
            </ul>
          </div>

          {/* Learning */}
          <div>
            <h4 className="font-bold mb-4 text-white">Learning</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-yellow-400 transition">Self Paced Program</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Mentor-Led Programs</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Certifications</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Community</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © 2026 SkillConnect. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-slate-400 text-sm">
              <a href="#" className="hover:text-yellow-400 transition">Privacy</a>
              <a href="#" className="hover:text-yellow-400 transition">Terms</a>
              <a href="#" className="hover:text-yellow-400 transition">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}