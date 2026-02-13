export default function LearningOptions() {
  return (
    <section className="relative py-20 bg-slate-950 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-32 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
          Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">Options</span>
        </h2>
        <p className="text-center text-slate-400 mb-14 max-w-2xl mx-auto">
          Choose the path that fits your learning style and goals
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Learning Card */}
          <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl hover:bg-white/10 transition duration-300">
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-green-400/30 to-cyan-400/30 rounded-full blur-2xl group-hover:scale-110 transition"></div>
            <div className="relative">
              <div className="w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br from-green-400 to-cyan-400 flex items-center justify-center text-2xl">
                🎓
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Free Learning</h3>
              <p className="text-slate-300 leading-relaxed">
                Short clips, self-paced basics to kickstart your journey at your own pace.
              </p>
              <div className="mt-6 pt-6 border-t border-white/10">
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Self-paced learning
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Basic tutorials
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Community access
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Mentor-Led Learning Card */}
          <div className="group relative bg-gradient-to-br from-yellow-400/10 to-orange-400/10 backdrop-blur-xl border-2 border-yellow-400/30 p-10 rounded-3xl shadow-2xl hover:border-yellow-400/50 transition duration-300">
            <div className="absolute -top-6 -right-6 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-sm font-bold rounded-full shadow-lg">
              ⭐ Popular
            </div>
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-yellow-400/40 to-orange-400/40 rounded-full blur-2xl group-hover:scale-110 transition"></div>
            <div className="relative">
              <div className="w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-2xl">
                🚀
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Mentor-Led Learning</h3>
              <p className="text-slate-300 leading-relaxed">
                Live sessions, real-world projects & industry-recognized certificates.
              </p>
              <div className="mt-6 pt-6 border-t border-white/20">
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-400">✓</span> Live mentor sessions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-400">✓</span> Hands-on projects
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-400">✓</span> Verified certificates
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-400">✓</span> Career support
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}