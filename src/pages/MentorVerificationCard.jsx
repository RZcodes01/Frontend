import React from 'react';
import { FileText, CheckCircle, XCircle, MapPin } from 'lucide-react';

const MentorVerificationCard = ({ mentor, onApprove, onReject }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg">
            {mentor.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{mentor.name}</h4>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin size={12} /> {mentor.location}
            </p>
          </div> 
        </div>
        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded ${mentor.verified ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
          {mentor.verified ? 'Verified' : 'Pending Review'}
        </span>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Expertise:</span>
          <span className="font-medium text-gray-800">{mentor.skill}</span>
        </div>
        <button className="w-full flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
          <FileText size={16} className="text-blue-500" />
          View Resume.pdf
        </button>
      </div>

      <div className="flex gap-2">
        {!mentor.verified && (
          <button 
            onClick={() => onApprove(mentor.id)} 
            className="flex-1 bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-blue-700 flex items-center justify-center gap-1"
          >
            <CheckCircle size={16} /> Approve
          </button>
        )}
        <button 
    onClick={() => onReject(mentor.id)} // Link the reject function
    className="px-3 bg-white border border-red-100 text-red-500 rounded-xl hover:bg-red-50 transition"
  >
    <XCircle size={20} />
  </button>
      </div>
    </div>
  );
};

export default MentorVerificationCard; // This is the "Link"