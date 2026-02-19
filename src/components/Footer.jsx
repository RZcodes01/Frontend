export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-500 border-t border-neutral-800">
      <div className="container mx-auto px-6 py-16">
        
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-4">
              Skill<span className="text-cyan-400">Connect</span>
            </h3>

            <p className="text-sm leading-relaxed mb-6">
              Empowering learners to build real skills, work on industry projects, and get hired faster.
            </p>

            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-md bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:border-cyan-400/40 hover:text-cyan-400 transition">
                <span className="text-sm">in</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-md bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:border-cyan-400/40 hover:text-cyan-400 transition">
                <span className="text-sm">📘</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-md bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:border-cyan-400/40 hover:text-cyan-400 transition">
                <span className="text-sm">📷</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-cyan-400 transition">Home</a></li>
              <li><a href="/quickskills" className="hover:text-cyan-400 transition">Quick Skills</a></li>
              <li><a href="/project" className="hover:text-cyan-400 transition">Projects</a></li>
              <li><a href="/community" className="hover:text-cyan-400 transition">Community</a></li>
            </ul>
          </div>

          {/* Learning */}
          <div>
            <h4 className="font-semibold text-white mb-4">Learning</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-cyan-400 transition">Self Paced Program</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Mentor-Led Programs</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Certifications</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Community Access</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            
            <p>© 2026 SkillConnect. All rights reserved.</p>

            <div className="flex gap-6">
              <a href="#" className="hover:text-cyan-400 transition">Privacy</a>
              <a href="#" className="hover:text-cyan-400 transition">Terms</a>
              <a href="#" className="hover:text-cyan-400 transition">Cookies</a>
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
}