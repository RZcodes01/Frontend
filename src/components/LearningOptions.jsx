export default function LearningOptions() {
  return (
    <section className="relative py-24 bg-slate-50 text-slate-900 border-b border-slate-200 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            Choose the way you want to <span className="italic text-slate-600">learn and grow.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl">

          {/* Self Paced Card */}
          <div className="group bg-white border border-slate-200 p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex flex-col h-full">

              <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                Self-Paced Learning
              </h3>

              <p className="text-slate-600 leading-relaxed mb-8 flex-grow">
                Learn at your own speed with structured lessons and practical examples.
                Perfect if you like flexibility and want to build skills on your schedule.
              </p>

              <div className="space-y-3 mb-6">
                {[
                  "Step-by-step guided tutorials",
                  "Access to learner community",
                  "Track your learning progress"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                    {item}
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Mentor Led Card */}
          <div className="group relative bg-white border border-slate-300 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">

            <div className="absolute -top-4 right-6 bg-slate-900 text-white px-3 py-1 rounded text-xs font-semibold tracking-wide uppercase">
              Most Popular
            </div>

            <div className="flex flex-col h-full">

              <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                Mentor-Led Cohort
              </h3>

              <p className="text-slate-600 leading-relaxed mb-8 flex-grow">
                Learn alongside a small group with guidance from industry experts.
                Get feedback, build real projects, and stay accountable throughout your journey.
              </p>

              <div className="space-y-3 mb-6">
                {[
                  "Live mentor sessions",
                  "Hands-on real-world projects",
                  "Industry-recognized certificate",
                  "Career guidance & placement support"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-slate-800">
                    <span className="text-slate-900 font-bold">✓</span>
                    {item}
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
