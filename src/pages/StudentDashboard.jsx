import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Award, TrendingUp, Users, Clock, ChevronRight, Bell, Settings, Search, Video, Star, Target } from 'lucide-react';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // --- NEW LOGIC START ---
  useEffect(() => {
    const handleNavbarClick = () => {
      console.log("Navbar Profile Clicked: Running Dashboard Logic...");
      
      // PLACE YOUR CUSTOM CODE HERE
      // Example: alert("Syncing Dashboard with Profile...");
    };

    // Listen for the 'shout' from the Navbar
    window.addEventListener('profileMenuOpened', handleNavbarClick);

    // Clean up listener when the user leaves the page
    return () => window.removeEventListener('profileMenuOpened', handleNavbarClick);
  }, []);
  // --- NEW LOGIC END ---

  const studentData = {
    name: "Alex Morgan",
    level: "Intermediate",
    points: 2450,
    coursesCompleted: 8,
    currentCourses: [
      { id: 1, title: "Advanced Web Development", instructor: "Sarah Chen", progress: 68, nextSession: "Today, 3:00 PM", duration: "2h 30m remaining" },
      { id: 2, title: "UI/UX Design Fundamentals", instructor: "Marcus Williams", progress: 45, nextSession: "Tomorrow, 10:00 AM", duration: "5h 15m remaining" },
      { id: 3, title: "Data Analytics with Python", instructor: "Dr. Priya Patel", progress: 82, nextSession: "Friday, 2:00 PM", duration: "1h 45m remaining" }
    ],
    upcomingSessions: [
      { id: 1, course: "Advanced Web Development", topic: "React State Management", time: "Today, 3:00 PM", duration: "1.5 hours", type: "live" },
      { id: 2, course: "UI/UX Design", topic: "Prototyping in Figma", time: "Tomorrow, 10:00 AM", duration: "2 hours", type: "workshop" },
      { id: 3, course: "Data Analytics", topic: "Data Visualization", time: "Friday, 2:00 PM", duration: "1 hour", type: "live" }
    ],
    achievements: [
      { id: 1, title: "Fast Learner", description: "Completed 3 courses in a month", icon: "⚡" },
      { id: 2, title: "Perfect Attendance", description: "Attended 20 sessions in a row", icon: "🎯" },
      { id: 3, title: "Top Performer", description: "Scored 95%+ on 5 quizzes", icon: "🏆" },
      { id: 4, title: "Community Helper", description: "Helped 10 peers", icon: "🤝" }
    ],
    recentActivity: [
      { id: 1, text: "Completed 'React Hooks' module", time: "2 hours ago" },
      { id: 2, text: "Submitted assignment for Web Development", time: "Yesterday" },
      { id: 3, text: "Earned 'Fast Learner' badge", time: "2 days ago" }
    ],
    weeklyGoal: { target: 10, completed: 7, label: "hours of learning" }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SkillConnect</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">{studentData.name}</p>
                  <p className="text-xs text-gray-500">{studentData.level} Learner</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {studentData.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {studentData.name.split(' ')[0]}! 👋</h1>
          <p className="text-gray-600">Ready to continue your learning journey?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<BookOpen className="text-blue-600"/>} bg="bg-blue-100" label="Courses in Progress" val={studentData.currentCourses.length} badge="Active" bColor="text-blue-600 bg-blue-50" />
          <StatCard icon={<Award className="text-green-600"/>} bg="bg-green-100" label="Courses Completed" val={studentData.coursesCompleted} badge="+2 this week" bColor="text-green-600 bg-green-50" />
          <StatCard icon={<Star className="text-purple-600"/>} bg="bg-purple-100" label="Skill Points" val={studentData.points} badge="Level 5" bColor="text-purple-600 bg-purple-50" />
          <StatCard icon={<Target className="text-orange-600"/>} bg="bg-orange-100" label="Weekly Goal Progress" val={`${studentData.weeklyGoal.completed}/${studentData.weeklyGoal.target}`} badge="70%" bColor="text-orange-600 bg-orange-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
                <button className="text-sm text-blue-600 font-medium flex items-center">View All <ChevronRight className="w-4 h-4 ml-1"/></button>
              </div>
              <div className="space-y-4">
                {studentData.currentCourses.map(course => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between mb-3">
                      <div><h3 className="font-semibold text-gray-900">{course.title}</h3><p className="text-sm text-gray-600">by {course.instructor}</p></div>
                      <span className="text-sm font-semibold text-blue-600">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center text-gray-600"><Clock className="w-4 h-4 mr-1"/>{course.duration}</div>
                      <button className="text-blue-600 font-medium flex items-center">Continue Learning <ChevronRight className="w-4 h-4 ml-1"/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">Weekly Goal</h2><TrendingUp className="w-5 h-5"/></div>
              <div className="flex items-end space-x-2 mb-2"><span className="text-4xl font-bold">{studentData.weeklyGoal.completed}</span><span className="text-xl opacity-75 mb-1">/ {studentData.weeklyGoal.target}</span></div>
              <div className="w-full bg-white/20 rounded-full h-3"><div className="bg-white h-3 rounded-full" style={{ width: '70%' }}></div></div>
              <p className="text-sm mt-3 opacity-90">Keep it up! You're on track.</p>
            </div>

                {/* Achievements */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Recent Achievements</h2>
                <Award className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="space-y-3">
                {studentData.achievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm">{achievement.title}</h4>
                      <p className="text-xs text-gray-600 mt-0.5">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium text-center">
                View All Achievements
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {studentData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ... other sidebar elements (Achievements, Activity) would follow the same pattern ... */}
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper component to keep the code clean
function StatCard({ icon, bg, label, val, badge, bColor }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center`}>{icon}</div>
        <span className={`text-xs font-medium ${bColor} px-2 py-1 rounded-full`}>{badge}</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{val}</h3>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}