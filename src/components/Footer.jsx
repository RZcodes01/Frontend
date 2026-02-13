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
                <span className="text-lg">𝕏</span>
              </a>
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
              <li><a href="#" className="hover:text-yellow-400 transition">Free Courses</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Mentor-Led Programs</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Certifications</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Community</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-4 text-white">Support</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-yellow-400 transition">Help Center</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h4 className="text-xl font-bold mb-3 text-white">Stay Updated</h4>
          <p className="text-slate-400 text-sm mb-6">
            Get the latest courses, projects, and career tips delivered to your inbox
          </p>
          <div className="flex max-w-md mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 bg-transparent text-white placeholder-slate-400 outline-none text-sm"
            />
            <button className="px-6 py-3 font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 text-black hover:scale-105 transition text-sm">
              Subscribe
            </button>
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