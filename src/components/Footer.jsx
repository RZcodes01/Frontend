export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="container mx-auto px-6 py-16">
        
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-4">
              SkillConnect
            </h3>

            <p className="text-sm leading-relaxed mb-6">
              Empowering learners to build real skills, work on industry projects, and get hired faster.
            </p>

            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-slate-800 transition">
                <span className="text-sm">in</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-slate-800 transition">
                <span className="text-sm">📘</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-slate-800 transition">
                <span className="text-sm">📷</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/quickskills" className="hover:text-white transition">Quick Skills</a></li>
              <li><a href="/project" className="hover:text-white transition">Projects</a></li>
              <li><a href="/community" className="hover:text-white transition">Community</a></li>
            </ul>
          </div>

          {/* Learning */}
          <div>
            <h4 className="font-semibold text-white mb-4">Learning</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Self Paced Program</a></li>
              <li><a href="#" className="hover:text-white transition">Mentor-Led Programs</a></li>
              <li><a href="#" className="hover:text-white transition">Certifications</a></li>
              <li><a href="#" className="hover:text-white transition">Community Access</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            
            <p>© 2026 SkillConnect. All rights reserved.</p>

            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">Cookies</a>
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
}
