import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Award, TrendingUp, Users, Clock, ChevronRight, Bell, Settings, Search, Video, Star, Target } from 'lucide-react';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const handleNavbarClick = () => {
      console.log("Navbar Profile Clicked: Running Dashboard Logic...");
    };

    window.addEventListener('profileMenuOpened', handleNavbarClick);

    return () => window.removeEventListener('profileMenuOpened', handleNavbarClick);
  }, []);

  const studentData = {
    name: "Alex Dev",
    level: "Student",
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
    weeklyGoal: { target: 10, completed: 7, label: "hours of learning" }
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      <header className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-cyan-400 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-bold text-white">Skill<span className="text-cyan-400">Connect</span></span>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-white">{studentData.name}</p>
                  <p className="text-xs text-neutral-500">{studentData.level} Learner</p>
                </div>
                <div className="w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center text-black font-semibold">
                  {studentData.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {studentData.name.split(' ')[0]}! </h1>
          <p className="text-neutral-400">Ready to continue your learning journey?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard  bg="bg-cyan-400/10" label="Courses in Progress" val={studentData.currentCourses.length} badge="Active" bColor="text-cyan-400 bg-cyan-400/10 border border-cyan-400/20" />
          <StatCard  bg="bg-cyan-400/10" label="Courses Completed" val={studentData.coursesCompleted} badge="+2 this week" bColor="text-cyan-400 bg-cyan-400/10 border border-cyan-400/20" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">My Courses</h2>
                <button className="text-sm text-cyan-400 font-medium flex items-center hover:text-cyan-300 transition-colors">View All <ChevronRight className="w-4 h-4 ml-1"/></button>
              </div>
              <div className="space-y-4">
                {studentData.currentCourses.map(course => (
                  <div key={course.id} className="border border-neutral-800 hover:border-cyan-400/30 rounded-lg p-4 transition-colors">
                    <div className="flex justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-white">{course.title}</h3>
                        <p className="text-sm text-neutral-500">by {course.instructor}</p>
                      </div>
                      <span className="text-sm font-semibold text-cyan-400">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-neutral-800 rounded-full h-2 mb-3">
                      <div className="bg-cyan-400 h-2 rounded-full transition-all" style={{ width: `${course.progress}%` }}></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center text-neutral-500"><Clock className="w-4 h-4 mr-1"/>{course.duration}</div>
                      <button className="text-cyan-400 font-medium flex items-center hover:text-cyan-300 transition-colors">Continue Learning <ChevronRight className="w-4 h-4 ml-1"/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, bg, label, val, badge, bColor }) {
  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800 hover:border-cyan-400/30 transition-colors p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center border border-cyan-400/20`}>{icon}</div>
        <span className={`text-xs font-medium ${bColor} px-2 py-1 rounded-full`}>{badge}</span>
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{val}</h3>
      <p className="text-sm text-neutral-500">{label}</p>
    </div>
  );
}
