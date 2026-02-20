import React, { useState } from 'react';
import MentorVerificationCard from './MentorVerificationCard';

const MentorManager = () => {
  const [mentors] = useState([
    { 
      id: 1, name: "Sarah Smith", skill: "React", location: "Remote",
      community: "Web Dev", joined: "2023-10-12", sessions: 5
    },
    { 
      id: 2, name: "Mike Ross", skill: "Node.js", location: "NYC",
      community: "Backend", joined: "2024-01-05", sessions: 6
    }
  ]);

  return (
    <div className="space-y-10">
      {/* SECTION 1: RESUME APPROVAL */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Pending Resume Review</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MentorVerificationCard mentor={{name: "Potential Mentor", skill: "Design"}} />
        </div>
      </section>

      {/* SECTION 2: ACTIVE MENTOR LIST */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Active Mentors List</h2>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-white text-sm">
              <tr>
                <th className="p-4">Mentor Name</th>
                <th className="p-4">Community</th>
                <th className="p-4">Joined</th>
                <th className="p-4">Live Sessions</th>
              </tr>
            </thead>
            <tbody>
              {mentors.map(m => (
                <tr key={m.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-bold">{m.name}</td>
                  <td className="p-4 text-blue-600">{m.community}</td>
                  <td className="p-4 text-sm text-gray-500">{m.joined}</td>
                  <td className="p-4 text-center">{m.sessions}</td>
                  <td className="p-4">
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default MentorManager;