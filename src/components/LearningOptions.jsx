export default function LearningOptions() {
  return (
    <section className="relative py-24 bg-blue-50 text-blue-900 border-b border-blue-100 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Section header */}
        <div className="mb-16 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-blue-900">
            Choose the way you want to{" "}
            <span className="italic text-blue-300">learn and grow.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl">

          {/* Self Paced Card */}
          <div className="group bg-blue-50 border-2 border-blue-200 p-8 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all duration-300">
            <div className="flex flex-col h-full">

              <h3 className="text-2xl font-semibold text-blue-900 mb-4">
                Self-Paced Learning
              </h3>

              <p className="text-blue-600 leading-relaxed mb-8 flex-grow">
                Learn at your own speed with structured lessons and practical examples.
                Perfect if you like flexibility and want to build skills on your schedule.
              </p>

              <div className="space-y-3 mb-6">
                {[
                  "Step-by-step guided tutorials",
                  "Access to learner community",
                  "Track your learning progress"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-blue-700">
                    <div className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    </div>
                    {item}
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Mentor Led Card — highlighted */}
          <div className="group relative bg-blue-900 border-2 border-blue-900 p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:border-amber-400 transition-all duration-300">

            <div className="flex flex-col h-full">
              <h3 className="text-2xl font-semibold text-blue-50 mb-4">
                Mentor-Led Cohort
              </h3>
              <p className="text-blue-300 leading-relaxed mb-8 flex-grow">
                Learn alongside a small group with guidance from industry experts.
                Get feedback, build real projects, and stay accountable throughout your journey.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  "Live mentor sessions",
                  "Hands-on real-world projects",
                  "Industry-recognized certificate",
                  "Career guidance & placement support"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-blue-200">
                    <div className="w-5 h-5 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
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