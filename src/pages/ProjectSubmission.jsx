import React, { useState } from 'react';

const ProjectSubmission = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    liveLink: '',
    repoLink: '',
    thumbnail: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to send data to your backend or Firebase goes here
    console.log("Project Submitted:", formData);
    alert("Project submitted successfully for review!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Submit Your Project</h2>
          <p className="mt-2 text-gray-600">Show the community and mentors what you've built this week.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Project Title</label>
            <input
              type="text"
              required
              className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g. E-commerce Dashboard"
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Short Description</label>
            <textarea
              rows="4"
              className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Briefly explain what features you implemented..."
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Live Demo URL</label>
              <input
                type="url"
                className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://myproject.com"
                onChange={(e) => setFormData({...formData, liveLink: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Repository Link</label>
              <input
                type="url"
                className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="GitHub / GitLab link"
                onChange={(e) => setFormData({...formData, repoLink: e.target.value})}
              />
            </div>
          </div>

          {/* Image Upload Placeholder */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Project Thumbnail</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-400 transition-colors cursor-pointer">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <span className="relative font-medium text-indigo-600 hover:text-indigo-500">Upload a file</span>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              Submit to Mentor for Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectSubmission;