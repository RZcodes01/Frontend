export default function Footer() {
  return (
    <footer className="bg-blue-950 text-blue-400 border-t border-blue-800">
      <div className="container mx-auto px-6 py-16">
        
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-blue-50 mb-4">
              Skill<span className="text-amber-400">Connect</span>
            </h3>

            <p className="text-sm leading-relaxed mb-6">
              Empowering learners to build real skills, work on industry projects, and get hired faster.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-blue-50 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-amber-400 transition">Home</a></li>
              <li><a href="/quickskills" className="hover:text-amber-400 transition">Quick Skills</a></li>
              <li><a href="/project" className="hover:text-amber-400 transition">Leaderboard</a></li>
              <li><a href="/community" className="hover:text-amber-400 transition">Community</a></li>
              <li><a href="/career" className="hover:text-amber-400 transition">Career</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-blue-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            
            <p>© 2026 SkillConnect. All rights reserved.</p>

            <div className="flex gap-6">
              <a href="#" className="hover:text-amber-400 transition">Privacy</a>
              <a href="#" className="hover:text-amber-400 transition">Terms</a>
              <a href="#" className="hover:text-amber-400 transition">Cookies</a>
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
}