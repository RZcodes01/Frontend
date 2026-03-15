import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Upload, Trash2, CheckCircle2, AlertCircle, BadgeCheck, Github, Globe } from 'lucide-react';
import { fetchProjectById } from '../api/project.api';
import { toast } from 'sonner';
import { createSubmission, getMySubmissions } from '../api/submission.api';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

const ProjectSubmission = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [description, setDescription] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [liveDemoLink, setLiveDemoLink] = useState('');
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const [projectRes, submissionsRes] = await Promise.all([
          fetchProjectById(projectId),
          getMySubmissions()
        ]);

        setProject(projectRes.data.data);

        const mySubmissions = submissionsRes.data.data || [];
        const existing = mySubmissions.find(s => s.projectId === projectId || s.projectId?._id === projectId);
        if (existing) setAlreadySubmitted(true);

      } catch (err) {
        toast.error("Failed to load project details");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [projectId, navigate]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const oversized = selectedFiles.filter(f => f.size > MAX_FILE_SIZE);
    if (oversized.length) {
      toast.error(`${oversized.map(f => f.name).join(', ')} exceed${oversized.length === 1 ? 's' : ''} the 20MB limit`);
    }

    const validFiles = selectedFiles.filter(f => f.size <= MAX_FILE_SIZE);

    setFiles(prev => {
      const newFiles = validFiles.filter(
        newFile => !prev.some(existing => existing.name === newFile.name && existing.size === newFile.size)
      );
      if (newFiles.length < validFiles.length) {
        toast.warning("Some duplicate files were skipped");
      }
      return [...prev, ...newFiles];
    });
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) return toast.error("Please upload at least one file");

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('projectId', projectId);
      formData.append('description', description);
      formData.append('githubLink', githubLink);
      formData.append('liveDemoLink', liveDemoLink);
      files.forEach(file => {
        formData.append('files', file);
      });

      await createSubmission(formData);
      toast.success("Project submitted successfully!");
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center text-blue-900">Loading...</div>
  );

  return (
    <div className="min-h-screen bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-blue-100">

        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 p-8 text-white">
          <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-blue-300 hover:text-white transition-colors text-sm font-bold">
            <ArrowLeft size={18} /> Back
          </button>
          <h2 className="text-3xl font-black">{project?.title}</h2>
          <p className="mt-2 text-blue-300 font-medium text-sm">Submit your project solution for review.</p>
        </div>

        {/* Already Submitted State */}
        {alreadySubmitted ? (
          <div className="p-8 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <BadgeCheck size={36} className="text-green-600" />
            </div>
            <h3 className="text-xl font-black text-blue-900">Already Submitted</h3>
            <p className="text-sm text-blue-500 font-medium max-w-sm">
              You've already submitted this project. Your mentor will review it shortly.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-8">

            {/* Description */}
            <div>
              <label className="block text-[10px] font-black text-blue-900 uppercase tracking-[0.2em] mb-3 px-1">Description</label>
              <textarea
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-5 py-4 bg-blue-50 border border-blue-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-blue-900 text-sm font-medium"
                placeholder="Describe your implementation, approach, and any challenges you faced..."
              ></textarea>
            </div>

            {/* GitHub Link */}
            <div>
              <label className="block text-[10px] font-black text-blue-900 uppercase tracking-[0.2em] mb-3 px-1">GitHub Repository</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-blue-400">
                  <Github size={18} />
                </div>
                <input
                  type="url"
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                  className="w-full pl-11 pr-5 py-4 bg-blue-50 border border-blue-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-blue-900 text-sm font-medium"
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>

            {/* Live Demo Link */}
            <div>
              <label className="block text-[10px] font-black text-blue-900 uppercase tracking-[0.2em] mb-3 px-1">Live Demo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-blue-400">
                  <Globe size={18} />
                </div>
                <input
                  type="url"
                  value={liveDemoLink}
                  onChange={(e) => setLiveDemoLink(e.target.value)}
                  className="w-full pl-11 pr-5 py-4 bg-blue-50 border border-blue-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-blue-900 text-sm font-medium"
                  placeholder="https://your-project.vercel.app"
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-[10px] font-black text-blue-900 uppercase tracking-[0.2em] mb-3 px-1">Project Files</label>
              <div className="relative group">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-blue-200 rounded-3xl bg-blue-50/50 group-hover:bg-blue-50 group-hover:border-blue-400 transition-all">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                    <Upload size={28} />
                  </div>
                  <p className="text-blue-900 font-bold">Drop files here or click to upload</p>
                  <p className="text-[10px] text-blue-500 mt-1 uppercase tracking-widest font-black opacity-60">Any format up to 20MB</p>
                </div>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-6 space-y-3">
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white border border-blue-100 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                          <FileText size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-blue-900 truncate">{file.name}</p>
                          <p className="text-[10px] text-blue-400 font-black uppercase">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Guidelines */}
            <div className="bg-amber-400/5 border border-amber-400/20 rounded-2xl p-5 flex gap-4">
              <AlertCircle className="text-amber-500 shrink-0" size={20} />
              <div className="space-y-1">
                <p className="text-xs font-black text-amber-900 uppercase tracking-widest">Submission Guidelines</p>
                <p className="text-[11px] text-amber-700/80 leading-relaxed font-bold">
                  Ensure all code files are included. If submitting a web project, consider including a screen recording of the live version. You can only submit once.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-3 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-base uppercase tracking-widest shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  Confirm Submission
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default ProjectSubmission;