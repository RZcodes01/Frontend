import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    FileText,
    ExternalLink,
    CheckCircle,
    Clock,
    Loader2,
    Play,
    Award,
    X
} from "lucide-react";

import {
    allProjectSubmissions,
    gradeSubmission
} from "../api/mentor.api";

export default function ProjectSubmissions() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [submissionData, setSubmissionData] = useState(null);
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    const [grade, setGrade] = useState("");
    const [feedback, setFeedback] = useState("");
    const [grading, setGrading] = useState(false);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                setLoading(true);
                const response = await allProjectSubmissions(projectId);
                setSubmissionData(response.data);
            } catch (err) {
                console.error("Error fetching submissions:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, [projectId]);

    const openModal = (sub) => {
        setSelectedSubmission(sub);
        setGrade(sub.grade ?? "");
        setFeedback(sub.feedback ?? "");
    };

    const handleGradeSubmit = async () => {
        if (grade === "" || grade < 0 || grade > 100) {
            alert("Grade must be between 0 and 100");
            return;
        }

        try {
            setGrading(true);

            await gradeSubmission(selectedSubmission._id, {
                grade: Number(grade),
                feedback
            });

            // Update UI
            setSubmissionData((prev) => ({
                ...prev,
                data: prev.data.map((sub) =>
                    sub._id === selectedSubmission._id
                        ? {
                            ...sub,
                            status: "reviewed",
                            grade: Number(grade),
                            feedback
                        }
                        : sub
                )
            }));

            setSelectedSubmission(null);
            setGrade("");
            setFeedback("");

        } catch (err) {
            console.error("Grading error:", err);
            alert("Failed to grade submission");
        } finally {
            setGrading(false);
        }
    };

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-orange-500" size={40} />
            </div>
        );

    return (
        <div className="min-h-screen bg-slate-50 pb-20">

            {/* HEADER */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">
                                {submissionData?.community || "Submissions"}
                            </p>
                            <h1 className="text-xl font-black text-slate-900">
                                Project Dashboard
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-900 text-white px-4 py-2 rounded-xl">
                        <div className="text-right">
                            <p className="text-[9px] font-bold opacity-60 uppercase">
                                Submissions
                            </p>
                            <p className="text-lg font-black">
                                {submissionData?.total || 0}
                            </p>
                        </div>
                        <CheckCircle size={18} className="text-emerald-400" />
                    </div>
                </div>
            </div>

            {/* MAIN */}
            <main className="max-w-6xl mx-auto px-6 py-10">
                {submissionData?.data?.length > 0 ? (
                    <div className="grid gap-6">
                        {submissionData.data.map((sub) => (
                            <div
                                key={sub._id}
                                className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row"
                            >
                                {/* Sidebar */}
                                <div className="p-8 md:w-64 bg-slate-50 border-r border-slate-100">
                                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black mb-4">
                                        {sub.studentId?.name?.charAt(0).toUpperCase() || "?"}
                                    </div>
                                    <h3 className="font-black text-sm mb-1">
                                        {sub.studentId.name || "Unknown"}
                                    </h3>
                                    <p className="text-[10px] text-slate-400 truncate mb-4">
                                        {sub.studentId.email || ""}
                                    </p>
                                    <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase">
                                        <Clock size={12} />
                                        {new Date(sub.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 flex-1">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="space-y-3">
                                            <span
                                                className={`px-2 py-1 rounded text-[9px] font-black uppercase border ${sub.status === "reviewed"
                                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                    : "bg-blue-50 text-blue-600 border-blue-100"
                                                    }`}
                                            >
                                                {sub.status}
                                            </span>

                                            {sub.grade !== undefined && (
                                                <p className="text-sm font-bold text-slate-700">
                                                    Grade: {sub.grade}/100
                                                </p>
                                            )}

                                            <p className="text-slate-600 text-sm italic">
                                                "{sub.notes}"
                                            </p>
                                        </div>

                                        <button
                                            disabled={sub.status === "reviewed"}
                                            onClick={() => openModal(sub)}
                                            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black hover:bg-orange-600 transition-all disabled:opacity-50"
                                        >
                                            <Award size={14} />
                                            {sub.status === "reviewed"
                                                ? "Reviewed"
                                                : "Grade Work"}
                                        </button>
                                    </div>

                                    {/* Files */}
                                    <div className="flex flex-wrap gap-3 mt-6">
                                        {sub.files.map((file, idx) => (
                                            <a
                                                key={idx}
                                                href={file.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-orange-500 transition-all"
                                            >
                                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400">
                                                    {file.type === "video" ? (
                                                        <Play size={16} />
                                                    ) : (
                                                        <FileText size={16} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black uppercase">
                                                        View File
                                                    </p>
                                                    <p className="text-[8px] text-slate-400 uppercase">
                                                        {file.type}
                                                    </p>
                                                </div>
                                                <ExternalLink size={12} />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-200">
                        <Clock size={40} className="mx-auto text-slate-200 mb-4" />
                        <h2 className="font-black text-slate-400 text-lg uppercase">
                            No Submissions Yet
                        </h2>
                    </div>
                )}
            </main>

            {/* MODAL */}
            {selectedSubmission && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-xl">Review Submission</h3>
                            <button
                                onClick={() => setSelectedSubmission(null)}
                                className="p-2 hover:bg-slate-100 rounded-full"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">
                                    Grade (0-100)
                                </label>
                                <input
                                    type="number"
                                    value={grade}
                                    onChange={(e) => setGrade(e.target.value)}
                                    className="w-full p-4 bg-slate-50 border rounded-2xl focus:border-orange-500 outline-none font-bold"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">
                                    Feedback Notes
                                </label>
                                <textarea
                                    rows="4"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    className="w-full p-4 bg-slate-50 border rounded-2xl focus:border-orange-500 outline-none text-sm"
                                />
                            </div>

                            <button
                                onClick={handleGradeSubmit}
                                disabled={grading}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-orange-500 transition-all disabled:opacity-50"
                            >
                                {grading ? "Submitting..." : "Submit Review"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}